<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">
        <i class="bi bi-x-lg"></i>
      </button>

      <h3 class="modal-title">Edit Data Admin</h3>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="nama">Nama Lengkap <span class="required">*</span></label>
          <input 
            type="text" 
            id="nama" 
            v-model="formData.nama"
            class="form-control" 
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email <span class="required">*</span></label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email"
            class="form-control" 
            placeholder="Masukkan email"
            required
          />
        </div>

        <div class="form-group">
          <label for="posisi">Posisi <span class="required">*</span></label>
          <input 
            type="text" 
            id="posisi" 
            v-model="formData.posisi"
            class="form-control" 
            placeholder="Masukkan posisi"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password Baru (Opsional)</label>
          <input 
            type="password" 
            id="password" 
            v-model="formData.password"
            class="form-control" 
            placeholder="Kosongkan jika tidak ingin mengubah password"
          />
          <small class="form-text">Biarkan kosong jika tidak ingin mengubah password</small>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="closeModal">Batal</button>
          <button type="submit" class="btn-submit">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalEditAdmin',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    adminData: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      formData: {
        id: null,
        nama: '',
        email: '',
        posisi: '',
        password: ''
      }
    }
  },
  watch: {
    adminData: {
      immediate: true,
      handler(newData) {
        if (newData) {
          this.formData = {
            id: newData.id,
            nama: newData.nama || '',
            email: newData.email || '',
            posisi: newData.posisi || '',
            password: ''
          }
        }
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
      this.resetForm()
    },
    submitForm() {
      this.$emit('submit', this.formData)
      this.resetForm()
    },
    resetForm() {
      this.formData = {
        id: null,
        nama: '',
        email: '',
        posisi: '',
        password: ''
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
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
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
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.required {
  color: #ef4444;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #1a7a7a;
  box-shadow: 0 0 0 3px rgba(26, 122, 122, 0.1);
}

.form-text {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.btn-cancel:hover {
  background-color: #d5d5d5;
}

.btn-submit {
  background-color: #1a7a7a;
  color: white;
}

.btn-submit:hover {
  background-color: #145f5f;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(26, 122, 122, 0.3);
}

@media (max-width: 576px) {
  .modal-content {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>