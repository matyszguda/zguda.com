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
let activeCard = null;
function updateCardDepth() {
  frame = 0;
  const enabled = desktop.matches && !reducedMotion.matches;
  const rect = ventures.getBoundingClientRect();
  const phase = activeCard ?? Math.max(0, Math.min(2, (innerHeight * .88 - rect.top) / (innerHeight * .48) ));
  ventures.classList.toggle('has-depth', enabled);
  cards.forEach((card, i) => {
    // Each card takes the front plane in turn. Layout/order stays unchanged.
    const weight = enabled ? Math.exp(-Math.pow((phase - i) * 1.8, 2)) : 0;
    card.style.setProperty('--card-depth', enabled ? `${(-180 * (1 - weight)).toFixed(1)}px` : '0px');
    card.style.setProperty('--card-tilt', enabled ? `${((i - 1) * 6 * (1 - weight)).toFixed(2)}deg` : '0deg');
    card.style.setProperty('--card-shadow', enabled ? (0.025 + weight * .065).toFixed(3) : '0');
    card.style.zIndex = String(Math.round(weight * 10));
  });
}
function scheduleCardDepth() { if (!frame) frame = requestAnimationFrame(updateCardDepth); }
addEventListener('scroll', scheduleCardDepth, { passive: true });
addEventListener('resize', scheduleCardDepth);
reducedMotion.addEventListener('change', scheduleCardDepth);
desktop.addEventListener('change', scheduleCardDepth);
cards.forEach((card, i) => {
  card.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { activeCard = i; scheduleCardDepth(); } });
  card.addEventListener('pointerleave', () => { activeCard = null; scheduleCardDepth(); });
  card.addEventListener('focusin', () => { activeCard = i; scheduleCardDepth(); });
  card.addEventListener('focusout', e => { if (!card.contains(e.relatedTarget)) { activeCard = null; scheduleCardDepth(); } });
});
updateCardDepth();

import './client-map.js';

import './email-contact.js';
