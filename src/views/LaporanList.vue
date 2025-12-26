<template>
  <div class="laporan-list-page">
    <Sidebar />

    <div class="main-content">
      <Navbar pageTitle="Daftar Laporan" />

      <div class="content-wrapper">
        <div class="page-header">
          <h2>Daftar Laporan</h2>
          <button class="btn-add" @click="goToCreate">
            <i class="bi bi-plus-circle"></i>
            Buat Laporan Baru
          </button>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat data...</p>
        </div>

        <TableLaporan v-else :reports="laporans" @refresh="fetchLaporans" @delete-report="handleDelete" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import TableLaporan from '../components/TableLaporan.vue'

const API_URL = 'http://localhost:8000/api/laporans'

export default {
  name: 'LaporanListView',
  components: {
    Sidebar,
    Navbar,
    TableLaporan
  },
  data() {
    return {
      laporans: [],
      isLoading: false
    }
  },
  mounted() {
    this.fetchLaporans()
  },
  methods: {
    async fetchLaporans() {
      this.isLoading = true
      try {
        const response = await axios.get(API_URL)
        if (response.data.success) {
          this.laporans = response.data.data
        }
      } catch (error) {
        console.error('Error fetching laporans:', error)
        alert('Gagal memuat data laporan')
      } finally {
        this.isLoading = false
      }
    },

    goToCreate() {
      this.$router.push('/laporan/create')
    },

    async handleDelete(id) {
      try {
        const response = await axios.delete(`${API_URL}/${id}`)
        if (response.data.success) {
          alert(response.data.message)
          this.fetchLaporans() // Refresh data
        }
      } catch (error) {
        console.error('Error deleting laporan:', error)
        alert('Gagal menghapus laporan')
      }
    }
  }
}
</script>

<style scoped>
.laporan-list-page {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  margin-left: 250px;
}

.content-wrapper {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.page-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #1a7a7a;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  background-color: #145f5f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 122, 122, 0.3);
}

.btn-add i {
  font-size: 1.2rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #1a7a7a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #666;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 200px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .content-wrapper {
    padding: 1.5rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }

  .btn-add {
    justify-content: center;
  }
}
</style>