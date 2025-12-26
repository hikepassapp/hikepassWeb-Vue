<template>
  <div class="table-container">
    <div class="table-responsive">
      <table class="table custom-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Gambar</th>
            <th>Nama Pelapor</th>
            <th>Tanggal Kejadian</th>
            <th>Lokasi Kejadian</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(laporan, index) in reports" :key="laporan.id">
            <td>{{ index + 1 }}</td>
            <td>
              <div class="image-cell">
                <img 
                  v-if="laporan.foto_bukti"
                  :src="getImageUrl(laporan.foto_bukti)" 
                  :alt="laporan.nama_pelapor"
                  class="report-image"
                  @click="viewImage(laporan.foto_bukti)"
                />
                <div v-else class="no-image">
                  <i class="bi bi-image"></i>
                </div>
              </div>
            </td>
            <td>{{ laporan.nama_pelapor }}</td>
            <td>{{ formatDate(laporan.tanggal_kejadian) }}</td>
            <td>{{ laporan.lokasi_kejadian }}</td>
            <td>
              <div class="description-cell">
                {{ truncateText(laporan.deskripsi_kejadian, 50) }}
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button 
                  class="btn-action btn-detail"
                  @click="viewDetail(laporan)"
                  title="Lihat Detail"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button 
                  class="btn-action btn-edit"
                  @click="editReport(laporan)"
                  title="Edit"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  class="btn-action btn-delete"
                  @click="deleteReport(laporan.id)"
                  title="Hapus"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          
          <!-- Empty State -->
          <tr v-if="reports.length === 0">
            <td colspan="7" class="text-center empty-state">
              <i class="bi bi-inbox"></i>
              <p>Belum ada data laporan</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal Detail -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detail Laporan</h3>
          <button class="btn-close" @click="closeDetailModal">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="selectedLaporan">
            <div class="detail-item">
              <strong>Nama Pelapor:</strong>
              <p>{{ selectedLaporan.nama_pelapor }}</p>
            </div>
            <div class="detail-item">
              <strong>Tanggal Kejadian:</strong>
              <p>{{ formatDate(selectedLaporan.tanggal_kejadian) }}</p>
            </div>
            <div class="detail-item">
              <strong>Lokasi Kejadian:</strong>
              <p>{{ selectedLaporan.lokasi_kejadian }}</p>
            </div>
            <div class="detail-item">
              <strong>Deskripsi Kejadian:</strong>
              <p>{{ selectedLaporan.deskripsi_kejadian }}</p>
            </div>
            <div class="detail-item" v-if="selectedLaporan.foto_bukti">
              <strong>Foto Bukti:</strong>
              <img :src="getImageUrl(selectedLaporan.foto_bukti)" alt="Bukti" class="detail-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal Image -->
    <div v-if="showImageModal" class="modal-overlay" @click="closeImageModal">
      <div class="modal-image-content" @click.stop>
        <button class="btn-close" @click="closeImageModal">
          <i class="bi bi-x"></i>
        </button>
        <img :src="getImageUrl(selectedImage)" alt="Bukti Foto" />
      </div>
    </div>
  </div>
</template>

<script>
const STORAGE_URL = 'http://localhost:8000/storage'

export default {
  name: 'TableLaporan',
  props: {
    reports: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showDetailModal: false,
      showImageModal: false,
      selectedLaporan: null,
      selectedImage: null
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    },
    
    truncateText(text, maxLength) {
      if (!text) return '-'
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    },
    
    getImageUrl(path) {
      if (!path) return ''
      return `${STORAGE_URL}/${path}`
    },
    
    viewDetail(laporan) {
      this.selectedLaporan = laporan
      this.showDetailModal = true
    },
    
    closeDetailModal() {
      this.showDetailModal = false
      this.selectedLaporan = null
    },
    
    viewImage(imagePath) {
      this.selectedImage = imagePath
      this.showImageModal = true
    },
    
    closeImageModal() {
      this.showImageModal = false
      this.selectedImage = null
    },
    
    editReport(laporan) {
      this.$emit('edit-report', laporan)
    },
    
    deleteReport(id) {
      if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
        this.$emit('delete-report', id)
      }
    }
  },
  emits: ['edit-report', 'delete-report']
}
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.table-responsive {
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  margin-bottom: 0;
  border-collapse: collapse;
}

.custom-table thead {
  background-color: #e8e8e8;
}

.custom-table thead th {
  padding: 1rem;
  font-weight: 600;
  color: #333;
  text-align: left;
  border-bottom: 2px solid #d0d0d0;
  white-space: nowrap;
}

.custom-table tbody td {
  padding: 1rem;
  vertical-align: middle;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

.custom-table tbody tr:last-child td {
  border-bottom: none;
}

.custom-table tbody tr:hover {
  background-color: #f8f9fa;
}

.image-cell {
  width: 100px;
  height: 80px;
}

.report-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.report-image:hover {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.5rem;
}

.description-cell {
  max-width: 300px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-detail {
  background-color: #3b82f6;
  color: white;
}

.btn-detail:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.btn-edit {
  background-color: #10b981;
  color: white;
}

.btn-edit:hover {
  background-color: #059669;
  transform: translateY(-2px);
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
}

.empty-state {
  padding: 3rem 1rem !important;
  color: #999;
}

.empty-state i {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0.25rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.detail-item {
  margin-bottom: 1.5rem;
}

.detail-item strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.95rem;
}

.detail-item p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.detail-image {
  max-width: 100%;
  border-radius: 12px;
  margin-top: 0.5rem;
}

.modal-image-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-image-content img {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 12px;
}

.modal-image-content .btn-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: white;
  color: #333;
}

/* Responsive */
@media (max-width: 1200px) {
  .description-cell {
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .custom-table thead th,
  .custom-table tbody td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .image-cell {
    width: 70px;
    height: 60px;
  }
  
  .description-cell {
    max-width: 150px;
  }
  
  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
}
</style>