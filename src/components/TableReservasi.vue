<template>
  <div class="table-container">
    <div class="table-responsive">
      <table class="table custom-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Kode Reservasi</th>
            <th>Nama</th>
            <th>NIK</th>
            <th>Kontak</th>
            <th>Jumlah Pendaki</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reservasi, index) in reservations" :key="reservasi.id">
            <td>{{ index + 1 }}</td>
            <td>{{ reservasi.kodeReservasi }}</td>
            <td>{{ reservasi.nama }}</td>
            <td>{{ reservasi.nik }}</td>
            <td>{{ reservasi.kontak }}</td>
            <td>{{ reservasi.jumlahPendaki }}</td>
            <td>
              <div class="action-buttons">
                <button 
                  class="btn-action btn-detail"
                  @click="$emit('view-detail', reservasi)"
                  title="Lihat Detail"
                >
                  <i class="bi bi-arrow-right"></i>
                </button>
                <button 
                  class="btn-action btn-delete"
                  @click="$emit('delete-reservasi', reservasi.id)"
                  title="Hapus"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          
          <!-- Empty State -->
          <tr v-if="reservations.length === 0">
            <td colspan="7" class="text-center empty-state">
              <i class="bi bi-inbox"></i>
              <p>Belum ada data reservasi</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableReservasi',
  props: {
    reservations: {
      type: Array,
      required: true
    }
  },
  emits: ['view-detail', 'delete-reservasi']
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
@media (max-width: 768px) {
  .custom-table thead th,
  .custom-table tbody td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>