// ═══════════════════════════════════════════════════════════
// Garden Planner — Object Manager Panel
// Searchable, filterable list of all placed objects
// ═══════════════════════════════════════════════════════════

// ═══ OBJECT MANAGER ═══
let objPanelOpen=false;

function toggleObjPanel(){
  objPanelOpen=!objPanelOpen;
  document.getElementById("obj-panel").classList.toggle("open",objPanelOpen);
  document.getElementById("obj-toggle-btn").style.background=objPanelOpen?"#eef5e5":"";
  document.getElementById("obj-toggle-btn").style.borderColor=objPanelOpen?"#5D8233":"";
  document.getElementById("obj-toggle-btn").style.color=objPanelOpen?"#4a6d28":"";
  if(objPanelOpen) renderObjList();
  setTimeout(()=>{if(config){recalcGS();buildGrid();renderAll()}},280);
}

let objFilterCat="all";
let collapsedGroups=new Set(CATS.map(c=>c.id).concat(["freeform","notes"]));
let expandedRows=new Set();

function renderObjList(){
  if(!objPanelOpen) return;
  const list=document.getElementById("obj-list");
  const query=(document.getElementById("obj-search").value||"").toLowerCase().trim();

  // Build items
  const items=[];
  elements.forEach(el=>{
    items.push({kind:"prefab",uid:el.uid,icon:el.icon,label:el.label,color:el.color,cat:el.cat||"other",
      x:Math.round(el.x/GS*2)/2,y:Math.round(el.y/GS*2)/2,w:el.w,h:el.h,groupId:el.groupId||null,zOff:el.zOff||0});
  });
  freeforms.forEach(ff=>{
    let mnX=1e9,mnY=1e9;
    ff.cells.forEach(k=>{const[gx,gy]=pk(k);if(gx<mnX)mnX=gx;if(gy<mnY)mnY=gy});
    items.push({kind:"freeform",uid:ff.uid,icon:ff.icon,label:ff.label,color:ff.color,cat:ff.cat||"other",
      x:mnX,y:mnY,w:null,h:null,area:ff.cells.size,groupId:ff.groupId||null,zOff:ff.zOff||0});
  });

  // Count per category
  const catCounts={};
  items.forEach(it=>{catCounts[it.cat]=(catCounts[it.cat]||0)+1});

  document.getElementById("obj-count").textContent=" — "+items.length;

  // Render filter tabs
  const fbar=document.getElementById("obj-filters");
  fbar.innerHTML="";
  const allBtn=document.createElement("button");
  allBtn.className="obj-ftab"+(objFilterCat==="all"?" active":"");
  allBtn.innerHTML=`All<span class="ftab-count">${items.length}</span>`;
  allBtn.onclick=()=>{objFilterCat="all";renderObjList()};
  fbar.appendChild(allBtn);
  CATS.forEach(cat=>{
    if(!catCounts[cat.id])return;
    const b=document.createElement("button");
    b.className="obj-ftab"+(objFilterCat===cat.id?" active":"");
    b.innerHTML=`${cat.icon}<span class="ftab-count">${catCounts[cat.id]}</span>`;
    b.title=cat.label;
    b.onclick=()=>{objFilterCat=cat.id;renderObjList()};
    fbar.appendChild(b);
  });

  // Filter
  let filtered=items;
  if(objFilterCat!=="all") filtered=filtered.filter(it=>it.cat===objFilterCat);
  if(query) filtered=filtered.filter(it=>it.label.toLowerCase().includes(query));

  list.innerHTML="";

  if(!filtered.length){
    list.innerHTML='<div style="text-align:center;padding:28px;color:#8a9a8a;font-size:12px">'+(items.length?(query?'No matches for "'+escH(query)+'"':'No objects in this category'):'No objects placed yet')+'</div>';
    return;
  }

  // Group by category
  const groups=new Map();
  filtered.forEach(it=>{
    if(!groups.has(it.cat)) groups.set(it.cat,[]);
    groups.get(it.cat).push(it);
  });

  // Render groups in CATS order
  const catOrder=CATS.map(c=>c.id);
  const sortedKeys=[...groups.keys()].sort((a,b)=>(catOrder.indexOf(a)||99)-(catOrder.indexOf(b)||99));

  sortedKeys.forEach(catId=>{
    const catInfo=CATS.find(c=>c.id===catId)||{icon:"📦",label:catId};
    const groupItems=groups.get(catId);
    const isCollapsed=collapsedGroups.has(catId);

    // Group header
    const hdr=document.createElement("div");
    hdr.className="obj-group-hdr";
    hdr.innerHTML=`<span class="og-arrow ${isCollapsed?"collapsed":""}">▼</span><span class="og-icon">${catInfo.icon}</span><span class="og-label">${catInfo.label}</span><span class="og-count">${groupItems.length}</span>`;
    hdr.onclick=()=>{
      if(collapsedGroups.has(catId)) collapsedGroups.delete(catId); else collapsedGroups.add(catId);
      renderObjList();
    };
    list.appendChild(hdr);

    // Group body
    const body=document.createElement("div");
    body.className="obj-group-body"+(isCollapsed?" collapsed":"");

    groupItems.forEach(item=>{
      const isActive=(item.uid===selectedId&&((item.kind==="prefab"&&selectedType==="prefab")||(item.kind==="freeform"&&selectedType==="freeform")));
      const isExpanded=expandedRows.has(item.uid);
      const dimsText=item.kind==="prefab"?`${item.w}×${item.h} @ (${item.x},${item.y})`:`${item.area}ft² @ (${item.x},${item.y})`;
      const grpBadge=item.groupId?`<span style="font-size:9px;color:#1565C0;background:#E3F2FD;padding:0 4px;border-radius:3px;margin-left:2px" title="Group ${item.groupId}">🔗</span>`:"";

      const row=document.createElement("div");
      row.className="obj-row"+(isActive?" active":"");
      row.innerHTML=`
        <span class="or-icon">${item.icon}</span>
        <div class="or-swatch" style="background:${item.color}"><input type="color" value="${item.color}" onchange="objSetColor(${item.uid},'${item.kind}',this.value)" onclick="event.stopPropagation()"></div>
        <span class="or-name" title="Double-click to rename" ondblclick="event.stopPropagation();objRename(${item.uid},'${item.kind}',this)">${escH(item.label)}${grpBadge}</span>
        <span class="or-dims">${dimsText}</span>
        <div class="or-actions">
          <button class="or-abtn" onclick="event.stopPropagation();objRenamePrompt(${item.uid},'${item.kind}')" title="Rename">✏️</button>
          <button class="or-abtn" onclick="event.stopPropagation();objLayerMove(${item.uid},'${item.kind}',-1)" title="Layer down">▼</button>
          <button class="or-abtn" onclick="event.stopPropagation();objLayerMove(${item.uid},'${item.kind}',1)" title="Layer up">▲</button>
          <button class="or-abtn" onclick="event.stopPropagation();toggleExpandRow(${item.uid})" title="Edit details">⚙</button>
          <button class="or-abtn" onclick="event.stopPropagation();objDuplicate(${item.uid},'${item.kind}')" title="Duplicate">📋</button>
          <button class="or-abtn danger" onclick="event.stopPropagation();objDelete(${item.uid},'${item.kind}')" title="Delete">🗑</button>
        </div>`;
      row.onclick=()=>{
        selectedId=item.uid;selectedType=item.kind;
        if(mode!=="place") setMode("place");
        renderAll();updateSelPanel();renderObjList();
        scrollToElement(item);
      };
      body.appendChild(row);

      // Expandable edit row
      const exp=document.createElement("div");
      exp.className="or-expand"+(isExpanded?"":" hidden");
      if(item.kind==="prefab"){
        exp.innerHTML=`
          <div style="display:flex;flex-direction:column;align-items:center"><div class="or-label">X</div><input class="or-field" type="number" value="${item.x}" min="0" step="0.5" onchange="objSetPos(${item.uid},'x',this.value)" onfocus="this.select()" onclick="event.stopPropagation()"></div>
          <div style="display:flex;flex-direction:column;align-items:center"><div class="or-label">Y</div><input class="or-field" type="number" value="${item.y}" min="0" step="0.5" onchange="objSetPos(${item.uid},'y',this.value)" onfocus="this.select()" onclick="event.stopPropagation()"></div>
          <div style="display:flex;flex-direction:column;align-items:center"><div class="or-label">W</div><input class="or-field" type="number" value="${item.w}" min="1" onchange="objSetDim(${item.uid},'w',this.value)" onfocus="this.select()" onclick="event.stopPropagation()"></div>
          <div style="display:flex;flex-direction:column;align-items:center"><div class="or-label">H</div><input class="or-field" type="number" value="${item.h}" min="1" onchange="objSetDim(${item.uid},'h',this.value)" onfocus="this.select()" onclick="event.stopPropagation()"></div>`;
      } else {
        exp.innerHTML=`
          <div style="display:flex;flex-direction:column;align-items:center"><div class="or-label">X</div><input class="or-field" type="number" value="${item.x}" min="0" onchange="objFFSetPos(${item.uid},'x',this.value)" onfocus="this.select()" onclick="event.stopPropagation()"></div>
          <div style="display:flex;flex-direction:column;align-items:center"><div class="or-label">Y</div><input class="or-field" type="number" value="${item.y}" min="0" onchange="objFFSetPos(${item.uid},'y',this.value)" onfocus="this.select()" onclick="event.stopPropagation()"></div>
          <div style="font-size:10px;color:#6b7c6b;padding:6px 0">Area: ${item.area} ft²</div>`;
      }
      body.appendChild(exp);
    });

    list.appendChild(body);
  });
}

