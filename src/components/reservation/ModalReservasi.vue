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
            :class="{ 'is-invalid': errors.id_mountain }"
            required
          >
            <option value="">Pilih Gunung</option>
            <option v-for="mountain in mountains" :key="mountain.id" :value="mountain.id">
              {{ mountain.name }}
            </option>
          </select>
          <span v-if="errors.id_mountain" class="error-text">{{ errors.id_mountain[0] }}</span>
        </div>

        <!-- Start Date -->
        <div class="form-group">
          <label for="startDate">Tanggal Mulai <span class="required">*</span></label>
          <input 
            id="startDate" 
            type="date" 
            v-model="form.start_date"
            class="form-control"
            :class="{ 'is-invalid': errors.start_date }"
            required
          />
          <span v-if="errors.start_date" class="error-text">{{ errors.start_date[0] }}</span>
        </div>

        <!-- Full Name -->
        <div class="form-group">
          <label for="name">Nama Lengkap <span class="required">*</span></label>
          <input 
            id="name" 
            type="text" 
            v-model="form.name"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            placeholder="Masukkan nama lengkap"
            required
          />
          <span v-if="errors.name" class="error-text">{{ errors.name[0] }}</span>
        </div>

        <!-- NIK -->
        <div class="form-group">
          <label for="nik">NIK <span class="required">*</span></label>
          <input 
            id="nik" 
            type="text" 
            v-model="form.nik"
            class="form-control"
            :class="{ 'is-invalid': errors.nik }"
            placeholder="Masukkan NIK"
            maxlength="16"
            required
          />
          <span v-if="errors.nik" class="error-text">{{ errors.nik[0] }}</span>
        </div>

        <!-- Gender -->
        <div class="form-group">
          <label for="gender">Jenis Kelamin <span class="required">*</span></label>
          <select 
            id="gender" 
            v-model="form.gender"
            class="form-control"
            :class="{ 'is-invalid': errors.gender }"
            required
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
          <span v-if="errors.gender" class="error-text">{{ errors.gender[0] }}</span>
        </div>

        <!-- Phone Number -->
        <div class="form-group">
          <label for="phoneNumber">No. Telepon <span class="required">*</span></label>
          <input 
            id="phoneNumber" 
            type="tel" 
            v-model="form.phone_number"
            class="form-control"
            :class="{ 'is-invalid': errors.phone_number }"
            placeholder="Contoh: 081234567890"
            required
          />
          <span v-if="errors.phone_number" class="error-text">{{ errors.phone_number[0] }}</span>
        </div>

        <!-- Address -->
        <div class="form-group">
          <label for="address">Alamat <span class="required">*</span></label>
          <textarea 
            id="address" 
            v-model="form.address"
            class="form-control"
            :class="{ 'is-invalid': errors.address }"
            placeholder="Masukkan alamat lengkap"
            rows="3"
            required
          ></textarea>
          <span v-if="errors.address" class="error-text">{{ errors.address[0] }}</span>
        </div>

        <!-- Citizenship -->
        <div class="form-group">
          <label for="citizen">Kewarganegaraan <span class="required">*</span></label>
          <select 
            id="citizen" 
            v-model="form.citizen"
            class="form-control"
            :class="{ 'is-invalid': errors.citizen }"
            required
          >
            <option value="">Pilih Kewarganegaraan</option>
            <option value="WNI">WNI</option>
            <option value="WNA">WNA</option>
          </select>
          <span v-if="errors.citizen" class="error-text">{{ errors.citizen[0] }}</span>
        </div>

        <!-- ID Card -->
        <div class="form-group">
          <label for="idCard">Foto KTP <span class="required">*</span></label>
          <input 
            id="idCard" 
            type="file" 
            @change="handleFileUpload"
            class="form-control"
            :class="{ 'is-invalid': errors.id_card }"
            accept="image/*"
            :required="!isEdit"
          />
          <span v-if="errors.id_card" class="error-text">{{ errors.id_card[0] }}</span>
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
      errors: {},
      isSubmitting: false
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
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal && this.reservation) {
        this.form = {
          id_mountain: this.reservation.id_mountain,
          start_date: this.reservation.start_date,
          name: this.reservation.name,
          nik: this.reservation.nik,
          gender: this.reservation.gender,
          phone_number: this.reservation.phone_number,
          address: this.reservation.address,
          citizen: this.reservation.citizen,
          id_card: this.reservation.id_card
        }
      } else if (newVal) {
        this.form = this.getEmptyForm()
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
    handleFileUpload(event) {
      this.form.id_card = event.target.files[0]
    },
    async handleSubmit() {
      this.errors = {}
      this.isSubmitting = true

      try {
        // Validate required fields first
        if (!this.form.id_mountain) {
          this.errors = { id_mountain: ['Pilih gunung terlebih dahulu'] }
          this.isSubmitting = false
          return
        }

        if (!this.form.id_card && !this.isEdit) {
          this.errors = { id_card: ['Upload foto KTP terlebih dahulu'] }
          this.isSubmitting = false
          return
        }

        // Create FormData for file upload
        const formData = new FormData()
        
        // Add all form fields (only non-empty values)
        Object.keys(this.form).forEach(key => {
          const value = this.form[key]
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
