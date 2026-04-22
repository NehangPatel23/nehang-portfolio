/* THEME TOGGLE */
const html=document.documentElement;
/* Sync toggle icon with whatever theme was applied by the head script */
document.getElementById('tog').addEventListener('click',()=>{
  const isDark=html.getAttribute('data-theme')==='dark';
  const next=isDark?'light':'dark';
  html.setAttribute('data-theme',next);
  try{localStorage.setItem('nehang-theme',next);}catch(e){}
});

/* DRAWER */
const ham=document.getElementById('ham'),drawer=document.getElementById('drawer');
let dOpen=false;
function setDrawer(v){
  dOpen=v;
  if(v){drawer.style.display='flex';requestAnimationFrame(()=>drawer.classList.add('open'));}
  else{drawer.classList.remove('open');setTimeout(()=>{if(!dOpen)drawer.style.display='none';},400);}
  ham.classList.toggle('open',v);
  document.body.style.overflow=v?'hidden':'';
}
ham.addEventListener('click',()=>setDrawer(!dOpen));
document.querySelectorAll('.dl').forEach(a=>a.addEventListener('click',()=>setDrawer(false)));

/* Drawer resume button (mobile) */
const drawerResumeBtn=document.getElementById('drawerResumeBtn');
if(drawerResumeBtn)drawerResumeBtn.addEventListener('click',()=>{setDrawer(false);openResume();});

/* Smooth scroll polyfill for Safari */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});

/* CURSOR */
if(window.matchMedia('(pointer:fine)').matches){
  const cur=document.getElementById('cur'),cur2=document.getElementById('cur2');
  let mx=0,my=0,fx=0,fy=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
  (function loop(){fx+=(mx-fx)*.11;fy+=(my-fy)*.11;cur2.style.left=fx+'px';cur2.style.top=fy+'px';requestAnimationFrame(loop)})();
  document.querySelectorAll('a,button,.pcard').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.classList.add('big');cur2.classList.add('big')});
    el.addEventListener('mouseleave',()=>{cur.classList.remove('big');cur2.classList.remove('big')});
  });
}

/* STICKY NAV */
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('stuck',scrollY>60));

/* REVEAL */
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.1});
document.querySelectorAll('.r').forEach(el=>obs.observe(el));
const tlObs=new IntersectionObserver(es=>es.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('in'),i*100)}),{threshold:.12});
document.querySelectorAll('.titem').forEach(el=>tlObs.observe(el));

/* PROJECT GLOW */
document.querySelectorAll('.pcard').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect();
    c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
    c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
  });
});

/* EXPANDABLE PROJECT CARDS */
document.querySelectorAll('.pcard:not(.wide)').forEach(card=>{
  const raw=card.dataset.highlights;
  if(!raw)return;
  const items=JSON.parse(raw);
  const panel=card.querySelector('.phighlights');
  if(!panel)return;
  panel.innerHTML='<p class="ph-label">Highlights</p>'+
    items.map(h=>`<div class="ph-item"><p class="ph-title">${h.t}</p><p class="ph-sub">${h.s}</p></div>`).join('');
  const btn=card.querySelector('.pcard-toggle');
  function toggle(e){
    e.stopPropagation();
    const isOpen=card.classList.contains('open');
    document.querySelectorAll('.pcard.open').forEach(c=>{
      if(c!==card){c.classList.remove('open');const b=c.querySelector('.pcard-toggle');if(b)b.setAttribute('aria-label','Expand');}
    });
    card.classList.toggle('open',!isOpen);
    if(btn)btn.setAttribute('aria-label',isOpen?'Expand':'Collapse');
  }
  if(btn)btn.addEventListener('click',toggle);
  card.addEventListener('click',e=>{
    if(e.target.tagName==='A'||e.target.closest('a'))return;
    toggle(e);
  });
});

