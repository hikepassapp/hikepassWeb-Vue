<template>
  <div class="form-group">
    <label class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <div class="upload-area">
      <div v-if="previewImage" class="preview-container">
        <div class="preview-item">
          <img :src="previewImage" alt="Preview" class="preview-image" />
          <button
            type="button"
            class="btn-remove"
            @click="removeImage"
          >
            <i class="bi bi-x-circle-fill"></i>
          </button>
        </div>
      </div>

      <label v-if="!previewImage" class="upload-btn">
        <input
          type="file"
          class="file-input"
          accept="image/*"
          @change="handleFileChange"
          :required="required && !previewImage"
        />
        <div class="upload-content">
          <i class="bi bi-camera-fill upload-icon"></i>
          <span class="upload-text">Tambah</span>
        </div>
      </label>
    </div>

    <small class="form-text">
      {{ helperText }}
    </small>
  </div>
</template>

<script>
export default {
  name: 'ImageUpload',
  props: {
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    helperText: {
      type: String,
      default: 'Format: JPG, PNG, JPEG. Maksimal 5MB.'
    }
  },
  data() {
    return {
      previewImage: null, 
      file: null           
    }
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0]
      if (!file) return

      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB')
        event.target.value = ''
        return
      }

      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar')
        event.target.value = ''
        return
      }

      this.file = file

      const reader = new FileReader()
      reader.onload = e => {
        this.previewImage = e.target.result
      }
      reader.readAsDataURL(file)

      this.$emit('update:files', [file])
    },

    removeImage() {
      this.previewImage = null
      this.file = null
      this.$emit('update:files', [])
    }
  },
  emits: ['update:files']
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.upload-area {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.preview-container {
  display: flex;
}

.preview-item {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove i {
  color: #ef4444;
  font-size: 1.3rem;
}

.upload-btn {
  width: 150px;
  height: 150px;
  border: 2px dashed #d0d0d0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
}

.upload-btn:hover {
  border-color: #1a7a7a;
  background-color: #f8fafa;
}

.file-input {
  display: none;
}

.upload-content {
  text-align: center;
}

.upload-icon {
  font-size: 2rem;
  color: #666;
  margin-bottom: 0.5rem;
  display: block;
}

.upload-text {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.form-text {
  display: block;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.85rem;
}

@media (max-width: 576px) {
  .preview-item,
  .upload-btn {
    width: 120px;
    height: 120px;
  }
}
</style>
