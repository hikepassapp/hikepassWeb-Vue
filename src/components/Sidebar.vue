<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h4 class="sidebar-brand">Hikepass Admin</h4>
    </div>
    
    <nav class="sidebar-nav">
      <router-link 
        to="/home" 
        class="nav-item"
        :class="{ active: $route.path === '/home' }"
      >
        Dashboard
      </router-link>
      
      <router-link 
        to="/data-gunung" 
        class="nav-item"
        :class="{ active: $route.path === '/data-gunung' }"
      >
        Data Gunung
      </router-link>

      <router-link 
        to="/reservasi" 
        class="nav-item"
        :class="{ active: $route.path === '/reservasi' }"
      >
        Reservasi
      </router-link>
      
      <router-link 
        to="/informasi" 
        class="nav-item"
        :class="{ active: $route.path === '/informasi' }"
      >
        Informasi
      </router-link>
      
      <router-link 
        to="/paket-wisata" 
        class="nav-item"
        :class="{ active: $route.path === '/paket-wisata' }"
      >
        Paket Wisata
      </router-link>

      <router-link 
        to="/berita" 
        class="nav-item"
        :class="{ active: $route.path === '/berita' }"
      >
        Berita & Event
      </router-link>
      
      <router-link 
        to="/laporan" 
        class="nav-item"
        :class="{ active: $route.path === '/laporan' }"
      >
        Laporan
      </router-link>
      
      <router-link 
        to="/user" 
        class="nav-item"
        :class="{ active: $route.path === '/user' }"
      >
        User
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  z-index: 100;
}

.sidebar-header {
  padding: 1.5rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-brand {
  color: #1a7a7a;
  font-weight: 700;
  font-size: 1.3rem;
  margin: 0;
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-item {
  display: block;
  padding: 0.9rem 1.5rem;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  font-weight: 500;
}

.nav-item:hover {
  background-color: #e8f5f5;
  color: #1a7a7a;
}

.nav-item.active {
  background-color: #e8f5f5;
  color: #1a7a7a;
  border-left-color: #1a7a7a;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
}

@media (max-width: 576px) {
  .sidebar {
    position: fixed;
    left: -250px;
    transition: left 0.3s ease;
  }
  
  .sidebar.open {
    left: 0;
  }
}
</style>