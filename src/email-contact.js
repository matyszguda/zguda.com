import { t } from './i18n.js';

const reveal=document.querySelector('#email-reveal');
const container=document.querySelector('#email-address');
const address=document.querySelector('#email-step');
const copy=document.querySelector('#email-copy');
const status=document.querySelector('#copy-status');
const email='matys+web@zguda.com';
reveal.addEventListener('click',()=>{
 address.textContent=email;
 container.hidden=false;
 copy.hidden=false;
 reveal.setAttribute('aria-expanded','true');
 reveal.hidden=true;
 address.focus();
});
async function copyEmail(){
 status.textContent='';
 try{
  await navigator.clipboard.writeText(email);
  status.textContent=t('Adres skopiowany.','Email address copied.');
 }catch{
  status.textContent=t('Nie udało się skopiować. Zaznacz adres i skopiuj go ręcznie.','Could not copy the address. Select it and copy it manually.');
 }
}
address.addEventListener('click',copyEmail);
copy.addEventListener('click',copyEmail);
