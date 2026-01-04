<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="status-icon" :class="iconClass">
        <i :class="iconElement"></i>
      </div>
      
      <h3 class="modal-title">{{ title }}</h3>
      <p class="status-message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      enum: ['success', 'error', 'warning'],
      default: 'success'
    },
    title: {
      type: String,
      default: 'Sukses'
    },
    message: {
      type: String,
      default: 'Operasi berhasil dilakukan'
    }
  },
  emits: ['close'],
  data() {
    return {
      autoCloseTimer: null
    }
  },
  computed: {
    iconClass() {
      return `status-icon-${this.type}`
    },
    iconElement() {
      const icons = {
        success: 'bi bi-check-circle',
        error: 'bi bi-x-circle',
        warning: 'bi bi-exclamation-circle'
      }
      return icons[this.type] || icons.success
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        clearTimeout(this.autoCloseTimer)
        this.autoCloseTimer = setTimeout(() => {
          this.closeModal()
        }, 2000)
      }
    }
  },
  methods: {
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

.status-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.status-icon-success {
  background-color: #d4edda;
  color: #28a745;
}

.status-icon-error {
  background-color: #f8d7da;
  color: #dc3545;
}

.status-icon-warning {
  background-color: #fff3cd;
  color: #ff9800;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1rem 0;
}

.status-message {
  font-size: 1rem;
  color: #666;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

</style>
