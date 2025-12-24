<template>
  <div class="mountain-card">
    <div class="card-image">
      <img :src="mountain.image" :alt="mountain.name" />
    </div>
    
    <div class="card-body">
      <h5 class="mountain-name">{{ mountain.name }}</h5>
      <p class="mountain-info">Pengelola : {{ mountain.manager }}</p>
      <div class="sub-mountain-info">
        <p class="mountain-info">Status : <span :class="['status-badge', mountain.status === 'Buka' ? 'status-open' : 'status-closed']">{{ mountain.status }}</span></p>
        <p class="mountain-info">Kuota : {{ mountain.quota }}</p>
      </div>
      <p class="mountain-info">Lokasi : {{ mountain.location }}</p>
      <p class="mountain-info">Kontak : {{ mountain.contact }}</p>
      <p class="mountain-info">Harga: {{ formatPrice(mountain.price) }}</p>
      <p class="mountain-info">Estimasi : {{ mountain.duration }}</p>
      <p class="mountain-info">Pos : {{ mountain.pos }}</p>
    </div>

    <div class="card-actions">
      <button class="btn-edit" @click="$emit('edit', mountain)">
        <i class="bi bi-pencil-square"></i>
        Edit
      </button>
      <button class="btn-delete" @click="$emit('delete', mountain)">
        <i class="bi bi-trash"></i>
        Hapus
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MountainCard',
  props: {
    mountain: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatPrice(price) {
      return `Rp. ${price.toLocaleString('id-ID')}`;
    }
  }
}
</script>

<style scoped>
.mountain-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mountain-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 1.2rem;
  flex: 1;
}

.sub-mountain-info {
  display: flex;
  justify-content: space-between;
  padding-right: 20px;
}


.mountain-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.8rem;
}

.mountain-info {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.4rem;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-edit {
  background-color: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
}

.btn-edit i,
.btn-delete i {
  font-size: 1rem;
}

.mountain-info:last-child {
  margin-bottom: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-block;
}

.status-open {
  background-color: #10b981;
  color: white;
}

.status-closed {
  background-color: #ef4444;
  color: white;
}

@media (max-width: 576px) {
  .card-image {
    height: 180px;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .mountain-name {
    font-size: 1rem;
  }
  
  .mountain-info {
    font-size: 0.85rem;
  }
}
</style>