// ═══════════════════════════════════════════════════════════
// Garden Planner — Rendering Engine
// 3-tier DOM cache rendering, node builders, draw preview,
// and cache management
// ═══════════════════════════════════════════════════════════

// ═══ RENDER ═══
let _rafPending=false, _cvEl=null;
// DOM cache: maps uid → DOM element so we reuse instead of rebuild
let _domCache=new Map(); // uid → {node, type, hash}
let _ffTransforms=new Map(); // uid → {dx, dy} for fast freeform drag offset
let _dirtyAll=true; // forces full rebuild when true

function getCv(){return _cvEl||(_cvEl=document.getElementById("canvas"))}
function scheduleRender(){
  if(_rafPending)return;
  _rafPending=true;
  requestAnimationFrame(()=>{_rafPending=false;doRenderAll()});
}
function renderAll(immediate){
  _dirtyAll=true;
  if(immediate){doRenderAll();return}
  scheduleRender();
}

// Fast position-only update during drags — skips full DOM rebuild
function renderDragMove(movedUids){
  const cv=getCv();
  movedUids.forEach(uid=>{
    const cached=_domCache.get(uid);
    if(!cached)return;
    if(cached.type==="prefab"){
      const el=elements.find(e=>e.uid===uid);
      if(el&&cached.node.parentNode){
        cached.node.style.left=el.x+"px";
        cached.node.style.top=el.y+"px";
      }
    } else if(cached.type==="freeform"){
      const ff=freeforms.find(f=>f.uid===uid);
      if(ff&&cached.node.parentNode){
        // Use CSS transform to offset the whole group — way faster than moving each cell
        const t=_ffTransforms.get(uid);
        if(t){
          cached.node.style.transform=`translate(${t.dx}px,${t.dy}px)`;
        }
      }
    } else if(cached.type==="note"){
      const n=notes.find(x=>x.uid===uid);
      if(n&&cached.node.parentNode){
        cached.node.style.left=n.x+"px";
        cached.node.style.top=n.y+"px";
      }
    }
  });
  // Update alignment guides are handled separately by caller
}

// Hash to detect when an element needs full rebuild vs just position
function _prefabHash(el){
  const isSel=selectedType==="prefab"&&el.uid===selectedId;
  const isHL=isHighlighted(el.uid);
  return `${el.id}|${el.w}|${el.h}|${el.color}|${el.rot||0}|${el.locked?1:0}|${isSel?1:0}|${isHL?1:0}|${el.icon}|${el.label}|${el.zOff||0}|${showLabels?1:0}`;
}
function _ffHash(ff){
  const isSel=selectedType==="freeform"&&ff.uid===selectedId;
  const isHL=isHighlighted(ff.uid);
  const isEditing=editingFFUid===ff.uid;
  // Include a fingerprint of cell positions so nudges/moves trigger rebuild
  let cfp=0;
  ff.cells.forEach(k=>{const[gx,gy]=pk(k);cfp=(cfp*31+gx*1000+gy)|0});
  return `${ff.color}|${ff.cells.size}|${cfp}|${isSel?1:0}|${isHL?1:0}|${isEditing?1:0}|${ff.zOff||0}|${ff.label}|${showLabels?1:0}`;
}

function doRenderAll(){
  _dirtyAll=false;
  const cv=getCv();
  // Remove stale alignment guides and draw previews (these are always transient)
  cv.querySelectorAll(".draw-preview,.align-guide").forEach(e=>e.remove());
  renderDrawPreview(cv);

  // Track which uids are still alive
  const liveUids=new Set();

  // ─── FREEFORMS ───
  freeforms.forEach(ff=>{
    liveUids.add(ff.uid);
    const hash=_ffHash(ff);
    const cached=_domCache.get(ff.uid);
    _ffTransforms.delete(ff.uid); // reset any drag transform
    if(cached&&cached.type==="freeform"&&cached.hash===hash&&cached.node.parentNode){
      // Reuse — just reset transform and update z-index
      cached.node.style.transform="";
      const isSel=selectedType==="freeform"&&ff.uid===selectedId;
      const isEditing=editingFFUid===ff.uid;
      const z=isEditing?60:isSel?49:((LAYER[ff.cat]||1)*10+(ff.zOff||0));
      cached.node.style.zIndex=z;
      return;
    }
    // Need full rebuild for this freeform
    if(cached&&cached.node.parentNode) cached.node.remove();
    const g=_buildFFNode(ff);
    _domCache.set(ff.uid,{node:g,type:"freeform",hash});
    cv.appendChild(g);
  });

  // ─── PREFABS ───
  elements.forEach(el=>{
    liveUids.add(el.uid);
    const hash=_prefabHash(el);
    const cached=_domCache.get(el.uid);
    if(cached&&cached.type==="prefab"&&cached.hash===hash&&cached.node.parentNode){
      // Reuse — just update position (may have changed from nudge/etc)
      cached.node.style.left=el.x+"px";
      cached.node.style.top=el.y+"px";
      return;
    }
    // Need full rebuild for this prefab
    if(cached&&cached.node.parentNode) cached.node.remove();
    const d=_buildPrefabNode(el);
    _domCache.set(el.uid,{node:d,type:"prefab",hash});
    cv.appendChild(d);
  });

  // ─── NOTES ───
  notes.forEach(n=>{
    liveUids.add(n.uid);
    const cached=_domCache.get(n.uid);
    if(cached&&cached.type==="note"&&cached.node.parentNode){
      cached.node.style.left=n.x+"px";
      cached.node.style.top=n.y+"px";
      // Update selection state
      const isSel=selectedType==="note"&&n.uid===selectedId;
      cached.node.className="note-el"+(isSel?" selected":"");
      return;
    }
    if(cached&&cached.node.parentNode) cached.node.remove();
    const node=_buildNoteNode(n);
    _domCache.set(n.uid,{node:node,type:"note",hash:""});
    cv.appendChild(node);
  });

  // ─── CLEANUP: remove DOM for deleted objects ───
  for(const[uid,cached] of _domCache){
    if(!liveUids.has(uid)){
      if(cached.node.parentNode) cached.node.remove();
      _domCache.delete(uid);
    }
  }
}

