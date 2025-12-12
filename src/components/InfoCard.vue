<template>
  <div class="info-card">
    <h3 class="info-title">{{ title }}</h3>
    <div class="info-content">
      <h2 class="info-value">{{ value }}</h2>
      <div class="info-badge">
        <span class="badge-dot" :style="{ backgroundColor: badgeColor }"></span>
        <span class="badge-text">{{ badge }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    badge: {
      type: String,
      required: true
    },
    badgeColor: {
      type: String,
      default: '#10b981'
    }
  }
}
</script>

<style scoped>
.info-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 100%;
}

.info-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.info-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  line-height: 1;
}

.info-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.badge-text {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

@media (max-width: 768px) {
  .info-value {
    font-size: 2rem;
  }
}
</style>