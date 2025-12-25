<template>
  <div v-if="show" class="modal-overlay" @click="handleClose">
    <div class="modal-detail" @click.stop>
      <button class="modal-close" @click="handleClose">
        <i class="bi bi-x-lg"></i>
      </button>
      <h3 class="modal-title">Tambah Data Gunung</h3>
      <div class="form-content">
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
            placeholder="email atau nomor telepon. Jika nomor telepon diawali +62"
          />
        </div>
        <div class="form-group">
          <label>Harga</label>
          <input 
            type="number" 
            v-model="formData.price" 
            class="form-control"
            placeholder="Masukkan harga, angka saja"
          />
        </div>
        <div class="form-group">
          <label>Durasi</label>
          <input 
            type="text" 
            v-model="formData.duration" 
            class="form-control"
            placeholder="contoh: 2 hari 1 malam atau 2 Jam 35 Menit"
          />
        </div>
        <div class="form-group">
          <label>Pos</label>
          <input 
            type="text" 
            v-model="formData.pos" 
            class="form-control"
            placeholder="Masukkan pos/basecamp"
          />
        </div>
        <div class="form-group">
          <label>Gambar Gunung</label>
          
          <div style="margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-weight: normal;">
              <input type="radio" name="imageOption" v-model="imageOption" value="file" />
              Upload File dari Komputer
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-weight: normal;">
              <input type="radio" name="imageOption" v-model="imageOption" value="url" />
              Gunakan URL Gambar
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
              v-model="formData.imageUrl"
              @input="updatePreviewFromUrl"
              class="form-control"
              placeholder="https://example.com/image.jpg"
            />
            <small style="color: #666; display: block; margin-top: 0.25rem;">
              Masukkan URL gambar dari internet
            </small>
          </div>

          <div v-if="imageOption === 'default'" style="margin-top: 0.5rem; padding: 0.75rem; background: #f0fdfa; border-radius: 8px; border: 1px solid #99f6e4;">
            <small style="color: #0d9488; font-weight: 500;">
              <i class="bi bi-image"></i> Menggunakan gambar default
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
          <button class="btn-cancel" @click="handleClose">
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
const DEFAULT_IMAGE_URL = 'https://apimice.kemenparekraf.go.id/event-daerah/public/669/0cd/153/6690cd153a162349133709.jpg'

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
        image: DEFAULT_IMAGE_URL,
        imageUrl: ''
      },
      imageOption: 'file',
      imagePreview: DEFAULT_IMAGE_URL,
      imageFile: null,
      selectedFileName: ''
    }
  },
  watch: {
    imageOption(newVal) {
      if (newVal === 'default') {
        this.imagePreview = DEFAULT_IMAGE_URL
      } else if (newVal === 'url') {
        this.imagePreview = this.formData.imageUrl || null
      } else if (newVal === 'file') {
        if (this.imageFile) {
          const reader = new FileReader()
          reader.onload = (e) => {
            this.imagePreview = e.target.result
          }
          reader.readAsDataURL(this.imageFile)
        } else {
          this.imagePreview = null
        }
      }
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.imageFile = file
        this.selectedFileName = file.name
        this.imageOption = 'file'
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    updatePreviewFromUrl() {
      if (this.imageOption === 'url') {
        this.imagePreview = this.formData.imageUrl || null
      }
    },

    handleSave() {
      // prepare the image field based on selected option
      if (this.imageOption === 'default') {
        this.formData.image = DEFAULT_IMAGE_URL
      } else if (this.imageOption === 'url') {
        this.formData.image = this.formData.imageUrl || DEFAULT_IMAGE_URL
      } else if (this.imageOption === 'file') {
        // for now include filename as a hint; main upload handled by parent
        this.formData.image = this.selectedFileName || DEFAULT_IMAGE_URL
      }

      this.formData.imageOption = this.imageOption
      this.$emit('save', { ...this.formData, imageFile: this.imageFile })
      this.resetForm()
    },

    handleClose() {
      this.resetForm()
      this.$emit('close')
    },

    setDefaultImage() {
      this.imageOption = 'default'
      this.imagePreview = DEFAULT_IMAGE_URL
      this.formData.image = DEFAULT_IMAGE_URL
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
        image: DEFAULT_IMAGE_URL,
        imageUrl: ''
      }
      this.imageOption = 'file'
      this.imagePreview = DEFAULT_IMAGE_URL
      this.imageFile = null
      this.selectedFileName = ''
    }
  }
}
</script>

<style scoped src="../../views/dataGunung/styleDataGunung.css"></style>
