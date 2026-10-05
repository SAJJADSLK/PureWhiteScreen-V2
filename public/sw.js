// Small offline cache: pages network-first, built assets stale-while-revalidate.
const CACHE = 'pws-v1'
self.addEventListener('install', (e) => { self.skipWaiting() })
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', (e) => {
  const req = e.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== location.origin) return
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res })
      .catch(() => caches.match(req).then((r) => r || caches.match('/'))))
    return
  }
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const hit = await c.match(req)
    const net = fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res }).catch(() => hit)
    return hit || net
  }))
})
