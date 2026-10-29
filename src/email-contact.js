const reveal=document.querySelector('#email-reveal');
const container=document.querySelector('#email-address');
const address=document.querySelector('#email-step');
const copy=document.querySelector('#email-copy');
const status=document.querySelector('#copy-status');
const email='matys+web@zguda.com';
reveal.addEventListener('click',()=>{
 address.textContent=email;
 container.hidden=false;
 reveal.setAttribute('aria-expanded','true');
 reveal.hidden=true;
 address.focus();
});
address.addEventListener('click',()=>{
 copy.hidden=false;
 address.setAttribute('aria-expanded','true');
 copy.focus();
});
copy.addEventListener('click',async()=>{
 status.textContent='';
 try{
  await navigator.clipboard.writeText(email);
  status.textContent='Adres skopiowany.';
 }catch{
  status.textContent='Nie udało się skopiować. Zaznacz adres i skopiuj go ręcznie.';
 }
});
