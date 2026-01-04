<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">
        <i class="bi bi-x-lg"></i>
      </button>
      
      <h3 class="modal-title">Check-in</h3>
      
      <form @submit.prevent="handleSubmit" class="form">
        <!-- Checkin Date -->
        <div class="form-group">
          <label for="checkinDate">Tanggal Check-in <span class="required">*</span></label>
          <input 
            id="checkinDate" 
            type="date" 
            v-model="form.checkin_date"
            @change="validateCheckinDate"
            :min="minCheckinDate"
            class="form-control"
            :class="{ 'is-invalid': validationErrors.checkin_date }"
            required
          />
          <span v-if="validationErrors.checkin_date" class="error-text">{{ validationErrors.checkin_date }}</span>
          <span v-else-if="formattedStartDate" class="helper-text">Check-in dapat dilakukan sejak {{ formattedStartDate }}.</span>
        </div>

        <!-- Barang Bawaan -->
        <div class="form-group">
          <label for="items">Barang Bawaan Check-in <span class="required">*</span></label>
          <textarea 
            id="items" 
            v-model="form.item_list"
            class="form-control"
            :class="{ 'is-invalid': validationErrors.item_list }"
            placeholder="Masukkan daftar barang bawaan"
            rows="4"
            required
          ></textarea>
          <span v-if="validationErrors.item_list" class="error-text">{{ validationErrors.item_list }}</span>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="closeModal">
            Batal
          </button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Check-in...' : 'Check-in' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalCheckin',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    reservation: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      form: {
        id_reservation: null,
        checkin_date: '',
        item_list: ''
      },
      validationErrors: {},
      errors: {},
      isSubmitting: false
    }
  },
  computed: {
    minCheckinDate() {
      if (this.reservation?.start_date) {
        return this.formatDateForInput(this.reservation.start_date)
      }
      return new Date().toISOString().split('T')[0]
    },
    formattedStartDate() {
      const startDate = this.formatDateForInput(this.reservation?.start_date)
      return startDate ? this.formatDate(startDate) : ''
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal && this.reservation) {
        this.form.id_reservation = this.reservation.id
        this.validationErrors = {}
      }
    }
  },
  methods: {
    validateCheckinDate() {
      if (!this.form.checkin_date) {
        this.validationErrors.checkin_date = 'Tanggal check-in wajib diisi'
        return
      }
      
      // checkin_date harus >= start_date (bisa sama tanggalnya)
      const reservationStart = this.formatDateForInput(this.reservation?.start_date)
      if (reservationStart && this.isBeforeDate(this.form.checkin_date, reservationStart)) {
        this.validationErrors.checkin_date = `Check-in dapat dilakukan sejak ${this.formatDate(reservationStart)} atau setelahnya`
        return
      }
      
      delete this.validationErrors.checkin_date
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      if (isNaN(date)) return '-'
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    },
    formatDateForInput(dateValue) {
      if (!dateValue) return ''

      if (typeof dateValue === 'string') {
        const parts = dateValue.split(/[^0-9]/).filter(Boolean)
        if (parts.length === 3) {
          let year, month, day
          if (parts[0].length === 4) {
            ;[year, month, day] = parts
          } else {
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
    isBeforeDate(value, minValue) {
      const valueDate = new Date(value)
      const minDate = new Date(minValue)
      if (isNaN(valueDate) || isNaN(minDate)) return false
      return valueDate < minDate
    },
    validateAllFields() {
      this.validationErrors = {}
      
      if (!this.form.checkin_date) {
        this.validationErrors.checkin_date = 'Tanggal check-in wajib diisi'
      } else {
        const reservationStart = this.formatDateForInput(this.reservation?.start_date)
        if (reservationStart && this.isBeforeDate(this.form.checkin_date, reservationStart)) {
          this.validationErrors.checkin_date = `Check-in dapat dilakukan sejak ${this.formatDate(reservationStart)} atau setelahnya`
        }
      }
      
      if (!this.form.item_list || !this.form.item_list.trim()) {
        this.validationErrors.item_list = 'Barang bawaan check-in wajib diisi'
      }
      
      return Object.keys(this.validationErrors).length === 0
    },
    async handleSubmit() {
      this.errors = {}
      
      // Validate all fields before submission
      if (!this.validateAllFields()) {
        return
      }
      
      this.isSubmitting = true

      try {
        this.$emit('submit', {
          data: this.form,
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
      this.form = {
        id_reservation: null,
        checkin_date: '',
        item_list: ''
      }
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
  z-index: 1001;
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
  min-height: 100px;
}

.error-text {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.helper-text {
  color: #6c757d;
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
