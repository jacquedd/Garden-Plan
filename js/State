// ═══════════════════════════════════════════════════════════
// Garden Planner — State, Tabs, Undo/Redo, Utilities
// Global state variables, tab management, undo/redo stack,
// and shared utility functions
// ═══════════════════════════════════════════════════════════

let GS=20;
let config=null,elements=[],freeforms=[],notes=[];
let selectedId=null,selectedType=null,activeCat="beds",showLabels=true,showGrid=true,showHouse=true,nextUid=1;
let mode="place",dragging=null,dragOff={x:0,y:0},resizing=null;
let drawBrush=null,brushSize=1,eraseSize=1,isDrawing=false,drawCells=new Set();
let isDraggingFF=false,ffDragStart=null;
let editingFFUid=null,editShapeMode="add",editShapeBrushSize=1;
let nextGroupId=1;
let multiSel=new Set();
// Zoom & Pan
let zoom=1, panX=0, panY=0, isPanning=false, panStart={x:0,y:0}, spaceHeld=false;
// Measure
let measurePts=[], measureEl=null;
// Recently used
let recentItems=[];

// ═══ TAB SYSTEM ═══
let tabs=[], activeTabId=null, nextTabId=1;
function createTabState(name,cfg){
  return {id:nextTabId++, name:name||("Garden "+nextTabId), config:cfg||null, elements:[], freeforms:[], notes:[], nextUid:1, nextGroupId:1, undoStack:[], redoStack:[], zoom:1, selectedId:null, selectedType:null, showLabels:true, showGrid:true, showHouse:true};
}
function saveCurrentTabState(){
  const tab=tabs.find(t=>t.id===activeTabId);
  if(!tab)return;
  tab.config=config?{...config}:null;
  tab.elements=elements.map(e=>({...e}));
  tab.freeforms=freeforms.map(ff=>({uid:ff.uid,id:ff.id,label:ff.label,icon:ff.icon,color:ff.color,cat:ff.cat||"other",groupId:ff.groupId||null,zOff:ff.zOff||0,locked:ff.locked||false,cells:new Set(ff.cells)}));
  tab.notes=notes.map(n=>({...n}));
  tab.nextUid=nextUid;tab.nextGroupId=nextGroupId;
  tab.undoStack=undoStack;tab.redoStack=redoStack;
  tab.zoom=zoom;tab.selectedId=selectedId;tab.selectedType=selectedType;
  tab.showLabels=showLabels;tab.showGrid=showGrid;tab.showHouse=showHouse;
}
function loadTabState(tab){
  clearDomCache();
  config=tab.config?{...tab.config}:null;
  elements=tab.elements.map(e=>({...e}));
  freeforms=tab.freeforms.map(ff=>({uid:ff.uid,id:ff.id,label:ff.label,icon:ff.icon,color:ff.color,cat:ff.cat||"other",groupId:ff.groupId||null,zOff:ff.zOff||0,locked:ff.locked||false,cells:new Set(ff.cells)}));
  notes=(tab.notes||[]).map(n=>({...n}));
  nextUid=tab.nextUid||1;nextGroupId=tab.nextGroupId||1;
  undoStack=tab.undoStack||[];redoStack=tab.redoStack||[];
  zoom=tab.zoom||1;
  selectedId=tab.selectedId||null;selectedType=tab.selectedType||null;
  multiSel.clear();drawCells.clear();editingFFUid=null;
  // Restore per-tab view settings
  showLabels=tab.showLabels!==undefined?tab.showLabels:true;
  showGrid=tab.showGrid!==undefined?tab.showGrid:true;
  showHouse=tab.showHouse!==undefined?tab.showHouse:true;
  applyViewSettings();
}
function applyViewSettings(){
  document.getElementById("chk-labels").checked=showLabels;
  document.getElementById("chk-grid").checked=showGrid;
  document.getElementById("chk-house").checked=showHouse;
  document.getElementById("house-bar").style.display=showHouse?"":"none";
}
function switchTab(id){
  if(id===activeTabId)return;
  if(editingFFUid)finishEditShape();
  if(drawCells.size>0)commitDrawing();
  saveCurrentTabState();
  activeTabId=id;
  const tab=tabs.find(t=>t.id===id);
  if(!tab)return;
  loadTabState(tab);
  _cvEl=null; // reset cached canvas ref
  if(config){
    calcGS();buildGrid();applyZoom();
    if(!showGrid) getCv().querySelectorAll(".grid-marker,.scale-label").forEach(e=>e.style.display="none");
    document.getElementById("compass-display").style.transform="rotate("+DA[config.northDir]+"deg)";
    setMode("place");
    renderAll(true);updateSelPanel();updateInfo();updateUndoButtons();
  }
  renderTabs();
}
function addTab(name,cfg){
  if(activeTabId)saveCurrentTabState();
  const tab=createTabState(name,cfg);
  tabs.push(tab);
  activeTabId=tab.id;
  loadTabState(tab);
  renderTabs();
  return tab;
}
function closeTab(id){
  if(tabs.length<=1)return; // always keep at least one tab
  const idx=tabs.findIndex(t=>t.id===id);
  if(idx<0)return;
  tabs.splice(idx,1);
  if(activeTabId===id){
    const newIdx=Math.min(idx,tabs.length-1);
    activeTabId=tabs[newIdx].id;
    loadTabState(tabs[newIdx]);
    _cvEl=null;
    if(config){calcGS();buildGrid();applyZoom();if(!showGrid)getCv().querySelectorAll(".grid-marker,.scale-label").forEach(e=>e.style.display="none");document.getElementById("compass-display").style.transform="rotate("+DA[config.northDir]+"deg)";setMode("place");renderAll(true);updateSelPanel();updateInfo();updateUndoButtons()}
  }
  renderTabs();
}
function renameTab(id){
  const tab=tabs.find(t=>t.id===id);if(!tab)return;
  // Inline edit via the tab bar
  const el=document.querySelector(`.tab-item[data-id="${id}"] .tab-name`);
  if(!el)return;
  const inp=document.createElement("input");
  inp.type="text";inp.value=tab.name;inp.className="tab-name-input";
  el.replaceWith(inp);inp.focus();inp.select();
  const commit=()=>{const v=inp.value.trim();if(v)tab.name=v;renderTabs()};
  inp.onblur=commit;
  inp.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();commit()}if(e.key==="Escape")renderTabs()};
}
function renderTabs(){
  const bar=document.getElementById("tab-bar");bar.innerHTML="";
  tabs.forEach(tab=>{
    const d=document.createElement("div");
    d.className="tab-item"+(tab.id===activeTabId?" active":"");
    d.dataset.id=tab.id;
    const name=document.createElement("span");name.className="tab-name";name.textContent=tab.name;
    const close=document.createElement("span");close.className="tab-close";close.textContent="×";
    close.onclick=e=>{e.stopPropagation();closeTab(tab.id)};
    d.appendChild(name);d.appendChild(close);
    d.onclick=()=>switchTab(tab.id);
    d.ondblclick=e=>{e.stopPropagation();renameTab(tab.id)};
    bar.appendChild(d);
  });
  const addBtn=document.createElement("button");addBtn.className="tab-add";addBtn.textContent="+";
  addBtn.title="New garden plan";
  addBtn.onclick=()=>{
    // Save current, create new blank tab, show setup for it
    saveCurrentTabState();
    const tab=addTab("Garden "+nextTabId);
    // Show a mini setup prompt
    const w=prompt("New garden width (ft):","8");
    const h=prompt("New garden depth (ft):","4");
    if(!w||!h||!+w||!+h){tabs.pop();activeTabId=tabs[tabs.length-1].id;loadTabState(tabs[tabs.length-1]);renderTabs();return}
    tab.config={width:Math.max(1,Math.min(200,+w)),height:Math.max(1,Math.min(200,+h)),northDir:"N"};
    config=tab.config;
    _cvEl=null;calcGS();buildGrid();applyZoom();
    document.getElementById("compass-display").style.transform="rotate("+DA[config.northDir]+"deg)";
    setMode("place");renderAll(true);updateSelPanel();updateInfo();updateUndoButtons();
    renderTabs();
  };
  bar.appendChild(addBtn);
}

