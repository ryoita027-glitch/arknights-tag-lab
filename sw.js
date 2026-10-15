// RECRUIT / TAG LAB: static offline-first PWA, 2026-10-16 (mobile usability update)
const CACHE_NAME='recruit-tag-lab-20261016-mobile-v5';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('recruit-tag-lab-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',event=>{
  const req=event.request, url=new URL(req.url), scopePath=new URL(self.registration.scope).pathname;
  if(req.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(scopePath))return;
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(req,copy)).catch(()=>{});}
    return response;
  }).catch(async error=>{
    if(req.mode==='navigate'){
      const fallback=await caches.match(new URL('./index.html',self.registration.scope).href);
      if(fallback)return fallback;
    }
    throw error;
  })));
});
