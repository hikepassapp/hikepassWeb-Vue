<template>
  <ConfirmModal
    :isOpen="isOpen"
    title="Hapus Reservasi"
    message="Apakah Anda yakin menghapus reservasi ini?"
    confirmText="Hapus"
    processingText="Menghapus..."
    confirmButtonClass="btn-delete"
    :isProcessing="isDeleting"
    @close="closeModal"
    @confirm="handleDelete"
  />
</template>

<script>
import ConfirmModal from '../common/ConfirmModal.vue'

export default {
  name: 'ModalDeleteReservasi',
  components: {
    ConfirmModal
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    reservationId: {
      type: [Number, String],
      default: null
    }
  },
  emits: ['close', 'confirm'],
  data() {
    return {
      isDeleting: false
    }
  },
  methods: {
    async handleDelete() {
      this.isDeleting = true
      try {
        this.$emit('confirm', this.reservationId)
      } finally {
        this.isDeleting = false
      }
    },
    closeModal() {
      this.$emit('close')
    }
  }
}
</script>

