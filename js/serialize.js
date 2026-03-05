// ═══════════════════════════════════════════════════════════
// Garden Planner — Serialization
// Save/load, import/export, URL sharing, file handling
// ═══════════════════════════════════════════════════════════

// ═══ SHARE LINK ═══
async function shareLink(){
  try{
    const data=JSON.stringify(ser());
    const blob=new Blob([data]);
    const cs=new CompressionStream("gzip");
    const stream=blob.stream().pipeThrough(cs);
    const compressed=await new Response(stream).arrayBuffer();
    const b64=btoa(String.fromCharCode(...new Uint8Array(compressed)));
    const url=location.origin+location.pathname+"#plan="+encodeURIComponent(b64);
    await navigator.clipboard.writeText(url);
    alert("Share link copied to clipboard! ("+Math.round(url.length/1024)+"KB)");
  }catch(e){alert("Could not create share link: "+e.message)}
}
async function loadFromHash(){
  const hash=location.hash;
  if(!hash.includes("plan="))return false;
  try{
    const b64=decodeURIComponent(hash.split("plan=")[1]);
    const bin=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    const ds=new DecompressionStream("gzip");
    const stream=new Blob([bin]).stream().pipeThrough(ds);
    const text=await new Response(stream).text();
    const d=JSON.parse(text);
    if(d.config){
      config=d.config;
      document.getElementById("setup-screen").style.display="none";
      document.getElementById("planner-screen").classList.add("visible");
      addTab("Shared Plan",config);
      initPlanner();
      deser(d);
      saveCurrentTabState();
      renderTabs();
      location.hash="";
      return true;
    }
  }catch(e){console.warn("Failed to load from hash",e)}
  return false;
}
// ═══ DRAG-DROP IMPORT ═══
function importDropped(e){
  const file=[...e.dataTransfer.files].find(f=>f.name.endsWith(".json"));
  if(!file)return;
  const r=new FileReader();
  r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.currentState)deser(d.currentState);if(d.savedIterations){loadSaves();const ex=new Set(saves.map(s=>s.timestamp));d.savedIterations.forEach(s=>{if(!ex.has(s.timestamp))saves.push(s)});saves.sort((a,b)=>b.timestamp-a.timestamp);persistSaves();renderSavesList()}closeSaveModal()}catch(err){alert("Error: "+err.message)}};
  r.readAsText(file);
}

