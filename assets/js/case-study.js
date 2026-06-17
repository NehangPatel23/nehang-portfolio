/* Theme toggle */
const html=document.documentElement;
const tog=document.getElementById('tog');
if(tog){
  tog.addEventListener('click',()=>{
    const isDark=html.getAttribute('data-theme')==='dark';
    const next=isDark?'light':'dark';
    html.setAttribute('data-theme',next);
    try{localStorage.setItem('nehang-theme',next);}catch(e){}
  });
}

/* Drawer */
const ham=document.getElementById('ham'),drawer=document.getElementById('drawer');
let dOpen=false;
function setDrawer(v){
  if(!drawer||!ham)return;
  dOpen=v;
  if(v){drawer.style.display='flex';requestAnimationFrame(()=>drawer.classList.add('open'));}
  else{drawer.classList.remove('open');setTimeout(()=>{if(!dOpen)drawer.style.display='none';},400);}
  ham.classList.toggle('open',v);
  document.body.style.overflow=v?'hidden':'';
}
if(ham)ham.addEventListener('click',()=>setDrawer(!dOpen));
document.querySelectorAll('.dl').forEach(a=>a.addEventListener('click',()=>setDrawer(false)));

/* Resume modal */
const resumeOverlay=document.getElementById('resumeOverlay');
const resumeBtn=document.getElementById('resumeBtn');
const resumeClose=document.getElementById('resumeClose');
function openResume(){
  if(!resumeOverlay)return;
  resumeOverlay.style.display='flex';
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>{
    resumeOverlay.classList.add('open');
    setTimeout(()=>{if(resumeClose)resumeClose.focus();},420);
  });
}
function closeResume(){
  if(!resumeOverlay)return;
  resumeOverlay.classList.remove('open');
  setTimeout(()=>{resumeOverlay.style.display='none';document.body.style.overflow='';},400);
}
if(resumeBtn)resumeBtn.addEventListener('click',openResume);
if(resumeClose)resumeClose.addEventListener('click',closeResume);
if(resumeOverlay)resumeOverlay.addEventListener('click',e=>{if(e.target===resumeOverlay)closeResume();});
const drawerResumeBtn=document.getElementById('drawerResumeBtn');
if(drawerResumeBtn)drawerResumeBtn.addEventListener('click',()=>{setDrawer(false);openResume();});
document.addEventListener('keydown',e=>{
  if(!resumeOverlay)return;
  if(e.key==='Escape'&&resumeOverlay.classList.contains('open')){closeResume();return;}
  if(!resumeOverlay.classList.contains('open')||e.key!=='Tab')return;
  const focusable=resumeOverlay.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
  const first=focusable[0],last=focusable[focusable.length-1];
  if(e.shiftKey){if(document.activeElement===first){e.preventDefault();last.focus();}}
  else{if(document.activeElement===last){e.preventDefault();first.focus();}}
});

/* Sticky nav */
const nav=document.getElementById('nav');
if(nav){
  window.addEventListener('scroll',()=>nav.classList.toggle('stuck',scrollY>40),{passive:true});
}

/* Reading progress bar */
const progressBar=document.getElementById('progress-bar');
window.addEventListener('scroll',()=>{
  const total=document.documentElement.scrollHeight-window.innerHeight;
  if(progressBar)progressBar.style.width=(total>0?(window.scrollY/total*100):0)+'%';
},{passive:true});

/* Back to top */
const btt=document.getElementById('btt');
window.addEventListener('scroll',()=>{
  if(btt)btt.classList.toggle('show',window.scrollY>500);
},{passive:true});
if(btt)btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* Reveal on scroll */
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.08});
document.querySelectorAll('.r').forEach(el=>obs.observe(el));

/* TOC scroll spy */
const tocLinks=document.querySelectorAll('.cs-toc a');
const tocSections=[...tocLinks].map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
if(tocLinks.length&&tocSections.length){
  const tocObs=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        const id=e.target.id;
        tocLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));
      }
    });
  },{rootMargin:'-20% 0px -70% 0px',threshold:0});
  tocSections.forEach(s=>tocObs.observe(s));
}

/* Custom cursor */
if(window.matchMedia('(pointer:fine)').matches){
  const cur=document.getElementById('cur'),cur2=document.getElementById('cur2');
  if(cur&&cur2){
    let mx=0,my=0,fx=0,fy=0;
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
    (function loop(){fx+=(mx-fx)*.11;fy+=(my-fy)*.11;cur2.style.left=fx+'px';cur2.style.top=fy+'px';requestAnimationFrame(loop)})();
    document.querySelectorAll('a,button,.btn,.cs-gallery-item').forEach(el=>{
      el.addEventListener('mouseenter',()=>{cur.classList.add('big');cur2.classList.add('big')});
      el.addEventListener('mouseleave',()=>{cur.classList.remove('big');cur2.classList.remove('big')});
    });
  }
}
