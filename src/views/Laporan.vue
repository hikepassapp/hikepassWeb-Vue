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
            <h2 class="form-title">{{ isEdit ? 'Edit Laporan' : 'Buat Laporan Baru' }}</h2>
          </div>

          <form @submit.prevent="handleSubmit" class="report-form">
            <!-- Nama Pelapor -->
            <FormInput id="namaPelapor" label="Nama Pelapor" v-model="formData.nama_pelapor"
              placeholder="Masukkan nama Anda" :required="true" />

            <!-- Tanggal Kejadian -->
            <FormDatePicker id="tanggalKejadian" label="Tanggal Kejadian" v-model="formData.tanggal_kejadian"
              :required="true" />

            <!-- Lokasi Kejadian -->
            <FormInput id="lokasiKejadian" label="Lokasi Kejadian" v-model="formData.lokasi_kejadian"
              placeholder="Contoh: Pos 1" :required="true" />

            <!-- Deskripsi Kejadian -->
            <FormTextarea id="deskripsiKejadian" label="Deskripsi Kejadian" v-model="formData.deskripsi_kejadian"
              placeholder="Jelaskan kronologi kejadian secara detail..." :required="true" :rows="8" />

            <!-- Bukti Foto -->
            <ImageUpload label="Bukti Foto" :required="!isEdit" @update:files="handleFilesUpdate" />

            <div v-if="isEdit && currentPhoto" class="current-photo">
              <p>Foto saat ini:</p>
              <img :src="getPhotoUrl(currentPhoto)" alt="Current photo" />
              <p class="photo-note">*Upload foto baru untuk mengganti</p>
            </div>

            <!-- Submit Button -->
            <div class="form-actions">
              <button type="submit" class="btn-submit" :disabled="isLoading">
                {{ isLoading ? 'Mengirim...' : (isEdit ? 'Update Laporan' : 'Kirim Laporan') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <ModalFeedbackGunung :show="showFeedbackModal" :message="feedbackMessage" :type="feedbackType"
      @close="showFeedbackModal = false" />
  </div>
</template>

<script>
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import FormInput from '../components/FormInput.vue'
import FormTextarea from '../components/FormTextarea.vue'
import FormDatePicker from '../components/FormDatePicker.vue'
import ImageUpload from '../components/ImageUpload.vue'
import ModalFeedbackGunung from '../components/dataGunung/ModalFeedbackGunung.vue'

const API_URL = 'http://localhost:8000/api/laporans'
const STORAGE_URL = 'http://localhost:8000/storage'

export default {
  name: 'LaporanView',
  components: {
    Sidebar,
    Navbar,
    FormInput,
    FormTextarea,
    FormDatePicker,
    ImageUpload,
    ModalFeedbackGunung
  },
  data() {
    return {
      formData: {
        nama_pelapor: '',
        tanggal_kejadian: '',
        lokasi_kejadian: '',
        deskripsi_kejadian: ''
      },
      files: [],
      isLoading: false,
      isEdit: false,
      editId: null,
      currentPhoto: null,

      showFeedbackModal: false,
      feedbackMessage: '',
      feedbackType: 'success'
    }
  },
  mounted() {
    // Cek apakah mode edit
    if (this.$route.params.id) {
      this.isEdit = true
      this.editId = this.$route.params.id
      this.loadLaporan()
    }
  },
  methods: {
    handleFilesUpdate(files) {
      this.files = files
    },

    async loadLaporan() {
      try {
        const response = await axios.get(`${API_URL}/${this.editId}`)
        if (response.data.success) {
          const data = response.data.data
          this.formData = {
            nama_pelapor: data.nama_pelapor,
            tanggal_kejadian: data.tanggal_kejadian,
            lokasi_kejadian: data.lokasi_kejadian,
            deskripsi_kejadian: data.deskripsi_kejadian
          }
          this.currentPhoto = data.foto_bukti
        }
      } catch (error) {
        console.error('Error loading laporan:', error)
        alert('Gagal memuat data laporan')
      }
    },

    async handleSubmit() {
      // Validasi form
      if (!this.formData.nama_pelapor || !this.formData.tanggal_kejadian ||
        !this.formData.lokasi_kejadian || !this.formData.deskripsi_kejadian) {
        this.feedbackMessage = 'Mohon lengkapi semua field yang wajib diisi!'
        this.feedbackType = 'error'
        this.showFeedbackModal = true
        return
      }

      if (!this.isEdit && this.files.length === 0) {
        this.feedbackMessage = 'Mohon upload minimal 1 foto sebagai bukti!'
        this.feedbackType = 'error'
        this.showFeedbackModal = true
        return
      }

      this.isLoading = true

      try {
        // Prepare FormData
        const formData = new FormData()
        formData.append('nama_pelapor', this.formData.nama_pelapor)
        formData.append('tanggal_kejadian', this.formData.tanggal_kejadian)
        formData.append('lokasi_kejadian', this.formData.lokasi_kejadian)
        formData.append('deskripsi_kejadian', this.formData.deskripsi_kejadian)

        // Tambahkan foto jika ada
        if (this.files.length > 0) {
          formData.append('foto_bukti', this.files[0])
        }

        let response

        if (this.isEdit) {
          // Update
          formData.append('_method', 'PUT')
          response = await axios.post(`${API_URL}/${this.editId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        } else {
          // Create
          response = await axios.post(API_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        }

        if (response.data.success) {
          this.feedbackMessage = response.data.message
          this.feedbackType = 'success'
          this.showFeedbackModal = true

          setTimeout(() => {
            this.$router.push('/laporan')
          }, 1200)
        }
      } catch (error) {
        console.error('Error submitting laporan:', error)
        if (error.response && error.response.data.errors) {
          const errors = error.response.data.errors
          const errorMessages = Object.values(errors).flat().join('\n')
          alert('Error:\n' + errorMessages)
        } else {
          this.feedbackMessage = 'Gagal mengirim laporan. Silakan coba lagi.'
          this.feedbackType = 'error'
          this.showFeedbackModal = true
        }
      } finally {
        this.isLoading = false
      }
    },

    getPhotoUrl(photo) {
      return `${STORAGE_URL}/${photo}`
    },

    resetForm() {
      this.formData = {
        nama_pelapor: '',
        tanggal_kejadian: '',
        lokasi_kejadian: '',
        deskripsi_kejadian: ''
      }
      this.files = []
    },

    goBack() {
      this.$router.back()
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

.current-photo {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.current-photo p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  color: #666;
}

.current-photo img {
  max-width: 200px;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.photo-note {
  font-size: 0.9rem;
  color: #999;
  font-style: italic;
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

.btn-submit:hover:not(:disabled) {
  background-color: #145f5f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 122, 122, 0.3);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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