// ═══ SAVE/LOAD ═══
let saves=[];
function ser(){
  // Compact format: short keys, omit defaults
  const pt=PREFAB_TYPES;
  const ce=elements.map(e=>{
    const o={u:e.uid,i:e.id,x:Math.round(e.x/GS*2)/2,y:Math.round(e.y/GS*2)/2,w:e.w,h:e.h};
    // Only store non-default values
    const ref=pt.find(p=>p.id===e.id);
    if(!ref||e.label!==ref.label) o.l=e.label;
    if(!ref||e.icon!==ref.icon) o.ic=e.icon;
    if(!ref||e.color!==ref.color) o.c=e.color;
    if(!ref||e.cat!==ref.cat) o.ca=e.cat;
    if(e.rot) o.r=e.rot;
    if(e.zOff) o.z=e.zOff;
    if(e.groupId) o.g=e.groupId;
    if(e.locked) o.lk=1;
    return o;
  });
  const cf=freeforms.map(ff=>{
    const o={u:ff.uid,i:ff.id,c:ff.color,cl:[...ff.cells].join("|")};
    if(ff.label) o.l=ff.label;
    if(ff.icon) o.ic=ff.icon;
    if(ff.cat&&ff.cat!=="other") o.ca=ff.cat;
    if(ff.zOff) o.z=ff.zOff;
    if(ff.groupId) o.g=ff.groupId;
    if(ff.locked) o.lk=1;
    return o;
  });
  const cn=(notes||[]).map(n=>({u:n.uid,x:+(n.x/GS).toFixed(1),y:+(n.y/GS).toFixed(1),t:n.text}));
  return{v:2,cfg:{w:config.width,h:config.height,d:config.northDir},e:ce,f:cf,n:cn,nu:nextUid,ng:nextGroupId};
}
function deser(d){
  // Support both v2 compact and v1 legacy
  if(d.v===2){
    config={width:d.cfg.w,height:d.cfg.h,northDir:d.cfg.d};
    calcGS();
    const pt=PREFAB_TYPES;
    elements=(d.e||[]).map(o=>{
      const ref=pt.find(p=>p.id===o.i)||{};
      return{uid:o.u,id:o.i,label:o.l||ref.label||o.i,icon:o.ic||ref.icon||"",color:o.c||ref.color||"#888",cat:o.ca||ref.cat||"other",x:o.x*GS,y:o.y*GS,w:o.w,h:o.h,rot:o.r||0,zOff:o.z||0,groupId:o.g||null,locked:!!o.lk};
    });
    freeforms=(d.f||[]).map(o=>{const cl=typeof o.cl==="string"?o.cl.split("|"):o.cl;return{uid:o.u,id:o.i,label:o.l||o.i,icon:o.ic||"",color:o.c,cat:o.ca||"other",zOff:o.z||0,groupId:o.g||null,locked:!!o.lk,cells:new Set(cl)}});
    notes=(d.n||[]).map(o=>({uid:o.u,x:o.x*GS,y:o.y*GS,text:o.t,w:100,h:32}));
    nextUid=d.nu||1;nextGroupId=d.ng||1;
  } else {
    // Legacy v1 format
    config=d.config;
    calcGS();
    elements=(d.elements||[]).map(e=>({...e,x:e.x*GS,y:e.y*GS}));
    freeforms=(d.freeforms||[]).map(ff=>({...ff,cells:new Set(ff.cells)}));
    notes=(d.notes||[]).map(n=>({...n,x:n.x*GS,y:n.y*GS}));
    nextUid=d.nextUid||1;nextGroupId=d.nextGroupId||1;
  }
  selectedId=null;selectedType=null;multiSel.clear();
  clearDomCache();buildGrid();applyZoom();document.getElementById("compass-display").style.transform="rotate("+DA[config.northDir]+"deg)";renderAll();updateSelPanel();updateInfo();
}
function loadSaves(){try{saves=JSON.parse(localStorage.getItem("gardenPlannerSaves")||"[]")}catch(e){saves=[]}}
function persistSaves(){try{localStorage.setItem("gardenPlannerSaves",JSON.stringify(saves))}catch(e){}}
function openSaveModal(){loadSaves();document.getElementById("save-name").value="";renderSavesList();document.getElementById("save-modal").classList.add("visible")}
function closeSaveModal(){document.getElementById("save-modal").classList.remove("visible")}
function saveIteration(){const name=document.getElementById("save-name").value.trim()||("Save "+new Date().toLocaleString());loadSaves();saves.unshift({name,timestamp:Date.now(),data:ser()});persistSaves();renderSavesList();document.getElementById("save-name").value=""}
function loadIteration(i){loadSaves();if(!saves[i])return;deser(saves[i].data);saveCurrentTabState();const tab=tabs.find(t=>t.id===activeTabId);if(tab&&saves[i].name)tab.name=saves[i].name;renderTabs();closeSaveModal()}
function deleteIteration(i){loadSaves();saves.splice(i,1);persistSaves();renderSavesList()}
function renameIteration(i){loadSaves();const n=prompt("Rename:",saves[i]?.name);if(n&&n.trim()){saves[i].name=n.trim();persistSaves();renderSavesList()}}
function escH(s){const d=document.createElement("div");d.textContent=s;return d.innerHTML}
function renderSavesList(){
  const c=document.getElementById("saves-list");c.innerHTML="";
  if(!saves.length){c.innerHTML='<div style="text-align:center;padding:20px;color:#8a9a8a;font-size:12px">No saves yet.</div>';return}
  saves.forEach((s,i)=>{const d=new Date(s.timestamp);const sd=s.data;const t=(sd.e?.length||sd.elements?.length||0)+(sd.f?.length||sd.freeforms?.length||0);const sw=sd.cfg?.w||sd.config?.width||'?';const sh=sd.cfg?.h||sd.config?.height||'?';
    const div=document.createElement("div");div.className="save-item";
    div.innerHTML=`<div style="flex:1;min-width:0"><div class="si-name">${escH(s.name)}</div><div class="si-meta">${d.toLocaleDateString()} ${d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} • ${t} el • ${sw}×${sh} ft</div></div><div class="si-actions"><button class="si-btn" onclick="event.stopPropagation();renameIteration(${i})">✏️</button><button class="si-btn danger" onclick="event.stopPropagation();deleteIteration(${i})">🗑</button></div>`;
    div.onclick=()=>loadIteration(i);c.appendChild(div);
  });
}
function exportToFile(){loadSaves();
  // Convert any v1 saves to v2 compact format
  const compactSaves=saves.map(s=>{
    if(s.data.v===2) return s;
    const od=s.data, pt=PREFAB_TYPES;
    const ce=(od.elements||[]).map(e=>{
      const o={u:e.uid,i:e.id,x:e.x,y:e.y,w:e.w,h:e.h};
      const ref=pt.find(p=>p.id===e.id);
      if(!ref||e.label!==ref.label) o.l=e.label;
      if(!ref||e.icon!==ref.icon) o.ic=e.icon;
      if(!ref||e.color!==ref.color) o.c=e.color;
      if(!ref||e.cat!==ref.cat) o.ca=e.cat;
      if(e.rot) o.r=e.rot;if(e.zOff) o.z=e.zOff;if(e.groupId) o.g=e.groupId;if(e.locked) o.lk=1;
      return o;
    });
    const cf=(od.freeforms||[]).map(ff=>{
      const o={u:ff.uid,i:ff.id,c:ff.color,cl:(ff.cells||[]).join("|")};
      if(ff.label) o.l=ff.label;if(ff.icon) o.ic=ff.icon;
      if(ff.cat&&ff.cat!=="other") o.ca=ff.cat;
      if(ff.zOff) o.z=ff.zOff;if(ff.groupId) o.g=ff.groupId;if(ff.locked) o.lk=1;
      return o;
    });
    const cn=(od.notes||[]).map(n=>({u:n.uid,x:n.x,y:n.y,t:n.text}));
    return{name:s.name,timestamp:s.timestamp,data:{v:2,cfg:{w:od.config.width,h:od.config.height,d:od.config.northDir},e:ce,f:cf,n:cn,nu:od.nextUid||1,ng:od.nextGroupId||1}};
  });
  const blob=new Blob([JSON.stringify({currentState:ser(),savedIterations:compactSaves},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="garden-plan-"+new Date().toISOString().slice(0,10)+".json";a.click()}
function importFromFile(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.currentState)deser(d.currentState);if(d.savedIterations){loadSaves();const ex=new Set(saves.map(s=>s.timestamp));d.savedIterations.forEach(s=>{if(!ex.has(s.timestamp))saves.push(s)});saves.sort((a,b)=>b.timestamp-a.timestamp);persistSaves();renderSavesList()}closeSaveModal()}catch(err){alert("Error: "+err.message)}};r.readAsText(f);e.target.value=""}

