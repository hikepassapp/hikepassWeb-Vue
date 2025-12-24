<template>
  <div class="data-gunung-page">
    <Sidebar />
    <div class="main-content">
      <Navbar pageTitle="Gunung" />
      <div class="content-wrapper">
        <div class="header-section">
          <h2 class="section-title">Data Gunung</h2>
          <button class="btn-add" @click="addMountain">
            + Tambah Data
          </button>
        </div>
        <div class="filter-section">
          <div class="show-entries">
            <span>Show</span>
            <select v-model="itemsPerPage" @change="updateItemsPerPage" class="form-select">
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="16">16</option>
            </select>
            <span>Data</span>
          </div>
          <div class="search-box">
            <span>Search:</span>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control"
              placeholder="Cari gunung..."
            />
          </div>
        </div>
        <div class="mountains-grid">
          <MountainCard 
            v-for="mountain in paginatedMountains" 
            :key="mountain.id"
            :mountain="mountain"
            @edit="editMountain"
            @delete="deleteMountain"
          />
        </div>
        <Pagination 
          :currentPage="currentPage"
          :totalPages="totalPages"
          @page-change="changePage"
        />
      </div>
    </div>

    <!-- Modal for Edit -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-detail" @click.stop>
        <button class="modal-close" @click="closeEditModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <h3 class="modal-title">Edit Data Gunung</h3>
        <div v-if="selectedMountain" class="form-content">
          <div class="form-group">
            <label>Nama Gunung</label>
            <input 
              type="text" 
              v-model="editForm.name" 
              class="form-control"
              placeholder="Masukkan nama gunung"
            />
          </div>
          <div class="form-group">
            <label>Pengelola</label>
            <select 
              v-model="editForm.manager" 
              class="form-control"
            >
              <option value="">Pilih Pengelola</option>
              <option value="LMDH">LMDH</option>
              <option value="Perhutani">Perhutani</option>
              <option value="Taman Nasional">Taman Nasional</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select 
              v-model="editForm.status" 
              class="form-control"
            >
              <option value="">Pilih Status</option>
              <option value="Buka">Buka</option>
              <option value="Tutup">Tutup</option>
            </select>
          </div>
          <div>
            <label>Kuota</label>
            <input 
              type="number" 
              v-model="editForm.quota" 
              class="form-control"
              placeholder="Masukkan kuota"
            />
          </div>
          <div class="form-group">
            <label>Lokasi</label>
            <input 
              type="text" 
              v-model="editForm.location" 
              class="form-control"
              placeholder="Masukkan lokasi"
            />
          </div>
          <div class="form-group">
            <label>Kontak</label>
            <input 
              type="text" 
              v-model="editForm.contact" 
              class="form-control"
              placeholder="Masukkan kontak, misalnya email atau nomor telepon. Jika nomor telepon, sertakan kode negara seperti +62"
            />
          </div>
          <div class="form-group">
            <label>Harga</label>
            <input 
              type="number" 
              v-model="editForm.price" 
              class="form-control"
              placeholder="Masukkan harga"
            />
          </div>
          <div class="form-group">
            <label>Durasi</label>
            <input 
              type="text" 
              v-model="editForm.duration" 
              class="form-control"
              placeholder="Masukkan durasi"
            />
          </div>
          <div class="form-group">
            <label>Pos</label>
            <input 
              type="text" 
              v-model="editForm.pos" 
              class="form-control"
              placeholder="Masukkan pos"
            />
          </div>
          <div class="form-group">
            <label>URL Gambar</label>
            <input 
              type="text" 
              v-model="editForm.image" 
              class="form-control"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div class="form-actions">
            <button class="btn-cancel" @click="closeEditModal">
              Batal
            </button>
            <button class="btn-save" @click="saveMountain">
              <i class="bi bi-check-circle me-2"></i>
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- End Modal -->

    <!-- Modal for Add -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal-detail" @click.stop>
        <button class="modal-close" @click="closeAddModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <h3 class="modal-title">Tambah Data Gunung</h3>
        <div class="form-content">
          <div class="form-group">
            <label>Nama Gunung</label>
            <input 
              type="text" 
              v-model="editForm.name" 
              class="form-control"
              placeholder="Masukkan nama gunung"
            />
          </div>
          <div class="form-group">
            <label>Pengelola</label>
            <select 
              v-model="editForm.manager" 
              class="form-control"
            >
              <option value="">Pilih Pengelola</option>
              <option value="LMDH">LMDH</option>
              <option value="Perhutani">Perhutani</option>
              <option value="Taman Nasional">Taman Nasional</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select 
              v-model="editForm.status" 
              class="form-control"
            >
              <option value="">Pilih Status</option>
              <option value="Buka">Buka</option>
              <option value="Tutup">Tutup</option>
            </select>
          </div>
          <div class="form-group">
            <label>Kuota</label>
            <input 
              type="number" 
              v-model="editForm.quota" 
              class="form-control"
              placeholder="Masukkan kuota"
            />
          </div>
          <div class="form-group">
            <label>Lokasi</label>
            <input 
              type="text" 
              v-model="editForm.location" 
              class="form-control"
              placeholder="Masukkan lokasi"
            />
          </div>
          <div class="form-group">
            <label>Kontak</label>
            <input 
              type="text" 
              v-model="editForm.contact" 
              class="form-control"
              placeholder="email atau nomor telepon. Jika nomor telepon diawali +62"
            />
          </div>
          <div class="form-group">
            <label>Harga</label>
            <input 
              type="number" 
              v-model="editForm.price" 
              class="form-control"
              placeholder="Masukkan harga, angka saja"
            />
          </div>
          <div class="form-group">
            <label>Durasi</label>
            <input 
              type="text" 
              v-model="editForm.duration" 
              class="form-control"
              placeholder="Dengan satuan jam atau menit"
            />
          </div>
          <div class="form-group">
            <label>Pos</label>
            <input 
              type="text" 
              v-model="editForm.pos" 
              class="form-control"
              placeholder="Masukkan pos/basecamp"
            />
          </div>
          <div class="form-group">
            <label>URL Gambar</label>
            <input 
              type="text" 
              v-model="editForm.image" 
              class="form-control"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div class="form-actions">
            <button class="btn-cancel" @click="closeAddModal">
              Batal
            </button>
            <button class="btn-save" @click="saveNewMountain">
              <i class="bi bi-check-circle me-2"></i>
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- End Add Modal -->

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-confirm" @click.stop>
        <div class="modal-icon-warning">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h3 class="modal-title">Konfirmasi Hapus</h3>
        <p class="modal-message">Apakah Anda yakin ingin menghapus data gunung ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div class="form-actions">
          <button class="btn-cancel" @click="cancelDelete">
            Batal
          </button>
          <button class="btn-delete-confirm" @click="confirmDelete">
            <i class="bi bi-trash me-2"></i>
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Feedback Modal -->
    <div v-if="showFeedbackModal" class="modal-overlay" @click="closeFeedbackModal">
      <div class="modal-feedback" @click.stop>
        <div class="modal-icon-success">
          <i class="bi bi-check-circle"></i>
        </div>
        <h3 class="modal-title">Berhasil!</h3>
        <p class="modal-message">{{ feedbackMessage }}</p>
        <button class="btn-ok" @click="closeFeedbackModal">
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import MountainCard from '../components/MountainCard.vue'
import Pagination from '../components/Pagination.vue'
import axios from 'axios'

