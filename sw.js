/* Charliyah's Dream Farm — tiny service worker for offline play.
   Uses relative paths so it works inside a GitHub Pages project folder.
   If anything here fails, the game simply runs online as normal. */
const CACHE = 'dream-farm-v1';
const FILES = [
  './', './index.html', './css/style.css', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png',
  './js/data.js', './js/art.js', './js/state.js', './js/audio.js', './js/ui.js', './js/panels.js', './js/main.js',
  './js/views/farm.js', './js/views/garden.js', './js/views/animals.js', './js/views/house.js',
  './js/views/market.js', './js/views/learn.js', './js/views/journal.js',
  './fonts/fredoka-latin-400-normal.woff2', './fonts/fredoka-latin-500-normal.woff2',
  './fonts/fredoka-latin-600-normal.woff2', './fonts/fredoka-latin-700-normal.woff2',
  './fonts/patrick-hand-latin-400-normal.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // add files one by one so a single missing file can't break installation
      .then((c) => Promise.all(FILES.map((f) => c.add(f).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first (so updates arrive quickly), falling back to the cache when offline.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html')))
  );
});
