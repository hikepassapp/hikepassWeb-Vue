<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <select v-model="selectedYear" @change="$emit('year-change', selectedYear)" class="year-select">
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>
    
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    
    <div class="chart-legend">
      <div v-for="legend in legends" :key="legend.label" class="legend-item">
        <span class="legend-dot" :style="{ backgroundColor: legend.color }"></span>
        <span class="legend-label">{{ legend.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'ChartCard',
  props: {
    title: {
      type: String,
      required: true
    },
    chartData: {
      type: Object,
      required: true
    },
    legends: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedYear: 2024,
      years: [2022, 2023, 2024, 2025],
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
    initChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')
      
      this.chart = new Chart(ctx, {
        type: 'line',
        data: this.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2.5,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#333',
              bodyColor: '#666',
              borderColor: '#ddd',
              borderWidth: 1,
              padding: 12,
              displayColors: true,
              boxWidth: 10,
              boxHeight: 10
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f0f0f0',
                drawBorder: false
              },
              ticks: {
                color: '#999',
                font: {
                  size: 11
                }
              }
            },
            x: {
              grid: {
                display: false,
                drawBorder: false
              },
              ticks: {
                color: '#999',
                font: {
                  size: 11
                }
              }
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.year-select {
  padding: 0.4rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #666;
  background-color: white;
  cursor: pointer;
}

.chart-container {
  margin-bottom: 1rem;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-label {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .chart-legend {
    gap: 1rem;
  }
}
</style>