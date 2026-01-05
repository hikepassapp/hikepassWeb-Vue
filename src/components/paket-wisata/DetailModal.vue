<template>
  <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
    <div class="modal-detail" @click.stop>
      <button class="modal-close" @click="$emit('close')">
        <i class="bi bi-x-lg"></i>
      </button>
      <h3 class="modal-title">Detail Paket Wisata</h3>
      <div v-if="wisataData" class="detail-content">
        <img :src="wisataData.gambar" alt="Wisata" class="detail-image" />
        <div class="detail-info">
          <div class="info-item">
            <strong>Judul Paket:</strong>
            <span>{{ wisataData.judul }}</span>
          </div>
          <div class="info-item">
            <strong>Jenis:</strong>
            <span class="badge-jenis">{{ wisataData.jenis }}</span>
          </div>
          <div class="info-item">
            <strong>Penulis:</strong>
            <span>{{ wisataData.penulis }}</span>
          </div>
          <div class="info-item">
            <strong>Kontak:</strong>
            <span>{{ wisataData.kontak }}</span>
          </div>
          <div class="info-item">
            <strong>Tanggal Trip:</strong>
            <span>{{ formatDate(wisataData.tanggalTerbit) }}</span>
          </div>
          <div class="info-item">
            <strong>Titik Kumpul:</strong>
            <span>{{ wisataData.titikKumpul }}</span>
          </div>
          <div class="info-item">
            <strong>Waktu:</strong>
            <span>{{ wisataData.waktu }}</span>
          </div>
          <div class="info-item">
            <strong>Guide:</strong>
            <span>{{ wisataData.guide }}</span>
          </div>
          <div class="info-item">
            <strong>Harga:</strong>
            <span class="price">{{ formatRupiah(wisataData.harga) }}</span>
          </div>
          <div class="info-item">
            <strong>Deskripsi:</strong>
            <p>{{ wisataData.deskripsi }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatRupiah, formatDate } from "@/utils/formatters";

export default {
  name: "DetailModal",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    wisataData: {
      type: Object,
      default: null,
    },
  },
  emits: ["close"],
  methods: {
    formatRupiah,
    formatDate,
  },
};
</script>

<style scoped>
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

@media (max-width: 768px) {
  .modal-detail {
    padding: 1.5rem;
  }
}
</style>
