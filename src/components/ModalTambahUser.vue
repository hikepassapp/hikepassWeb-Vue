<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop style="max-width: 500px;">
      <div class="modal-header">
        <h3 class="modal-title">Tambah User</h3>
        <button class="btn-close" @click="closeModal"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">Nama</label>
            <input v-model="formData.nama" type="text" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="formData.email" type="email" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input v-model="formData.password" type="password" class="form-control" required minlength="8" />
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn-submit">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalTambahUser',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        nama: '',
        email: '',
        password: ''
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
        nama: '',
        email: '',
        password: ''
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
  max-width: 800px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0;
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
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: #1a7a7a;
}

.textarea {
  resize: vertical;
  line-height: 1.5;
}

select.form-control {
  cursor: pointer;
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
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

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