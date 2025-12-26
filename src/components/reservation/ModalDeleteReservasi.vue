<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="confirm-icon">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      
      <h3 class="modal-title">Hapus Reservasi</h3>
      <p class="confirm-text">Apakah Anda yakin menghapus reservasi ini?</p>

      <div class="modal-actions">
        <button type="button" class="btn-cancel" @click="closeModal" :disabled="isDeleting">
          Batal
        </button>
        <button type="button" class="btn-delete" @click="handleDelete" :disabled="isDeleting">
          {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalDeleteReservasi',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    reservationId: {
      type: [Number, String],
      default: null
    }
  },
  emits: ['close', 'confirm'],
  data() {
    return {
      isDeleting: false
    }
  },
  methods: {
    async handleDelete() {
      this.isDeleting = true
      try {
        this.$emit('confirm', this.reservationId)
      } finally {
        this.isDeleting = false
      }
    },
    closeModal() {
      this.$emit('close')
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
  max-width: 450px;
  width: 100%;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.confirm-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background-color: #fff3cd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-icon i {
  font-size: 2.5rem;
  color: #ff9800;
}

.modal-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.confirm-text {
  color: #666;
  font-size: 1rem;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-cancel,
.btn-delete {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #666;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-2px);
}

.btn-cancel:disabled,
.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95vw;
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-delete {
    width: 100%;
  }
}
</style>
