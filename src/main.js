const projects = [
 ['Haddad PLM','Procesy / Discovery / Produkt','System wspierający tworzenie kolekcji odzieżowych — od koncepcji i projektowania po produkcję. Poznanie procesów różnych zespołów oraz stopniowe wdrażanie wspólnego środowiska pracy.','haddad-plm'],
 ['Eurocash','Retail / E-commerce / Organizacja','Współpraca przy usługach cyfrowych Delikatesów Centrum: Delikarcie, stronie sieci oraz Click & Collect. Podczas pandemii kluczowe było szybkie określenie MVP i uruchomienie rezerwacji zakupów.','sklep-delikatesy-pl'],
 ['PayPo','Fintech / CX / Marka','Połączenie doświadczenia użytkownika i komunikacji marki. Analiza procesu zakupowego, projektowanie interfejsu i rozwój identyfikacji wizualnej usługi odroczonych płatności.','paypo'],
 ['Parlor Social','Społeczność / Mobile / Integracje','Cyfrowe zaplecze nowojorskiego klubu: aplikacje mobilne, panel administracyjny, płatności i CRM. Za identyfikację oraz projekt interfejsu odpowiadało DTE Studio.','parlor-social'],
 ['PAYBACK','Koncepcja / Gry / Zaangażowanie','Punktołap — gra mobilna łącząca zabawę, rywalizację i nagrody w programie lojalnościowym. Projekt na styku marketingu, technologii i pracy kreatywnej.','punktolap']
];
document.querySelector('#projects').innerHTML=projects.map(([name,tags,text,path],i)=>`<details class="project"><summary><span class="project-number">0${i+1}</span><h3>${name}</h3><span class="project-tags">${tags}</span><span class="plus">+</span></summary><div class="project-body"><p>${text}</p><a class="text-link" href="https://kissdigital.com/work/${path}" target="_blank" rel="noopener noreferrer">Opis realizacji w KISS digital ↗</a></div></details>`).join('');

import './navigation.js';
const ventures = document.querySelector('.ventures');
const cards = [...document.querySelectorAll('.venture')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const desktop = matchMedia('(min-width: 761px)');
let frame = 0;
function updateParallax() {
  frame = 0;
  const enabled = desktop.matches && !reducedMotion.matches;
  const rect = ventures.getBoundingClientRect();
  const travel = Math.max(0, Math.min(96, (innerHeight * .85 - rect.top) * .28));
  cards.forEach((card, i) => {
    const offset = enabled ? i * travel / 2 : 0;
    card.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
  });
}
function scheduleParallax() {
  if (!frame) frame = requestAnimationFrame(updateParallax);
}
addEventListener('scroll', scheduleParallax, { passive: true });
addEventListener('resize', scheduleParallax);
reducedMotion.addEventListener('change', scheduleParallax);
desktop.addEventListener('change', scheduleParallax);
updateParallax();

import './client-map.js';