function _loadPlanFromSetup(json){
  try{
    const d=JSON.parse(json);
    const state=d.currentState;
    if(!state||!(state.config||state.cfg)){alert("Invalid plan file.");return}
    // Extract config
    if(state.v===2) config={width:state.cfg.w,height:state.cfg.h,northDir:state.cfg.d};
    else config=state.config;
    // Switch to planner
    document.getElementById("setup-screen").style.display="none";
    document.getElementById("planner-screen").classList.add("visible");
    const name=d.savedIterations?.[0]?.name||"Loaded Plan";
    addTab(name,config);
    initPlanner();
    deser(state);
    saveCurrentTabState();
    // Load saved iterations
    if(d.savedIterations){
      loadSaves();
      const ex=new Set(saves.map(s=>s.timestamp));
      d.savedIterations.forEach(s=>{if(!ex.has(s.timestamp))saves.push(s)});
      saves.sort((a,b)=>b.timestamp-a.timestamp);
      persistSaves();
    }
    renderTabs();
  }catch(err){alert("Error loading file: "+err.message)}
}
function loadSetupFile(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>_loadPlanFromSetup(ev.target.result);r.readAsText(f);e.target.value=""}
function loadSetupDrop(e){const f=e.dataTransfer.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>_loadPlanFromSetup(ev.target.result);r.readAsText(f)}