// ─── DOM NODE BUILDERS ───
function _buildPrefabNode(el){
  const isSel=selectedType==="prefab"&&el.uid===selectedId;
  const isHL=isHighlighted(el.uid);
  const d=document.createElement("div");
  const isRound = ROUND_IDS.has(el.id) || el.cat==="flowers" || el.cat==="produce";
  const isFence = FENCE_IDS.has(el.id);
  const isGate = GATE_IDS.has(el.id);
  let cls="placed-el";
  if(isRound) cls+=" round";
  if(isFence) cls+=" fence";
  if(isGate) cls+=" fence-gate";
  if(isSel) cls+=" selected";
  if(isHL&&!isSel) cls+=" grouped";
  if(el.locked) cls+=" locked";
  d.className=cls;
  d.dataset.uid=el.uid;d.dataset.kind="prefab";
  const z=isSel?50:((LAYER[el.cat]||1)*10+(el.zOff||0));
  const rot=el.rot||0;
  d.style.cssText=`left:${el.x}px;top:${el.y}px;width:${el.w*GS}px;height:${el.h*GS}px;background:${el.color};z-index:${z};${rot?`transform:rotate(${rot}deg);transform-origin:center center;`:""}`;
  let h="";
  if(isFence){
    const pw=el.w*GS, ph=el.h*GS;
    h+=`<div class="fence-post" style="top:-3px;left:-3px"></div>`;
    h+=`<div class="fence-post" style="top:-3px;right:-3px"></div>`;
    h+=`<div class="fence-post" style="bottom:-3px;left:-3px"></div>`;
    h+=`<div class="fence-post" style="bottom:-3px;right:-3px"></div>`;
    if(el.w>3){const step=Math.max(2,Math.round(el.w/Math.ceil(el.w/5)));for(let i=step;i<el.w;i+=step){const px=i*GS;h+=`<div class="fence-post" style="top:-3px;left:${px-3}px"></div><div class="fence-post" style="bottom:-3px;left:${px-3}px"></div>`}}
    if(el.h>3){const step=Math.max(2,Math.round(el.h/Math.ceil(el.h/5)));for(let i=step;i<el.h;i+=step){const py=i*GS;h+=`<div class="fence-post" style="left:-3px;top:${py-3}px"></div><div class="fence-post" style="right:-3px;top:${py-3}px"></div>`}}
    if(showLabels&&pw>30)h+=`<span class="el-label" style="position:absolute;top:4px;left:50%;transform:translateX(-50%);color:#6D4C41;text-shadow:0 1px 2px rgba(255,255,255,0.8)">${el.label}</span>`;
  } else if(isGate){
    const isV=el.id==="fence-gate-v";
    if(isV) d.classList.add("rot90");
    h+=`<div class="gate-opening"><span style="font-size:${Math.max(10,Math.min(el.w,el.h)*GS*0.35)}px">🚪</span></div>`;
    if(showLabels)h+=`<span class="el-label" style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);color:#5D4037;text-shadow:0 1px 2px rgba(255,255,255,0.8);font-size:7px">Gate</span>`;
  } else {
    const sz=Math.min(el.w,el.h)*GS*0.4;
    h+=`<span class="el-icon" style="font-size:${Math.max(10,sz)}px">${el.icon}</span>`;
    if(showLabels&&el.w*GS>20&&el.h*GS>24)h+=`<span class="el-label">${el.label}</span>`;
  }
  if(isSel){["nw","ne","sw","se","n","s","e","w"].forEach(x=>h+=`<div class="resize-handle ${x}" data-handle="${x}"></div>`);h+=`<div class="rotate-handle" data-handle="rotate">↻</div>`}
  d.innerHTML=h;
  return d;
}

