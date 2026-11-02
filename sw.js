const CACHE='finland-trip-v41';
const FILES=['./','./index.html','./day1.html','./day2.html','./day3.html','./day4.html','./day5.html','./day6.html','./day7.html','./day8.html','./accommodation-city.html','./accommodation.html','./costs.html','./finland_lapland_winter_activities.html','./vr_night_train.html','./assets/nordic.css','./assets/nordic.js','./assets/trip-dashboard.css','./assets/trip-dashboard.js','./assets/santa-village-aurora.webp','./assets/santa-village-aurora-hq.jpg','./manifest.json','./aurora-watch.html','./lapland-meals.html','./travel-assistant.html','./assets/travel-assistant.js','./mobility-assistant.html','./other.html','./shopping.html','./packing.html','./reservations.html','./transport.html','./emergency.html'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;
 const url=new URL(req.url);if(url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return response;}).catch(async()=>{const cache=await caches.open(CACHE);return (await cache.match(req))||(await cache.match(url.origin+url.pathname))||(await cache.match('./index.html'));}));
 }else{
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}return response;})));
 }
});