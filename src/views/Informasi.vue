<template>
  <div class="informasi-page">
    <!-- Sidebar Component -->
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
          <button class="btn-add" @click="openTambahModal">
            + Tambah Informasi
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat data...</p>
        </div>

        <!-- Cards Grid -->
        <div v-else-if="informasiData.length > 0" class="cards-grid">
          <InformasiCard 
            v-for="info in informasiData" 
            :key="info.id"
            :info="info"
            @edit="editInformasi"
            @delete="confirmDelete"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <i class="bi bi-info-circle"></i>
          <p>Belum ada data informasi</p>
          <button class="btn-add" @click="openTambahModal">
            + Tambah Informasi Pertama
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-detail" @click.stop>
        <button class="modal-close" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <h3 class="modal-title">{{ isEditMode ? 'Edit Informasi' : 'Tambah Informasi' }}</h3>
        
        <form @submit.prevent="saveInformasi" class="form-content">
          <div class="form-group">
            <label>Judul <span class="required">*</span></label>
            <input 
              type="text" 
              v-model="form.judul" 
              class="form-control"
              placeholder="Masukkan judul informasi"
              required
            />
          </div>

          <div class="form-group">
            <label>Deskripsi <span class="required">*</span></label>
            <textarea 
              v-model="form.deskripsi" 
              class="form-control"
              rows="5"
              placeholder="Masukkan deskripsi informasi"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>Gambar <span class="required">*</span></label>
            <input 
              type="file" 
              @change="handleFileChange"
              class="form-control"
              accept="image/*"
              :required="!isEditMode"
            />
            <small class="form-text">Format: JPG, PNG, JPEG (Max: 2MB)</small>
            
            <!-- Preview Image -->
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal">
              Batal
            </button>
            <button type="submit" class="btn-save" :disabled="saving">
              <i class="bi bi-check-circle me-2"></i>
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-confirm" @click.stop>
        <div class="modal-icon-danger">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h3 class="modal-title">Konfirmasi Hapus</h3>
        <p class="modal-message">Apakah Anda yakin ingin menghapus informasi ini?</p>
        <div class="form-actions">
          <button class="btn-cancel" @click="showDeleteModal = false">
            Batal
          </button>
          <button class="btn-delete-confirm" @click="deleteInformasi" :disabled="deleting">
            {{ deleting ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
import InformasiCard from '../components/InformasiCard.vue';

const API_URL = 'http://localhost:8000/api/informasi';

export default {
  name: 'InformasiView',
  components: {
    Sidebar,
    Navbar,
    InformasiCard
  },
  data() {
    return {
      informasiData: [],
      loading: false,
      saving: false,
      deleting: false,
      showModal: false,
      showDeleteModal: false,
      isEditMode: false,
      selectedInfo: null,
      deleteId: null,
      imagePreview: null,
      form: {
        judul: '',
        deskripsi: '',
        gambar: null
      }
    }
  },
  mounted() {
    this.fetchInformasi();
  },
  methods: {
    async fetchInformasi() {
      this.loading = true;
      try {
        const response = await axios.get(API_URL);
        this.informasiData = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        this.showNotification('Gagal memuat data', 'error');
      } finally {
        this.loading = false;
      }
    },

    openTambahModal() {
      this.isEditMode = false;
      this.resetForm();
      this.showModal = true;
    },

    editInformasi(info) {
      this.isEditMode = true;
      this.selectedInfo = info;
      this.form = {
        judul: info.judul,
        deskripsi: info.deskripsi,
        gambar: null
      };
      
      // Set preview image for edit mode
      if (info.gambar) {
        if (info.gambar.startsWith('http')) {
          this.imagePreview = info.gambar;
        } else {
          this.imagePreview = `http://localhost:8000/storage/${info.gambar}`;
        }
      }
      
      this.showModal = true;
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
          this.showNotification('Ukuran file maksimal 2MB', 'error');
          event.target.value = '';
          return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          this.showNotification('Format file harus JPG, JPEG, atau PNG', 'error');
          event.target.value = '';
          return;
        }

        this.form.gambar = file;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async saveInformasi() {
      this.saving = true;
      
      try {
        const formData = new FormData();
        formData.append('judul', this.form.judul);
        formData.append('deskripsi', this.form.deskripsi);
        
        if (this.form.gambar) {
          formData.append('gambar', this.form.gambar);
        }

        let response;
        if (this.isEditMode) {
          // Update
          formData.append('_method', 'PUT');
          response = await axios.post(`${API_URL}/${this.selectedInfo.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          // Create
          response = await axios.post(API_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        this.showNotification(
          this.isEditMode ? 'Informasi berhasil diperbarui!' : 'Informasi berhasil ditambahkan!',
          'success'
        );
        
        this.closeModal();
        this.fetchInformasi();
      } catch (error) {
        console.error('Error saving data:', error);
        this.showNotification(
          error.response?.data?.message || 'Gagal menyimpan data',
          'error'
        );
      } finally {
        this.saving = false;
      }
    },

    confirmDelete(id) {
      this.deleteId = id;
      this.showDeleteModal = true;
    },

    async deleteInformasi() {
      this.deleting = true;
      
      try {
        await axios.delete(`${API_URL}/${this.deleteId}`);
        this.showNotification('Informasi berhasil dihapus!', 'success');
        this.showDeleteModal = false;
        this.deleteId = null;
        this.fetchInformasi();
      } catch (error) {
        console.error('Error deleting data:', error);
        this.showNotification('Gagal menghapus data', 'error');
      } finally {
        this.deleting = false;
      }
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    resetForm() {
      this.form = {
        judul: '',
        deskripsi: '',
        gambar: null
      };
      this.imagePreview = null;
      this.selectedInfo = null;
    },

    showNotification(message, type = 'success') {
      // Simple alert, you can replace with toast notification
      alert(message);
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1a7a7a;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.modal-confirm {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.modal-icon-danger {
  width: 80px;
  height: 80px;
  background-color: #fee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.modal-icon-danger i {
  font-size: 2.5rem;
  color: #ef4444;
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

.modal-message {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1rem;
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

.required {
  color: #ef4444;
}

.form-control {
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

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.form-text {
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.25rem;
}

.image-preview {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel,
.btn-save,
.btn-delete-confirm {
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

.btn-save:hover:not(:disabled) {
  background-color: #145f5f;
}

.btn-delete-confirm {
  background-color: #ef4444;
  color: white;
}

.btn-delete-confirm:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn-save:disabled,
.btn-delete-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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