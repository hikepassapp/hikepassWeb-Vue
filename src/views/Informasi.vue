<template>
  <div class="informasi-page">
    <!-- Sidebar Component (sudah ada) -->
    <Sidebar />

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Navbar Component -->
      <Navbar pageTitle="Informasi" />

      <!-- Content Wrapper -->
      <div class="content-wrapper">
        <!-- Page Header -->
        <div class="page-header">
          <h2 class="page-title">Daftar Informasi</h2>
          <button class="btn-add" @click="tambahInformasi">
            + Tambah Informasi
          </button>
        </div>

        <!-- Cards Grid -->
        <div class="cards-grid">
          <InformasiCard 
            v-for="info in informasiData" 
            :key="info.id"
            :info="info"
            @edit="editInformasi"
            @delete="deleteInformasi"
          />
        </div>

        <!-- Empty State -->
        <div v-if="informasiData.length === 0" class="empty-state">
          <i class="bi bi-info-circle"></i>
          <p>Belum ada data informasi</p>
          <button class="btn-add" @click="tambahInformasi">
            + Tambah Informasi Pertama
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Edit -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-detail" @click.stop>
        <button class="modal-close" @click="closeEditModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <h3 class="modal-title">Edit Informasi</h3>
        <div v-if="selectedInfo" class="form-content">
          <div class="form-group">
            <label>Judul</label>
            <input 
              type="text" 
              v-model="editForm.judul" 
              class="form-control"
              placeholder="Masukkan judul informasi"
            />
          </div>

          <div class="form-group">
            <label>Deskripsi</label>
            <textarea 
              v-model="editForm.deskripsi" 
              class="form-control"
              rows="5"
              placeholder="Masukkan deskripsi informasi"
            ></textarea>
          </div>

          <div class="form-group">
            <label>URL Gambar</label>
            <input 
              type="text" 
              v-model="editForm.gambar" 
              class="form-control"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div class="form-actions">
            <button class="btn-cancel" @click="closeEditModal">
              Batal
            </button>
            <button class="btn-save" @click="saveInformasi">
              <i class="bi bi-check-circle me-2"></i>
              Simpan
            </button>
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

// Import komponen baru
import InformasiCard from '../components/InformasiCard.vue';

export default {
  name: 'InformasiView',
  components: {
    Sidebar,
    Navbar,
    InformasiCard
  },
  data() {
    return {
      showEditModal: false,
      selectedInfo: null,
      editForm: {
        judul: '',
        deskripsi: '',
        gambar: ''
      },
      informasiData: [
        {
          id: 1,
          judul: 'Peraturan',
          deskripsi: 'Persiapan Fisik dan Mental: Pastikan kondisi fisik Anda prima sebelum mendaki. Lakukan latihan rutin seperti jogging, bersepeda, atau hiking ringan untuk meningkatkan stamina. Selain itu, persiapkan mental Anda untuk menghadapi tantangan selama pendakian.',
          gambar: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400'
        },
        {
          id: 2,
          judul: 'Tips',
          deskripsi: 'Persiapan Fisik dan Mental: Pastikan kondisi fisik Anda prima sebelum mendaki. Lakukan latihan rutin seperti jogging, bersepeda, atau hiking ringan untuk meningkatkan stamina.',
          gambar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
        },
        {
          id: 3,
          judul: 'Umum',
          deskripsi: 'Persiapan Fisik dan Mental: Pastikan kondisi fisik Anda prima sebelum mendaki. Lakukan latihan rutin seperti jogging, bersepeda, atau hiking ringan untuk meningkatkan stamina.',
          gambar: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400'
        },
        {
          id: 4,
          judul: 'Keselamatan',
          deskripsi: 'Keselamatan adalah prioritas utama dalam setiap pendakian. Selalu patuhi instruksi dari pemandu, jangan memaksakan diri jika kondisi tidak memungkinkan, dan selalu bawa perlengkapan P3K.',
          gambar: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400'
        },
        {
          id: 5,
          judul: 'Perlengkapan',
          deskripsi: 'Bawa perlengkapan yang sesuai dengan durasi dan kondisi medan. Carrier, sleeping bag, tenda, pakaian hangat, sepatu tracking, dan peralatan masak adalah beberapa item penting yang harus dibawa.',
          gambar: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400'
        },
        {
          id: 6,
          judul: 'Etika Pendaki',
          deskripsi: 'Jaga kebersihan gunung dengan tidak membuang sampah sembarangan. Hormati budaya lokal dan sesama pendaki. Leave no trace adalah prinsip yang harus dipegang oleh setiap pendaki.',
          gambar: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400'
        }
      ]
    }
  },
  methods: {
    editInformasi(info) {
      this.selectedInfo = info;
      this.editForm = {
        judul: info.judul,
        deskripsi: info.deskripsi,
        gambar: info.gambar
      };
      this.showEditModal = true;
    },
    deleteInformasi(id) {
      if (confirm('Apakah Anda yakin ingin menghapus informasi ini?')) {
        this.informasiData = this.informasiData.filter(info => info.id !== id);
        // Bisa tambahkan notifikasi sukses di sini
        alert('Informasi berhasil dihapus!');
      }
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedInfo = null;
      this.editForm = {
        judul: '',
        deskripsi: '',
        gambar: ''
      };
    },
    saveInformasi() {
      if (this.selectedInfo) {
        // Update data
        const index = this.informasiData.findIndex(info => info.id === this.selectedInfo.id);
        if (index !== -1) {
          this.informasiData[index] = {
            ...this.informasiData[index],
            ...this.editForm
          };
        }
        alert('Informasi berhasil diperbarui!');
        this.closeEditModal();
      }
    },
    tambahInformasi() {
      // Redirect ke form tambah informasi atau buka modal
      // this.$router.push('/informasi/tambah');
      alert('Fitur tambah informasi akan segera hadir!');
    }
  }
}
</script>

<style scoped>
.informasi-page {
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

/* Cards Grid Layout */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-state i {
  font-size: 4rem;
  color: #999;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
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

.form-content {
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
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-group .form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.form-group .form-control:focus {
  outline: none;
  border-color: #1a7a7a;
}

.form-group textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cancel {
  background-color: #6b7280;
  color: white;
}

.btn-cancel:hover {
  background-color: #4b5563;
}

.btn-save {
  background-color: #1a7a7a;
  color: white;
}

.btn-save:hover {
  background-color: #145f5f;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 200px;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
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