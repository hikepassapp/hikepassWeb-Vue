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
          <button v-if="activeTab === 'reservasi'" class="btn-add" @click="addReservasi">
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
        
        <!-- Table Content -->
        <TableReservasi 
          v-if="activeTab === 'reservasi'"
          :reservations="paginatedReservations"
          @view-detail="viewDetail"
          @delete-reservasi="deleteReservasi"
        />
        
        <TableCheckIn 
          v-if="activeTab === 'checkin'"
          :checkIns="paginatedCheckIns"
          @view-detail="viewDetail"
        />
        
        <TableCheckOut 
          v-if="activeTab === 'checkout'"
          :checkOuts="paginatedCheckOuts"
          @view-detail="viewDetail"
        />
        
        <!-- Pagination -->
        <Pagination 
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
        <h3 class="modal-title">Detail {{ getModalTitle() }}</h3>
        <div v-if="selectedData" class="detail-content">
          <div class="detail-info">
            <div class="info-item">
              <strong>Kode Reservasi:</strong>
              <span>{{ selectedData.kodeReservasi }}</span>
            </div>
            <div class="info-item">
              <strong>Nama:</strong>
              <span>{{ selectedData.nama }}</span>
            </div>
            <div v-if="activeTab === 'reservasi'" class="info-item">
              <strong>NIK:</strong>
              <span>{{ selectedData.nik }}</span>
            </div>
            <div v-if="activeTab === 'reservasi'" class="info-item">
              <strong>Kontak:</strong>
              <span>{{ selectedData.kontak }}</span>
            </div>
            <div v-if="activeTab === 'checkin'" class="info-item">
              <strong>Tanggal Check-In:</strong>
              <span>{{ formatDate(selectedData.tanggalCheckIn) }}</span>
            </div>
            <div v-if="activeTab === 'checkout'" class="info-item">
              <strong>Tanggal Check-Out:</strong>
              <span>{{ formatDate(selectedData.tanggalCheckOut) }}</span>
            </div>
            <div class="info-item">
              <strong>Jumlah Pendaki:</strong>
              <span>{{ selectedData.jumlahPendaki }}</span>
            </div>
            <div v-if="selectedData.status" class="info-item">
              <strong>Status:</strong>
              <span>{{ selectedData.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import TabNavigation from '../components/TabNavigation.vue'
import TableReservasi from '../components/TableReservasi.vue'
import TableCheckIn from '../components/TableCheckIn.vue'
import TableCheckOut from '../components/TableCheckOut.vue'
import Pagination from '../components/Pagination.vue'

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
      showDetailModal: false,
      selectedData: null,
      tabs: [
        { id: 'reservasi', label: 'Reservasi' },
        { id: 'checkin', label: 'Check-In' },
        { id: 'checkout', label: 'Check-Out' }
      ],
      reservations: [
        {
          id: 1,
          kodeReservasi: 'RSV-3913923',
          nama: 'Satria',
          nik: '3201313123231244',
          kontak: '08XXXX',
          jumlahPendaki: 4
        },
        {
          id: 2,
          kodeReservasi: 'RSV-3913923',
          nama: 'Satria',
          nik: '3201313123231244',
          kontak: '08XXXX',
          jumlahPendaki: 4
        }
      ],
      checkIns: [
        {
          id: 1,
          kodeReservasi: 'RSV-3913923',
          nama: 'Satria',
          tanggalCheckIn: '2025-12-16',
          jumlahPendaki: 4,
          status: 'Check-In'
        },
        {
          id: 2,
          kodeReservasi: 'RSV-3913924',
          nama: 'Ahmad',
          tanggalCheckIn: '2025-12-15',
          jumlahPendaki: 3,
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
        },
        {
          id: 2,
          kodeReservasi: 'RSV-3913921',
          nama: 'Dewi',
          tanggalCheckOut: '2025-12-13',
          jumlahPendaki: 2,
          status: 'Selesai'
        }
      ]
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
        r.kodeReservasi.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        r.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        r.nik.includes(this.searchQuery) ||
        r.kontak.includes(this.searchQuery)
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
  methods: {
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
    addReservasi() {
      console.log('Add Reservasi');
      // Navigate to add form or open modal
    },
    viewDetail(data) {
      this.selectedData = data;
      this.showDetailModal = true;
    },
    deleteReservasi(id) {
      if (confirm('Apakah Anda yakin ingin menghapus reservasi ini?')) {
        this.reservations = this.reservations.filter(r => r.id !== id);
        console.log('Deleted reservasi with id:', id);
      }
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedData = null;
    },
    getModalTitle() {
      const titles = {
        reservasi: 'Reservasi',
        checkin: 'Check-In',
        checkout: 'Check-Out'
      };
      return titles[this.activeTab];
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

.modal-detail {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
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
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box .form-control {
    width: 100%;
  }
  
  .modal-detail {
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
}
</style>