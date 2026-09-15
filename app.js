'use strict';
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>document.querySelector('#service').value=a.dataset.service));
document.querySelector('#year').textContent=new Date().getFullYear();
const cards=[...document.querySelectorAll('.project-card')],filters=[...document.querySelectorAll('[data-filter]')];
filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));cards.forEach(c=>c.hidden=button.dataset.filter!=='all'&&c.dataset.category!==button.dataset.filter);const count=cards.filter(c=>!c.hidden).length;document.querySelector('#project-count').textContent=`${count} project photograph${count===1?'':'s'}`;}));
const viewer=document.querySelector('#project-viewer');let activeLinks=[],current=0,opener;
function showPhoto(){const a=activeLinks[current],image=document.querySelector('#viewer-image');image.src=a.href;image.alt=a.querySelector('img').alt;document.querySelector('#viewer-title').textContent=a.dataset.title;document.querySelector('#viewer-category').textContent=a.dataset.caption;document.querySelector('#viewer-count').textContent=`${current+1} / ${activeLinks.length}`;}
document.querySelectorAll('.project-open').forEach(a=>a.addEventListener('click',e=>{if(!viewer.showModal)return;e.preventDefault();opener=a;activeLinks=cards.filter(c=>!c.hidden).map(c=>c.querySelector('a'));current=activeLinks.indexOf(a);showPhoto();viewer.showModal();document.body.classList.add('viewer-open');}));
document.querySelector('#viewer-close').addEventListener('click',()=>viewer.close());
function movePhoto(step){current=(current+step+activeLinks.length)%activeLinks.length;showPhoto();}
document.querySelector('#viewer-prev').addEventListener('click',()=>movePhoto(-1));document.querySelector('#viewer-next').addEventListener('click',()=>movePhoto(1));
viewer.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();movePhoto(1);}if(e.key==='ArrowLeft'){e.preventDefault();movePhoto(-1);}});
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
viewer.addEventListener('close',()=>{document.body.classList.remove('viewer-open');opener?.focus({preventScroll:true});});
const form=document.querySelector('#quote-form'),inputs=[...form.querySelectorAll('input[type="file"]')];
const error=document.querySelector('#upload-error'),summary=document.querySelector('#file-summary');
function validateFiles(){let total=0,count=0;error.textContent='';inputs.forEach(i=>i.setCustomValidity(''));for(const input of inputs){for(const file of input.files){count++;total+=file.size;if(!/\.(pdf|dwg|png|jpe?g)$/i.test(file.name)){error.textContent='Please choose PDF, DWG, PNG or JPG files only.';input.setCustomValidity(error.textContent);}else if(!file.size){error.textContent='This file is empty. Please choose another file.';input.setCustomValidity(error.textContent);}}}if(total>10*1024*1024){error.textContent='Your attachments exceed 10 MB in total. Please choose smaller files.';inputs.find(i=>i.files.length)?.setCustomValidity(error.textContent);}summary.textContent=count?`${count} file${count===1?'':'s'} selected · ${(total/1024/1024).toFixed(2)} MB`:'';return !error.textContent;}
inputs.forEach(i=>i.addEventListener('change',validateFiles));
document.querySelector('#add-files').addEventListener('click',e=>{document.querySelector('#extra-files').hidden=false;e.currentTarget.setAttribute('aria-expanded','true');e.currentTarget.hidden=true;document.querySelector('#drawing-2').focus();});
form.addEventListener('submit',e=>{if(!validateFiles()){e.preventDefault();form.reportValidity();return;}for(const id of ['customer-name','project-details']){const input=document.getElementById(id);if(!input.value.trim()){e.preventDefault();input.setCustomValidity('Please enter a value.');input.reportValidity();input.addEventListener('input',()=>input.setCustomValidity(''),{once:true});return;}}});
