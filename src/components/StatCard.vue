<template>
  <div class="stat-card">
    <div class="stat-content">
      <div class="stat-info">
        <p class="stat-label">{{ label }}</p>
        <h2 class="stat-value">{{ formattedValue }}</h2>
        <span class="stat-badge" :style="{ backgroundColor: badgeColor }">
          {{ year }}
        </span>
      </div>
      <div class="stat-icon" :style="{ backgroundColor: iconBgColor }">
        <i :class="iconClass" :style="{ color: iconColor }"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    year: {
      type: [String, Number],
      default: '2025'
    },
    iconClass: {
      type: String,
      required: true
    },
    iconColor: {
      type: String,
      default: '#1a7a7a'
    },
    iconBgColor: {
      type: String,
      default: '#e0f7f7'
    },
    badgeColor: {
      type: String,
      default: '#d4f4dd'
    },
    formatCurrency: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedValue() {
      if (this.formatCurrency) {
        return `Rp.${this.value.toLocaleString('id-ID')}`;
      }
      return typeof this.value === 'number' ? this.value.toLocaleString('id-ID') : this.value;
    }
  }
}
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0.5rem 0;
  line-height: 1.2;
}

.stat-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a7a7a;
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon i {
  font-size: 2rem;
}

@media (max-width: 768px) {
  .stat-value {
    font-size: 1.6rem;
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
  }
  
  .stat-icon i {
    font-size: 1.7rem;
  }
}
</style>