<template>
  <div class="reservasi-page">
    <Sidebar />
    
    <div class="main-content">
      <Navbar pageTitle="Reservasi" />
      
      <div class="content-wrapper">
        <!-- Tab Navigation -->
        <TabNavigation 
          :tabs="tabs"
          :activeTab="activeTab"
          @change-tab="changeTab"
        />
        
        <!-- Section Header -->
        <div class="section-header">
          <h2 class="section-title">{{ sectionTitle }}</h2>
          <button v-if="activeTab === 'reservasi'" class="btn-add" @click="openAddModal">
            + Tambah Data
          </button>
        </div>
        
        <!-- Filter Section -->
        <div class="filter-section">
          <div class="show-entries">
            <span>Show</span>
            <select v-model="itemsPerPage" @change="updateItemsPerPage" class="form-select">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>Data</span>
          </div>
          
          <div class="search-box">
            <span>Search:</span>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control"
              placeholder="Cari..."
            />
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat data...</p>
        </div>
        
        <!-- Table Content -->
        <TableReservasi 
          v-if="activeTab === 'reservasi' && !loading"
          :reservations="paginatedReservations"
          @view-detail="viewDetail"
          @edit-reservasi="openEditModal"
          @delete-reservasi="openDeleteModal"
        />
        
        <TableCheckIn 
          v-if="activeTab === 'checkin' && !loading"
          :checkIns="paginatedCheckIns"
          @view-detail="viewDetail"
        />
        
        <TableCheckOut 
          v-if="activeTab === 'checkout' && !loading"
          :checkOuts="paginatedCheckOuts"
          @view-detail="viewDetail"
        />
        
        <!-- Pagination -->
        <Pagination 
          v-if="!loading"
          :currentPage="currentPage"
          :totalPages="totalPages"
          @page-change="changePage"
        />
      </div>
    </div>
    
    <!-- Modal for Detail -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-detail" @click.stop>
        <button class="modal-close" @click="closeDetailModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <h3 class="modal-title">Detail Reservasi</h3>
        <div v-if="selectedData" class="detail-content">
          <div class="detail-info">
            <div class="info-item">
              <strong>ID Reservasi:</strong>
              <span>{{ selectedData.id }}</span>
            </div>
            <div class="info-item">
              <strong>Nama Gunung:</strong>
              <span>{{ selectedData.mountain?.name || '-' }}</span>
            </div>
            <div class="info-item">
              <strong>Tanggal Mulai:</strong>
              <span>{{ formatDate(selectedData.start_date) }}</span>
            </div>
            <div class="info-item">
              <strong>Nama:</strong>
              <span>{{ selectedData.name }}</span>
            </div>
            <div class="info-item">
              <strong>NIK:</strong>
              <span>{{ selectedData.nik }}</span>
            </div>
            <div class="info-item">
              <strong>Jenis Kelamin:</strong>
              <span>{{ selectedData.gender === 'male' ? 'Laki-laki' : 'Perempuan' }}</span>
            </div>
            <div class="info-item">
              <strong>No. Telepon:</strong>
              <span>{{ selectedData.phone_number }}</span>
            </div>
            <div class="info-item">
              <strong>Alamat:</strong>
              <span>{{ selectedData.address }}</span>
            </div>
            <div class="info-item">
              <strong>Kewarganegaraan:</strong>
              <span>{{ selectedData.citizen }}</span>
            </div>
            <div class="info-item">
              <strong>ID Card:</strong>
              <span>{{ selectedData.id_card }}</span>
            </div>
            <div class="info-item">
              <strong>Harga:</strong>
              <span>{{ selectedData.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal for Add/Edit -->
    <div v-if="showFormModal" class="modal-overlay" @click="closeFormModal">
      <div class="modal-form" @click.stop>
        <button class="modal-close" @click="closeFormModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <h3 class="modal-title">{{ isEditMode ? 'Edit Reservasi' : 'Tambah Reservasi' }}</h3>
        
        <form @submit.prevent="submitForm" class="reservation-form">
          <div class="form-group">
            <label for="id_mountain">Gunung <span class="required">*</span></label>
            <select 
              id="id_mountain" 
              v-model="formData.id_mountain" 
              class="form-control"
              :class="{ 'is-invalid': errors.id_mountain }"
              required
            >
              <option value="">Pilih Gunung</option>
              <option v-for="mountain in mountains" :key="mountain.id" :value="mountain.id">
                {{ mountain.name }}
              </option>
            </select>
            <span v-if="errors.id_mountain" class="error-text">{{ errors.id_mountain[0] }}</span>
          </div>
          
          <div class="form-group">
            <label for="start_date">Tanggal Mulai <span class="required">*</span></label>
            <input 
              type="date" 
              id="start_date" 
              v-model="formData.start_date" 
              class="form-control"
              :class="{ 'is-invalid': errors.start_date }"
              required
            />
            <span v-if="errors.start_date" class="error-text">{{ errors.start_date[0] }}</span>
          </div>
          
          <div class="form-group">
            <label for="name">Nama Lengkap <span class="required">*</span></label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              class="form-control"
              :class="{ 'is-invalid': errors.name }"
              placeholder="Masukkan nama lengkap"
              required
            />
            <span v-if="errors.name" class="error-text">{{ errors.name[0] }}</span>
          </div>
          
          <div class="form-group">
            <label for="nik">NIK <span class="required">*</span></label>
            <input 
              type="text" 
              id="nik" 
              v-model="formData.nik" 
              class="form-control"
              :class="{ 'is-invalid': errors.nik }"
              placeholder="Masukkan NIK"
              maxlength="16"
              required
            />
            <span v-if="errors.nik" class="error-text">{{ errors.nik[0] }}</span>
          </div>
          
          <div class="form-group">
            <label for="gender">Jenis Kelamin <span class="required">*</span></label>
            <select 
              id="gender" 
              v-model="formData.gender" 
              class="form-control"
              :class="{ 'is-invalid': errors.gender }"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
            <span v-if="errors.gender" class="error-text">{{ errors.gender[0] }}</span>
          </div>
          
          <div class="form-group">
            <label for="phone_number">No. Telepon <span class="required">*</span></label>
            <input 
              type="tel" 
              id="phone_number" 
              v-model="formData.phone_number" 
              class="form-control"
              :class="{ 'is-invalid': errors.phone_number }"
              placeholder="Contoh: 081234567890"
              required
            />
            <span v-if="errors.phone_number" class="error-text">{{ errors.phone_number[0] }}</span>
          </div>
          
          <div class="form-group">
            <label for="address">Alamat <span class="required">*</span></label>
            <textarea 
              id="address" 
              v-model="formData.address" 
              class="form-control"
              :class="{ 'is-invalid': errors.address }"
              placeholder="Masukkan alamat lengkap"
              rows="3"
              required
            ></textarea>
            <span v-if="errors.address" class="error-text">{{ errors.address[0] }}</span>
          </div>
          
          <div class="form-group">
            <label for="citizen">Kewarganegaraan <span class="required">*</span></label>
            <input 
              type="text" 
              id="citizen" 
              v-model="formData.citizen" 
              class="form-control"
              :class="{ 'is-invalid': errors.citizen }"
              placeholder="Contoh: Indonesian"
              required
            />
            <span v-if="errors.citizen" class="error-text">{{ errors.citizen[0] }}</span>
          </div>
          
          <div class="form-group">
            <label for="id_card">ID Card <span class="required">*</span></label>
            <input 
              type="text" 
              id="id_card" 
              v-model="formData.id_card" 
              class="form-control"
              :class="{ 'is-invalid': errors.id_card }"
              placeholder="Contoh: KTP1234567890"
              required
            />
            <span v-if="errors.id_card" class="error-text">{{ errors.id_card[0] }}</span>
          </div>

          <div class="form-group">
            <label for="price">Harga <span class="required">*</span></label>
            <input 
              type="text" 
              id="price" 
              v-model="formData.price" 
              class="form-control"
              :class="{ 'is-invalid': errors.price }"
              placeholder="Contoh: Rp.30000"
              required
            />
            <span v-if="errors.price" class="error-text">{{ errors.price[0] }}</span>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeFormModal">
              Batal
            </button>
            <button type="submit" class="btn-submit" :disabled="submitting">
              {{ submitting ? 'Menyimpan...' : (isEditMode ? 'Update' : 'Simpan') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal for Delete Confirmation -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-confirm" @click.stop>
        <div class="confirm-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h3 class="modal-title">Konfirmasi Hapus</h3>
        <p class="confirm-text">Apakah Anda yakin ingin menghapus reservasi ini?</p>
        <div class="confirm-actions">
          <button type="button" class="btn-cancel" @click="closeDeleteModal">
            Batal
          </button>
          <button type="button" class="btn-delete" @click="confirmDelete" :disabled="deleting">
            {{ deleting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Sidebar from '../../components/Sidebar.vue'
import Navbar from '../../components/Navbar.vue'
import TabNavigation from '../../components/TabNavigation.vue'
import TableReservasi from '../../components/reservation/TableReservasi.vue'
import TableCheckIn from '../../components/checkin/TableCheckIn.vue'
import TableCheckOut from '../../components/checkout/TableCheckOut.vue'
import Pagination from '../../components/Pagination.vue'

// Configure axios base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export default {
  name: 'ReservasiView',
  components: {
    Sidebar,
    Navbar,
    TabNavigation,
    TableReservasi,
    TableCheckIn,
    TableCheckOut,
    Pagination
  },
  data() {
    return {
      activeTab: 'reservasi',
      searchQuery: '',
      itemsPerPage: 10,
      currentPage: 1,
      loading: false,
      submitting: false,
      deleting: false,
      showDetailModal: false,
      showFormModal: false,
      showDeleteModal: false,
      isEditMode: false,
      selectedData: null,
      deleteId: null,
      errors: {},
      tabs: [
        { id: 'reservasi', label: 'Reservasi' },
        { id: 'checkin', label: 'Check-In' },
        { id: 'checkout', label: 'Check-Out' }
      ],
      reservations: [],
      mountains: [],
      checkIns: [
        {
          id: 1,
          kodeReservasi: 'RSV-3913923',
          nama: 'Satria',
          tanggalCheckIn: '2025-12-16',
          jumlahPendaki: 4,
          status: 'Check-In'
        }
      ],
      checkOuts: [
        {
          id: 1,
          kodeReservasi: 'RSV-3913920',
          nama: 'Budi',
          tanggalCheckOut: '2025-12-14',
          jumlahPendaki: 5,
          status: 'Selesai'
        }
      ],
      formData: {
        id_mountain: '',
        start_date: '',
        name: '',
        nik: '',
        gender: '',
        phone_number: '',
        address: '',
        citizen: '',
        id_card: '',
        price: ''
      }
    }
  },
  computed: {
    sectionTitle() {
      const titles = {
        reservasi: 'Daftar Reservasi',
        checkin: 'Daftar Check-In',
        checkout: 'Daftar Check-Out'
      };
      return titles[this.activeTab];
    },
    filteredReservations() {
      if (!this.searchQuery) return this.reservations;
      return this.reservations.filter(r => 
        r.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        r.nik.includes(this.searchQuery) ||
        r.phone_number.includes(this.searchQuery) ||
        r.id.toString().includes(this.searchQuery)
      );
    },
    filteredCheckIns() {
      if (!this.searchQuery) return this.checkIns;
      return this.checkIns.filter(c => 
        c.kodeReservasi.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.nama.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredCheckOuts() {
      if (!this.searchQuery) return this.checkOuts;
      return this.checkOuts.filter(c => 
        c.kodeReservasi.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.nama.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    currentData() {
      const dataMap = {
        reservasi: this.filteredReservations,
        checkin: this.filteredCheckIns,
        checkout: this.filteredCheckOuts
      };
      return dataMap[this.activeTab];
    },
    totalPages() {
      return Math.ceil(this.currentData.length / this.itemsPerPage);
    },
    paginatedReservations() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredReservations.slice(start, end);
    },
    paginatedCheckIns() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCheckIns.slice(start, end);
    },
    paginatedCheckOuts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCheckOuts.slice(start, end);
    }
  },
  mounted() {
    this.fetchReservations()
    this.fetchMountains()
  },
  methods: {
    async fetchReservations() {
      this.loading = true
      try {
        console.log('Fetching reservations from: http://127.0.0.1:8000/api/reservations')
        const response = await api.get('/api/reservations')
        console.log('Reservations response:', response.data)
        
        if (response.data.success) {
          this.reservations = response.data.data
          console.log('Loaded reservations:', this.reservations.length)
        } else {
          console.error('API returned success: false')
          alert('Gagal memuat data: ' + (response.data.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error fetching reservations:', error)
        if (error.response) {
          // Server responded with error
          console.error('Response error:', error.response.data)
          console.error('Status code:', error.response.status)
          alert(`Gagal memuat data reservasi: ${error.response.status} - ${error.response.data.message || error.message}`)
        } else if (error.request) {
          // Request was made but no response
          console.error('No response received:', error.request)
          alert('Gagal terhubung ke server. Pastikan backend berjalan di http://127.0.0.1:8000')
        } else {
          // Something else happened
          console.error('Error:', error.message)
          alert('Terjadi kesalahan: ' + error.message)
        }
      } finally {
        this.loading = false
      }
    },
    async fetchMountains() {
      try {
        console.log('Fetching mountains from: http://127.0.0.1:8000/api/mountains')
        const response = await api.get('/api/mountains')
        console.log('Mountains raw response:', response.data)

        // Accept various response shapes: Array, { data: [] }, { mountains: [] }
        let list = []
        if (Array.isArray(response.data)) {
          list = response.data
        } else if (Array.isArray(response.data?.data)) {
          list = response.data.data
        } else if (Array.isArray(response.data?.mountains)) {
          list = response.data.mountains
        } else if (response.data?.success && Array.isArray(response.data?.data)) {
          list = response.data.data
        } else {
          console.warn('Unexpected mountains response shape:', response.data)
        }

        // Normalize to { id, name }
        this.mountains = (list || [])
          .map(m => ({
            id: m.id ?? m.id_mountain ?? m.mountain_id,
            name: m.name ?? m.mountain_name ?? m.nama ?? 'Tanpa nama'
          }))
          .filter(m => m.id)

        console.log('Loaded mountains (normalized):', this.mountains.length)
      } catch (error) {
        console.error('Error fetching mountains:', error)
        if (error.response) {
          console.error('Mountains response error:', error.response.data)
          console.error('Status code:', error.response.status)
        } else if (error.request) {
          console.error('No response received for mountains')
        }
        // Fallback to empty array to keep select stable
        this.mountains = []
      }
    },
    changeTab(tabId) {
      this.activeTab = tabId;
      this.currentPage = 1;
      this.searchQuery = '';
    },
    changePage(page) {
      this.currentPage = page;
    },
    updateItemsPerPage() {
      this.currentPage = 1;
    },
    openAddModal() {
      this.isEditMode = false
      this.resetForm()
      // Refresh mountains to ensure latest options before showing form
      this.fetchMountains()
      this.showFormModal = true
    },
    openEditModal(data) {
      this.isEditMode = true
      this.selectedData = data
      this.formData = {
        id_mountain: data.id_mountain,
        start_date: data.start_date,
        name: data.name,
        nik: data.nik,
        gender: data.gender,
        phone_number: data.phone_number,
        address: data.address,
        citizen: data.citizen,
        id_card: data.id_card,
        price: data.price
      }
      // Refresh mountains to ensure options are up to date
      this.fetchMountains()
      this.showFormModal = true
    },
    openDeleteModal(id) {
      this.deleteId = id
      this.showDeleteModal = true
    },
    async submitForm() {
      this.submitting = true
      this.errors = {}
      
      try {
        let response
        if (this.isEditMode) {
          console.log('Updating reservation:', this.selectedData.id, this.formData)
          response = await api.put(`/api/reservations/${this.selectedData.id}`, this.formData)
        } else {
          console.log('Creating new reservation:', this.formData)
          response = await api.post('/api/reservations', this.formData)
        }
        
        console.log('Submit response:', response.data)
        
        if (response.data.success) {
          alert(response.data.message || 'Data berhasil disimpan')
          this.closeFormModal()
          await this.fetchReservations()
        } else {
          alert('Gagal menyimpan data: ' + (response.data.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        if (error.response && error.response.status === 422) {
          // Validation errors
          this.errors = error.response.data.errors || {}
          console.error('Validation errors:', this.errors)
          alert('Terdapat kesalahan validasi. Periksa form Anda.')
        } else if (error.response) {
          console.error('Submit error response:', error.response.data)
          alert(`Terjadi kesalahan: ${error.response.status} - ${error.response.data.message || error.message}`)
        } else {
          alert('Terjadi kesalahan saat menyimpan data: ' + error.message)
        }
      } finally {
        this.submitting = false
      }
    },
    async confirmDelete() {
      this.deleting = true
      try {
        console.log('Deleting reservation:', this.deleteId)
        const response = await api.delete(`/api/reservations/${this.deleteId}`)
        console.log('Delete response:', response.data)
        
        if (response.data.success) {
          alert(response.data.message || 'Data berhasil dihapus')
          this.closeDeleteModal()
          await this.fetchReservations()
        } else {
          alert('Gagal menghapus data: ' + (response.data.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error deleting reservation:', error)
        if (error.response) {
          console.error('Delete error response:', error.response.data)
          alert(`Gagal menghapus data: ${error.response.status} - ${error.response.data.message || error.message}`)
        } else {
          alert('Gagal menghapus data reservasi: ' + error.message)
        }
      } finally {
        this.deleting = false
      }
    },
    viewDetail(data) {
      this.selectedData = data;
      this.showDetailModal = true;
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedData = null;
    },
    closeFormModal() {
      this.showFormModal = false
      this.resetForm()
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteId = null
    },
    resetForm() {
      this.formData = {
        id_mountain: '',
        start_date: '',
        name: '',
        nik: '',
        gender: '',
        phone_number: '',
        address: '',
        citizen: '',
        id_card: '',
        price: ''
      }
      this.errors = {}
      this.selectedData = null
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }
}
</script>

<style scoped>
.reservasi-page {
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.btn-add {
  background-color: #1a7a7a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-add:hover {
  background-color: #145f5f;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.show-entries {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.show-entries span {
  color: #666;
  font-weight: 500;
}

.show-entries .form-select {
  width: 80px;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-box span {
  color: #666;
  font-weight: 500;
}

.search-box .form-control {
  width: 250px;
  padding: 0.4rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1a7a7a;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Modal Styles */
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
  z-index: 1000;
  padding: 1rem;
}

.modal-detail,
.modal-form,
.modal-confirm {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-confirm {
  max-width: 450px;
  text-align: center;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  color: #333;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item strong {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.info-item span {
  color: #666;
  font-size: 1rem;
}

/* Form Styles */
.reservation-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.required {
  color: #dc3545;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #1a7a7a;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit,
.btn-delete {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.95rem;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-submit {
  background-color: #1a7a7a;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: #145f5f;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Delete Modal */
.confirm-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background-color: #fff3cd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-icon i {
  font-size: 2.5rem;
  color: #ff9800;
}

.confirm-text {
  color: #666;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
}
</style>