<template>
  <div class="form-berita-page">
    <Sidebar />

    <div class="main-content">
      <Navbar pageTitle="Tambah Berita & Event" />
      <div class="content-wrapper">
        <!-- Back Button -->
        <button @click="goBack" class="btn-back">
          <i class="bi bi-arrow-left"></i>
          Kembali
        </button>

        <!-- Form Container -->
        <div class="form-container">
          <h2 class="form-title">Tambah Berita & Event Baru</h2>

          <form @submit.prevent="handleSubmit">
            <!-- Image Upload -->
            <div class="form-group image-upload-group">
              <label class="form-label">Gambar Berita & Event</label>
              <div
                class="image-upload-area"
                @click="$refs.fileInput.click()"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="handleDrop"
                :class="{ dragging: isDragging }"
              >
                <div v-if="!imagePreview" class="upload-placeholder">
                  <i class="bi bi-cloud-upload"></i>
                  <p>Klik atau drag & drop gambar di sini</p>
                  <span>PNG, JPG atau WEBP (Max. 5MB)</span>
                </div>
                <div v-else class="image-preview">
                  <img :src="imagePreview" alt="Preview" />
                  <button
                    type="button"
                    class="btn-remove-image"
                    @click.stop="removeImage"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileChange"
                style="display: none"
              />
              <p v-if="errors.image" class="error-message">
                {{ errors.image }}
              </p>
            </div>

            <!-- Grid Form Fields -->
            <div class="form-grid">
              <!-- Judul -->
              <div class="form-group">
                <label class="form-label">Judul *</label>
                <input
                  v-model="form.judul"
                  type="text"
                  class="form-input"
                  placeholder="Contoh: Mendaki saat Hujan"
                  :class="{ error: errors.judul }"
                />
                <p v-if="errors.judul" class="error-message">
                  {{ errors.judul }}
                </p>
              </div>

              <!-- Penulis -->
              <div class="form-group">
                <label class="form-label">Penulis/Publisher *</label>
                <input
                  v-model="form.penulis"
                  type="text"
                  class="form-input"
                  placeholder="Nama penulis"
                  :class="{ error: errors.penulis }"
                />
                <p v-if="errors.penulis" class="error-message">
                  {{ errors.penulis }}
                </p>
              </div>

              <!-- Jenis -->
              <div class="form-group">
                <label class="form-label">Jenis *</label>
                <select
                  v-model="form.jenis"
                  class="form-input"
                  :class="{ error: errors.jenis }"
                >
                  <option value="">Pilih jenis</option>
                  <option value="berita">Berita</option>
                  <option value="event">Event</option>
                </select>
                <p v-if="errors.jenis" class="error-message">
                  {{ errors.jenis }}
                </p>
              </div>

              <!-- Tanggal -->
              <div class="form-group">
                <label class="form-label">Tanggal Publish *</label>
                <input
                  v-model="form.tanggalPublish"
                  type="date"
                  class="form-input"
                  :class="{ error: errors.tanggalPublish }"
                />
                <p v-if="errors.tanggalPublish" class="error-message">
                  {{ errors.tanggalPublish }}
                </p>
              </div>
            </div>
            <!-- Deskripsi (Full Width) -->
            <div class="form-group">
              <label class="form-label">Deskripsi Berita/Event *</label>
              <textarea
                v-model="form.deskripsi"
                class="form-textarea"
                rows="6"
                placeholder="Jelaskan detail berita/event..."
                :class="{ error: errors.deskripsi }"
              ></textarea>
              <p v-if="errors.deskripsi" class="error-message">
                {{ errors.deskripsi }}
              </p>
            </div>

            <!-- Submit Buttons -->
            <div class="form-actions">
              <button type="button" @click="goBack" class="btn-cancel">
                Batal
              </button>
              <button type="submit" class="btn-submit" :disabled="loading">
                <span v-if="loading">
                  <i class="bi bi-hourglass-split"></i>
                  Menyimpan...
                </span>
                <span v-else>
                  <i class="bi bi-check-circle"></i>
                  Simpan Paket
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
import beritaEventService from "@/services/beritaEventService";