/* RESUME MODAL */
const resumeOverlay=document.getElementById('resumeOverlay');
const resumeBtn=document.getElementById('resumeBtn');
const resumeClose=document.getElementById('resumeClose');
function closeResume(){
  resumeOverlay.classList.remove('open');
  setTimeout(()=>{resumeOverlay.style.display='none';document.body.style.overflow='';},400);
}
if(resumeBtn)resumeBtn.addEventListener('click',openResume);
if(resumeClose)resumeClose.addEventListener('click',closeResume);
resumeOverlay.addEventListener('click',e=>{if(e.target===resumeOverlay)closeResume();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&resumeOverlay.classList.contains('open')){closeResume();return;}
  /* Focus trap inside modal */
  if(!resumeOverlay.classList.contains('open'))return;
  if(e.key!=='Tab')return;
  const focusable=resumeOverlay.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
  const first=focusable[0],last=focusable[focusable.length-1];
  if(e.shiftKey){if(document.activeElement===first){e.preventDefault();last.focus();}}
  else{if(document.activeElement===last){e.preventDefault();first.focus();}}
});
/* Focus close button when modal opens for screen reader UX */
function openResume(){
  resumeOverlay.style.display='flex';
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>{
    resumeOverlay.classList.add('open');
    setTimeout(()=>{if(resumeClose)resumeClose.focus();},420);
  });
}

/* Page visibility: pause terminal when tab is hidden, resume on return */
document.addEventListener('visibilitychange',()=>{
  /* termPaused is a global flag read by the terminal IIFE */
  window._termTabHidden=document.hidden;
});

/* READING PROGRESS BAR */
const progressBar=document.getElementById('progress-bar');
window.addEventListener('scroll',()=>{
  const scrolled=window.scrollY;
  const total=document.documentElement.scrollHeight-window.innerHeight;
  if(progressBar)progressBar.style.width=(total>0?(scrolled/total*100):0)+'%';
},{ passive:true });

/* BACK TO TOP */
const btt=document.getElementById('btt');
window.addEventListener('scroll',()=>{
  if(btt)btt.classList.toggle('show',window.scrollY>500);
},{ passive:true });
if(btt)btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* ACTIVE NAV HIGHLIGHTING */
const navSections=['about','projects','exp','education','contact'];
const navLinks=document.querySelectorAll('.nav-links a');
const secEls=navSections.map(id=>document.getElementById(id)).filter(Boolean);
const navObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const id=e.target.id;
      navLinks.forEach(a=>{
        a.classList.toggle('active',a.getAttribute('href')==='#'+id);
      });
    }
  });
},{threshold:.35,rootMargin:'-60px 0px -40% 0px'});
secEls.forEach(el=>navObs.observe(el));

/* COPY EMAIL */
const copyEmailEl=document.getElementById('copyEmail');
const copyToast=document.getElementById('copy-toast');
let toastTimer;
function showToast(){
  if(copyToast){
    copyToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>copyToast.classList.remove('show'),2400);
  }
}
if(copyEmailEl){
  copyEmailEl.addEventListener('click',()=>{
    navigator.clipboard.writeText('nehangal@usc.edu').then(showToast).catch(()=>{
      /* Fallback for browsers without clipboard API */
      const ta=document.createElement('textarea');
      ta.value='nehangal@usc.edu';ta.style.position='fixed';ta.style.opacity='0';
      document.body.appendChild(ta);ta.select();
      try{document.execCommand('copy');showToast();}catch(e){}
      document.body.removeChild(ta);
    });
  });
  copyEmailEl.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')copyEmailEl.click();});
}

/* PROJECT FILTERS */
(function(){
  const tabs=document.querySelectorAll('.pftab');
  const cards=document.querySelectorAll('#pgrid .pcard');
  tabs.forEach(btn=>{
    btn.addEventListener('click',()=>{
      tabs.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.filter;
      cards.forEach(c=>{
        const cats=(c.dataset.category||'').split(' ');
        c.hidden=!cats.includes(f);
      });
    });
  });
})();

/* STAT COUNTER ANIMATION
   Counts up from 0 to the target value when the stats
   section scrolls into view. Eases out — fast then slow. */
