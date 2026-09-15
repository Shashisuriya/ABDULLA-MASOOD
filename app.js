'use strict';
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menu.setAttribute('aria-expanded','false'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if(event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menu.focus(); } });
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { document.querySelector('#service').value = link.dataset.service; document.querySelector('#enquiry-result').hidden = true; }));
const form = document.querySelector('#quote-form');
const result = document.querySelector('#enquiry-result');
form.addEventListener('input', () => { result.hidden = true; });
form.addEventListener('change', () => { result.hidden = true; });
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  const details = String(data.get('details')).trim();
  if(!name || !details) { const field = !name ? form.elements.name : form.elements.details; field.setCustomValidity('Please enter your project information.'); field.reportValidity(); field.addEventListener('input', () => field.setCustomValidity(''), {once:true}); return; }
  const message = `Hello Abdullah Masood Steel Works, I would like to request a quotation.\n\nName: ${name}\nService: ${data.get('service')}\nProject: ${details}`;
  document.querySelector('#whatsapp-enquiry').href = `https://wa.me/971557798855?text=${encodeURIComponent(message)}`;
  result.hidden = false;
});
document.querySelector('#year').textContent = new Date().getFullYear();