export default {
  name: "TambahBeritaEventView",
  components: {
    Sidebar,
    Navbar,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const isDragging = ref(false);
    const imagePreview = ref(null);
    const imageFile = ref(null);

    const form = ref({
      judul: "",
      penulis: "",
      jenis: "",
      tanggalPublish: "",
      deskripsi: "",
    });

    const errors = ref({});

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        processFile(file);
      }
    };

    const handleDrop = (e) => {
      isDragging.value = false;
      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    };

    const processFile = (file) => {
      // Validasi file
      if (!file.type.startsWith("image/")) {
        errors.value.image = "File harus berupa gambar";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        errors.value.image = "Ukuran file maksimal 5MB";
        return;
      }

      imageFile.value = file;
      errors.value.image = null;

      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const removeImage = () => {
      imagePreview.value = null;
      imageFile.value = null;
    };

    const validateForm = () => {
      errors.value = {};
      let isValid = true;

      if (!form.value.judul) {
        errors.value.judul = "Judul harus diisi";
        isValid = false;
      } else if (form.value.judul.trim().length < 5) {
        errors.value.judul = "Judul minimal 5 karakter";
        isValid = false;
      }

      if (!form.value.penulis) {
        errors.value.penulis = "Penulis harus diisi";
        isValid = false;
      } else if (form.value.penulis.trim().length < 3) {
        errors.value.penulis = "Nama penulis minimal 3 karakter";
        isValid = false;
      }

      if (!form.value.jenis) {
        errors.value.jenis = "Jenis harus dipilih";
        isValid = false;
      }

      if (!form.value.tanggalPublish) {
        errors.value.tanggalPublish = "Tanggal harus diisi";
        isValid = false;
      }

      if (!form.value.deskripsi || form.value.deskripsi.length < 20) {
        errors.value.deskripsi = "Deskripsi minimal 20 karakter";
        isValid = false;
      }

      return isValid;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      loading.value = true;

      try {
        const formData = new FormData();
        formData.append("judul", form.value.judul);
        formData.append("penulis", form.value.penulis);
        formData.append("jenis", form.value.jenis);
        formData.append("tanggalPublish", form.value.tanggalPublish);
        formData.append("deskripsi", form.value.deskripsi);

        if (imageFile.value) {
          formData.append("image", imageFile.value);
        }
        await beritaEventService.createBeritaEvent(formData);
        router.push("/berita");
      } catch (error) {
        alert(error.response?.data?.message || "Gagal menyimpan data");
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      router.push("/berita");
    };

    return {
      form,
      errors,
      loading,
      isDragging,
      imagePreview,
      handleFileChange,
      handleDrop,
      removeImage,
      handleSubmit,
      goBack,
    };
  },
};
</script>

<style scoped>
.form-wisata-page {
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
  max-width: 1200px;
  margin: 0 auto;
}

.btn-back {
  background: white;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-back:hover {
  background-color: #f8f9fa;
  border-color: #1a7a7a;
  color: #1a7a7a;
}

.form-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1a7a7a;
  box-shadow: 0 0 0 3px rgba(26, 122, 122, 0.1);
}

.form-input.error,
.form-textarea.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Image Upload */
.image-upload-group {
  margin-bottom: 2rem;
}

.image-upload-area {
  border: 2px dashed #d0d0d0;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.image-upload-area:hover,
.image-upload-area.dragging {
  border-color: #1a7a7a;
  background: #f0f9f9;
}

.upload-placeholder i {
  font-size: 3rem;
  color: #999;
  display: block;
  margin-bottom: 1rem;
}

.upload-placeholder p {
  color: #666;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.upload-placeholder span {
  color: #999;
  font-size: 0.85rem;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.btn-remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
}

.btn-remove-image:hover {
  background: #dc2626;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: #f3f4f6;
  color: #4b5563;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit {
  background: #1a7a7a;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #145f5f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 122, 122, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