export default {
  name: 'DataGunungView',
  components: {
    Sidebar,
    Navbar,
    MountainCard,
    Pagination
  },
  data() {
    return {
      searchQuery: '',
      itemsPerPage: 8,
      currentPage: 1,
      showEditModal: false,
      showAddModal: false,
      showDeleteModal: false,
      showFeedbackModal: false,
      feedbackMessage: '',
      mountainToDelete: null,
      selectedMountain: null,
      editForm: {
        name: '',
        status:'',
        manager: '',
        quota:'',
        location: '',
        contact: '',
        price: '',
        duration: '',
        pos: '',
        image: ''
      },
      API_URL: 'http://127.0.0.1:8000/api/mountains',
      mountains: []
    }
  },
  computed: {
    filteredMountains() {
      if (!this.searchQuery) {
        return this.mountains;
      }
      return this.mountains.filter(mountain => 
        mountain.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        mountain.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredMountains.length / this.itemsPerPage);
    },
    paginatedMountains() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredMountains.slice(start, end);
    }
  },
  mounted() {
    this.fetchMountains()
  },
  methods: {
    async fetchMountains() {
      try {
        const response = await axios.get(this.API_URL)
        this.mountains = response.data
      } catch (error) {
        console.error('Error fetching mountains:', error)
        this.feedbackMessage = 'Gagal memuat data gunung'
        this.showFeedbackModal = true
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    updateItemsPerPage() {
      this.currentPage = 1;
    },
    addMountain() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
      this.editForm = {
        name: '',
        status:'',
        manager: '',
        quota: '',
        location: '',
        contact: '',
        price: '',
        duration: '',
        pos: '',
        image: ''
      };
    },
    async saveNewMountain() {
      try {
        await axios.post(this.API_URL, this.editForm)
        await this.fetchMountains()
        this.closeAddModal()
        this.feedbackMessage = 'Data gunung berhasil ditambahkan!'
        this.showFeedbackModal = true
      } catch (error) {
        console.error('Error adding mountain:', error)
        this.feedbackMessage = 'Gagal menambahkan data gunung'
        this.showFeedbackModal = true
      }
    },
    editMountain(mountain) {
      this.selectedMountain = mountain;
      this.editForm = { ...mountain };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedMountain = null;
      this.editForm = {
        name: '',
        status:'',
        manager: '',
        quota: '',
        location: '',
        price: '',
        duration: '',
        pos: '',
        image: ''
      };
    },
    async saveMountain() {
      if (this.selectedMountain) {
        try {
          await axios.put(`${this.API_URL}/${this.selectedMountain.id}`, this.editForm)
          await this.fetchMountains()
          this.closeEditModal()
          this.feedbackMessage = 'Data gunung berhasil diperbarui!'
          this.showFeedbackModal = true
        } catch (error) {
          console.error('Error updating mountain:', error)
          this.feedbackMessage = 'Gagal memperbarui data gunung'
          this.showFeedbackModal = true
        }
      }
    },
    deleteMountain(mountain) {
      this.mountainToDelete = mountain;
      this.showDeleteModal = true;
    },
    async confirmDelete() {
      if (this.mountainToDelete) {
        try {
          await axios.delete(`${this.API_URL}/${this.mountainToDelete.id}`)
          await this.fetchMountains()
          this.showDeleteModal = false
          this.mountainToDelete = null
          this.feedbackMessage = 'Data gunung berhasil dihapus!'
          this.showFeedbackModal = true
        } catch (error) {
          console.error('Error deleting mountain:', error)
          this.feedbackMessage = 'Gagal menghapus data gunung'
          this.showFeedbackModal = true
          this.showDeleteModal = false
          this.mountainToDelete = null
        }
      }
    },
    cancelDelete() {
      this.showDeleteModal = false;
      this.mountainToDelete = null;
    },
    closeFeedbackModal() {
      this.showFeedbackModal = false;
      this.feedbackMessage = '';
    }
  }
}
</script>

<style scoped>
.data-gunung-page {
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
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
  margin-bottom: 2rem;
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
  width: 200px;
  padding: 0.4rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.mountains-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 1400px) {
  .mountains-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 200px;
  }
  
  .mountains-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .header-section {
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
  
  .mountains-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
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

/* Delete Confirmation Modal */
.modal-confirm,
.modal-feedback {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.modal-icon-warning,
.modal-icon-success {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.modal-icon-warning {
  background-color: #fef3c7;
  color: #f59e0b;
}

.modal-icon-success {
  background-color: #d1fae5;
  color: #10b981;
}

.modal-message {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

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
  background-color: #ef4444;
  color: white;
}

.btn-delete-confirm:hover {
  background-color: #dc2626;
}

.btn-ok {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #1a7a7a;
  color: white;
  font-size: 1rem;
}

.btn-ok:hover {
  background-color: #145f5f;
}

/* ...existing code... */
</style>