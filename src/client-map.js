import land from './map-land.json';
const places = [
 ['Manhattan, New York','USA',-73.9712,40.7831,'us'],
 ['San Francisco','USA',-122.4194,37.7749,'us'],
 ['Philadelphia','USA',-75.1652,39.9526,'us'],
 ['Dayton, New Jersey','USA',-74.5102,40.3726,'us'],
 ['Brooklyn, New York','USA',-73.9442,40.6782,'us'],
 ['Dundee','Szkocja, Wielka Brytania',-2.9707,56.462,'europe'],
 ['Londyn','Wielka Brytania',-.1276,51.5072,'europe'],
 ['Salzburg','Austria',13.055,47.8095,'europe'],
 ['Berlin','Niemcy',13.405,52.52,'europe'],
 ['Zurych','Szwajcaria',8.5417,47.3769,'europe'],
 ['Oslo','Norwegia',10.7522,59.9139,'europe'],
 ['Kraków','Polska',19.945,50.0647,'europe'],
 ['Warszawa','Polska',21.0122,52.2297,'europe'],
 ['Abu Dhabi','Zjednoczone Emiraty Arabskie',54.3773,24.4539,'gulf'],
 ['Tallinn','Estonia',24.7536,59.437,'europe'],
 ['Lublin','Polska',22.5684,51.2465,'europe'],
 ['Monachium','Niemcy',11.582,48.1351,'europe'],
 ['Mediolan','Włochy',9.19,45.4642,'europe']
];
const host=document.querySelector('#client-map');
const project=(lon,lat)=>[(lon+130)*5,(70-lat)*7];
host.insertAdjacentHTML('afterbegin',`<svg viewBox="0 0 1000 370" role="group" aria-labelledby="map-title map-desc"><title id="map-title">Mapa lokalizacji klientów</title><desc id="map-desc">Wybierz kropkę, aby zobaczyć nazwę miasta. Kropki można wybierać także klawiszem Tab i zatwierdzać klawiszem Enter.</desc><path class="map-land" d="${land}"/>${places.map(([city,,lon,lat],i)=>{const[x,y]=project(lon,lat);return `<circle class="map-point" data-point="${i}" cx="${x}" cy="${y}" r="4" role="button" tabindex="0" aria-label="${city}" aria-pressed="false"/>`}).join('')}</svg>`);
const svg=host.querySelector('svg');
const label=document.querySelector('#map-city-name');
let selected=null;
function positionLabel(){
 if(!selected)return;
 const point=selected.getBoundingClientRect();
 const rect=host.getBoundingClientRect();
 label.style.left=`${Math.max(8,Math.min(rect.width-label.offsetWidth-8,point.x+point.width/2-rect.x-label.offsetWidth/2))}px`;
 label.style.top=`${Math.max(8,point.y-rect.y-label.offsetHeight-10)}px`;
}
function selectPoint(point){
 selected=point;
 host.querySelectorAll('[data-point]').forEach(p=>{p.classList.toggle('selected',p===point);p.setAttribute('aria-pressed',String(p===point));});
 label.textContent=places[Number(point.dataset.point)][0];label.hidden=false;positionLabel();
}
host.addEventListener('click',e=>{if(e.target.matches('[data-point]'))selectPoint(e.target);else{label.hidden=true;selected=null;host.querySelectorAll('[data-point]').forEach(p=>{p.classList.remove('selected');p.setAttribute('aria-pressed','false');});}});
host.addEventListener('keydown',e=>{if(e.target.matches('[data-point]')&&['Enter',' '].includes(e.key)){e.preventDefault();selectPoint(e.target);}if(e.key==='Escape'){label.hidden=true;}});
function resizeMap(){const scale=Math.min(svg.clientWidth/1000,svg.clientHeight/370);host.querySelectorAll('[data-point]').forEach(p=>p.setAttribute('r',5/Math.max(.1,scale)));positionLabel();}
addEventListener('resize',resizeMap);resizeMap();
