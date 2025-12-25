<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-detail" @click.stop ref="modalForm">
      <button class="modal-close" @click="$emit('close')">
        <i class="bi bi-x-lg"></i>
      </button>
      <h3 class="modal-title">Tambah Data Gunung</h3>
      <div class="form-content">
        <div v-if="errors.general" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-circle me-2"></i>{{ errors.general }}
        </div>
        <div class="form-group">
          <label>Nama Gunung</label>
          <input 
            type="text" 
            v-model="formData.name" 
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            placeholder="Masukkan nama gunung"
          />
          <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
        </div>
        <div class="form-group">
          <label>Pengelola</label>
          <select 
            v-model="formData.manager" 
            class="form-control"
            :class="{ 'is-invalid': errors.manager }"
          >
            <option value="">Pilih Pengelola</option>
            <option value="LMDH">LMDH</option>
            <option value="Perhutani">Perhutani</option>
            <option value="Taman Nasional">Taman Nasional</option>
          </select>
          <div v-if="errors.manager" class="invalid-feedback">{{ errors.manager }}</div>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select 
            v-model="formData.status" 
            class="form-control"
            :class="{ 'is-invalid': errors.status }"
          >
            <option value="">Pilih Status</option>
            <option value="Buka">Buka</option>
            <option value="Tutup">Tutup</option>
          </select>
          <div v-if="errors.status" class="invalid-feedback">{{ errors.status }}</div>
        </div>
        <div class="form-group">
          <label>Kuota</label>
          <input 
            type="number" 
            v-model="formData.quota" 
            class="form-control"
            :class="{ 'is-invalid': errors.quota }"
            placeholder="Masukkan kuota"
            min="1"
          />
          <div v-if="errors.quota" class="invalid-feedback">{{ errors.quota }}</div>
        </div>
        <div class="form-group">
          <label>Lokasi</label>
          <input 
            type="text" 
            v-model="formData.location" 
            class="form-control"
            :class="{ 'is-invalid': errors.location }"
            placeholder="Masukkan lokasi"
          />
          <div v-if="errors.location" class="invalid-feedback">{{ errors.location }}</div>
        </div>
        <div class="form-group">
          <label>Kontak</label>
          <input 
            type="text" 
            v-model="formData.contact" 
            class="form-control"
            :class="{ 'is-invalid': errors.contact }"
            placeholder="email atau nomor telepon. Jika nomor telepon diawali +62"
          />
          <div v-if="errors.contact" class="invalid-feedback">{{ errors.contact }}</div>
        </div>
        <div class="form-group">
          <label>Harga</label>
          <input 
            type="number" 
            v-model="formData.price" 
            class="form-control"
            :class="{ 'is-invalid': errors.price }"
            placeholder="Masukkan harga, angka saja"
            min="0"
          />
          <div v-if="errors.price" class="invalid-feedback">{{ errors.price }}</div>
        </div>
        <div class="form-group">
          <label>Durasi</label>
          <input 
            type="text" 
            v-model="formData.duration" 
            class="form-control"
            :class="{ 'is-invalid': errors.duration }"
            placeholder="Dengan satuan jam atau menit"
          />
          <div v-if="errors.duration" class="invalid-feedback">{{ errors.duration }}</div>
        </div>
        <div class="form-group">
          <label>Pos</label>
          <input 
            type="text" 
            v-model="formData.pos" 
            class="form-control"
            :class="{ 'is-invalid': errors.pos }"
            placeholder="Masukkan pos/basecamp"
          />
          <div v-if="errors.pos" class="invalid-feedback">{{ errors.pos }}</div>
        </div>
        <div class="form-group">
          <label>URL Gambar</label>
          <input 
            type="text" 
            v-model="formData.image" 
            class="form-control"
            :class="{ 'is-invalid': errors.image }"
            placeholder="https://example.com/image.jpg"
          />
          <div v-if="errors.image" class="invalid-feedback">{{ errors.image }}</div>
        </div>
        <div class="form-actions">
          <button class="btn-cancel" @click="handleClose" :disabled="isSubmitting">
            Batal
          </button>
          <button class="btn-save" @click="handleSave" :disabled="isSubmitting">
            <i v-if="!isSubmitting" class="bi bi-check-circle me-2"></i>
            <span v-if="isSubmitting">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Menyimpan...
            </span>
            <span v-else>Simpan</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalAddGunung',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        status: '',
        manager: '',
        quota: '',
        location: '',
        contact: '',
        price: '',
        duration: '',
        pos: '',
        image: ''
      },
      errors: {
        general: '',
        name: '',
        status: '',
        manager: '',
        quota: '',
        location: '',
        contact: '',
        price: '',
        duration: '',
        pos: '',
        image: ''
      },
      isSubmitting: false
    }
  },
  methods: {
    validateForm() {
      this.clearErrors()
      let isValid = true

      // Validate name
      if (!this.formData.name || this.formData.name.trim() === '') {
        this.errors.name = 'Nama gunung harus diisi'
        isValid = false
      } else if (this.formData.name.length < 2) {
        this.errors.name = 'Nama gunung minimal 2 karakter'
        isValid = false
      } else if (this.formData.name.length > 100) {
        this.errors.name = 'Nama gunung maksimal 100 karakter'
        isValid = false
      }

      // Validate manager
      if (!this.formData.manager || this.formData.manager.trim() === '') {
        this.errors.manager = 'Pengelola harus dipilih'
        isValid = false
      }

      // Validate status
      if (!this.formData.status || this.formData.status.trim() === '') {
        this.errors.status = 'Status harus dipilih'
        isValid = false
      }

      // Validate quota
      if (!this.formData.quota) {
        this.errors.quota = 'Kuota harus diisi'
        isValid = false
      } else if (parseInt(this.formData.quota) < 1) {
        this.errors.quota = 'Kuota minimal harus 1'
        isValid = false
      } else if (parseInt(this.formData.quota) > 10000) {
        this.errors.quota = 'Kuota maksimal 10000'
        isValid = false
      }

      // Validate location
      if (!this.formData.location || this.formData.location.trim() === '') {
        this.errors.location = 'Lokasi harus diisi'
        isValid = false
      } else if (this.formData.location.length < 3) {
        this.errors.location = 'Lokasi minimal 3 karakter'
        isValid = false
      }

      // Validate contact (email or phone)
      if (!this.formData.contact || this.formData.contact.trim() === '') {
        this.errors.contact = 'Kontak harus diisi'
        isValid = false
      } else if (!this.isValidContact(this.formData.contact)) {
        this.errors.contact = 'Format kontak tidak valid (gunakan email atau nomor telepon +62...)'
        isValid = false
      }

      // Validate price
      if (!this.formData.price && this.formData.price !== 0) {
        this.errors.price = 'Harga harus diisi'
        isValid = false
      } else if (parseInt(this.formData.price) < 0) {
        this.errors.price = 'Harga tidak boleh negatif'
        isValid = false
      }

      // Validate duration
      if (!this.formData.duration || this.formData.duration.trim() === '') {
        this.errors.duration = 'Durasi harus diisi'
        isValid = false
      } else if (this.formData.duration.length < 2) {
        this.errors.duration = 'Durasi harus minimal 2 karakter'
        isValid = false
      }

      // Validate pos
      if (!this.formData.pos || this.formData.pos.trim() === '') {
        this.errors.pos = 'Pos/basecamp harus diisi'
        isValid = false
      }

      // Validate image URL (optional but validate if provided)
      if (this.formData.image && this.formData.image.trim() !== '') {
        if (!this.isValidUrl(this.formData.image)) {
          this.errors.image = 'Format URL tidak valid'
          isValid = false
        }
      }

      return isValid
    },
    isValidContact(contact) {
      // Check if email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(contact)) {
        return true
      }
      // Check if phone format (+62...)
      const phoneRegex = /^\+62\d{9,12}$/
      if (phoneRegex.test(contact)) {
        return true
      }
      return false
    },
    isValidUrl(url) {
      try {
        new URL(url)
        return true
      } catch (error) {
        return false
      }
    },
    clearErrors() {
      this.errors = {
        general: '',
        name: '',
        status: '',
        manager: '',
        quota: '',
        location: '',
        contact: '',
        price: '',
        duration: '',
        pos: '',
        image: ''
      }
    },
    handleSave() {
      if (!this.validateForm()) {
        return
      }

      this.$emit('save', this.formData)
    },
    handleClose() {
      this.resetForm()
      this.$emit('close')
    },
    resetForm() {
      this.formData = {
        name: '',
        status: '',
        manager: '',
        quota: '',
        location: '',
        contact: '',
        price: '',
        duration: '',
        pos: '',
        image: ''
      }
      this.clearErrors()
    },
    setSubmitting(value) {
      this.isSubmitting = value
    },
    setGeneralError(message) {
      this.errors.general = message
    }
  }
}
</script>

<style scoped src="../../views/dataGunung/styleDataGunung.css"></style>