function _buildFFNode(ff){
  const isSel=selectedType==="freeform"&&ff.uid===selectedId;
  const isHL=isHighlighted(ff.uid);
  const isEditing=editingFFUid===ff.uid;
  const g=document.createElement("div");
  g.className="ff-group"+(mode==="place"||isEditing?" selectable":"");
  g.dataset.uid=ff.uid;g.dataset.kind="freeform";
  const z=isEditing?60:isSel?49:((LAYER[ff.cat]||1)*10+(ff.zOff||0));
  g.style.cssText=`width:${config.width*GS}px;height:${config.height*GS}px;z-index:${z};`;
  let mnX=1e9,mnY=1e9,mxX=-1,mxY=-1;
  ff.cells.forEach(k=>{
    const[gx,gy]=pk(k);if(gx<mnX)mnX=gx;if(gy<mnY)mnY=gy;if(gx>mxX)mxX=gx;if(gy>mxY)mxY=gy;
    const c=document.createElement("div");c.className="ff-cell"+(isEditing?" editing":"");
    const hN=ff.cells.has(ck(gx,gy-1)),hS=ff.cells.has(ck(gx,gy+1)),hE=ff.cells.has(ck(gx+1,gy)),hW=ff.cells.has(ck(gx-1,gy));
    const r1=(!hN&&!hW)?6:0,r2=(!hN&&!hE)?6:0,r3=(!hS&&!hE)?6:0,r4=(!hS&&!hW)?6:0;
    const bdr=isEditing?"1.5px solid rgba(171,71,188,0.6)":isSel?"1px solid rgba(255,214,0,0.5)":isHL?"1px solid rgba(100,180,255,0.5)":"1px solid rgba(0,0,0,0.08)";
    c.style.cssText=`left:${gx*GS}px;top:${gy*GS}px;width:${GS}px;height:${GS}px;background:${ff.color};opacity:${isEditing?0.9:0.82};border-radius:${r1}px ${r2}px ${r3}px ${r4}px;border:${bdr};`;
    g.appendChild(c);
  });
  if(showLabels&&ff.cells.size>=3){
    const cx=((mnX+mxX)/2)*GS+GS/2,cy=((mnY+mxY)/2)*GS+GS/2;
    const l=document.createElement("div");l.className="fg-label";l.style.cssText=`left:${cx}px;top:${cy}px;transform:translate(-50%,-50%)`;
    l.textContent=(isEditing?"✏️ ":"")+ff.icon+" "+ff.label;g.appendChild(l);
  }
  return g;
}

function _buildNoteNode(n){
  const isSel=selectedType==="note"&&n.uid===selectedId;
  const d=document.createElement("div");
  d.className="note-el"+(isSel?" selected":"");
  d.dataset.uid=n.uid;d.dataset.kind="note";
  d.style.cssText=`left:${n.x}px;top:${n.y}px;`;
  d.textContent=n.text;
  return d;
}

function renderDrawPreview(cv){
  if(!drawCells.size)return;if(!cv)cv=getCv();
  const frag=document.createDocumentFragment();
  const col=drawBrush?._color||drawBrush?.color||"#888";
  drawCells.forEach(k=>{
    const[gx,gy]=pk(k);const c=document.createElement("div");c.className="draw-preview";
    const hN=drawCells.has(ck(gx,gy-1)),hS=drawCells.has(ck(gx,gy+1)),hE=drawCells.has(ck(gx+1,gy)),hW=drawCells.has(ck(gx-1,gy));
    const r1=(!hN&&!hW)?6:0,r2=(!hN&&!hE)?6:0,r3=(!hS&&!hE)?6:0,r4=(!hS&&!hW)?6:0;
    c.style.cssText=`left:${gx*GS}px;top:${gy*GS}px;width:${GS}px;height:${GS}px;background:${col};border-radius:${r1}px ${r2}px ${r3}px ${r4}px;`;
    frag.appendChild(c);
  });
  cv.appendChild(frag);
}

// Invalidate cache for specific uid (forces rebuild on next render)
function invalidateCache(uid){
  const c=_domCache.get(uid);
  if(c) c.hash="";
}
// Clear all cache (e.g. on tab switch, deser)
function clearDomCache(){
  _domCache.forEach(c=>{if(c.node.parentNode)c.node.remove()});
  _domCache.clear();_ffTransforms.clear();
}
