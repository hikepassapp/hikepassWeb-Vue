<template>
  <div class="form-group">
    <label class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    
    <div class="upload-area">
      <!-- Preview Images -->
      <div v-if="previewImages.length > 0" class="preview-container">
        <div 
          v-for="(image, index) in previewImages" 
          :key="index" 
          class="preview-item"
        >
          <img :src="image" alt="Preview" class="preview-image" />
          <button 
            type="button"
            @click="removeImage(index)" 
            class="btn-remove"
          >
            <i class="bi bi-x-circle-fill"></i>
          </button>
        </div>
      </div>
      
      <!-- Upload Button -->
      <label class="upload-btn" :class="{ 'has-images': previewImages.length > 0 }">
        <input
          type="file"
          @change="handleFileChange"
          accept="image/*"
          multiple
          class="file-input"
          :required="required && previewImages.length === 0"
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
      default: 'Format: JPG, PNG, JPEG. Max 5MB per file.'
    }
  },
  data() {
    return {
      previewImages: [],
      files: []
    }
  },
  methods: {
    handleFileChange(event) {
      const files = Array.from(event.target.files);
      
      files.forEach(file => {
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} terlalu besar. Maksimal 5MB.`);
          return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} bukan gambar.`);
          return;
        }
        
        this.files.push(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
      
      this.$emit('update:files', this.files);
      event.target.value = ''; // Reset input
    },
    removeImage(index) {
      this.previewImages.splice(index, 1);
      this.files.splice(index, 1);
      this.$emit('update:files', this.files);
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
  gap: 1rem;
  flex-wrap: wrap;
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
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.btn-remove i {
  color: #ef4444;
  font-size: 1.3rem;
}

.btn-remove:hover {
  transform: scale(1.1);
}

.upload-btn {
  width: 150px;
  height: 150px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.upload-btn:hover {
  border-color: #1a7a7a;
  background-color: #f8fafa;
}

.upload-btn.has-images {
  width: 150px;
  height: 150px;
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