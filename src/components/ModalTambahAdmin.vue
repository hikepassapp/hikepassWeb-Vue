<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h3 class="modal-title">Tambah</h3>
        <button class="btn-close" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      
      <!-- Body -->
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-control"
              required
            />
          </div>
          
          <!-- Peran -->
          <div class="form-group">
            <label class="form-label">Peran</label>
            <p class="peran-info">
              Untuk info mengenai peran akun selengkapnya dapat dilihat 
              <a href="#" class="link-disini">Disini</a>.
            </p>
            
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.peran"
                  value="Administrator"
                  class="radio-input"
                  required
                />
                <span class="radio-text">Administrator</span>
              </label>
              
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.peran"
                  value="Owner"
                  class="radio-input"
                />
                <span class="radio-text">Owner</span>
              </label>
              
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.peran"
                  value="Developer"
                  class="radio-input"
                />
                <span class="radio-text">Developer</span>
              </label>
            </div>
          </div>
          
          <!-- Submit Button -->
          <div class="modal-footer">
            <button type="submit" class="btn-submit">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalTambahAdmin',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        email: '',
        peran: 'Administrator'
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.formData);
      this.resetForm();
    },
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        email: '',
        peran: 'Administrator'
      };
    }
  },
  emits: ['close', 'submit']
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
  z-index: 1050;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #1a7a7a;
}

.peran-info {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.link-disini {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.link-disini:hover {
  text-decoration: underline;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
}

.radio-input {
  width: 20px;
  height: 20px;
  margin-right: 0.8rem;
  cursor: pointer;
  accent-color: #f59e0b;
}

.radio-text {
  font-size: 1rem;
  color: #333;
}

.modal-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.btn-submit {
  background-color: #1a7a7a;
  color: white;
  border: none;
  padding: 0.9rem 3rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background-color: #145f5f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 122, 122, 0.3);
}

/* Responsive */
@media (max-width: 576px) {
  .modal-container {
    max-width: 100%;
    border-radius: 16px 16px 0 0;
    margin-top: auto;
  }
  
  .modal-header,
  .modal-body {
    padding: 1.5rem;
  }
  
  .btn-submit {
    width: 100%;
  }
}
</style>