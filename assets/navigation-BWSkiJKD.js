(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function o(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(e){if(e.ep)return;e.ep=!0;const n=o(e);fetch(e.href,n)}})();const m=document.querySelector(".style-washer"),G=["invert","ornate","blue","mono-light","mono-dark"],C={base:"Styl podstawowy",invert:"Inwersja kolorów",ornate:"Krój szeryfowy i ozdobny",blue:"Błękit zamiast czerwieni","mono-light":"Czerń na bieli","mono-dark":"Biel na czerni"},z="zguda-style-wash";function X(){try{const t=sessionStorage.getItem(z);return G.includes(t)?t:"base"}catch{return"base"}}if(m){let n=function(s,E=!0,l=!0){if(s==="base"?t.removeAttribute("data-wash"):t.dataset.wash=s,l)try{s==="base"?sessionStorage.removeItem(z):sessionStorage.setItem(z,s)}catch{}const h=C[s];m.setAttribute("aria-label",`Pralka — wylosuj styl strony. Aktualnie: ${h}.`),m.title=`${h}. Kliknij, by losować. Przytrzymaj, by przywrócić podstawowy.`,E&&i&&(i.textContent=h);const A=document.querySelector('meta[name="theme-color"]');A&&(A.content=["invert","mono-dark"].includes(s)?"#000000":"#ffffff")};const t=document.documentElement,i=document.querySelector(".style-wash-status");let o,r,e=0;const c=performance.getEntriesByType("navigation")[0]?.type==="reload";n(c?"base":X(),!1,c),addEventListener("pageshow",()=>n(X(),!1,!1)),m.addEventListener("click",s=>{if(performance.now()<e)return;if(s.shiftKey){n("base");return}const E=G.filter(l=>l!==t.dataset.wash);n(E[Math.floor(Math.random()*E.length)]),m.classList.add("is-washing"),clearTimeout(r),r=setTimeout(()=>m.classList.remove("is-washing"),520)}),m.addEventListener("pointerdown",s=>{s.button===0&&(clearTimeout(o),o=setTimeout(()=>{n("base"),e=performance.now()+700},650))});for(const s of["pointerup","pointercancel","pointerleave"])m.addEventListener(s,()=>clearTimeout(o));m.addEventListener("contextmenu",s=>s.preventDefault())}const F=`
attribute vec2 aPosition;
varying vec2 vUV;
void main() {
  vUV = vec2(aPosition.x * .5 + .5, .5 - aPosition.y * .5);
  gl_Position = vec4(aPosition, 0., 1.);
}`,q=`
precision highp float;
varying vec2 vUV;
uniform sampler2D uPhoto;
uniform sampler2D uRelief;
uniform vec2 uTexel;
uniform vec2 uSize;
uniform vec3 uLight;
uniform float uDepth;
uniform float uStrength;

float heightAt(vec2 uv) {
  return dot(texture2D(uRelief, uv).rg, vec2(256. / 257., 1. / 257.)) * uDepth;
}

void main() {
  vec3 photo = texture2D(uPhoto, vUV).rgb;
  vec4 data = texture2D(uRelief, vUV);
  float h = heightAt(vUV);
  vec2 slope = vec2(
    heightAt(vUV + vec2(uTexel.x, 0.)) - heightAt(vUV - vec2(uTexel.x, 0.)),
    heightAt(vUV + vec2(0., uTexel.y)) - heightAt(vUV - vec2(0., uTexel.y))
  ) / (2. * uTexel * uSize);
  vec3 normal = normalize(vec3(-slope, 1.));
  vec3 light = normalize(uLight - vec3(vUV * uSize, h));

  // Trace the height field toward the light. A raised letter occludes cloth
  // on the opposite side, including the spaces between adjacent letter edges.
  float visibility = 1.;
  float horizontal = max(length(light.xy), .001);
  for (int i = 1; i <= 24; i++) {
    float distance = float(i) * uDepth * .14;
    vec2 uv = vUV + light.xy / horizontal * distance / uSize;
    float rayHeight = h + distance * light.z / horizontal;
    float clearance = rayHeight - heightAt(uv);
    visibility = min(visibility, smoothstep(-.7, 1.3 + distance * .1, clearance + .8));
  }
  float diffuse = max(dot(normal, light), 0.);
  vec3 halfway = normalize(light + vec3(0., 0., 1.));
  float specular = .012 * pow(max(dot(normal, halfway), 0.), 20.);
  float illumination = (.68 + visibility * (.5 * diffuse + specular))
    / (.68 + .5 * max(light.z, 0.) + .012 * pow(max(halfway.z, 0.), 20.));

  // Remove the photographed lighting while retaining the original fine weave.
  // Only the reconstructed relief is re-lit; the edge blends stay untouched.
  vec3 cloth = photo * .903 / max(data.b, .35);
  vec3 relit = clamp(cloth * illumination, 0., 1.);
  gl_FragColor = vec4(mix(photo, relit, data.a * uStrength * .9), 1.);
}`;async function j(){const t=await fetch(new URL(""+new URL("logo-relief-CvBdxMb7.bin",import.meta.url).href,import.meta.url));if(!t.ok)throw new Error("Relief data unavailable");const i=await t.arrayBuffer(),o=new DataView(i);if(o.getUint32(0,!1)!==1380730417)throw new Error("Invalid relief data");const r=o.getUint16(4,!0),e=o.getUint16(6,!0);if(i.byteLength!==8+r*e*4)throw new Error("Incomplete relief data");return{width:r,height:e,pixels:new Uint8Array(i,8)}}async function Y(t,i){const o=t.querySelector("img");try{await o.decode()}catch{return null}const r=document.createElement("canvas");r.className="logo-relief",r.setAttribute("aria-hidden","true");const e=r.getContext("webgl",{alpha:!1,antialias:!1,depth:!1,powerPreference:"low-power"});if(!e)return null;const n=document.createElement("canvas"),c=n.getContext("2d");if(!c)return e.getExtension("WEBGL_lose_context")?.loseContext(),null;let s;function E(u,T){const a=e.createShader(u);if(e.shaderSource(a,T),e.compileShader(a),!e.getShaderParameter(a,e.COMPILE_STATUS))throw new Error("Relief shader unavailable");return a}let l;try{l=e.createProgram();const u=E(e.VERTEX_SHADER,F),T=E(e.FRAGMENT_SHADER,q);if(e.attachShader(l,u),e.attachShader(l,T),e.linkProgram(l),e.deleteShader(u),e.deleteShader(T),!e.getProgramParameter(l,e.LINK_STATUS))throw new Error("Relief program unavailable");e.useProgram(l);const a=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,a),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const R=e.getAttribLocation(l,"aPosition");e.enableVertexAttribArray(R),e.vertexAttribPointer(R,2,e.FLOAT,!1,0,0);for(const[f,b]of[[0,"uPhoto"],[1,"uRelief"]]){e.activeTexture(e.TEXTURE0+f);const S=e.createTexture();e.bindTexture(e.TEXTURE_2D,S),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),f===0?(s=S,e.texImage2D(e.TEXTURE_2D,0,e.RGB,1,1,0,e.RGB,e.UNSIGNED_BYTE,new Uint8Array([255,255,255]))):e.texImage2D(e.TEXTURE_2D,0,e.RGBA,i.width,i.height,0,e.RGBA,e.UNSIGNED_BYTE,i.pixels),e.uniform1i(e.getUniformLocation(l,b),f)}}catch{return e.getExtension("WEBGL_lose_context")?.loseContext(),null}const h=Object.fromEntries(["uSize","uLight","uDepth","uStrength","uTexel"].map(u=>[u,e.getUniformLocation(l,u)]));e.uniform2f(h.uTexel,1/i.width,1/i.height);let A=!0;r.addEventListener("webglcontextlost",()=>{A=!1,t.classList.remove("has-relief"),r.remove()}),t.append(r);const M={anchor:t,visible:!0,render(u,T){if(!A||!this.visible)return;const a=o.getBoundingClientRect(),R=Math.min(devicePixelRatio||1,2),f=Math.max(1,Math.round(a.width*R)),b=Math.max(1,Math.round(a.height*R));(r.width!==f||r.height!==b)&&(r.width=f,r.height=b,e.viewport(0,0,f,b),n.width=f,n.height=b,c.imageSmoothingQuality="high",c.drawImage(o,0,0,f,b),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,s),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,n));const S=u?u.x-a.left:-a.width,B=u?u.y-a.top:-a.height,k=Math.hypot(S-a.width/2,B-a.height/2);e.uniform2f(h.uSize,a.width,a.height),e.uniform3f(h.uLight,S,B,Math.max(a.width*.48,k*.65)),e.uniform1f(h.uDepth,a.width*.02),e.uniform1f(h.uStrength,T),e.drawArrays(e.TRIANGLE_STRIP,0,4)}};return M.render(null,0),t.classList.add("has-relief"),M}const U=matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"),O=document.documentElement,v=document.createElement("div");v.className="laser-cursor";v.setAttribute("aria-hidden","true");document.body.append(v);const K='a[href],button,summary,input,textarea,select,[role="button"],[tabindex]:not([tabindex="-1"])',d={x:0,y:0},g={x:0,y:0};let p=!1,w=0,I=0,D=!1,_=[];function y(){I||(I=requestAnimationFrame(W))}function x(){p=!1,v.classList.remove("is-visible","is-interactive","is-pressed"),O.classList.remove("has-laser"),y()}function W(){I=0;const t=p&&U.matches?1:0;g.x+=(d.x-g.x)*.25,g.y+=(d.y-g.y)*.25,w+=(t-w)*.2,Math.abs(t-w)<.001&&(w=t);const i=p?document.elementFromPoint(d.x,d.y)?.closest(K):null;v.classList.toggle("is-interactive",!!i&&!i.matches(':disabled,[aria-disabled="true"]')),v.style.transform=`translate3d(${d.x}px,${d.y}px,0)`;for(const o of _)o.render(g,w);(Math.abs(t-w)>.001||Math.hypot(d.x-g.x,d.y-g.y)>.2)&&y()}async function H(){if(!D){D=!0;try{const t=await j();if(!U.matches){D=!1;return}_=(await Promise.all([...document.querySelectorAll(".site-wordmark")].map(r=>Y(r,t)))).filter(Boolean),w=0;const i=new IntersectionObserver(r=>{for(const e of r){const n=_.find(c=>c.anchor===e.target);n&&(n.visible=e.isIntersecting)}y()}),o=new ResizeObserver(y);for(const r of _)i.observe(r.anchor),o.observe(r.anchor);y()}catch{}}}addEventListener("pointermove",t=>{if(!U.matches||t.pointerType!=="mouse"){p&&x();return}p||(g.x=t.clientX,g.y=t.clientY),d.x=t.clientX,d.y=t.clientY,p=!0,v.classList.add("is-visible"),O.classList.add("has-laser"),H(),y()},{passive:!0});addEventListener("pointerdown",()=>{p&&v.classList.add("is-pressed")},{passive:!0});addEventListener("pointerup",()=>v.classList.remove("is-pressed"),{passive:!0});addEventListener("pointerout",t=>{t.relatedTarget||x()});addEventListener("blur",x);addEventListener("keydown",t=>{t.key==="Tab"&&x()});addEventListener("scroll",()=>{p&&y()},{passive:!0});addEventListener("resize",y);addEventListener("pageshow",x);document.addEventListener("visibilitychange",()=>{document.hidden&&x()});U.addEventListener("change",()=>{U.matches||x()});const L=document.querySelector(".menu-toggle"),P=document.querySelector("#site-nav");function V(){L?.setAttribute("aria-expanded","false"),P?.classList.remove("is-open")}L?.addEventListener("click",()=>{const t=L.getAttribute("aria-expanded")!=="true";L.setAttribute("aria-expanded",String(t)),P.classList.toggle("is-open",t)});P?.addEventListener("click",t=>{t.target.closest("a")&&V()});document.addEventListener("keydown",t=>{t.key==="Escape"&&L?.getAttribute("aria-expanded")==="true"&&(V(),L.focus())});const N=[...document.querySelectorAll("main section[id]")];if(N.length){const t=new IntersectionObserver(i=>{for(const o of i)o.isIntersecting&&P.querySelectorAll("a").forEach(r=>{r.hash==="#"+o.target.id?r.setAttribute("aria-current","location"):r.removeAttribute("aria-current")})},{rootMargin:"-15% 0px -60% 0px"});N.forEach(i=>t.observe(i))}
