<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-feedback" @click.stop>
      <div :class="['modal-icon', type === 'success' ? 'modal-icon-success' : 'modal-icon-error']">
        <i :class="type === 'success' ? 'bi bi-check-circle' : 'bi bi-x-circle'"></i>
      </div>
      <h3 class="modal-title">{{ type === 'success' ? 'Berhasil!' : 'Gagal!' }}</h3>
      <p class="modal-message">{{ message }}</p>
      <button class="btn-ok" @click="$emit('close')">
        OK
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalFeedbackGunung',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error'].includes(value)
    }
  }
}
</script>

<style scoped src="../../views/dataGunung/styleDataGunung.css"></style>
