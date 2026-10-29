const projects = [
 ['Haddad PLM','Procesy / Discovery / Produkt','System wspierający tworzenie kolekcji odzieżowych — od koncepcji i projektowania po produkcję. Poznanie procesów różnych zespołów oraz stopniowe wdrażanie wspólnego środowiska pracy.','haddad-plm'],
 ['Eurocash','Retail / E-commerce / Organizacja','Współpraca przy usługach cyfrowych Delikatesów Centrum: Delikarcie, stronie sieci oraz Click & Collect. Podczas pandemii kluczowe było szybkie określenie MVP i uruchomienie rezerwacji zakupów.','sklep-delikatesy-pl'],
 ['PayPo','Fintech / CX / Marka','Połączenie doświadczenia użytkownika i komunikacji marki. Analiza procesu zakupowego, projektowanie interfejsu i rozwój identyfikacji wizualnej usługi odroczonych płatności.','paypo'],
 ['Parlor Social','Społeczność / Mobile / Integracje','Cyfrowe zaplecze nowojorskiego klubu: aplikacje mobilne, panel administracyjny, płatności i CRM. Za identyfikację oraz projekt interfejsu odpowiadało DTE Studio.','parlor-social'],
 ['PAYBACK','Koncepcja / Gry / Zaangażowanie','Punktołap — gra mobilna łącząca zabawę, rywalizację i nagrody w programie lojalnościowym. Projekt na styku marketingu, technologii i pracy kreatywnej.','punktolap']
];
document.querySelector('#projects').innerHTML=projects.map(([name,tags,text,path],i)=>`<details class="project"><summary><span class="project-number">0${i+1}</span><h3>${name}</h3><span class="project-tags">${tags}</span><span class="plus">+</span></summary><div class="project-body"><p>${text}</p><a class="text-link" href="https://kissdigital.com/work/${path}">Opis realizacji w KISS digital ↗</a></div></details>`).join('');

import './navigation.js';
const track=document.querySelector('.venture-scroll');
const cards=[...document.querySelectorAll('.venture')];
const controls=[...document.querySelectorAll('[data-card]')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let frame=0;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function paintDeck(){
 frame=0;
 if(reduced.matches){document.documentElement.classList.remove('motion-ready');cards.forEach(c=>{c.removeAttribute('style');c.inert=false;});return;}
 document.documentElement.classList.add('motion-ready');
 const rect=track.getBoundingClientRect();
 const progress=clamp(-rect.top/(track.offsetHeight-innerHeight),0,1)*2;
 const step=Math.min(1,Math.floor(progress));
 const t=progress-step;
 const eased=t*t*(3-2*t);
 const active=clamp(Math.round(progress),0,2);
 cards.forEach((card,i)=>{
  const rank=(i-step+3)%3;
  let depth=rank-eased;
  let x=0,angle=0;
  if(rank===0){depth=t<.5?0:2; x=-Math.sin(Math.PI*t)*92;angle=-Math.sin(Math.PI*t)*12;}
  card.style.transform=`translate3d(${x}%, ${depth*19}px, ${-depth*85}px) rotateY(${angle}deg) rotateZ(${depth*-1.5}deg)`;
  card.style.zIndex=String(rank===0?(t<.5?5:1):4-rank);
  card.inert=i!==active;
 });
 controls.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===active)));
}
function schedule(){if(!frame)frame=requestAnimationFrame(paintDeck);}
controls.forEach((button,i)=>button.addEventListener('click',()=>{if(reduced.matches)return;const top=scrollY+track.getBoundingClientRect().top;window.scrollTo({top:top+(track.offsetHeight-innerHeight)*i/2,behavior:'smooth'});}));
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);paintDeck();
