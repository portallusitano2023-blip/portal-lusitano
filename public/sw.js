const CACHE_VERSION = 'v2'; // Incrementar ao fazer mudanças significativas
const CACHE_NAME = `portal-lusitano-${CACHE_VERSION}`;
const IMAGE_CACHE = `portal-lusitano-images-${CACHE_VERSION}`;
const STATIC_CACHE = `portal-lusitano-static-${CACHE_VERSION}`;
const API_CACHE = `portal-lusitano-api-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/comprar',
  '/loja',
  '/cavalos-famosos',
  '/jornal',
  '/eventos',
  '/ferramentas',
  '/offline',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) =>
            name.startsWith('portal-lusitano-') &&
            !name.includes(CACHE_VERSION)
          )
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ============================================================================
// Cache Strategies
// ============================================================================

/**
 * Cache-First Strategy
 * Tenta cache primeiro, fallback para rede se não encontrar
 * Ideal para: imagens, fonts, assets estáticos
 */
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Se for imagem e falhar, retornar placeholder
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#1a1a1a" width="400" height="300"/><text fill="#C5A059" x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="sans-serif">Imagem indisponível</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    throw error;
  }
}

/**
 * Network-First Strategy
 * Tenta rede primeiro, fallback para cache se falhar
 * Ideal para: API calls, páginas HTML
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Offline page para navegação
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }

    throw error;
  }
}

/**
 * Stale-While-Revalidate Strategy
 * Retorna cache imediatamente, atualiza cache em background
 * Ideal para: conteúdo que pode ser ligeiramente desatualizado
 */
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.status === 200) {
      const cache = caches.open(cacheName);
      cache.then((c) => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// ============================================================================
// Fetch Event with Smart Strategy Selection
// ============================================================================

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);
  const request = event.request;

  // ✅ STRATEGY 1: Cache-First para IMAGENS
  if (
    request.destination === 'image' ||
    /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // ✅ STRATEGY 2: Cache-First para ASSETS ESTÁTICOS
  if (
    /\.(css|js|woff|woff2|ttf|eot)$/i.test(url.pathname) ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // ✅ STRATEGY 3: Network-First para API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // ✅ STRATEGY 4: Network-First para PÁGINAS (navegação)
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request, CACHE_NAME));
    return;
  }

  // ✅ STRATEGY 5: Stale-While-Revalidate para OUTROS
  event.respondWith(staleWhileRevalidateStrategy(request, CACHE_NAME));
});

// ============================================================================
// Push Notifications
// ============================================================================

/**
 * Push event - receives push messages from the server and displays a notification.
 * The payload should be JSON with: { title, body, icon?, url?, tag? }
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = {
      title: 'Portal Lusitano',
      body: event.data.text(),
    };
  }

  const title = data.title || 'Portal Lusitano';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: data.tag || 'portal-lusitano-notification',
    data: {
      url: data.url || '/',
    },
    vibrate: [100, 50, 100],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * Notification click - opens or focuses the relevant page when the user
 * taps the notification.
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If there is already an open tab with this origin, focus it and navigate
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.focus();
          return client.navigate(targetUrl);
        }
      }
      // Otherwise open a new window
      return clients.openWindow(targetUrl);
    })
  );
});
