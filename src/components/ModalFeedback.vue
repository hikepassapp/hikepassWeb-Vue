<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click="close">
      <div class="modal-feedback" :class="`modal-${type}`" @click.stop>
        <div class="feedback-icon">
          <i v-if="type === 'success'" class="bi bi-check-circle-fill"></i>
          <i v-if="type === 'error'" class="bi bi-x-circle-fill"></i>
          <i v-if="type === 'warning'" class="bi bi-exclamation-triangle-fill"></i>
          <i v-if="type === 'info'" class="bi bi-info-circle-fill"></i>
        </div>
        <h3 class="feedback-title">{{ title }}</h3>
        <p class="feedback-message">{{ message }}</p>
        <button class="btn-close-feedback" @click="close">OK</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalFeedback',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'success', // success, error, warning, info
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        // Auto close setelah 3 detik untuk success
        if (this.type === 'success') {
          setTimeout(() => {
            this.close();
          }, 3000);
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit('close');
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-feedback {
  background: white;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: scale(0.9) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.feedback-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.modal-success .feedback-icon {
  color: #28a745;
}

.modal-error .feedback-icon {
  color: #dc3545;
}

.modal-warning .feedback-icon {
  color: #ffc107;
}

.modal-info .feedback-icon {
  color: #17a2b8;
}

.feedback-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.75rem;
}

.feedback-message {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.btn-close-feedback {
  background-color: #1a7a7a;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-close-feedback:hover {
  background-color: #145f5f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 122, 122, 0.3);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 576px) {
  .modal-feedback {
    padding: 2rem 1.5rem;
    max-width: 90%;
  }

  .feedback-icon {
    font-size: 3rem;
  }

  .feedback-title {
    font-size: 1.3rem;
  }

  .feedback-message {
    font-size: 0.95rem;
  }
}
</style>