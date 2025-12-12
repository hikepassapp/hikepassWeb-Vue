<template>
  <div class="mountain-card">
    <div class="card-image">
      <img :src="mountain.image" :alt="mountain.name" />
    </div>
    
    <div class="card-body">
      <h5 class="mountain-name">{{ mountain.name }}</h5>
      <p class="mountain-info">{{ mountain.lmdh }}</p>
      <p class="mountain-info">Lokasi : {{ mountain.location }}</p>
      <p class="mountain-info">Kontak: {{ mountain.contact }}</p>
      <p class="mountain-info">Harga: {{ formatPrice(mountain.price) }}</p>
      <p class="mountain-info">Estimasi : {{ mountain.duration }}</p>
      <p class="mountain-info">Pos : {{ mountain.pos }}</p>
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

.mountain-info:last-child {
  margin-bottom: 0;
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