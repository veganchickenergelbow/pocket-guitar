// Pocket service worker. Bump VERSION whenever shipped files change.
const VERSION = 'pocket-v3';
const FONTS = 'pocket-fonts-v1';

// Precache is best-effort: missing files never block install.
const SHELL = [
  './', 'index.html', 'styles.css', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'js/app.js', 'js/router.js', 'js/store.js', 'js/dom.js',
  'js/views/today.js', 'js/views/learn.js', 'js/views/ear.js', 'js/views/tools.js',
  'js/views/placement.js', 'js/views/settings.js', 'js/views/metronome-ui.js',
  'js/views/tuner.js', 'js/views/library.js', 'js/views/lesson.js',
  'js/audio/synth.js', 'js/audio/pitch.js', 'js/audio/session.js', 'js/audio/listener.js', 'js/audio/metronome.js',
  'js/music/theory.js', 'js/music/voicings.js', 'js/music/voicings-data.js',
  'js/ui/diagram.js', 'js/ui/markdown.js',
  'js/content/curriculum.js',
  'js/content/lessons/unit1.js', 'js/content/lessons/unit2.js', 'js/content/lessons/unit3.js',
  'js/content/lessons/unit4.js', 'js/content/lessons/unit5.js', 'js/content/lessons/unit6.js',
  'js/content/lessons/unit7.js', 'js/content/lessons/unit8.js',
  'js/exercises/find-note.js', 'js/exercises/sequence.js', 'js/exercises/chord-arp.js',
  'js/exercises/ear.js', 'js/exercises/quiz.js', 'js/exercises/progression.js',
  'js/exercises/_ui.js', 'js/exercises/_mic.js', 'js/exercises/ear-data.js',
  'icons/icon-maskable-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await Promise.allSettled(SHELL.map((u) => cache.add(u)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION && k !== FONTS).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req)) || (await cache.match('index.html')) || Response.error();
  }
}

async function cacheFirst(req, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(cacheFirst(req, FONTS).catch(() => Response.error()));
    return;
  }
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(networkFirst(req));
    return;
  }
  e.respondWith(cacheFirst(req, VERSION).catch(() => Response.error()));
});
