/**
 * Service Worker for Bibiere PWA
 * Provides offline functionality and caching strategies
 */

const CACHE_NAME = 'bibiere-v1.0.0';
const STATIC_CACHE = 'bibiere-static-v1.0.0';
const DYNAMIC_CACHE = 'bibiere-dynamic-v1.0.0';
const IMAGE_CACHE = 'bibiere-images-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/about',
  '/contact',
];

// Routes to cache dynamically
const CACHE_ROUTES = [
  '/collections/new-arrivals',
  '/account',
  '/about',
  '/lookbook',
];

// Network-first routes (always try network first)
const NETWORK_FIRST_ROUTES = [
  '/api/',
  '/checkout',
  '/admin/'
];

// Cache-first routes (serve from cache if available)
const CACHE_FIRST_ROUTES = [
  '/collections/',
  '/products/',
  '/lookbook',
  '/journal'
];

self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Pre-cache critical routes
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('[SW] Pre-caching critical routes');
        return cache.addAll(CACHE_ROUTES);
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete');
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Handle different types of requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isNetworkFirstRoute(request)) {
    event.respondWith(handleNetworkFirst(request));
  } else if (isCacheFirstRoute(request)) {
    event.respondWith(handleCacheFirst(request));
  } else {
    event.respondWith(handleStaleWhileRevalidate(request));
  }
});

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'wishlist-sync') {
    event.waitUntil(syncWishlist());
  } else if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart());
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'bibiere',
    body: 'New updates available',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-72x72.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  // Parse notification data if available
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        ...notificationData,
        ...payload
      };
    } catch (error) {
      console.log('[SW] Failed to parse notification data, using text');
      notificationData.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      image: notificationData.image,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions,
      requireInteraction: notificationData.requireInteraction,
      silent: notificationData.silent,
      vibrate: notificationData.vibrate,
      timestamp: notificationData.timestamp || Date.now()
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.notification.tag, event.action);
  
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  
  // Handle different notification types
  if (notificationData.type === 'order-update') {
    event.waitUntil(
      clients.openWindow(`/order/${notificationData.orderId}`)
    );
  } else if (notificationData.type === 'back-in-stock') {
    event.waitUntil(
      clients.openWindow(`/product/${notificationData.productId}`)
    );
  } else if (notificationData.type === 'new-arrivals') {
    const url = notificationData.collection 
      ? `/collections/${notificationData.collection}`
      : '/collections/new-arrivals';
    event.waitUntil(
      clients.openWindow(url)
    );
  } else if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/collections/new-arrivals')
    );
  } else if (event.action === 'view-product') {
    event.waitUntil(
      clients.openWindow(`/product/${notificationData.productId}`)
    );
  } else if (event.action === 'add-to-cart') {
    // Handle add to cart action
    event.waitUntil(
      handleAddToCartFromNotification(notificationData.productId)
    );
  } else if (event.action === 'track-order') {
    event.waitUntil(
      clients.openWindow(`/track-order?id=${notificationData.orderId}`)
    );
  } else if (event.action === 'view-order') {
    event.waitUntil(
      clients.openWindow(`/order/${notificationData.orderId}`)
    );
  } else if (event.action === 'close' || event.action === 'dismiss') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Utility functions
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(request.url);
}

function isNetworkFirstRoute(request) {
  return NETWORK_FIRST_ROUTES.some(route => request.url.includes(route));
}

function isCacheFirstRoute(request) {
  return CACHE_FIRST_ROUTES.some(route => request.url.includes(route));
}

async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Image request failed:', error);
    // Return placeholder image for failed image requests
    return caches.match('/images/placeholder.jpg');
  }
}

async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network first failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return root page for navigation requests when offline
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    throw error;
  }
}

async function handleCacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, networkResponse);
        });
      }
    }).catch(() => {
      // Ignore network errors in background update
    });
    
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache first failed:', error);
    
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    throw error;
  }
}

async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.log('[SW] Stale while revalidate fetch failed:', error);
    return cachedResponse;
  });
  
  return cachedResponse || fetchPromise;
}

async function syncWishlist() {
  try {
    console.log('[SW] Syncing wishlist...');
    // Get pending wishlist actions from IndexedDB
    const pendingActions = await getPendingWishlistActions();
    
    for (const action of pendingActions) {
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action)
        });
        
        // Remove from pending actions
        await removePendingWishlistAction(action.id);
      } catch (error) {
        console.log('[SW] Failed to sync wishlist action:', error);
      }
    }
  } catch (error) {
    console.log('[SW] Wishlist sync failed:', error);
  }
}

async function syncCart() {
  try {
    console.log('[SW] Syncing cart...');
    // Get pending cart actions from IndexedDB
    const pendingActions = await getPendingCartActions();
    
    for (const action of pendingActions) {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(action)
        });
        
        // Remove from pending actions
        await removePendingCartAction(action.id);
      } catch (error) {
        console.log('[SW] Failed to sync cart action:', error);
      }
    }
  } catch (error) {
    console.log('[SW] Cart sync failed:', error);
  }
}

// IndexedDB helpers (simplified - would need full implementation)
async function getPendingWishlistActions() {
  // Implementation would use IndexedDB to get pending actions
  return [];
}

async function removePendingWishlistAction(id) {
  // Implementation would remove action from IndexedDB
}

async function getPendingCartActions() {
  // Implementation would use IndexedDB to get pending actions
  return [];
}

async function removePendingCartAction(id) {
  // Implementation would remove action from IndexedDB
}

// Handle add to cart from notification
async function handleAddToCartFromNotification(productId) {
  try {
    // First, try to find an existing client
    const clients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    if (clients.length > 0) {
      // If app is open, send message to add to cart
      clients[0].postMessage({
        type: 'ADD_TO_CART_FROM_NOTIFICATION',
        productId: productId
      });
      clients[0].focus();
    } else {
      // If app is not open, open it with add to cart intent
      const url = `/product/${productId}?action=add-to-cart`;
      await self.clients.openWindow(url);
    }
  } catch (error) {
    console.error('[SW] Failed to handle add to cart from notification:', error);
    // Fallback: just open the product page
    await self.clients.openWindow(`/product/${productId}`);
  }
}
