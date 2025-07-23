<template>
  <div class="app-container">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container">
        <div class="d-flex flex-grow-1 align-items-center">
          <div class="d-flex align-items-center me-auto">
            <RouterLink to="/" @click="closeMenu" class="d-flex align-items-center text-decoration-none">
              <img src="./assets/logo.png" alt="Logo" class="rounded-circle me-2" style="width:40px; height:40px; object-fit:cover;">
            </RouterLink>
            <RouterLink to="/" @click="closeMenu" class="d-flex flex-column text-decoration-none">
              <span class="d-inline text-white" style="line-height: 1.1;">Logistik E-Learning</span>
              <small class="d-inline text-white-50" style="font-size: 0.8em;">Cedric Arnhold (s0586354)</small>
            </RouterLink>
          </div>
          
          <button 
            class="navbar-toggler ms-auto" 
            type="button" 
            @click="toggleMenu" 
            aria-label="Toggle navigation"
            :aria-expanded="isMenuOpen ? 'true' : 'false'"
          >
            <span class="mdi mdi-menu"></span>
          </button>
        </div>
        
        <div class="collapse navbar-collapse" :class="{ 'show': isMenuOpen }">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink 
                class="nav-link" 
                to="/" 
                @click="closeMenu"
                :class="{ 'active': $route.path === '/' }"
              >
                <i class="mdi mdi-home me-1"></i> Home
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink 
                class="nav-link" 
                to="/abc-xyz" 
                @click="closeMenu"
                :class="{ 'active': $route.path.startsWith('/abc-analyse') }"
              >
                <i class="mdi mdi-chart-bar me-1"></i> ABC/XYZ-Analyse
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink 
                class="nav-link" 
                to="/stuecklistenanalyse" 
                @click="closeMenu"
                :class="{ 'active': $route.path.startsWith('/stuecklistenanalyse') }"
              >
                <i class="mdi mdi-format-list-bulleted me-1"></i> Stücklistenanalyse
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink 
                class="nav-link" 
                to="/make-or-buy" 
                @click="closeMenu"
                :class="{ 'active': $route.path.startsWith('/make-or-buy') }"
              >
                <i class="mdi mdi-scale-balance me-1"></i> Make or Buy
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Page Loading Indicator -->
    <div v-if="isLoading" class="page-loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Laden...</span>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container my-4 pt-5">
      <RouterView v-slot="{ Component }">
        <Transition 
          :name="$route.meta.transition || 'fade'" 
          mode="out-in"
          @before-enter="startLoading"
          @after-enter="finishLoading"
        >
          <component :is="Component" :key="$route.path" />
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer class="bg-light mt-5 py-4">
      <div class="container text-center">
        <p class="mb-0">© 2025 HTW Berlin - Fachbereich 4: Wirtschaftsinformatik Cedric Arnhold </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { RouterView, RouterLink } from 'vue-router';

export default {
  components: {
    RouterView,
    RouterLink
  },
  data() {
    return {
      isMenuOpen: false,
      isLoading: false,
      loadingTimeout: null
    }
  },
  computed: {
    navClasses() {
      return {
        'navbar': true,
        'navbar-expand-lg': true,
        'navbar-dark': true,
        'bg-primary': true
      }
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      // Close menu when clicking outside
      if (this.isMenuOpen) {
        document.addEventListener('click', this.handleClickOutside);
      } else {
        document.removeEventListener('click', this.handleClickOutside);
      }
    },
    closeMenu() {
      this.isMenuOpen = false;
      document.removeEventListener('click', this.handleClickOutside);
    },
    handleClickOutside(event) {
      const navbar = this.$el.querySelector('.navbar');
      const button = this.$el.querySelector('.navbar-toggler');
      
      if (!navbar.contains(event.target) && event.target !== button) {
        this.closeMenu();
      }
    },
    startLoading() {
      // Clear any existing timeout to prevent flickering
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
      }
      
      // Only show loading if it takes more than 300ms
      this.loadingTimeout = setTimeout(() => {
        this.isLoading = true;
      }, 300);
    },
    finishLoading() {
      // Clear the loading timeout if it hasn't fired yet
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = null;
      }
      
      // Hide loading indicator
      this.isLoading = false;
      
      // Scroll to top of the page
      window.scrollTo(0, 0);
    }
  },
  beforeUnmount() {
    // Clean up event listeners
    document.removeEventListener('click', this.handleClickOutside);
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-slide-left-enter-active,
.page-slide-left-leave-active,
.page-slide-right-enter-active,
.page-slide-right-leave-active {
  transition: all 0.3s ease;
}

.page-slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.page-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.page-slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

main {
  padding-top: 80px; 
}

.navbar {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 0;
}

.navbar-brand img{
  font-weight: 600;
  font-size: 1.25rem;
  margin-right: 0.5rem;
}

.nav-link {
  position: relative;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link i {
  font-size: 1.1rem;
  vertical-align: middle;
}

.navbar-toggler {
  border: none;
  padding: 0.5rem;
}

.navbar-toggler:focus {
  box-shadow: none;
  outline: none;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    padding: 1rem;
    margin-top: 0.5rem;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .nav-link {
    color: var(--bs-gray-800) !important;
    margin: 0.25rem 0;
    padding: 0.75rem 1rem;
  }
  
  .nav-link.active {
    background-color: var(--htw-green);
    color: white !important;
  }
}

.navbar-toggler .mdi-menu {
  transition: transform 0.3s ease;
}

.navbar-toggler[aria-expanded="true"] .mdi-menu {
  transform: rotate(90deg);
}

.bg-primary {
  background-color: var(--htw-green) !important; 
}
</style>