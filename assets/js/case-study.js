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
  const lb=document.getElementById('csLb');
  if(lb&&lb.classList.contains('open')){
    if(e.key==='Escape'){e.preventDefault();window.__csLbClose&&window.__csLbClose();return;}
    if(e.key==='ArrowLeft'){e.preventDefault();window.__csLbStep&&window.__csLbStep(-1);return;}
    if(e.key==='ArrowRight'){e.preventDefault();window.__csLbStep&&window.__csLbStep(1);return;}
    if(e.key==='Tab'){
      const focusable=[...lb.querySelectorAll('button')].filter(b=>getComputedStyle(b).display!=='none');
      const first=focusable[0],last=focusable[focusable.length-1];
      if(!first)return;
      if(e.shiftKey){if(document.activeElement===first){e.preventDefault();last.focus();}}
      else{if(document.activeElement===last){e.preventDefault();first.focus();}}
    }
    return;
  }
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

/* Gallery lightbox */
(function(){
  const items=[...document.querySelectorAll('.cs-gallery-item')].filter(f=>f.querySelector('img'));
  if(!items.length)return;

  const slides=items.map(fig=>{
    const img=fig.querySelector('img');
    const cap=fig.querySelector('figcaption');
    return {src:img.getAttribute('src'),alt:img.alt||'',cap:cap?cap.textContent.trim():''};
  });

  const lb=document.createElement('div');
  lb.id='csLb';
  lb.className='cs-lb'+(slides.length<2?' single':'');
  lb.setAttribute('role','dialog');
  lb.setAttribute('aria-modal','true');
  lb.setAttribute('aria-label','Image viewer');
  lb.innerHTML=`
    <div class="cs-lb-backdrop" data-lb="close"></div>
    <button type="button" class="cs-lb-close" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <button type="button" class="cs-lb-prev" aria-label="Previous image">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
    </button>
    <button type="button" class="cs-lb-next" aria-label="Next image">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
    </button>
    <figure class="cs-lb-stage">
      <div class="cs-lb-frame"><img alt=""/></div>
      <figcaption class="cs-lb-cap"></figcaption>
    </figure>
    <p class="cs-lb-count" aria-live="polite"></p>
  `;
  document.body.appendChild(lb);

  const imgEl=lb.querySelector('.cs-lb-frame img');
  const capEl=lb.querySelector('.cs-lb-cap');
  const countEl=lb.querySelector('.cs-lb-count');
  const closeBtn=lb.querySelector('.cs-lb-close');
  const prevBtn=lb.querySelector('.cs-lb-prev');
  const nextBtn=lb.querySelector('.cs-lb-next');
  let idx=0, lastFocus=null;

  function render(){
    const s=slides[idx];
    imgEl.src=s.src;
    imgEl.alt=s.alt;
    capEl.textContent=s.cap;
    capEl.hidden=!s.cap;
    countEl.textContent=(idx+1)+' / '+slides.length;
  }
  function open(n){
    idx=(n+slides.length)%slides.length;
    render();
    lastFocus=document.activeElement;
    lb.classList.add('open');
    document.body.style.overflow='hidden';
    closeBtn.focus();
  }
  function close(){
    lb.classList.remove('open');
    document.body.style.overflow='';
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }
  function step(d){
    idx=(idx+d+slides.length)%slides.length;
    render();
  }

  window.__csLbClose=close;
  window.__csLbStep=step;

  items.forEach((fig,n)=>{
    fig.setAttribute('tabindex','0');
    fig.setAttribute('role','button');
    const label=slides[n].cap||slides[n].alt||'View larger image';
    fig.setAttribute('aria-label','View larger: '+label);
    fig.addEventListener('click',()=>open(n));
    fig.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();open(n);}
    });
  });

  closeBtn.addEventListener('click',close);
  prevBtn.addEventListener('click',()=>step(-1));
  nextBtn.addEventListener('click',()=>step(1));
  lb.addEventListener('click',e=>{if(e.target.dataset.lb==='close')close();});

  const cur=document.getElementById('cur'),cur2=document.getElementById('cur2');
  if(cur&&cur2){
    [closeBtn,prevBtn,nextBtn].forEach(el=>{
      el.addEventListener('mouseenter',()=>{cur.classList.add('big');cur2.classList.add('big')});
      el.addEventListener('mouseleave',()=>{cur.classList.remove('big');cur2.classList.remove('big')});
    });
  }
})();
