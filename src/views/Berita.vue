<template>
  <div class="berita-page">
    <!-- Sidebar Component (sudah ada) -->
    <Sidebar />

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Navbar Component -->
      <Navbar pageTitle="Berita & Event" />

      <!-- Content Wrapper -->
      <div class="content-wrapper">
        <!-- Page Header -->
        <div class="page-header">
          <h2 class="page-title">Daftar Berita & Event</h2>
          <button class="btn-add" @click="tambahBerita">
            + Tambah Berita
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
              placeholder="Cari berita..." 
            />
          </div>
        </div>

        <!-- Table Berita Component -->
        <TableBerita 
          :beritaList="paginatedBerita"
          :startIndex="startIndex"
          @view-detail="viewDetail"
          @delete-berita="deleteBerita"
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
        <h3 class="modal-title">Detail Berita</h3>
        <div v-if="selectedBerita" class="detail-content">
          <img :src="selectedBerita.gambar" alt="Berita" class="detail-image" />
          <div class="detail-info">
            <div class="info-item">
              <strong>Judul:</strong>
              <span>{{ selectedBerita.judul }}</span>
            </div>
            <div class="info-item">
              <strong>Jenis:</strong>
              <span class="badge-jenis">{{ selectedBerita.jenis }}</span>
            </div>
            <div class="info-item">
              <strong>Tanggal Terbit:</strong>
              <span>{{ selectedBerita.tanggalTerbit }}</span>
            </div>
            <div class="info-item">
              <strong>Penulis:</strong>
              <span>{{ selectedBerita.penulis }}</span>
            </div>
            <div class="info-item">
              <strong>Isi Berita:</strong>
              <p>{{ selectedBerita.isiBerita || selectedBerita.judul }}</p>
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
import TableBerita from '../components/TableBerita.vue';

export default {
  name: 'BeritaView',
  components: {
    Sidebar,
    Navbar,
    Pagination,
    TableBerita
  },
  data() {
    return {
      searchQuery: '',
      itemsPerPage: 10,
      currentPage: 1,
      showImageModal: false,
      showDetailModal: false,
      selectedImage: '',
      selectedBerita: null,
      beritaData: [
        {
          id: 1,
          gambar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          judul: '3 Fakta Unik Gunung Malabar, Habitat Macan Kumbang di Jawa Barat',
          jenis: 'Berita',
          tanggalTerbit: '12/12/2025',
          penulis: 'Admin 1',
          isiBerita: 'Gunung Malabar yang terletak di Jawa Barat menyimpan sejuta keunikan. Salah satunya adalah keberadaan Macan Kumbang yang menjadi ikon fauna langka di kawasan ini. Gunung dengan ketinggian 2.321 mdpl ini menawarkan panorama alam yang memukau dan kekayaan biodiversitas yang luar biasa.'
        },
        {
          id: 2,
          gambar: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400',
          judul: 'Event Pendakian Gunung Gede Pangrango Dibuka Kembali',
          jenis: 'Event',
          tanggalTerbit: '11/12/2025',
          penulis: 'Admin 2',
          isiBerita: 'Taman Nasional Gunung Gede Pangrango resmi membuka kembali jalur pendakian setelah masa penutupan. Pendaki dapat kembali menikmati keindahan alam pegunungan dengan protokol keselamatan yang ketat.'
        },
        {
          id: 3,
          gambar: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400',
          judul: 'Tips Mendaki Gunung di Musim Hujan dengan Aman',
          jenis: 'Berita',
          tanggalTerbit: '10/12/2025',
          penulis: 'Admin 1',
          isiBerita: 'Mendaki gunung saat musim hujan memerlukan persiapan ekstra. Berikut adalah tips penting untuk menjaga keselamatan Anda selama pendakian di cuaca yang tidak menentu.'
        },
        {
          id: 4,
          gambar: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
          judul: 'Festival Pendaki Nusantara 2025 Segera Digelar',
          jenis: 'Event',
          tanggalTerbit: '09/12/2025',
          penulis: 'Admin 3',
          isiBerita: 'Festival tahunan yang mempertemukan para pendaki dari seluruh Indonesia akan segera diselenggarakan. Acara ini menampilkan berbagai kegiatan menarik dan edukatif.'
        },
        {
          id: 5,
          gambar: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400',
          judul: 'Penemuan Spesies Baru Flora di Gunung Merapi',
          jenis: 'Berita',
          tanggalTerbit: '08/12/2025',
          penulis: 'Admin 2',
          isiBerita: 'Tim peneliti menemukan spesies flora baru di kawasan Gunung Merapi. Penemuan ini menambah kekayaan biodiversitas Indonesia yang sudah sangat beragam.'
        }
      ]
    }
  },
  computed: {
    filteredBerita() {
      if (!this.searchQuery) {
        return this.beritaData;
      }
      
      return this.beritaData.filter(berita => 
        berita.judul.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        berita.penulis.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        berita.jenis.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredBerita.length / this.itemsPerPage);
    },
    paginatedBerita() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredBerita.slice(start, end);
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
    viewDetail(berita) {
      this.selectedBerita = berita;
      this.showDetailModal = true;
    },
    deleteBerita(id) {
      if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
        this.beritaData = this.beritaData.filter(berita => berita.id !== id);
        
        // Adjust current page jika data di halaman terakhir habis
        if (this.paginatedBerita.length === 0 && this.currentPage > 1) {
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
      this.selectedBerita = null;
    },
    tambahBerita() {
      // Redirect ke form tambah berita
      // this.$router.push('/berita/tambah');
      alert('Fitur tambah berita akan segera hadir!');
    }
  }
}
</script>

<style scoped>
.berita-page {
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

.badge-jenis {
  background-color: #ffc107;
  color: #000;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
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