function toggleExpandRow(uid){
  if(expandedRows.has(uid)) expandedRows.delete(uid); else expandedRows.add(uid);
  renderObjList();
}

function scrollToElement(item){
  const cv=document.getElementById("canvas");
  const area=document.querySelector(".canvas-area");
  const px=item.x*GS, py=item.y*GS;
  // Scroll so the element is centered
  area.scrollTo({left:px-area.clientWidth/2+50,top:py-area.clientHeight/2+50,behavior:"smooth"});
}

function objSetPos(uid,axis,val){
  const el=elements.find(e=>e.uid===uid);if(!el)return;
  snapshot();
  const v=Math.max(0,parseFloat(val)||0);
  const cW=config.width*GS,cH=config.height*GS;
  if(axis==="x") el.x=Math.min(cW-el.w*GS,v*GS);
  else el.y=Math.min(cH-el.h*GS,v*GS);
  renderAll();updateSelPanel();renderObjList();
}

function objSetDim(uid,axis,val){
  const el=elements.find(e=>e.uid===uid);if(!el)return;
  snapshot();
  const v=Math.max(1,Math.min(200,parseInt(val)||1));
  if(axis==="w") el.w=v; else el.h=v;
  const cW=config.width*GS,cH=config.height*GS;
  el.x=Math.max(0,Math.min(cW-el.w*GS,el.x));
  el.y=Math.max(0,Math.min(cH-el.h*GS,el.y));
  renderAll();updateSelPanel();renderObjList();
}

