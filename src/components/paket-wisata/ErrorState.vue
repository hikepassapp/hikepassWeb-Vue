<template>
  <div class="error-container">
    <i class="bi bi-exclamation-triangle"></i>
    <p>{{ message }}</p>
    <button @click="$emit('retry')" class="btn-retry">Coba Lagi</button>
  </div>
</template>

<script>
export default {
  name: 'ErrorState',
  props: {
    message: {
      type: String,
      required: true
    }
  },
  emits: ['retry']
}
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
  color: #dc3545;
}

.error-container i {
  font-size: 3rem;
}

.btn-retry {
  background-color: #1a7a7a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-retry:hover {
  background-color: #145f5f;
}
</style>    