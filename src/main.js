import './assets/main.css';

import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import App from './App.vue';
import router from './router';

// Handle SPA redirect from 404.html on GitHub Pages
(function() {
  const l = window.location;
  const params = new URLSearchParams(l.search);
  const p = params.get('p');
  if (p) {
    const q = params.get('q');
    const h = l.hash.slice(1);
    const path = `/${p.replace(/~and~/g, '&')}`;
    const query = q ? `?${q.replace(/~and~/g, '&')}` : '';
    const hash = h ? `#${h}` : '';
    window.history.replaceState(null, document.title, `${path}${query}${hash}`);
  }
})();

// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import Material Design Icons
import '@mdi/font/css/materialdesignicons.min.css';

// Import Chart.js
import 'chart.js/auto';

// Create app instance
const app = createApp(App);
const head = createHead();

// Use plugins
app.use(router);
app.use(head);

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err);
  console.error('Error info:', info);
};

// Global properties
app.config.globalProperties.$filters = {
  formatCurrency(value) {
    if (typeof value !== 'number') {
      return value;
    }
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  },
  formatNumber(value, decimals = 2) {
    if (typeof value !== 'number') {
      return value;
    }
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  },
  formatPercentage(value, decimals = 1) {
    if (typeof value !== 'number') {
      return value;
    }
    return `${value.toFixed(decimals)}%`;
  }
};

// Global components (if needed)
// app.component('ComponentName', Component);

// Mount the app
app.mount('#app');

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
}

// Handle offline/online status
window.addEventListener('online', () => {
  console.log('Application is online');
  // You could dispatch an event or update a store here
});

window.addEventListener('offline', () => {
  console.log('Application is offline');
  // You could dispatch an event or update a store here
});
