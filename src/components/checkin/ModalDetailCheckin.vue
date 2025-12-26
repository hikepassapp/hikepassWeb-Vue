<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">
        <i class="bi bi-x-lg"></i>
      </button>
      
      <h3 class="modal-title">Detail Check-in</h3>
      
      <div v-if="checkin && checkin.reservation" class="detail-content">
        <div class="detail-info">
          <div class="info-item">
            <strong>Gunung:</strong>
            <span>{{ checkin.reservation.mountain?.name || '-' }}</span>
          </div>
          
          <div class="info-item">
            <strong>Tanggal Check-in:</strong>
            <span>{{ formatDate(checkin.checkin_date) }}</span>
          </div>
          
          <div class="info-item">
            <strong>Nama Lengkap:</strong>
            <span>{{ checkin.reservation.name }}</span>
          </div>
          
          <div class="info-item">
            <strong>NIK:</strong>
            <span>{{ checkin.reservation.nik }}</span>
          </div>
          
          <div class="info-item">
            <strong>Jenis Kelamin:</strong>
            <span>{{ formatGender(checkin.reservation.gender) }}</span>
          </div>
          
          <div class="info-item">
            <strong>No. Telepon:</strong>
            <span>{{ checkin.reservation.phone_number }}</span>
          </div>
          
          <div class="info-item">
            <strong>Alamat:</strong>
            <span>{{ checkin.reservation.address }}</span>
          </div>
          
          <div class="info-item">
            <strong>Kewarganegaraan:</strong>
            <span>{{ checkin.reservation.citizen }}</span>
          </div>
          
          <div class="info-item" v-if="checkin.reservation.id_card">
            <strong>Foto KTP:</strong>
            <img :src="checkin.reservation.id_card" :alt="checkin.reservation.name" class="id-card-image" />
          </div>
          
          <div class="info-item">
            <strong>Barang Bawaan Check-in:</strong>
            <span>{{ checkin.item_list || '-' }}</span>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="closeModal">
            Batal
          </button>
          <button type="button" class="btn-checkout" @click="openCheckoutModal">
            Check-out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalDetailCheckin',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    checkin: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'checkout'],
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    },
    formatGender(gender) {
      return gender === 'male' ? 'Laki-laki' : (gender === 'female' ? 'Perempuan' : '-')
    },
    closeModal() {
      this.$emit('close')
    },
    openCheckoutModal() {
      this.$emit('checkout', this.checkin)
      this.closeModal()
    }
  }
}
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

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  color: #333;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1.5rem 0;
  padding-right: 2rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item strong {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.info-item span {
  color: #666;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.id-card-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-checkout {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-checkout {
  background-color: #1a7a7a;
  color: white;
}

.btn-checkout:hover {
  background-color: #145f5f;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95vw;
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-checkout {
    width: 100%;
  }
}
</style>
