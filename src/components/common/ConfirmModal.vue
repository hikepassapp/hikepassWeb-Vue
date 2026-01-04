<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="confirm-icon">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      
      <h3 class="modal-title">{{ title }}</h3>
      <p class="confirm-text">{{ message }}</p>

      <div class="modal-actions">
        <button 
          type="button" 
          class="btn-cancel" 
          @click="closeModal" 
          :disabled="isProcessing"
        >
          Batal
        </button>
        <button 
          type="button" 
          class="btn-confirm" 
          @click="handleConfirm" 
          :disabled="isProcessing"
          :class="confirmButtonClass"
        >
          {{ isProcessing ? processingText : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Konfirmasi'
    },
    message: {
      type: String,
      default: 'Apakah Anda yakin?'
    },
    confirmText: {
      type: String,
      default: 'Hapus'
    },
    processingText: {
      type: String,
      default: 'Memproses...'
    },
    confirmButtonClass: {
      type: String,
      default: 'btn-delete'
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'confirm'],
  methods: {
    handleConfirm() {
      this.$emit('confirm')
    },
    closeModal() {
      if (!this.isProcessing) {
        this.$emit('close')
      }
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1rem 0;
}

.confirm-text {
  font-size: 1rem;
  color: #666;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #333;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.btn-confirm {
  color: white;
}

.btn-delete {
  background-color: #dc3545;
}

.btn-delete:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

.btn-success {
  background-color: #28a745;
}

.btn-success:hover:not(:disabled) {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.btn-cancel:disabled,
.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
</style>
