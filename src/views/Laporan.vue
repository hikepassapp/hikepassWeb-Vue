<template>
  <div class="laporan-page">
    <Sidebar />
    
    <div class="main-content">
      <Navbar pageTitle="Laporan" />
      
      <div class="content-wrapper">
        <div class="form-container">
          <div class="form-header">
            <button class="btn-back" @click="goBack">
              <i class="bi bi-arrow-left"></i>
            </button>
            <h2 class="form-title">Buat Laporan Baru</h2>
          </div>
          
          <form @submit.prevent="handleSubmit" class="report-form">
            <!-- Nama Pelapor -->
            <FormInput
              id="namaPelapor"
              label="Nama Pelapor"
              v-model="formData.namaPelapor"
              placeholder="Masukkan nama Anda"
              :required="true"
            />
            
            <!-- Tanggal Kejadian -->
            <FormDatePicker
              id="tanggalKejadian"
              label="Tanggal Kejadian"
              v-model="formData.tanggalKejadian"
              :required="true"
            />
            
            <!-- Lokasi Kejadian -->
            <FormInput
              id="lokasiKejadian"
              label="Lokasi Kejadian"
              v-model="formData.lokasiKejadian"
              placeholder="Contoh: Pos 1"
              :required="true"
            />
            
            <!-- Deskripsi Kejadian -->
            <FormTextarea
              id="deskripsiKejadian"
              label="Deskripsi Kejadian"
              v-model="formData.deskripsiKejadian"
              placeholder="Jelaskan kronologi kejadian secara detail..."
              :required="true"
              :rows="8"
            />
            
            <!-- Bukti Foto -->
            <ImageUpload
              label="Bukti Foto"
              :required="true"
              @update:files="handleFilesUpdate"
            />
            
            <!-- Submit Button -->
            <div class="form-actions">
              <button type="submit" class="btn-submit">
                Kirim Laporan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import FormInput from '../components/FormInput.vue'
import FormTextarea from '../components/FormTextarea.vue'
import FormDatePicker from '../components/FormDatePicker.vue'
import ImageUpload from '../components/ImageUpload.vue'

export default {
  name: 'LaporanView',
  components: {
    Sidebar,
    Navbar,
    FormInput,
    FormTextarea,
    FormDatePicker,
    ImageUpload
  },
  data() {
    return {
      formData: {
        namaPelapor: '',
        tanggalKejadian: '',
        lokasiKejadian: '',
        deskripsiKejadian: ''
      },
      files: []
    }
  },
  methods: {
    handleFilesUpdate(files) {
      this.files = files;
    },
    handleSubmit() {
      // Validasi form
      if (!this.formData.namaPelapor || !this.formData.tanggalKejadian || 
          !this.formData.lokasiKejadian || !this.formData.deskripsiKejadian) {
        alert('Mohon lengkapi semua field yang wajib diisi!');
        return;
      }
      
      if (this.files.length === 0) {
        alert('Mohon upload minimal 1 foto sebagai bukti!');
        return;
      }
      
      // Prepare data untuk submit
      const reportData = {
        ...this.formData,
        photos: this.files
      };
      
      console.log('Laporan Data:', reportData);
      
      // TODO: Kirim data ke backend
      // this.submitToBackend(reportData);
      
      alert('Laporan berhasil dikirim!');
      
      // Reset form
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        namaPelapor: '',
        tanggalKejadian: '',
        lokasiKejadian: '',
        deskripsiKejadian: ''
      };
      this.files = [];
    },
    goBack() {
      this.$router.back();
    }
  }
}
</script>

<style scoped>
.laporan-page {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  margin-left: 250px;
}

.content-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.btn-back {
  background: none;
  border: none;
  color: #1a7a7a;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.btn-back:hover {
  background-color: #f0f0f0;
  transform: translateX(-3px);
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.report-form {
  margin-top: 1.5rem;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
}

.btn-submit {
  width: 100%;
  padding: 1rem 2rem;
  background-color: #1a7a7a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background-color: #145f5f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 122, 122, 0.3);
}

.btn-submit:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 200px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .form-container {
    padding: 2rem 1.5rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  .form-container {
    padding: 1.5rem 1rem;
  }
  
  .form-title {
    font-size: 1.3rem;
  }
  
  .form-header {
    margin-bottom: 1.5rem;
  }
}
</style>