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
                  :src="laporan.image" 
                  :alt="laporan.namaPelapor"
                  class="report-image"
                  @click="$emit('view-image', laporan.image)"
                />
              </div>
            </td>
            <td>{{ laporan.namaPelapor }}</td>
            <td>{{ formatDate(laporan.tanggalKejadian) }}</td>
            <td>{{ laporan.lokasiKejadian }}</td>
            <td>
              <div class="description-cell">
                {{ truncateText(laporan.deskripsi, 50) }}
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button 
                  class="btn-action btn-detail"
                  @click="$emit('view-detail', laporan)"
                  title="Lihat Detail"
                >
                  <i class="bi bi-arrow-right"></i>
                </button>
                <button 
                  class="btn-action btn-delete"
                  @click="$emit('delete-report', laporan.id)"
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
  </div>
</template>

<script>
export default {
  name: 'TableLaporan',
  props: {
    reports: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    truncateText(text, maxLength) {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    }
  },
  emits: ['view-detail', 'delete-report', 'view-image']
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
}
</style>