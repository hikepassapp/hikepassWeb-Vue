<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-feedback" @click.stop>
      <div class="modal-icon-success">
        <i class="bi bi-check-circle"></i>
      </div>
      <h3 class="modal-title">Berhasil!</h3>
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
    }
  }
}
</script>

<style scoped src="../../views/dataGunung/styleDataGunung.css"></style>
