import { ref } from 'vue';

export const loadingStore = {
  isLoading: ref(false),
  
  startLoading() {
    this.isLoading.value = true;
  },
  
  finishLoading() {
    this.isLoading.value = false;
  }
};

// Make the store reactive and available globally
import { createApp } from 'vue';
const app = createApp({});
app.config.globalProperties.$loadingStore = loadingStore;
