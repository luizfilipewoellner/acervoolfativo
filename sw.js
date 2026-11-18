// Guarda o app no aparelho para abrir rápido e funcionar sem internet.
// Ao publicar uma versão nova, troque o número abaixo.
const CACHE="acervo-v21";
const SHELL=["./","index.html","borji.json","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png","apple-touch-icon.png","borji-frasco.jpg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  const ok=u.origin===location.origin||u.hostname==="www.gstatic.com"||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!ok)return;
  // Rede primeiro (pega sempre a versão nova); sem internet, usa a cópia guardada.
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