(function(){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const stats=document.querySelectorAll('.stat-n[data-target]');
  if(!stats.length)return;
  const seen=new WeakSet();
  const cObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting||seen.has(e.target))return;
      seen.add(e.target);
      const el=e.target;
      const target=parseInt(el.dataset.target,10);
      const suffix=el.dataset.suffix||'';
      const display=el.dataset.display||null;
      /* Special case: 1500 → display as "1.5k+" */
      if(display){
        let start=null;
        const DUR=1400;
        function step(ts){
          if(!start)start=ts;
          const prog=Math.min((ts-start)/DUR,1);
          const ease=1-Math.pow(1-prog,3); /* cubic ease-out */
          const val=Math.round(ease*target);
          /* Format as 1.5k+ style */
          el.textContent=val>=1000?(val/1000).toFixed(1)+'k'+suffix:val+suffix;
          if(prog<1)requestAnimationFrame(step);
          else el.textContent=display;
        }
        el.textContent='0'+suffix;
        requestAnimationFrame(step);
      } else {
        let start=null;
        const DUR=900;
        function step(ts){
          if(!start)start=ts;
          const prog=Math.min((ts-start)/DUR,1);
          const ease=1-Math.pow(1-prog,3);
          el.textContent=Math.round(ease*target)+suffix;
          if(prog<1)requestAnimationFrame(step);
        }
        el.textContent='0'+suffix;
        requestAnimationFrame(step);
      }
    });
  },{threshold:.6});
  stats.forEach(s=>cObs.observe(s));
})();

/* MOBILE CARD TOUCH — ensure expand toggle works on touch devices
   without triggering the link inside the card. */
(function(){
  document.querySelectorAll('.pcard-toggle').forEach(btn=>{
    btn.addEventListener('touchend',e=>{
      e.preventDefault(); /* prevent ghost click */
      btn.click();
    },{passive:false});
  });
})();

/* ARIA-LIVE on copy toast for screen readers */
(function(){
  const toast=document.getElementById('copy-toast');
  if(toast)toast.setAttribute('aria-live','polite');
})();

