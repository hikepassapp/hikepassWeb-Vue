<template>
  <div class="paket-wisata-page">
    <!-- Sidebar Component (sudah ada) -->
    <Sidebar />

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Navbar Component -->
      <Navbar pageTitle="Paket Wisata" />

      <!-- Content Wrapper -->
      <div class="content-wrapper">
        <!-- Page Header -->
        <div class="page-header">
          <h2 class="page-title">Paket Wisata</h2>
          <button class="btn-add" @click="tambahWisata">
            + Tambah Paket
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
              placeholder="Cari paket wisata..." 
            />
          </div>
        </div>

        <!-- Table Wisata Component -->
        <TableWisata 
          :wisataList="paginatedWisata"
          :startIndex="startIndex"
          @view-detail="viewDetail"
          @delete-wisata="deleteWisata"
          @view-image="viewImage"
        />

        <!-- Pagination Component -->
        <Pagination 
          :currentPage="currentPage"
          :totalPages="totalPages"
          @page-change="changePage"
        />
      </div>
    </div>

    <!-- Modal for Image Preview -->
    <div v-if="showImageModal" class="modal-overlay" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeImageModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <img :src="selectedImage" alt="Preview" class="modal-image" />
      </div>
    </div>

    <!-- Modal for Detail -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-detail" @click.stop>
        <button class="modal-close" @click="closeDetailModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <h3 class="modal-title">Detail Paket Wisata</h3>
        <div v-if="selectedWisata" class="detail-content">
          <img :src="selectedWisata.gambar" alt="Wisata" class="detail-image" />
          <div class="detail-info">
            <div class="info-item">
              <strong>Judul Paket:</strong>
              <span>{{ selectedWisata.judul }}</span>
            </div>
            <div class="info-item">
              <strong>Jenis:</strong>
              <span class="badge-jenis">{{ selectedWisata.jenis }}</span>
            </div>
            <div class="info-item">
              <strong>Kontak:</strong>
              <span>{{ selectedWisata.kontak }}</span>
            </div>
            <div class="info-item">
              <strong>Tanggal Terbit:</strong>
              <span>{{ selectedWisata.tanggalTerbit }}</span>
            </div>
            <div class="info-item">
              <strong>Guide:</strong>
              <span>{{ selectedWisata.guide }}</span>
            </div>
            <div class="info-item">
              <strong>Harga:</strong>
              <span class="price">{{ formatRupiah(selectedWisata.harga) }}</span>
            </div>
            <div class="info-item">
              <strong>Deskripsi:</strong>
              <p>{{ selectedWisata.deskripsi }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import komponen yang sudah ada
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
import Pagination from '../components/Pagination.vue';

// Import komponen baru
import TableWisata from '../components/TableWisata.vue';

export default {
  name: 'PaketWisataView',
  components: {
    Sidebar,
    Navbar,
    Pagination,
    TableWisata
  },
  data() {
    return {
      searchQuery: '',
      itemsPerPage: 10,
      currentPage: 1,
      showImageModal: false,
      showDetailModal: false,
      selectedImage: '',
      selectedWisata: null,
      wisataData: [
        {
          id: 1,
          gambar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          judul: 'Puncak Besar Malabar',
          jenis: 'Open Trip',
          kontak: '082381319412943',
          tanggalTerbit: '12/12/2025',
          guide: 'Tiga Dewa',
          harga: 850000,
          deskripsi: 'Paket wisata pendakian Gunung Malabar dengan pemandu berpengalaman. Termasuk transportasi, camping equipment, dan makan 3x sehari. Durasi 2 hari 1 malam dengan spot terbaik untuk menikmati sunrise dan sunset.'
        },
        {
          id: 2,
          gambar: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400',
          judul: 'Gunung Gede Pangrango Adventure',
          jenis: 'Open Trip',
          kontak: '081234567890',
          tanggalTerbit: '11/12/2025',
          guide: 'Budi Hartono',
          harga: 950000,
          deskripsi: 'Eksplorasi keindahan Taman Nasional Gunung Gede Pangrango. Paket lengkap dengan guide profesional, peralatan camping, dan dokumentasi.'
        },
        {
          id: 3,
          gambar: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400',
          judul: 'Papandayan Crater Trek',
          jenis: 'Private Trip',
          kontak: '085678901234',
          tanggalTerbit: '10/12/2025',
          guide: 'Andi Kusuma',
          harga: 750000,
          deskripsi: 'Jelajahi kawah aktif Gunung Papandayan dengan pemanduan eksklusif. Cocok untuk pemula maupun pendaki berpengalaman.'
        },
        {
          id: 4,
          gambar: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
          judul: 'Rinjani Summit Attack',
          jenis: 'Open Trip',
          kontak: '087890123456',
          tanggalTerbit: '09/12/2025',
          guide: 'Made Wijaya',
          harga: 2500000,
          deskripsi: 'Pendakian menuju puncak Gunung Rinjani 3726 mdpl. Paket 4 hari 3 malam dengan kunjungan ke Danau Segara Anak.'
        },
        {
          id: 5,
          gambar: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400',
          judul: 'Semeru Mahameru Expedition',
          jenis: 'Private Trip',
          kontak: '089012345678',
          tanggalTerbit: '08/12/2025',
          guide: 'Joko Susilo',
          harga: 1800000,
          deskripsi: 'Ekspedisi ke puncak tertinggi Pulau Jawa. Paket 5 hari 4 malam dengan rute melalui Ranu Kumbolo yang memukau.'
        }
      ]
    }
  },
  computed: {
    filteredWisata() {
      if (!this.searchQuery) {
        return this.wisataData;
      }
      
      return this.wisataData.filter(wisata => 
        wisata.judul.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        wisata.guide.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        wisata.jenis.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        wisata.kontak.includes(this.searchQuery)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredWisata.length / this.itemsPerPage);
    },
    paginatedWisata() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredWisata.slice(start, end);
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    }
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
    updateItemsPerPage() {
      this.currentPage = 1;
    },
    viewDetail(wisata) {
      this.selectedWisata = wisata;
      this.showDetailModal = true;
    },
    deleteWisata(id) {
      if (confirm('Apakah Anda yakin ingin menghapus paket wisata ini?')) {
        this.wisataData = this.wisataData.filter(wisata => wisata.id !== id);
        
        // Adjust current page jika data di halaman terakhir habis
        if (this.paginatedWisata.length === 0 && this.currentPage > 1) {
          this.currentPage--;
        }
      }
    },
    viewImage(image) {
      this.selectedImage = image;
      this.showImageModal = true;
    },
    closeImageModal() {
      this.showImageModal = false;
      this.selectedImage = '';
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedWisata = null;
    },
    tambahWisata() {
      // Redirect ke form tambah paket wisata
      // this.$router.push('/wisata/tambah');
      alert('Fitur tambah paket wisata akan segera hadir!');
    },
    formatRupiah(angka) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(angka);
    }
  }
}
</script>

<style scoped>
.paket-wisata-page {
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
}

.page-title {
  font-size: 1.8rem;
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

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.modal-image {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 12px;
}

.modal-detail {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
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
  background: rgba(0, 0, 0, 0.8);
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

.detail-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
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
}

.info-item strong {
  color: #333;
  font-weight: 600;
}

.info-item span,
.info-item p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.price {
  color: #1a7a7a !important;
  font-weight: 600 !important;
  font-size: 1.1rem !important;
}

.badge-jenis {
  background-color: #ffc107;
  color: #000;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
  width: fit-content;
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
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-add {
    width: 100%;
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

  .page-title {
    font-size: 1.5rem;
  }
}
</style>