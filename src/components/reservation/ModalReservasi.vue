<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">
        <i class="bi bi-x-lg"></i>
      </button>
      
      <h3 class="modal-title">{{ isEdit ? 'Edit Reservasi' : 'Tambah Reservasi' }}</h3>
      
      <form @submit.prevent="handleSubmit" class="form">
        <!-- Mountain -->
        <div class="form-group">
          <label for="mountain">Gunung <span class="required">*</span></label>
          <select 
            id="mountain" 
            v-model="form.id_mountain"
            class="form-control"
            :class="{ 'is-invalid': validationErrors.id_mountain }"
            required
          >
            <option value="">Pilih Gunung</option>
            <option v-for="mountain in mountains" :key="mountain.id" :value="mountain.id">
              {{ mountain.name }}
            </option>
          </select>
          <span v-if="validationErrors.id_mountain" class="error-text">{{ validationErrors.id_mountain }}</span>
        </div>

        <!-- Start Date -->
        <div class="form-group">
          <label for="startDate">Tanggal Mulai <span class="required">*</span></label>
          <input 
            id="startDate" 
            type="date" 
            v-model="form.start_date"
            :min="minStartDate"
            class="form-control"
            :class="{ 'is-invalid': validationErrors.start_date }"
            required
          />
          <span v-if="validationErrors.start_date" class="error-text">{{ validationErrors.start_date }}</span>
        </div>

        <!-- Full Name -->
        <div class="form-group">
          <label for="name">Nama Lengkap <span class="required">*</span></label>
          <input 
            id="name" 
            type="text" 
            v-model="form.name"
            @input="validateName"
            class="form-control"
            :class="{ 'is-invalid': validationErrors.name }"
            placeholder="Masukkan nama lengkap"
            required
          />
          <span v-if="validationErrors.name" class="error-text">{{ validationErrors.name }}</span>
        </div>

        <!-- NIK -->
        <div class="form-group">
          <label for="nik">NIK <span class="required">*</span></label>
          <input 
            id="nik" 
            type="text" 
            v-model="form.nik"
            @input="validateNik"
            class="form-control"
            :class="{ 'is-invalid': validationErrors.nik }"
            placeholder="Masukkan NIK"
            maxlength="16"
            inputmode="numeric"
            required
          />
          <span v-if="validationErrors.nik" class="error-text">{{ validationErrors.nik }}</span>
          <span v-else-if="form.nik && form.nik.length < 16" class="input-info">{{ form.nik.length }}/16 digit</span>
        </div>

        <!-- Gender -->
        <div class="form-group">
          <label for="gender">Jenis Kelamin <span class="required">*</span></label>
          <select 
            id="gender" 
            v-model="form.gender"
            class="form-control"
            :class="{ 'is-invalid': validationErrors.gender }"
            required
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
          <span v-if="validationErrors.gender" class="error-text">{{ validationErrors.gender }}</span>
        </div>

        <!-- Phone Number -->
        <div class="form-group">
          <label for="phoneNumber">No. Telepon <span class="required">*</span></label>
          <input 
            id="phoneNumber" 
            type="tel" 
            v-model="form.phone_number"
            @input="validatePhoneNumber"
            class="form-control"
            :class="{ 'is-invalid': validationErrors.phone_number }"
            placeholder="Contoh: 081234567890"
            required
          />
          <span v-if="validationErrors.phone_number" class="error-text">{{ validationErrors.phone_number }}</span>
        </div>

        <!-- Address -->
        <div class="form-group">
          <label for="address">Alamat <span class="required">*</span></label>
          <textarea 
            id="address" 
            v-model="form.address"
            class="form-control"
            :class="{ 'is-invalid': validationErrors.address }"
            placeholder="Masukkan alamat lengkap"
            rows="3"
            required
          ></textarea>
          <span v-if="validationErrors.address" class="error-text">{{ validationErrors.address }}</span>
        </div>

        <!-- Citizenship -->
        <div class="form-group">
          <label for="citizen">Kewarganegaraan <span class="required">*</span></label>
          <select 
            id="citizen" 
            v-model="form.citizen"
            class="form-control"
            :class="{ 'is-invalid': validationErrors.citizen }"
            required
          >
            <option value="">Pilih Kewarganegaraan</option>
            <option value="WNI">WNI</option>
            <option value="WNA">WNA</option>
          </select>
          <span v-if="validationErrors.citizen" class="error-text">{{ validationErrors.citizen }}</span>
        </div>

        <!-- ID Card -->
        <div class="form-group">
          <label for="idCard">Foto KTP <span class="required">*</span></label>
          <div v-if="isEdit && form.id_card && typeof form.id_card === 'string'" class="current-file">
            File saat ini: {{ getFileName(form.id_card) }}
          </div>
          <input 
            id="idCard" 
            type="file" 
            @change="handleFileUpload"
            class="form-control"
            :class="{ 'is-invalid': validationErrors.id_card }"
            accept="image/*"
            :required="!isEdit && !form.id_card"
          />
          <span v-if="validationErrors.id_card" class="error-text">{{ validationErrors.id_card }}</span>
          
          <!-- ID Card Preview -->
          <div v-if="idCardPreview" class="id-card-preview-section">
            <label>Preview Foto KTP:</label>
            <img :src="idCardPreview" :alt="'Preview ID Card'" class="id-card-preview-image" />
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="closeModal">
            Batal
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalReservasi',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    mountains: {
      type: Array,
      default: () => []
    },
    reservation: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      form: this.getEmptyForm(),
      validationErrors: {},
      errors: {},
      isSubmitting: false,
      originalStartDate: null,
      originalIdCard: null,
      idCardPreview: null
    }
  },
  computed: {
    isEdit() {
      return !!this.reservation
    },
    selectedMountain() {
      if (!this.form.id_mountain) return null
      return this.mountains.find(m => m.id === this.form.id_mountain)
    },
    mountainPrice() {
      return this.selectedMountain?.price || 0
    },
    minStartDate() {
      const today = new Date()
      return today.toISOString().split('T')[0]
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal && this.reservation) {
        // Store original values for edit mode
        this.originalStartDate = this.reservation.start_date
        this.originalIdCard = this.reservation.id_card
        
        this.form = {
          id_mountain: this.reservation.id_mountain,
          start_date: this.formatDateForInput(this.reservation.start_date),
          name: this.reservation.name,
          nik: this.reservation.nik,
          gender: this.reservation.gender,
          phone_number: this.reservation.phone_number,
          address: this.reservation.address,
          citizen: this.reservation.citizen,
          id_card: this.reservation.id_card
        }
        this.validationErrors = {}
        
        // Set preview image untuk edit mode
        if (this.reservation.id_card && typeof this.reservation.id_card === 'string') {
          this.idCardPreview = this.buildImageUrl(this.reservation.id_card)
        } else {
          this.idCardPreview = null
        }
      } else if (newVal) {
        this.form = this.getEmptyForm()
        this.originalStartDate = null
        this.originalIdCard = null
        this.validationErrors = {}
        this.idCardPreview = null
      }
    }
  },
  methods: {
    getEmptyForm() {
      return {
        id_mountain: '',
        start_date: '',
        name: '',
        nik: '',
        gender: '',
        phone_number: '',
        address: '',
        citizen: '',
        id_card: null
      }
    },
    validateName() {
      const value = this.form.name
      const alphabetRegex = /^[a-zA-Z\s]*$/
      
      if (!value) {
        this.validationErrors.name = 'Nama lengkap wajib diisi'
      } else if (!alphabetRegex.test(value)) {
        this.validationErrors.name = 'Nama hanya boleh berisi huruf'
      } else {
        delete this.validationErrors.name
      }
    },
    validateNik() {
      const value = this.form.nik
      const digitRegex = /^\d*$/
      
      if (!value) {
        this.validationErrors.nik = 'NIK wajib diisi'
      } else if (!digitRegex.test(value)) {
        this.validationErrors.nik = 'NIK hanya boleh berisi angka'
      } else if (value.length < 16) {
        this.validationErrors.nik = `NIK harus 16 digit (saat ini ${value.length} digit)`
      } else {
        delete this.validationErrors.nik
      }
    },
    validatePhoneNumber() {
      const value = this.form.phone_number
      const digitRegex = /^\d*$/
      
      if (!value) {
        this.validationErrors.phone_number = 'No. telepon wajib diisi'
      } else if (!digitRegex.test(value)) {
        this.validationErrors.phone_number = 'No. telepon hanya boleh berisi angka'
      } else if (value.length < 10) {
        this.validationErrors.phone_number = `No. telepon minimal 10 digit (saat ini ${value.length} digit)`
      } else if (value.length > 13) {
        this.validationErrors.phone_number = `No. telepon maksimal 13 digit (saat ini ${value.length} digit)`
      } else {
        delete this.validationErrors.phone_number
      }
    },
    validateAllFields() {
      this.validationErrors = {}
      
      // Validate all fields
      if (!this.form.id_mountain) {
        this.validationErrors.id_mountain = 'Pilih gunung terlebih dahulu'
      }
      
      if (!this.form.start_date) {
        this.validationErrors.start_date = 'Tanggal mulai wajib diisi'
      }
      
      this.validateName()
      this.validateNik()
      
      if (!this.form.gender) {
        this.validationErrors.gender = 'Pilih jenis kelamin'
      }
      
      this.validatePhoneNumber()
      
      if (!this.form.address) {
        this.validationErrors.address = 'Alamat wajib diisi'
      }
      
      if (!this.form.citizen) {
        this.validationErrors.citizen = 'Pilih kewarganegaraan'
      }
      
      if (!this.form.id_card && !this.isEdit) {
        this.validationErrors.id_card = 'Upload foto KTP terlebih dahulu'
      }
      
      return Object.keys(this.validationErrors).length === 0
    },
    getFileName(path) {
      if (!path) return ''
      return path.split('/').pop() || path
    },
    buildImageUrl(path) {
      if (!path) return ''
      return path.startsWith('http') ? path : `http://127.0.0.1:8000/storage/${path}`
    },
    formatDateForInput(dateValue) {
      if (!dateValue) return ''

      // Normalize string dates from backend (dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd, with/without time)
      if (typeof dateValue === 'string') {
        const parts = dateValue.split(/[^0-9]/).filter(Boolean)
        if (parts.length === 3) {
          let year, month, day
          if (parts[0].length === 4) {
            // Assume yyyy mm dd
            ;[year, month, day] = parts
          } else {
            // Assume dd mm yyyy
            ;[day, month, year] = parts
          }
          if (year && month && day) {
            return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
          }
        }
      }

      const parsed = new Date(dateValue)
      if (!isNaN(parsed)) {
        return parsed.toISOString().split('T')[0]
      }

      return ''
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.id_card = file
        delete this.validationErrors.id_card
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          this.idCardPreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async handleSubmit() {
      this.errors = {}
      
      // Validate all fields before submission
      if (!this.validateAllFields()) {
        return
      }
      
      this.isSubmitting = true

      try {
        // Create FormData for file upload
        const formData = new FormData()
        
        // Add all form fields (only non-empty values)
        Object.keys(this.form).forEach(key => {
          const value = this.form[key]
          
          // Skip id_card if it's the original value in edit mode
          if (key === 'id_card' && this.isEdit && value === this.originalIdCard) {
            return
          }
          
          if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value)
          }
        })
        
        // Add price from selected mountain (convert to integer)
        if (this.mountainPrice) {
          formData.append('price', Math.round(parseFloat(this.mountainPrice)))
        }

        // Debug: log what we're sending
        console.log('📤 Submitting reservation:')
        for (let pair of formData.entries()) {
          console.log(`  ${pair[0]}: ${pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]}`)
        }

        this.$emit('submit', {
          data: formData,
          isEdit: this.isEdit,
          reservationId: this.reservation?.id
        })
      } catch (error) {
        console.error('Error submitting form:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    closeModal() {
      this.errors = {}
      this.validationErrors = {}
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
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
  font-size: 1.2rem;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1.5rem 0;
  padding-right: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.required {
  color: #dc3545;
  margin-left: 2px;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:disabled {
  background-color: #f5f5f5;
  color: #666;
  cursor: not-allowed;
  opacity: 0.8;
}

.form-control:focus {
  outline: none;
  border-color: #1a7a7a;
  box-shadow: 0 0 0 3px rgba(26, 122, 122, 0.1);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

.error-text {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.input-info {
  color: #666;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.current-file {
  font-size: 0.85rem;
  color: #666;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.id-card-preview-section {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.id-card-preview-section label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
}

.id-card-preview-image {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-submit {
  background-color: #1a7a7a;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: #145f5f;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95vw;
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