/* ══════════════════════════════════════════════════════
   HERO — A* PATHFINDING
   Live algorithm execution on a procedurally generated
   maze. Runs 2 A* steps per frame. Open set glows purple,
   closed set dims, optimal path traces in teal.
   Heuristic: Manhattan distance  h(n) = |Δx| + |Δy|
   Resets with a fresh random maze every ~5 seconds.
   ══════════════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('nnCanvas');
  if(!canvas)return;
  /* Respect reduced-motion: hide canvas entirely, show a static gradient instead */
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    canvas.style.background='radial-gradient(ellipse at 70% 50%,rgba(167,139,245,.07) 0%,transparent 70%)';
    return;
  }
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const scene=new THREE.Scene();

  const isMob=innerWidth<640;
  const COLS=isMob?14:22, ROWS=isMob?10:14;
  const CELL=0.76, GAP=0.82;
  const CX=(COLS-1)*GAP*.5, CZ=(ROWS-1)*GAP*.5;

  const camera=new THREE.PerspectiveCamera(50,1,.1,300);
  camera.position.set(CX-1,16,CZ+10);
  camera.lookAt(CX,0,CZ-1.5);

  function resize(){
    const w=canvas.offsetWidth,h=canvas.offsetHeight||innerHeight;
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  window.addEventListener('resize',resize);resize();

  scene.add(new THREE.AmbientLight(0x090812,1.6));
  const sun=new THREE.DirectionalLight(0xA78BF5,.75);sun.position.set(4,12,6);scene.add(sun);
  const sun2=new THREE.DirectionalLight(0x5EEAD4,.35);sun2.position.set(-4,8,-4);scene.add(sun2);
  const probe=new THREE.PointLight(0xA78BF5,0,11);scene.add(probe);

  /* shared cell geometries */
  const fGeo=new THREE.BoxGeometry(CELL,.07,CELL);
  const wGeo=new THREE.BoxGeometry(CELL,.26,CELL);

  /* cell state enum */
  const ST_EMPTY=0,ST_OPEN=1,ST_CLOSED=2,ST_PATH=3,ST_START=4,ST_GOAL=5;
  const COLORS=[0x0c0c15,0x7C3AED,0x2d1b69,0x5EEAD4,0x22c55e,0xFCD34D];
  const YS=[0,.06,.02,.14,.07,.07];
  const OP=[.42,.95,.72,1.0,1.0,1.0];

  /* grid data */
  let grid=[],meshes=[]; /* grid: 0=empty,1=wall,2=start,3=goal */
  const WALL=1,START=2,GOAL=3;

  function key(r,c){return r*COLS+c;}
  function h(r,c){return Math.abs(r-(ROWS-2))+Math.abs(c-(COLS-2));}

  function bfsOk(){
    const vis=Array.from({length:ROWS},()=>new Uint8Array(COLS));
    const q=[[1,1]];vis[1][1]=1;
    while(q.length){const[r,c]=q.shift();if(r===ROWS-2&&c===COLS-2)return true;for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1]]){const nr=r+dr,nc=c+dc;if(nr<0||nr>=ROWS||nc<0||nc>=COLS||vis[nr][nc]||grid[nr][nc]===WALL)continue;vis[nr][nc]=1;q.push([nr,nc]);}}
    return false;
  }

  function buildMaze(){
    meshes.forEach(row=>row&&row.forEach(m=>m&&scene.remove(m)));
    meshes=[];grid=[];
    for(let r=0;r<ROWS;r++){grid[r]=[];meshes[r]=[];for(let c=0;c<COLS;c++)grid[r][c]=0;}
    /* borders */
    for(let r=0;r<ROWS;r++)grid[r][0]=grid[r][COLS-1]=WALL;
    for(let c=0;c<COLS;c++)grid[0][c]=grid[ROWS-1][c]=WALL;
    /* random interior walls */
    for(let r=1;r<ROWS-1;r++)for(let c=1;c<COLS-1;c++){
      if(r<=2&&c<=2)continue;if(r>=ROWS-3&&c>=COLS-3)continue;
      if(Math.random()<.27)grid[r][c]=WALL;
    }
    /* guarantee a path */
    if(!bfsOk()){
      for(let s=0;s<=ROWS+COLS;s++){
        const r=1+Math.round((ROWS-3)*s/(ROWS+COLS));
        const c=1+Math.round((COLS-3)*s/(ROWS+COLS));
        if(r>0&&r<ROWS-1&&c>0&&c<COLS-1)grid[r][c]=0;
      }
    }
    grid[1][1]=START;grid[ROWS-2][COLS-2]=GOAL;
    /* create meshes */
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
      const w=grid[r][c]===WALL;
      const initSt=grid[r][c]===START?ST_START:grid[r][c]===GOAL?ST_GOAL:w?-1:ST_EMPTY;
      const mat=new THREE.MeshPhongMaterial({
        color:w?0x18182e:initSt>=0?COLORS[initSt]:COLORS[ST_EMPTY],
        shininess:45,transparent:true,opacity:w?.88:initSt>=0?OP[initSt]:OP[ST_EMPTY]
      });
      const m=new THREE.Mesh(w?wGeo:fGeo,mat);
      m.position.set(c*GAP,w?.11:initSt>=0?YS[initSt]:0,(ROWS-1-r)*GAP);
      scene.add(m);meshes[r][c]=m;
    }
  }

  function setCell(r,c,st){
    if(grid[r][c]===WALL)return;
    const m=meshes[r][c];if(!m)return;
    m.material.color.setHex(COLORS[st]);
    m.material.opacity=OP[st];
    m.position.y=YS[st];
  }

  /* A* state */
  let aOpen,aClosed,aCameFrom,aG,aF,pathCells,pathIdx;
  let phase='search',revealF=0,pauseT=0,curNode=null;

  function initAStar(){
    aOpen=new Map();aClosed=new Set();aCameFrom={};
    aG=Array.from({length:ROWS},()=>new Float32Array(COLS).fill(1e9));
    aF=Array.from({length:ROWS},()=>new Float32Array(COLS).fill(1e9));
    pathCells=[];pathIdx=0;curNode=null;
    aG[1][1]=0;aF[1][1]=h(1,1);aOpen.set(key(1,1),aF[1][1]);
    setCell(1,1,ST_START);setCell(ROWS-2,COLS-2,ST_GOAL);
  }

  function astarStep(){
    let bK=-1,bF=Infinity;
    for(const[k,f]of aOpen)if(f<bF){bF=f;bK=k;}
    if(bK<0)return'nopath';
    const cr=Math.floor(bK/COLS),cc=bK%COLS;
    curNode={r:cr,c:cc};
    if(cr===ROWS-2&&cc===COLS-2){
      let k=bK;
      while(aCameFrom[k]!==undefined){pathCells.unshift(k);k=aCameFrom[k];}
      pathCells.unshift(key(1,1));
      return'found';
    }
    aOpen.delete(bK);aClosed.add(bK);
    if(grid[cr][cc]!==START&&grid[cr][cc]!==GOAL)setCell(cr,cc,ST_CLOSED);
    for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1]]){
      const nr=cr+dr,nc=cc+dc;
      if(nr<0||nr>=ROWS||nc<0||nc>=COLS||grid[nr][nc]===WALL)continue;
      const nk=key(nr,nc);
      if(aClosed.has(nk))continue;
      const tG=aG[cr][cc]+1;
      if(tG<aG[nr][nc]){
        aCameFrom[nk]=bK;aG[nr][nc]=tG;aF[nr][nc]=tG+h(nr,nc);
        aOpen.set(nk,aF[nr][nc]);
        if(grid[nr][nc]!==START&&grid[nr][nc]!==GOAL)setCell(nr,nc,ST_OPEN);
      }
    }
    return'running';
  }

  buildMaze();initAStar();

  let rmx=0,rmy=0;
  document.addEventListener('mousemove',e=>{rmx=(e.clientX/innerWidth-.5);rmy=(e.clientY/innerHeight-.5)});

  const clock=new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const dt=clock.getDelta();

    if(phase==='search'){
      let res='running';
      for(let i=0;i<2&&res==='running';i++)res=astarStep();
      if(curNode){probe.position.set(curNode.c*GAP,2.8,(ROWS-1-curNode.r)*GAP);probe.color.setHex(0xA78BF5);probe.intensity=4.5;}
      if(res==='found'){phase='path';revealF=0;probe.color.setHex(0x5EEAD4);}
      else if(res==='nopath'){phase='pause';pauseT=0;}
    } else if(phase==='path'){
      revealF++;
      if(revealF%3===0&&pathIdx<pathCells.length){
        const k=pathCells[pathIdx++];
        const r=Math.floor(k/COLS),c=k%COLS;
        if(grid[r][c]!==START&&grid[r][c]!==GOAL)setCell(r,c,ST_PATH);
        probe.position.set(c*GAP,2.8,(ROWS-1-r)*GAP);probe.intensity=5.5;
      }
      if(pathIdx>=pathCells.length){phase='pause';pauseT=0;}
    } else if(phase==='pause'){
      pauseT+=dt;
      probe.intensity=Math.max(0,probe.intensity-dt*4);
      if(pauseT>2.8){buildMaze();initAStar();phase='search';probe.intensity=4.5;}
    }

    camera.position.x=CX-1+rmx*1.4;
    camera.lookAt(CX+rmx*.4,0,CZ-1.5);
    renderer.render(scene,camera);
  }
  animate();
})();

