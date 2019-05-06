const filesToCache = [
    "/",
    "/Theme-Ringtone.mp3",
    "/sprite.html",
    "/spriteMario.css",
    "/spriteMario.js",
    "/spriteMarioV1.png",
    "/IndexedDBUtil.js",
    "/serviceWorker.js"
],
    version = 1,
    cacheName = "cacheV"+JSON.stringify(Date.now()),
    cacheEvent = {
        "install" : "install",
        "fetch" : "fetch",
        "activate": "activate"
    };

function trace (str){
    console.log(str);
};
function cacheInstallEventHandler(event){
    event.preventDefault();
    trace("Attempting to install service worker and cache static assets");
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
              //return cache.addAll(filesToCache);
                filesToCache.forEach(function(elem){
                    cache.add(elem);
                });
            }
        )
    );
};
function cacheFetchEventHandler(event){
    event.preventDefault();
    trace("fetch event for " + event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if(response){
                    trace("found " +event.request.url + " in cache");
                    return response;
                }
                trace('Network request for '+ event.request.url);
                console.log('Network request for ', event.request.url);
                return fetch(event.request)
                .then(function(data){

                });
            }).catch(function(err){
                console.log("some error", err);
            })
    )
};
function activationHandler( event ){
    console.log('Activating new service worker...');  
    const cacheWhitelist = [cacheName];  
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
}
self.addEventListener(cacheEvent.install, cacheInstallEventHandler);
self.addEventListener(cacheEvent.fetch, cacheFetchEventHandler);
self.addEventListener(cacheEvent.activate, activationHandler);