// Undo/Redo
let undoStack=[],redoStack=[];
const MAX_UNDO=80;

function snapshot(){
  undoStack.push({
    elements:elements.map(e=>({...e})),
    freeforms:freeforms.map(ff=>({uid:ff.uid,id:ff.id,label:ff.label,icon:ff.icon,color:ff.color,cat:ff.cat||"other",groupId:ff.groupId||null,zOff:ff.zOff||0,locked:ff.locked||false,cells:new Set(ff.cells)})),
    notes:notes.map(n=>({...n})),
    nextUid,nextGroupId
  });
  if(undoStack.length>MAX_UNDO) undoStack.shift();
  redoStack=[];
  updateUndoButtons();
}
function _saveState(){
  return {
    elements:elements.map(e=>({...e})),
    freeforms:freeforms.map(ff=>({uid:ff.uid,id:ff.id,label:ff.label,icon:ff.icon,color:ff.color,cat:ff.cat||"other",groupId:ff.groupId||null,zOff:ff.zOff||0,locked:ff.locked||false,cells:new Set(ff.cells)})),
    notes:notes.map(n=>({...n})),
    nextUid,nextGroupId
  };
}
function _restoreState(s){
  elements=s.elements;freeforms=s.freeforms;notes=s.notes||[];nextUid=s.nextUid;nextGroupId=s.nextGroupId||nextGroupId;
  selectedId=null;selectedType=null;multiSel.clear();
  clearDomCache();renderAll();updateSelPanel();updateInfo();updateUndoButtons();
}
function undo(){
  if(!undoStack.length)return;
  redoStack.push(_saveState());
  _restoreState(undoStack.pop());
}
function redo(){
  if(!redoStack.length)return;
  undoStack.push(_saveState());
  _restoreState(redoStack.pop());
}
function updateUndoButtons(){
  const ub=document.getElementById("undo-btn"),rb=document.getElementById("redo-btn");
  if(ub){ub.disabled=!undoStack.length;ub.style.opacity=undoStack.length?"1":"0.4"}
  if(rb){rb.disabled=!redoStack.length;rb.style.opacity=redoStack.length?"1":"0.4"}
}

function snap(v){const half=GS/2;return Math.round(v/half)*half}
function ck(a,b){return a+","+b}
function pk(k){const p=k.split(",");return[+p[0],+p[1]]}

// Find object by uid in either array
function findObj(uid){return elements.find(e=>e.uid===uid)||freeforms.find(f=>f.uid===uid)}
function findObjKind(uid){return elements.find(e=>e.uid===uid)?"prefab":"freeform"}
// Get all UIDs in same group as uid
function getGroupUids(uid){
  const obj=findObj(uid);if(!obj||!obj.groupId)return new Set([uid]);
  const gid=obj.groupId,s=new Set();
  elements.forEach(e=>{if(e.groupId===gid)s.add(e.uid)});
  freeforms.forEach(f=>{if(f.groupId===gid)s.add(f.uid)});
  return s;
}
// Check if uid is selected (primary or multi or group)
function isHighlighted(uid){
  if(multiSel.size>0) return multiSel.has(uid);
  if(!selectedId) return false;
  if(uid===selectedId) return true;
  const obj=findObj(selectedId);
  if(obj&&obj.groupId){const obj2=findObj(uid);return obj2&&obj2.groupId===obj.groupId}
  return false;
}