/* ══════════════════════════════════════════════════════
   ABOUT — BINARY SEARCH TREE (live insertions)
   Random integers insert one by one into a real BST.
   Each node drops from above to its computed position.
   Edges draw as the tree grows. After the tree fills,
   a traversal pulse sweeps in-order, then it resets.
   ══════════════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('ac');
  if(!canvas)return;
  /* Respect reduced-motion preference */
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){canvas.style.display='none';return;}
  const parent=canvas.parentElement;

  /* Lazy init — defer GPU work until canvas is near viewport */
  const lazyObs=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting)return;
    lazyObs.disconnect();
    initBST(canvas,parent);
  },{rootMargin:'200px'});
  lazyObs.observe(canvas);

  function initBST(canvas,parent){
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(52,1,.1,100);
  camera.position.set(0,1.2,9.5);
  camera.lookAt(0,-1,0);

  function resize(){
    const w=parent.offsetWidth,h=parent.offsetHeight||parent.offsetWidth;
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(parent);resize();

  scene.add(new THREE.AmbientLight(0x090812,1.2));
  const pl=new THREE.PointLight(0xA78BF5,3.2,20);pl.position.set(3,5,6);scene.add(pl);
  const pl2=new THREE.PointLight(0x5EEAD4,1.8,14);pl2.position.set(-3,2,5);scene.add(pl2);
  const probe=new THREE.PointLight(0x5EEAD4,0,8);scene.add(probe);

  /* BST node class */
  function BSTNode(val,depth,x){
    this.val=val;this.left=null;this.right=null;
    this.depth=depth;this.x=x;
    this.mesh=null;this.edgeLine=null;this.state='idle'; /* idle|inserting|visited */
  }
  let root=null,nodeList=[],edgeList=[];
  const YSEP=1.15,XBASE=3.2;

  function insertBST(val){
    function ins(node,v,depth,x,xRange){
      if(!node){
        const n=new BSTNode(v,depth,x);nodeList.push(n);return n;
      }
      if(v<node.val){
        const nx=x-xRange*.5;
        node.left=ins(node.left,v,depth+1,nx,xRange*.5);
      } else {
        const nx=x+xRange*.5;
        node.right=ins(node.right,v,depth+1,nx,xRange*.5);
      }
      return node;
    }
    root=ins(root,val,0,0,XBASE);
  }

  const nGeo=new THREE.SphereGeometry(.22,14,14);
  const FLY_DUR=.48;

  /* pending mesh creation after insert */
  function materializeNode(n,parentNode){
    const mat=new THREE.MeshPhongMaterial({color:0xA78BF5,shininess:100,transparent:true,opacity:0,emissive:0xA78BF5,emissiveIntensity:.1});
    const m=new THREE.Mesh(nGeo,mat);
    const tx=n.x, ty=-n.depth*YSEP, tz=0;
    m.position.set(tx,ty+3.5,tz); /* start above */
    scene.add(m);n.mesh=m;

    if(parentNode&&parentNode.mesh){
      const pts=[parentNode.mesh.position.clone(),new THREE.Vector3(tx,ty,tz)];
      const lg=new THREE.BufferGeometry().setFromPoints(pts);
      const lm=new THREE.LineBasicMaterial({color:0xA78BF5,transparent:true,opacity:0});
      const l=new THREE.Line(lg,lm);scene.add(l);
      n.edgeLine=l;edgeList.push({line:l,mat:lm,n});
    }
    /* animate drop */
    const startY=ty+3.5,endY=ty;
    let t=0;
    n.state='inserting';
    probe.position.set(tx,startY,1);probe.intensity=4;
    function drop(){
      if(t>=1){
        m.position.y=endY;m.material.opacity=.9;
        if(n.edgeLine)n.edgeLine.material.opacity=.5;
        probe.intensity=0;n.state='idle';return;
      }
      t=Math.min(t+.025/FLY_DUR,1);
      const e=1-(1-t)*(1-t);
      m.position.y=startY+(endY-startY)*e;
      m.material.opacity=e*.9;
      probe.position.set(tx,m.position.y,1);
      requestAnimationFrame(drop);
    }
    drop();
  }

  /* In-order traversal list */
  function inorder(node,out=[]){if(!node)return out;inorder(node.left,out);out.push(node);inorder(node.right,out);return out;}

  /* State machine */
  const INSERT_IV=.9, N_VALS=13, PAUSE_DUR=2.4;
  let phase='insert',phaseT=0,queue=[],inorderList=[],ioIdx=0,ioT=0;
  let parentMap=new Map();

  function freshKeys(){
    const used=new Set();const out=[];
    while(out.length<N_VALS){const v=10+Math.floor(Math.random()*88);if(!used.has(v)){used.add(v);out.push(v);}}
    return out;
  }

  function resetAll(){
    nodeList.forEach(n=>{if(n.mesh)scene.remove(n.mesh);if(n.edgeLine)scene.remove(n.edgeLine);});
    edgeList=[];nodeList=[];root=null;parentMap=new Map();
    queue=freshKeys();inorderList=[];ioIdx=0;phase='insert';phaseT=0;
  }
  resetAll();

  function insertNext(){
    const v=queue.shift();
    /* find parent before inserting */
    let par=null,cur=root,depth=0,x=0,xRange=XBASE;
    while(cur){par=cur;if(v<cur.val){x=cur.x-xRange*.5;xRange*=.5;depth++;cur=cur.left;}else{x=cur.x+xRange*.5;xRange*=.5;depth++;cur=cur.right;}}
    insertBST(v);
    const newNode=nodeList[nodeList.length-1];
    parentMap.set(newNode,par);
    materializeNode(newNode,par);
  }

  /* Inorder sweep */
  function startInorder(){
    inorderList=inorder(root);ioIdx=0;ioT=0;phase='traverse';
    inorderList.forEach(n=>{if(n.mesh)n.mesh.material.color.setHex(0xA78BF5);});
  }

  const clock=new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const dt=clock.getDelta();
    const t=clock.getElapsedTime();

    if(phase==='insert'){
      phaseT+=dt;
      const allIdle=nodeList.every(n=>n.state==='idle');
      if(phaseT>=INSERT_IV&&allIdle&&queue.length>0){insertNext();phaseT=0;}
      if(queue.length===0&&allIdle){setTimeout(startInorder,800);}
    } else if(phase==='traverse'){
      ioT+=dt;
      if(ioT>=.28&&ioIdx<inorderList.length){
        const n=inorderList[ioIdx++];
        if(n.mesh){n.mesh.material.color.setHex(0x5EEAD4);n.mesh.material.emissive.setHex(0x5EEAD4);
          probe.position.set(n.x,-n.depth*YSEP,1.2);probe.color.setHex(0x5EEAD4);probe.intensity=3.5;}
        ioT=0;
      }
      if(ioIdx>=inorderList.length&&ioT>1.2){phase='pause';phaseT=0;}
    } else if(phase==='pause'){
      phaseT+=dt;probe.intensity=Math.max(0,probe.intensity-dt*3);
      if(phaseT>PAUSE_DUR)resetAll();
    }

    /* Animate inserting nodes */
    nodeList.forEach(n=>{
      if(!n.mesh)return;
      if(n.state==='idle'&&phase!=='traverse'){
        n.mesh.material.color.setHex(0xA78BF5);
        n.mesh.material.emissive.setHex(0xA78BF5);
        n.mesh.scale.setScalar(1+.06*Math.sin(t*2.2+n.val*.4));
      }
    });

    pl.position.x=3+Math.sin(t*.3)*2;
    pl.position.y=5+Math.cos(t*.24)*1.5;
    scene.rotation.y=Math.sin(t*.14)*.06;
    renderer.render(scene,camera);
  }
  animate();
  } /* end initBST */
})();

