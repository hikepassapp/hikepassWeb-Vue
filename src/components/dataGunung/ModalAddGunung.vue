<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-detail" @click.stop>
      <button class="modal-close" @click="$emit('close')">
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
            placeholder="Dengan satuan jam atau menit"
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
          <label>URL Gambar</label>
          <input 
            type="text" 
            v-model="formData.image" 
            class="form-control"
            placeholder="https://example.com/image.jpg"
          />
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
      }
    }
  },
  methods: {
    handleSave() {
      this.$emit('save', this.formData)
      this.resetForm()
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
    }
  }
}
</script>

<style scoped src="../../views/dataGunung/styleDataGunung.css"></style>
