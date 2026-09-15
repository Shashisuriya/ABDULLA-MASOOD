'use strict';
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>document.querySelector('#service').value=a.dataset.service));
document.querySelector('#year').textContent=new Date().getFullYear();
const cards=[...document.querySelectorAll('.project-card')],filters=[...document.querySelectorAll('[data-filter]')];
let projectFilter='all',projectLimit=12;
const matchingCards=()=>cards.filter(c=>projectFilter==='all'||c.dataset.category===projectFilter);
function renderProjects(){const matched=matchingCards();cards.forEach(c=>c.hidden=true);matched.slice(0,projectLimit).forEach(c=>c.hidden=false);document.querySelector('#project-count').textContent=`Showing ${Math.min(projectLimit,matched.length)} of ${matched.length} photographs`;document.querySelector('#load-projects').hidden=projectLimit>=matched.length;}
filters.forEach(button=>button.addEventListener('click',()=>{projectFilter=button.dataset.filter;projectLimit=12;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderProjects();}));
document.querySelector('#load-projects').addEventListener('click',()=>{const next=matchingCards()[projectLimit];projectLimit+=12;renderProjects();next?.querySelector('a').focus({preventScroll:true});});renderProjects();
const viewer=document.querySelector('#project-viewer');let activeLinks=[],current=0,opener;
function showPhoto(){const a=activeLinks[current],image=document.querySelector('#viewer-image');image.src=a.href;image.alt=a.querySelector('img').alt;document.querySelector('#viewer-title').textContent=a.dataset.title;document.querySelector('#viewer-category').textContent=a.dataset.caption;document.querySelector('#viewer-count').textContent=`${current+1} / ${activeLinks.length}`;}
document.querySelectorAll('.project-open').forEach(a=>a.addEventListener('click',e=>{if(!viewer.showModal)return;e.preventDefault();opener=a;activeLinks=matchingCards().map(c=>c.querySelector('a'));current=activeLinks.indexOf(a);showPhoto();viewer.showModal();document.body.classList.add('viewer-open');}));
document.querySelector('#viewer-close').addEventListener('click',()=>viewer.close());
function movePhoto(step){current=(current+step+activeLinks.length)%activeLinks.length;showPhoto();}
document.querySelector('#viewer-prev').addEventListener('click',()=>movePhoto(-1));document.querySelector('#viewer-next').addEventListener('click',()=>movePhoto(1));
viewer.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();movePhoto(1);}if(e.key==='ArrowLeft'){e.preventDefault();movePhoto(-1);}});
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
viewer.addEventListener('close',()=>{document.body.classList.remove('viewer-open');opener?.focus({preventScroll:true});});
const form=document.querySelector('#quote-form'),inputs=[...form.querySelectorAll('input[type="file"]')];
const error=document.querySelector('#upload-error'),summary=document.querySelector('#file-summary');
function validateFiles(){let total=0,count=0;error.textContent='';inputs.forEach(i=>i.setCustomValidity(''));for(const input of inputs){for(const file of input.files){count++;total+=file.size;if(!/\.(pdf|dwg|png|jpe?g)$/i.test(file.name)){error.textContent='Please choose PDF, DWG, PNG or JPG files only.';input.setCustomValidity(error.textContent);}else if(!file.size){error.textContent='This file is empty. Please choose another file.';input.setCustomValidity(error.textContent);}}}if(total>10000000){error.textContent='Your attachments exceed 10 MB in total. Please choose smaller files.';inputs.find(i=>i.files.length)?.setCustomValidity(error.textContent);}summary.textContent=count?`${count} file${count===1?'':'s'} selected Â· ${(total/1024/1024).toFixed(2)} MB`:'';return !error.textContent;}
inputs.forEach(i=>i.addEventListener('change',validateFiles));
document.querySelector('#add-files').addEventListener('click',e=>{document.querySelector('#extra-files').hidden=false;e.currentTarget.setAttribute('aria-expanded','true');e.currentTarget.hidden=true;document.querySelector('#drawing-2').focus();});
form.addEventListener('submit',e=>{if(!validateFiles()){e.preventDefault();form.reportValidity();return;}for(const id of ['customer-name','project-details']){const input=document.getElementById(id);if(!input.value.trim()){e.preventDefault();input.setCustomValidity('Please enter a value.');input.reportValidity();input.addEventListener('input',()=>input.setCustomValidity(''),{once:true});return;}}});

// Two image layers keep the hero lightweight; each incoming photograph decodes before fading.
const hero=document.querySelector('.hero-visual'),layers=[...document.querySelectorAll('.hero-photo')];
const slides=[53,1,48,29,58,7],slideNames=['Covered parking canopy','Balcony steel railings','Steel-frame seating','Outdoor canopy','Steel staircase','Industrial access platform'];
const motion=matchMedia('(prefers-reduced-motion: reduce)');let slide=0,layer=0,paused=motion.matches,busy=false,heroVisible=true,timer;
const pauseButton=document.querySelector('#hero-pause');
function syncPause(){pauseButton.textContent=paused?'▶':'Ⅱ';pauseButton.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');hero.classList.toggle('is-paused',paused);}
function schedule(){clearTimeout(timer);if(!paused&&!document.hidden&&heroVisible)timer=setTimeout(()=>changeSlide(1),6000);}
async function changeSlide(step){if(busy)return;busy=true;clearTimeout(timer);const next=(slide+step+slides.length)%slides.length,incoming=layers[1-layer];incoming.src=`assets/client/work-${String(slides[next]).padStart(2,'0')}.webp`;incoming.alt=slideNames[next];try{await incoming.decode();layers[layer].classList.remove('is-active');layers[layer].setAttribute('aria-hidden','true');incoming.classList.add('is-active');incoming.removeAttribute('aria-hidden');layer=1-layer;slide=next;document.querySelector('#hero-counter').textContent=`${String(slide+1).padStart(2,'0')} / 06`;}catch{}busy=false;schedule();}
pauseButton.addEventListener('click',()=>{paused=!paused;syncPause();schedule();});
document.querySelector('#hero-prev').addEventListener('click',()=>changeSlide(-1));document.querySelector('#hero-next').addEventListener('click',()=>changeSlide(1));
document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',e=>{paused=e.matches;syncPause();schedule();});
new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;schedule();},{threshold:.1}).observe(hero);syncPause();schedule();
document.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();})));
