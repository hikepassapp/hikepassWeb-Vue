<template>
  <div class="informasi-card">
    <div class="card-image">
      <img :src="getImageUrl(info.gambar)" :alt="info.judul" @error="handleImageError" />
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ info.judul }}</h3>
      <div class="card-content">
        <p class="card-label">Deskripsi</p>
        <p class="card-description">{{ truncateText(info.deskripsi, 100) }}</p>
      </div>
    </div>
    <div class="card-actions">
      <button class="btn-edit" @click="$emit('edit', info)">
        <i class="bi bi-pencil-square"></i>
        Edit
      </button>
      <button class="btn-delete" @click="$emit('delete', info.id)">
        <i class="bi bi-trash"></i>
        Hapus
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InformasiCard',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  methods: {
    getImageUrl(gambar) {
      // Jika gambar adalah URL lengkap
      if (gambar && (gambar.startsWith('http://') || gambar.startsWith('https://'))) {
        return gambar;
      }
      // Jika gambar adalah path relatif dari server
      if (gambar) {
        return `http://localhost:8000/storage/${gambar}`;
      }
      // Default placeholder
      return 'https://via.placeholder.com/400x250?text=No+Image';
    },
    handleImageError(e) {
      e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    }
  },
  emits: ['edit', 'delete']
}
</script>

<style scoped>
.informasi-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.informasi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 250px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.informasi-card:hover .card-image img {
  transform: scale(1.05);
}

.card-body {
  padding: 1.5rem;
  flex: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-label {
  font-weight: 600;
  color: #333;
  margin: 0;
  font-size: 0.95rem;
}

.card-description {
  color: #666;
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
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

@media (max-width: 768px) {
  .card-image {
    height: 200px;
  }

  .card-body {
    padding: 1.25rem;
  }

  .card-title {
    font-size: 1.1rem;
  }

  .card-actions {
    padding: 0.875rem 1.25rem;
  }
}
</style>