function objFFSetPos(uid,axis,val){
  const ff=freeforms.find(f=>f.uid===uid);if(!ff)return;
  const v=Math.max(0,parseInt(val)||0);
  let mnX=1e9,mnY=1e9;
  ff.cells.forEach(k=>{const[gx,gy]=pk(k);if(gx<mnX)mnX=gx;if(gy<mnY)mnY=gy});
  const dx=axis==="x"?v-mnX:0;
  const dy=axis==="y"?v-mnY:0;
  if(!dx&&!dy)return;
  snapshot();
  const nc=new Set();let ok=true;
  ff.cells.forEach(k=>{const[gx,gy]=pk(k);const nx=gx+dx,ny=gy+dy;if(nx<0||nx>=config.width||ny<0||ny>=config.height)ok=false;nc.add(ck(nx,ny))});
  if(ok){ff.cells=nc;renderAll();updateSelPanel();renderObjList()}
}

function objSetColor(uid,kind,color){
  snapshot();
  if(kind==="prefab"){const el=elements.find(e=>e.uid===uid);if(el)el.color=color;}
  else{const ff=freeforms.find(f=>f.uid===uid);if(ff)ff.color=color;}
  renderAll();renderObjList();
}

function objLayerMove(uid,kind,delta){
  snapshot();
  const obj=kind==="prefab"?elements.find(e=>e.uid===uid):freeforms.find(f=>f.uid===uid);
  if(obj) obj.zOff=Math.max(-20,Math.min(20,(obj.zOff||0)+delta));
  renderAll();updateSelPanel();renderObjList();
}

function objDelete(uid,kind){
  snapshot();
  if(kind==="prefab") elements=elements.filter(e=>e.uid!==uid);
  else freeforms=freeforms.filter(f=>f.uid!==uid);
  if(selectedId===uid){selectedId=null;selectedType=null}
  renderAll();updateSelPanel();updateInfo();renderObjList();
}

function objRenamePrompt(uid,kind){
  const obj=kind==="prefab"?elements.find(e=>e.uid===uid)
    :kind==="freeform"?freeforms.find(f=>f.uid===uid)
    :notes.find(n=>n.uid===uid);
  if(!obj)return;
  const isNote=kind==="note";
  const cur=isNote?obj.text:obj.label;
  const n=prompt("Rename:",cur);
  if(n&&n.trim()){snapshot();if(isNote)obj.text=n.trim();else obj.label=n.trim();clearDomCache();renderAll();updateSelPanel();if(objPanelOpen)renderObjList()}
}

function objRename(uid,kind,span){
  const obj=kind==="prefab"?elements.find(e=>e.uid===uid):freeforms.find(f=>f.uid===uid);
  if(!obj)return;
  const inp=document.createElement("input");
  inp.type="text";inp.value=obj.label;
  inp.className="or-field";
  inp.style.cssText="width:100%;font-size:11px;font-weight:600;padding:2px 4px;";
  span.replaceWith(inp);
  inp.focus();inp.select();
  const commit=()=>{
    const v=inp.value.trim();
    if(v&&v!==obj.label){snapshot();obj.label=v;renderAll();updateSelPanel()}
    renderObjList();
  };
  inp.onblur=commit;
  inp.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();commit()}if(e.key==="Escape"){renderObjList()}};
}