/* ══════════════════════════════════════════════════════
   TERMINAL — Typewriter animation
   Cycles through realistic dev commands from Nehang's
   actual stack. Prompt → command → output, repeating.
   ══════════════════════════════════════════════════════ */
(function(){
  const body=document.getElementById('termBody');
  if(!body)return;

  const PROMPT='<span class="tp">nehang@usc</span><span class="tout">:</span><span class="tc">~/projects</span><span class="tout">$</span> ';

  const SEQUENCES=[
    [
      {cmd:'python3 pipeline.py --source web --records 10000',delay:55},
      {out:'<span class="tout">Initialising scraper engine...</span>'},
      {out:'<span class="tout">Connecting to MySQL · nehangdb · pipeline_v3</span>'},
      {out:'<span class="tout">[████████████████████] 10,000 / 10,000 records</span>'},
      {out:'<span class="tok">✓ Pipeline complete in 4.31s — 0 errors</span>'},
    ],
    [
      {cmd:'flutter build apk --release',delay:60},
      {out:'<span class="tout">Compiling Kotlin... (FinTrackr)</span>'},
      {out:'<span class="tout">Running Gradle task assembleRelease...</span>'},
      {out:'<span class="tok">✓ Built build/app/outputs/apk/release/app-release.apk (18.4 MB)</span>'},
    ],
    [
      {cmd:'git log --oneline -5',delay:55},
      {out:'<span class="tout">a3f91bc feat: add expense chart with category breakdown</span>'},
      {out:'<span class="tout">c88d2e1 fix: debt payoff calculation edge case</span>'},
      {out:'<span class="tout">f14a009 refactor: extract reusable Flutter widget library</span>'},
      {out:'<span class="tout">9b3c714 feat: Golang API endpoint for user goals</span>'},
      {out:'<span class="tout">0e2d3f8 chore: MySQL index optimisation on records table</span>'},
    ],
    [
      {cmd:'python3 -c "import pandas as pd; df = pd.read_csv(\'records.csv\'); print(df.describe())"',delay:45},
      {out:'<span class="tout">       record_id    status_code    latency_ms</span>'},
      {out:'<span class="tout">count  10000.00      10000.00       10000.00</span>'},
      {out:'<span class="tout">mean    5000.50        200.03          42.17</span>'},
      {out:'<span class="tout">std     2886.89          1.42          11.33</span>'},
      {out:'<span class="tok">✓ DataFrame loaded — 0 null values, 0 duplicates</span>'},
    ],
    [
      {cmd:'python3 train.py --model knn --dataset records --k 5',delay:50},
      {out:'<span class="tout">Loading dataset... 10,000 samples × 8 features</span>'},
      {out:'<span class="tout">Train / test split: 80% / 20%</span>'},
      {out:'<span class="tout">Fitting KNeighborsClassifier(k=5)...</span>'},
      {out:'<span class="tout">Accuracy:  94.3%   Precision: 93.8%   Recall: 94.1%</span>'},
      {out:'<span class="tok">✓ Model saved to ./models/knn_v1.pkl</span>'},
    ],
    [
      {cmd:'go run server.go --port 8080',delay:58},
      {out:'<span class="tout">» Loading routes...</span>'},
      {out:'<span class="tout">» Registered: GET  /api/users</span>'},
      {out:'<span class="tout">» Registered: POST /api/goals</span>'},
      {out:'<span class="tout">» Registered: GET  /api/pipeline/status</span>'},
      {out:'<span class="tok">✓ Server listening on :8080</span>'},
    ],
  ];

  let lines=[],seqIdx=0,cursorEl=null;
  let paused=false,pendingLoop=null;

  function addLine(html){
    const d=document.createElement('div');
    d.className='term-line';d.innerHTML=html;
    body.appendChild(d);
    body.scrollTop=body.scrollHeight;
    return d;
  }

  function clearTerm(){
    body.innerHTML='';lines=[];
    if(cursorEl)cursorEl=null;
  }

  function typeLine(text,delay,cb){
    const promptD=addLine(PROMPT);
    const span=document.createElement('span');
    span.style.color='#e2dff5';
    promptD.appendChild(span);
    cursorEl=document.createElement('span');
    cursorEl.className='tcursor';
    promptD.appendChild(cursorEl);

    let i=0;
    function tick(){
      if(paused||window._termTabHidden){setTimeout(tick,120);return;}
      if(i<text.length){span.textContent+=text[i++];body.scrollTop=body.scrollHeight;setTimeout(tick,delay+(Math.random()*18-9));}
      else{promptD.removeChild(cursorEl);cursorEl=null;cb();}
    }
    tick();
  }

  function showOutput(html,cb){
    setTimeout(()=>{
      if(paused){setTimeout(()=>showOutput(html,cb),120);return;}
      addLine(html);cb();
    },160);
  }

  function runSequence(seq,done){
    const steps=seq.slice();
    function next(){
      if(!steps.length){setTimeout(done,900);return;}
      const s=steps.shift();
      if(s.cmd)typeLine(s.cmd,s.delay||55,next);
      else showOutput(s.out,next);
    }
    next();
  }

  function loop(){
    if(paused){pendingLoop=true;return;}
    pendingLoop=false;
    /* On every full cycle restart, clear terminal for a clean session */
    if(seqIdx>0&&seqIdx%SEQUENCES.length===0){
      clearTerm();
      /* Brief pause before restarting — like a new terminal session opening */
      setTimeout(()=>{if(!paused)runSequence(SEQUENCES[0],()=>{seqIdx=1;setTimeout(loop,1600);});},700);
      return;
    }
    const seq=SEQUENCES[seqIdx%SEQUENCES.length];seqIdx++;
    runSequence(seq,()=>{setTimeout(loop,1600);});
  }

  /* Pause when contact section enters viewport, resume when it leaves */
  const contactEl=document.getElementById('contact');
  if(contactEl){
    const pauseObs=new IntersectionObserver(es=>{
      const entering=es[0].isIntersecting;
      if(entering&&!paused){
        paused=true;
        /* show a blinking cursor to indicate suspended state */
        if(!body.querySelector('.tcursor')){
          const d=document.createElement('div');d.className='term-line';
          const c=document.createElement('span');c.className='tcursor';
          d.appendChild(c);body.appendChild(d);
        }
      } else if(!entering&&paused){
        paused=false;
        /* remove any lingering idle cursor */
        body.querySelectorAll('.term-line').forEach(l=>{
          if(l.children.length===1&&l.children[0].classList.contains('tcursor'))l.remove();
        });
        if(pendingLoop)loop();
      }
    },{threshold:.15});
    pauseObs.observe(contactEl);
  }

  /* Start once terminal section scrolls into view */
  const termObs=new IntersectionObserver(es=>{
    if(es[0].isIntersecting){termObs.disconnect();setTimeout(loop,400);}
  },{threshold:.3});
  const sec=document.getElementById('terminal-section');
  if(sec)termObs.observe(sec);
})();
