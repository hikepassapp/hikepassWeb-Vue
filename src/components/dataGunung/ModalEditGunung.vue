<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-detail" @click.stop>
      <button class="modal-close" @click="$emit('close')">
        <i class="bi bi-x-lg"></i>
      </button>
      <h3 class="modal-title">Edit Data Gunung</h3>
      <div v-if="mountain" class="form-content">
        <div class="form-group">
          <label>Nama Gunung</label>
          <input 
            type="text" 
            v-model="formData.name" 
            class="form-control"
            placeholder="Masukkan nama gunung"
          />
        </div>
        <div class="form-group">
          <label>Pengelola</label>
          <select 
            v-model="formData.manager" 
            class="form-control"
          >
            <option value="">Pilih Pengelola</option>
            <option value="LMDH">LMDH</option>
            <option value="Perhutani">Perhutani</option>
            <option value="Taman Nasional">Taman Nasional</option>
          </select>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select 
            v-model="formData.status" 
            class="form-control"
          >
            <option value="">Pilih Status</option>
            <option value="Buka">Buka</option>
            <option value="Tutup">Tutup</option>
          </select>
        </div>
        <div class="form-group">
          <label>Kuota</label>
          <input 
            type="number" 
            v-model="formData.quota" 
            class="form-control"
            placeholder="Masukkan kuota"
          />
        </div>
        <div class="form-group">
          <label>Lokasi</label>
          <input 
            type="text" 
            v-model="formData.location" 
            class="form-control"
            placeholder="Masukkan lokasi"
          />
        </div>
        <div class="form-group">
          <label>Kontak</label>
          <input 
            type="text" 
            v-model="formData.contact" 
            class="form-control"
            placeholder="Masukkan kontak, misalnya email atau nomor telepon. Jika nomor telepon, sertakan kode negara seperti +62"
          />
        </div>
        <div class="form-group">
          <label>Harga</label>
          <input 
            type="number" 
            v-model="formData.price" 
            class="form-control"
            placeholder="Masukkan harga"
          />
        </div>
        <div class="form-group">
          <label>Durasi</label>
          <input 
            type="text" 
            v-model="formData.duration" 
            class="form-control"
            placeholder="Masukkan durasi"
          />
        </div>
        <div class="form-group">
          <label>Pos</label>
          <input 
            type="text" 
            v-model="formData.pos" 
            class="form-control"
            placeholder="Masukkan pos"
          />
        </div>
        <div class="form-group">
          <label>Gambar Gunung</label>
          
          <div style="margin-bottom: 1rem; padding: 0.75rem; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
            <small style="color: #6b7280;">Gambar saat ini:</small><br>
            <small style="color: #374151; font-weight: 500;">{{ currentImageDisplay }}</small>
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-weight: normal;">
              <input type="radio" name="imageOption" v-model="imageOption" value="keep" />
              Tetap Gunakan Gambar Saat Ini
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-weight: normal;">
              <input type="radio" name="imageOption" v-model="imageOption" value="file" />
              Upload File Baru
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-weight: normal;">
              <input type="radio" name="imageOption" v-model="imageOption" value="url" />
              Gunakan URL Baru
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal;">
              <input type="radio" name="imageOption" v-model="imageOption" value="default" />
              Gunakan Gambar Default
            </label>
          </div>

          <div v-if="imageOption === 'file'" style="margin-top: 0.5rem;">
            <input 
              type="file" 
              ref="fileInput"
              @change="handleFileSelect"
              accept="image/*"
              style="display: none"
            />
            <button 
              type="button"
              @click="$refs.fileInput.click()"
              style="padding: 0.75rem 1.5rem; background: #1a7a7a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;"
            >
              <i class="bi bi-upload"></i> Pilih File
            </button>
            <small v-if="selectedFileName" style="color: #059669; margin-left: 0.5rem; font-weight: 500;">
              ✓ {{ selectedFileName }}
            </small>
          </div>

          <div v-if="imageOption === 'url'" style="margin-top: 0.5rem;">
            <input 
              type="text"
              v-model="newImageUrl"
              class="form-control"
              placeholder="https://example.com/image.jpg"
            />
            <small style="color: #666; display: block; margin-top: 0.25rem;">
              Masukkan URL gambar baru
            </small>
          </div>

          <div v-if="imageOption === 'default'" style="margin-top: 0.5rem; padding: 0.75rem; background: #f0fdfa; border-radius: 8px; border: 1px solid #99f6e4;">
            <small style="color: #0d9488; font-weight: 500;">
              <i class="bi bi-image"></i> Akan menggunakan gambar default
            </small>
          </div>
        </div>

        <div v-if="imagePreview" class="form-group">
          <label>Preview Gambar</label>
          <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 0.5rem; background: #f9fafb;">
            <img :src="imagePreview" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 6px; object-fit: cover; display: block; margin: 0 auto;" />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-cancel" @click="$emit('close')">
            Batal
          </button>
          <button class="btn-save" @click="handleSave">
            <i class="bi bi-check-circle me-2"></i>
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const DEFAULT_IMAGE_PATH = 'mountains/defaultMountainPics.jpg'

