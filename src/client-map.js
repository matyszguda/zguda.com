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
 ['Mediolan','Włochy',9.19,45.4642,'europe'],
 ['Washington DC','USA',-77.0369,38.9072,'us'],
 ['Calgary','Kanada',-114.0719,51.0447,'us'],
 ['Dubaj','Zjednoczone Emiraty Arabskie',55.2708,25.2048,'gulf']
];
const host=document.querySelector('#client-map');
const project=(lon,lat)=>[(lon+130)*5,(70-lat)*7];
// Draw Philadelphia last so its dot remains selectable in the East Coast cluster.
const drawOrder=places.map((place,i)=>({place,i})).sort((a,b)=>(a.i===2)-(b.i===2));
host.insertAdjacentHTML('afterbegin',`<svg viewBox="0 0 1000 370" tabindex="0" role="group" aria-labelledby="map-title" aria-describedby="map-help"><title id="map-title">Mapa lokalizacji klientów</title><path class="map-land" d="${land}"/>${drawOrder.map(({place:[city,,lon,lat],i})=>{const[x,y]=project(lon,lat);return `<circle class="map-point" data-point="${i}" cx="${x}" cy="${y}" r="3" role="button" tabindex="0" aria-label="${city}" aria-pressed="false"/>`}).join('')}</svg>`);
const svg=host.querySelector('svg');
const label=document.querySelector('#map-city-name');
let selected=null;
let view={x:0,y:0,w:1000,h:370};
let dragged=false;
const pointers=new Map();
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function positionLabel(){
 if(!selected||label.hidden)return;
 const point=selected.getBoundingClientRect(),rect=host.getBoundingClientRect();
 label.style.left=`${clamp(point.x+point.width/2-rect.x-label.offsetWidth/2,8,Math.max(8,rect.width-label.offsetWidth-8))}px`;
 label.style.top=`${Math.max(8,point.y-rect.y-label.offsetHeight-10)}px`;
}
function render(){
 view.x=clamp(view.x,0,1000-view.w);view.y=clamp(view.y,0,370-view.h);
 svg.setAttribute('viewBox',`${view.x} ${view.y} ${view.w} ${view.h}`);
 const scale=Math.min(svg.clientWidth/view.w,svg.clientHeight/view.h);
 host.querySelectorAll('[data-point]').forEach(p=>p.setAttribute('r',3.5/Math.max(.1,scale)));
 positionLabel();
}
function world(x,y){const point=new DOMPoint(x,y);return point.matrixTransform(svg.getScreenCTM().inverse());}
function zoom(factor,x,y){
 const p=world(x,y),w=clamp(view.w/factor,1000/64,1000),h=w*.37;
 view={x:p.x-(p.x-view.x)*w/view.w,y:p.y-(p.y-view.y)*h/view.h,w,h};render();
}
function clearSelection(){label.hidden=true;selected=null;host.querySelectorAll('[data-point]').forEach(p=>{p.classList.remove('selected');p.setAttribute('aria-pressed','false');});}
function selectPoint(point){
 selected=point;
 host.querySelectorAll('[data-point]').forEach(p=>{p.classList.toggle('selected',p===point);p.setAttribute('aria-pressed',String(p===point));});
 label.textContent=places[Number(point.dataset.point)][0];label.hidden=false;positionLabel();
}
svg.addEventListener('click',e=>{if(dragged){dragged=false;return;}if(e.target.matches('[data-point]'))selectPoint(e.target);else{clearSelection();svg.focus({preventScroll:true});}});
svg.addEventListener('dblclick',e=>{e.preventDefault();svg.focus({preventScroll:true});zoom(2,e.clientX,e.clientY);});
svg.addEventListener('wheel',e=>{
 if(!e.ctrlKey&&!svg.contains(document.activeElement)&&document.activeElement!==svg)return;
 e.preventDefault();zoom(Math.exp(-clamp(e.deltaY,-100,100)*.005),e.clientX,e.clientY);
},{passive:false});
svg.addEventListener('keydown',e=>{
 if(e.target.matches('[data-point]')&&['Enter',' '].includes(e.key)){e.preventDefault();selectPoint(e.target);return;}
 const rect=svg.getBoundingClientRect();
 if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
  e.preventDefault();
  if(e.key==='0'){view={x:0,y:0,w:1000,h:370};render();}
  else if(['+','=','-'].includes(e.key))zoom(e.key==='-'?1/1.5:1.5,rect.x+rect.width/2,rect.y+rect.height/2);
  else {view.x+=e.key==='ArrowRight'?view.w*.15:e.key==='ArrowLeft'?-view.w*.15:0;view.y+=e.key==='ArrowDown'?view.h*.15:e.key==='ArrowUp'?-view.h*.15:0;render();}
 }
 if(e.key==='Escape'){clearSelection();svg.blur();}
});
svg.addEventListener('focusin',e=>{
 if(!e.target.matches('[data-point]'))return;
 const x=Number(e.target.getAttribute('cx')),y=Number(e.target.getAttribute('cy'));
 if(x<view.x||x>view.x+view.w||y<view.y||y>view.y+view.h){view.x=x-view.w/2;view.y=y-view.h/2;render();}
});
svg.addEventListener('pointerdown',e=>{dragged=false;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(!e.target.matches('[data-point]'))svg.setPointerCapture(e.pointerId);});
svg.addEventListener('pointermove',e=>{
 const prev=pointers.get(e.pointerId);if(!prev)return;
 const current={x:e.clientX,y:e.clientY};
 if(pointers.size===2){
  const other=[...pointers.entries()].find(([id])=>id!==e.pointerId)[1];
  const before=Math.hypot(prev.x-other.x,prev.y-other.y),after=Math.hypot(current.x-other.x,current.y-other.y);
  if(before>5)zoom(after/before,(current.x+other.x)/2,(current.y+other.y)/2);
  dragged=true;
 }else if(Math.abs(current.x-prev.x)+Math.abs(current.y-prev.y)>2){
  const a=world(prev.x,prev.y),b=world(current.x,current.y);view.x+=a.x-b.x;view.y+=a.y-b.y;render();dragged=true;
 }
 pointers.set(e.pointerId,current);
});
for(const type of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(type,e=>pointers.delete(e.pointerId));
addEventListener('resize',render);render();
