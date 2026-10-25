const CACHE="microverdeata-v16";
const FILES=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const page=r.mode==="navigate"||r.destination==="document";
  if(page){ /* pagina: întâi rețeaua (versiunea nouă), apoi memoria locală dacă nu ai internet */
    e.respondWith(fetch(r).then(n=>{if(n&&n.ok){const c=n.clone();caches.open(CACHE).then(x=>x.put(r,c));}return n;}).catch(()=>caches.match(r).then(h=>h||caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(n=>{if(n&&(n.ok||n.type==="opaque")){const c=n.clone();caches.open(CACHE).then(x=>x.put(r,c));}return n;}).catch(()=>hit);
    return hit||net;
  }));
});
