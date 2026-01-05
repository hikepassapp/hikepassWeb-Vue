<template>
  <div class="table-container">
    <div class="table-responsive">
      <table class="table custom-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Gambar</th>
            <th>Judul</th>
            <th>Jenis</th>
            <th>Tanggal Terbit</th>
            <th>Penulis</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(berita, index) in beritaList" :key="berita.id">
            <td>{{ startIndex + index + 1 }}</td>
            <td>
              <div class="image-cell">
                <img
                  :src="berita.gambar"
                  :alt="berita.judul"
                  class="berita-image"
                  @click="$emit('view-image', berita.gambar)"
                  @error="handleImageError"
                />
              </div>
            </td>
            <td>
              <div class="title-cell">
                {{ berita.judul }}
              </div>
            </td>
            <td>
              <span class="badge-jenis" :class="jenisClass(berita.jenis)">
                {{ berita.jenis }}
              </span>
            </td>
            <td>{{ formatDate(berita.tanggalTerbit) }}</td>
            <td>{{ berita.penulis }}</td>
            <td>
              <div class="action-buttons">
                <button
                  class="btn-action btn-detail"
                  @click="$emit('view-detail', berita)"
                  title="Lihat Detail"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                  class="btn-action btn-delete"
                  @click="$emit('delete-berita', berita.id, berita.judul)"
                  title="Hapus"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="beritaList.length === 0">
            <td colspan="7" class="text-center empty-state">
              <i class="bi bi-inbox"></i>
              <p>Belum ada data berita/event</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/formatters";

export default {
  name: "TableBerita",
  props: {
    beritaList: {
      type: Array,
      default: () => [],
    },
    startIndex: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleImageError(e) {
      e.target.src = "https://via.placeholder.com/100x80?text=No+Image";
    },
    formatDate,
    jenisClass(jenis) {
      return jenis.toLowerCase() === "event" ? "badge-event" : "badge-berita";
    },
  },
  emits: ["view-detail", "delete-berita", "view-image"],
};
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

.berita-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.berita-image:hover {
  transform: scale(1.05);
}

.title-cell {
  max-width: 300px;
  line-height: 1.5;
}

.badge-jenis {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
  text-transform: capitalize;
}

.badge-berita {
  background-color: #3b82f6;
  color: white;
}

.badge-event {
  background-color: #ffc107;
  color: #000;
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

@media (max-width: 1200px) {
  .title-cell {
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

  .title-cell {
    max-width: 150px;
  }

  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>
