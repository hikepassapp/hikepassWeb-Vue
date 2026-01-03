<template>
  <div>
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
          <i class="bi bi-house-door"></i>
          <span>Dashboard</span>
        </router-link>
        
        <router-link 
          to="/data-gunung" 
          class="nav-item"
          :class="{ active: $route.path === '/data-gunung' }"
        >
          <i class="bi bi-triangle"></i>
          <span>Data Gunung</span>
        </router-link>

        <router-link 
          to="/reservasi" 
          class="nav-item"
          :class="{ active: $route.path === '/reservasi' }"
        >
          <i class="bi bi-calendar-check"></i>
          <span>Reservasi</span>
        </router-link>
        
        <router-link 
          to="/informasi" 
          class="nav-item"
          :class="{ active: $route.path === '/informasi' }"
        >
          <i class="bi bi-info-circle"></i>
          <span>Informasi</span>
        </router-link>
        
        <router-link 
          to="/paket-wisata" 
          class="nav-item"
          :class="{ active: $route.path === '/paket-wisata' }"
        >
          <i class="bi bi-backpack"></i>
          <span>Paket Wisata</span>
        </router-link>

        <router-link 
          to="/berita" 
          class="nav-item"
          :class="{ active: $route.path === '/berita' }"
        >
          <i class="bi bi-newspaper"></i>
          <span>Berita & Event</span>
        </router-link>
        
        <router-link 
          to="/laporan" 
          class="nav-item"
          :class="{ active: $route.path === '/laporan' }"
        >
          <i class="bi bi-file-text"></i>
          <span>Laporan</span>
        </router-link>
        
        <router-link 
          to="/user" 
          class="nav-item"
          :class="{ active: $route.path === '/user' }"
        >
          <i class="bi bi-people"></i>
          <span>User</span>
        </router-link>
      </nav>

      <!-- Logout Button -->
      <div class="sidebar-footer">
        <button class="btn-logout" @click="showLogoutModal = true">
          <i class="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>

    <!-- Modal Logout Confirmation -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="showLogoutModal = false">
      <div class="modal-logout" @click.stop>
        <div class="logout-icon">
          <i class="bi bi-box-arrow-right"></i>
        </div>
        <h3 class="modal-title">Konfirmasi Logout</h3>
        <p class="modal-text">
          Apakah Anda yakin ingin keluar dari sistem?<br>
          Anda harus login kembali untuk mengakses dashboard.
        </p>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showLogoutModal = false">
            Batal
          </button>
          <button class="btn-confirm-logout" @click="confirmLogout">
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      showLogoutModal: false,
      user: null
    }
  },
  mounted() {
    // Ambil data user dari localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      this.user = JSON.parse(userData)
    }
  },
  methods: {
    openLogoutModal() {
      this.showLogoutModal = true
    },

    closeLogoutModal() {
      this.showLogoutModal = false
    },

    confirmLogout() {
      // Hapus semua data session
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Tutup modal
      this.showLogoutModal = false
      
      // Redirect ke login
      this.$router.push('/login')
    }
  }
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
  display: flex;
  flex-direction: column;
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
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.5rem;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  font-weight: 500;
}

.nav-item i {
  font-size: 1.1rem;
  width: 20px;
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

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  margin-top: auto;
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout i {
  font-size: 1.1rem;
}

.btn-logout:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.btn-logout:active {
  transform: translateY(0);
}

/* Modal Logout Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-logout {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  position: relative;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.logout-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.75rem;
}

.modal-text {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-cancel,
.btn-confirm-logout {
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.btn-cancel:hover {
  background-color: #d5d5d5;
  transform: translateY(-2px);
}

.btn-confirm-logout {
  background-color: #ef4444;
  color: white;
}

.btn-confirm-logout:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(239, 68, 68, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }

  .nav-item {
    padding: 0.8rem 1.25rem;
    font-size: 0.9rem;
  }

  .btn-logout {
    padding: 0.75rem 0.85rem;
    font-size: 0.9rem;
  }

  .modal-logout {
    padding: 1.5rem;
  }

  .logout-icon {
    width: 70px;
    height: 70px;
    font-size: 2rem;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .modal-text {
    font-size: 0.95rem;
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

  .modal-logout {
    padding: 1.5rem;
    margin: 1rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm-logout {
    width: 100%;
  }
}

/* Scrollbar Styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>