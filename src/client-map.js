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
const list=document.querySelector('#city-list');
const views={all:'0 0 1000 370',us:'10 130 310 120',europe:'610 45 195 160',gulf:'890 270 70 70'};
const project=(lon,lat)=>[(lon+130)*5,(70-lat)*7];
host.innerHTML=`<svg viewBox="${views.all}" role="img" aria-labelledby="map-title map-desc"><title id="map-title">Mapa lokalizacji klientów</title><desc id="map-desc">Stany Zjednoczone, Europa i Abu Dhabi. Wszystkie 18 lokalizacji można wybrać przyciskami pod mapą.</desc><path class="map-land" d="${land}"/>${places.map(([city,country,lon,lat],i)=>{const[x,y]=project(lon,lat);return `<circle class="map-point" data-point="${i}" cx="${x}" cy="${y}" r="3"><title>${city} — ${country}</title></circle>`}).join('')}</svg>`;
list.innerHTML=places.map(([city],i)=>`<button data-city="${i}" aria-pressed="false">${city}</button>`).join('');
const svg=host.querySelector('svg');
function setRegion(region){
 svg.setAttribute('viewBox',views[region]);
 document.querySelectorAll('[data-region]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.region===region)));
 host.querySelectorAll('.map-point').forEach((p,i)=>{const [, , w, h]=views[region].split(' ').map(Number);const scale=Math.min(svg.clientWidth/w,svg.clientHeight/h);p.setAttribute('r',5/Math.max(.1,scale));p.classList.toggle('outside-region',region!=='all'&&places[i][4]!==region);});
}
function selectCity(i){
 const [city,country,,,region]=places[i];setRegion(region);
 list.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.city)===i)));
 host.querySelectorAll('.map-point').forEach((p,n)=>p.classList.toggle('selected',i===n));
 document.querySelector('#map-selection').textContent=`${city} — ${country}`;
}
list.addEventListener('click',e=>{const b=e.target.closest('[data-city]');if(b)selectCity(Number(b.dataset.city));});
host.addEventListener('click',e=>{if(e.target.matches('[data-point]'))selectCity(Number(e.target.dataset.point));});
document.querySelectorAll('[data-region]').forEach(b=>b.addEventListener('click',()=>setRegion(b.dataset.region)));

addEventListener('resize',()=>setRegion(document.querySelector('[data-region][aria-pressed="true"]').dataset.region));
setRegion('all');