export default {
  name: 'ModalEditGunung',
  props: {
    show: Boolean,
    mountain: Object
  },
  data() {
    return {
      imageOption: 'keep',
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
      newImageUrl: '',
      selectedFile: null,
      selectedFileName: '',
      imagePreview: null,
      API_BASE_URL: 'http://127.0.0.1:8000'
    }
  },
  computed: {
    defaultImageUrl() {
      return `${this.API_BASE_URL}/storage/${DEFAULT_IMAGE_PATH}`
    },
    currentImageDisplay() {
      if (!this.formData.image) return 'Tidak ada gambar'
      if (this.formData.image.startsWith('http')) {
        return this.formData.image
      }
      return this.formData.image
    },
    currentImageUrl() {
      if (!this.formData.image) return this.defaultImageUrl
      if (this.formData.image.startsWith('http')) {
        return this.formData.image
      }
      return `${this.API_BASE_URL}/storage/${this.formData.image}`
    }
  },
  watch: {
    mountain: {
      handler(newMountain) {
        if (newMountain) {
          this.formData = { ...newMountain }
          this.imageOption = 'keep'
          this.imagePreview = this.currentImageUrl
          this.newImageUrl = ''
          this.selectedFile = null
          this.selectedFileName = ''
        }
      },
      immediate: true,
      deep: true
    },
    imageOption(newOption) {
      if (newOption === 'keep') {
        this.imagePreview = this.currentImageUrl
        this.selectedFile = null
        this.selectedFileName = ''
        this.newImageUrl = ''
      } else if (newOption === 'default') {
        this.imagePreview = this.defaultImageUrl
        this.selectedFile = null
        this.selectedFileName = ''
        this.newImageUrl = ''
      } else if (newOption === 'url') {
        this.selectedFile = null
        this.selectedFileName = ''
        if (this.newImageUrl) {
          this.imagePreview = this.newImageUrl
        }
      } else if (newOption === 'file') {
        this.newImageUrl = ''
        if (!this.selectedFile) {
          this.imagePreview = this.currentImageUrl
        }
      }
    },
    newImageUrl(newUrl) {
      if (this.imageOption === 'url' && newUrl) {
        this.imagePreview = newUrl
      }
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('File harus berupa gambar!')
          return
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('Ukuran file maksimal 5MB!')
          return
        }
        
        this.selectedFile = file
        this.selectedFileName = file.name
        this.imageOption = 'file'
        
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    
    handleSave() {
      const formData = new FormData()
      
      if (this.imageOption === 'file' && this.selectedFile) {
        formData.append('image', this.selectedFile)
        formData.append('image_type', 'file')
      } else if (this.imageOption === 'url' && this.newImageUrl) {
        formData.append('image_url', this.newImageUrl)
        formData.append('image_type', 'url')
      } else if (this.imageOption === 'default') {
        formData.append('image_path', DEFAULT_IMAGE_PATH)
        formData.append('image_type', 'default')
      } else {
        formData.append('image_path', this.formData.image)
        formData.append('image_type', 'keep')
      }
      
      formData.append('name', this.formData.name)
      formData.append('status', this.formData.status)
      formData.append('manager', this.formData.manager)
      formData.append('quota', this.formData.quota)
      formData.append('location', this.formData.location)
      formData.append('contact', this.formData.contact)
      formData.append('price', this.formData.price)
      formData.append('duration', this.formData.duration)
      formData.append('pos', this.formData.pos)
      
      this.$emit('save', formData)
    }
  }
}
</script>

<style scoped src="../../views/dataGunung/styleDataGunung.css"></style>
