// service-worker.js
var cacheName, filesToCache;

cacheName = 'link-201802081653';

filesToCache = [
  'favicon.ico',
'flags.9c74e172f87984c48ddf.png',
'icons.674f50d287a8c48dc19b.eot',
'icons.912ec66d7572ff821749.svg',
'icons.af7ae505a9eed503f8b8.woff2',
'icons.b06871f281fee6b241d6.ttf',
'icons.fee66e712a8a08eef580.woff',
'index.html',
'inline.bundle.js',
'inline.bundle.js.map',
'main.bundle.js',
'main.bundle.js.map',
'polyfills.bundle.js',
'polyfills.bundle.js.map',
'scripts.bundle.js',
'scripts.bundle.js.map',
'styles.bundle.js',
'styles.bundle.js.map',
'vendor.bundle.js',
'vendor.bundle.js.map'
];

self.addEventListener('install', function(e) {
  // [ServiceWorker] Install
  return e.waitUntil(caches.open(cacheName).then(function(cache) {
    console.log('[ServiceWorker] Caching app shell');
    return cache.addAll(filesToCache);
  }));
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  return e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  return e.waitUntil(caches.keys().then(function(keyList) {
    return Promise.all(keyList.map(function(key) {
      if (key !== cacheName) {
        console.log('[ServiceWorker] Removing old cache', key);
        return caches["delete"](key);
      }
    }));
  }));
});
