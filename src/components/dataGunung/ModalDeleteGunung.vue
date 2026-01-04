<template>
  <div v-if="show" class="modal-overlay" @click="$emit('cancel')">
    <div class="modal-confirm" @click.stop>
      <div class="modal-icon-warning">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      <h3 class="modal-title">{{ title }}</h3>
      <p class="modal-message">{{ message }}</p>
      <div class="form-actions">
        <button class="btn-cancel" @click="$emit('cancel')">
          Batal
        </button>
        <button class="btn-delete-confirm" @click="$emit('confirm')">
          <i class="bi bi-trash me-2"></i>
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalDeleteGunung',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Konfirmasi Hapus'
    },
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped src="../../views/dataGunung/styleDataGunung.css"></style>
