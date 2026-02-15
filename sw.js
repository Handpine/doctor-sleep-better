// 修改版本號 (例如加上 -v2) 以強制瀏覽器更新快取
const CACHE_NAME = 'dsb-v-final-v2'; 

const ASSETS = [
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // 加入這行：強制新版 Service Worker 立即接管
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  // 加入這段：刪除舊的 Cache，確保使用者看到最新介面
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // 網路優先策略 (Network First) - 開發階段比較不會有快取卡住的問題
      return fetch(e.request).catch(() => cachedResponse);
    })
  );
});