import { arrowIcon } from './link-icons.js';
import { t } from './i18n.js';

const projects = [
 ['Haddad PLM',t('Procesy / Discovery / Produkt','Processes / Discovery / Product'),t('System wspierający tworzenie kolekcji odzieżowych — od koncepcji i projektowania po produkcję. Poznanie procesów różnych zespołów oraz stopniowe wdrażanie wspólnego środowiska pracy.','A system supporting the creation of clothing collections, from concept and design through to production. Understanding how different teams work and gradually introducing a shared working environment.'),'haddad-plm'],
 ['Eurocash',t('Retail / E-commerce / Organizacja','Retail / E-commerce / Organisation'),t('Współpraca przy usługach cyfrowych Delikatesów Centrum: Delikarcie, stronie sieci oraz Click & Collect. Podczas pandemii kluczowe było szybkie określenie MVP i uruchomienie rezerwacji zakupów.','Work on digital services for Delikatesy Centrum: Delikarta, the chain’s website and Click & Collect. During the pandemic, quickly defining an MVP and launching shopping reservations was essential.'),'sklep-delikatesy-pl'],
 ['PayPo',t('Fintech / CX / Marka','Fintech / CX / Brand'),t('Połączenie doświadczenia użytkownika i komunikacji marki. Analiza procesu zakupowego, projektowanie interfejsu i rozwój identyfikacji wizualnej usługi odroczonych płatności.','Bringing user experience and brand communication together. Analysing the purchasing journey, designing the interface and developing the visual identity of a buy now, pay later service.'),'paypo'],
 ['Parlor Social',t('Społeczność / Mobile / Integracje','Community / Mobile / Integrations'),t('Cyfrowe zaplecze nowojorskiego klubu: aplikacje mobilne, panel administracyjny, płatności i CRM. Za identyfikację oraz projekt interfejsu odpowiadało DTE Studio.','The digital infrastructure for a New York club: mobile apps, an administration panel, payments and CRM. DTE Studio was responsible for the visual identity and interface design.'),'parlor-social'],
 ['PAYBACK',t('Koncepcja / Gry / Zaangażowanie','Concept / Games / Engagement'),t('Punktołap — gra mobilna łącząca zabawę, rywalizację i nagrody w programie lojalnościowym. Projekt na styku marketingu, technologii i pracy kreatywnej.','Punktołap, a mobile game combining fun, competition and rewards within a loyalty programme. A project bringing together marketing, technology and creative work.'),'punktolap']
];
document.querySelector('#projects').innerHTML=projects.map(([name,tags,text,path],i)=>`<details class="project"><summary><span class="project-number">0${i+1}</span><h3>${name}</h3><span class="project-tags">${tags}</span><span class="plus">+</span></summary><div class="project-body"><p>${text}</p><a class="text-link" href="https://kissdigital.com/work/${path}" target="_blank" rel="noopener noreferrer">${t('Opis realizacji w KISS digital','Project details at KISS digital')} ${arrowIcon()}</a></div></details>`).join('');

import './navigation.js';
import './client-map.js';

import './email-contact.js';
import './income-chart.js';
import './team-chart.js';
import './steady-chart.js';
import './cieplo-metrics.js';
