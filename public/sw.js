const CACHE='strivo-shell-v1';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['/','/manifest.webmanifest','/icon-192.png','/icon-512.png','/apple-touch-icon.png'])));});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('strivo-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||event.request.headers.has('RSC')||url.search) return;
 if(event.request.mode==='navigate') {event.respondWith(fetch(event.request).then(response=>{if(response.ok&&url.pathname==='/'){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put('/',copy)));}return response;}).catch(()=>caches.match('/')));return;}
 if(url.pathname.startsWith('/_next/static/'))event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)));}return response;})));
});
