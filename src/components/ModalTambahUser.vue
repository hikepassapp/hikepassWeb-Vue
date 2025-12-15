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
          <!-- Row 1: Nama & NIK -->
          <div class="form-row">
            <div class="form-group">
              <label for="nama" class="form-label">Nama</label>
              <input
                id="nama"
                v-model="formData.nama"
                type="text"
                class="form-control"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="nik" class="form-label">NIK</label>
              <input
                id="nik"
                v-model="formData.nik"
                type="text"
                class="form-control"
                maxlength="16"
                pattern="[0-9]{16}"
                required
              />
            </div>
          </div>
          
          <!-- Row 2: Tanggal Lahir & Jenis Kelamin -->
          <div class="form-row">
            <div class="form-group">
              <label for="tanggalLahir" class="form-label">Tanggal Lahir</label>
              <input
                id="tanggalLahir"
                v-model="formData.tanggalLahir"
                type="date"
                class="form-control"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="jenisKelamin" class="form-label">Jenis Kelamin</label>
              <select
                id="jenisKelamin"
                v-model="formData.jenisKelamin"
                class="form-control"
                required
              >
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>
          
          <!-- Alamat -->
          <div class="form-group">
            <label for="alamat" class="form-label">Alamat</label>
            <textarea
              id="alamat"
              v-model="formData.alamat"
              class="form-control textarea"
              rows="3"
              required
            ></textarea>
          </div>
          
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
          
          <!-- Kontak -->
          <div class="form-group">
            <label for="kontak" class="form-label">Kontak</label>
            <input
              id="kontak"
              v-model="formData.kontak"
              type="tel"
              class="form-control"
              pattern="[0-9]{10,15}"
              required
            />
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
        nik: '',
        tanggalLahir: '',
        jenisKelamin: '',
        alamat: '',
        email: '',
        kontak: ''
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
        nik: '',
        tanggalLahir: '',
        jenisKelamin: '',
        alamat: '',
        email: '',
        kontak: ''
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