import { createRouter, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';
import Home from '../views/Home.vue';
import AbcXyz from '../views/ABCXYZ.vue';
import Stuecklistenanalyse from '../views/Stuecklistenanalyse.vue';
import MakeOrBuy from '../views/MakeOrBuy.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Startseite' }
  },
  {
    path: '/abc-xyz',
    name: 'ABCAnalyse',
    component: AbcXyz,
    meta: { 
      title: 'ABC/XYZ-Analyse',
      transition: 'page-slide-left'
    }
  },
  {
    path: '/stuecklistenanalyse',
    name: 'Stuecklistenanalyse',
    component: Stuecklistenanalyse,
    meta: { 
      title: 'Stücklistenanalyse',
      transition: 'page-slide-left'
    }
  },
  {
    path: '/make-or-buy',
    name: 'MakeOrBuy',
    component: MakeOrBuy,
    meta: { 
      title: 'Make or Buy',
      transition: 'page-slide-left'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 70 // Offset for fixed header
      };
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

// Update page title
router.beforeEach((to, from, next) => {
  // Set the page title
  document.title = to.meta.title 
    ? `${to.meta.title} | HTW Logistik E-Learning` 
    : 'HTW Logistik E-Learning';
  
  // Ensure the page scrolls to top on route change
  window.scrollTo(0, 0);
  
  // Resolve the route
  next();
});

// Handle route changes for page transitions
router.afterEach((to, from) => {
  // Wait for the next tick to ensure the DOM is updated
  nextTick(() => {
    // Force a reflow to ensure transitions work
    document.body.offsetHeight;
  });
});

export default router;
