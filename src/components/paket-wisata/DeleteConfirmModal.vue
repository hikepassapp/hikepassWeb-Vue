<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click="$emit('cancel')">
      <div class="modal-content" @click.stop>
        <div class="modal-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        
        <h3 class="modal-title">Konfirmasi Hapus</h3>
        
        <p class="modal-message">
          Apakah Anda yakin ingin menghapus 
          <strong>"{{ itemName }}"</strong>?
        </p>
        
        <p class="modal-warning">
          <i class="bi bi-info-circle"></i>
          Tindakan ini tidak dapat dibatalkan
        </p>
        
        <div class="modal-actions">
          <button @click="$emit('cancel')" class="btn-cancel">
            <i class="bi bi-x-circle"></i>
            Batal
          </button>
          <button @click="$emit('confirm')" class="btn-confirm">
            <i class="bi bi-trash"></i>
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DeleteConfirmModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    itemName: {
      type: String,
      default: 'item ini'
    }
  },
  emits: ['confirm', 'cancel']
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-icon {
  width: 80px;
  height: 80px;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.modal-icon i {
  font-size: 2.5rem;
  color: #ef4444;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.modal-message {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.modal-message strong {
  color: #333;
  font-weight: 600;
}

.modal-warning {
  background: #fef3c7;
  color: #92400e;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.modal-warning i {
  font-size: 1.1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #4b5563;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-confirm {
  background-color: #ef4444;
  color: white;
}

.btn-confirm:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* Modal Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 576px) {
  .modal-content {
    padding: 1.5rem;
  }

  .modal-icon {
    width: 60px;
    height: 60px;
  }

  .modal-icon i {
    font-size: 2rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>