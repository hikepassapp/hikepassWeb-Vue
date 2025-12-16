<template>
  <div class="home-page">
    <Sidebar />
    
    <div class="main-content">
      <Navbar pageTitle="Dashboard" />
      
      <div class="content-wrapper">
        <!-- Statistics Cards Row -->
        <div class="stats-row">
          <div class="stat-col">
            <StatCard 
              label="Total Pendapatan / Tahun"
              :value="17144000"
              year="2025"
              iconClass="bi bi-bank"
              iconColor="#10b981"
              iconBgColor="#d4f4dd"
              badgeColor="#d4f4dd"
              :formatCurrency="true"
            />
          </div>
          
          <div class="stat-col">
            <StatCard 
              label="Jumlah Reservasi / Tahun"
              :value="13391"
              year="2025"
              iconClass="bi bi-ticket-perforated"
              iconColor="#f59e0b"
              iconBgColor="#fef3c7"
              badgeColor="#fef3c7"
            />
          </div>
          
          <div class="stat-col">
            <StatCard 
              label="Jumlah Gunung"
              :value="1"
              year="2025"
              iconClass="bi bi-triangle"
              iconColor="#3b82f6"
              iconBgColor="#dbeafe"
              badgeColor="#dbeafe"
            />
          </div>
        </div>
        
        <!-- Chart and Info Cards Row -->
        <div class="chart-info-row">
          <div class="chart-col">
            <ChartCard 
              title="Statistik Dalam Satu Tahun"
              :chartData="chartData"
              :legends="chartLegends"
              @year-change="handleYearChange"
            />
          </div>
          
          <div class="info-col">
            <div class="info-cards-wrapper">
              <InfoCard 
                title="Jumlah Laporan Bulan Ini"
                :value="127"
                badge="Laporan"
                badgeColor="#10b981"
              />
              
              <InfoCard 
                title="Jumlah Kecelakaan Bulan Ini"
                :value="12"
                badge="Pendaki"
                badgeColor="#ef4444"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import StatCard from '../components/StatCard.vue'
import ChartCard from '../components/ChartCard.vue'
import InfoCard from '../components/InfoCard.vue'

export default {
  name: 'DashboardView',
  components: {
    Sidebar,
    Navbar,
    StatCard,
    ChartCard,
    InfoCard
  },
  data() {
    return {
      chartData: {
        labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        datasets: [
          {
            label: 'Jumlah Korban',
            data: [110, 80, 90, 130, 150, 130, 120, 120, 200, 190, 140, 140],
            borderColor: '#a5b4fc',
            backgroundColor: 'rgba(165, 180, 252, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#a5b4fc',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          },
          {
            label: 'Jumlah Reservasi',
            data: [100, 70, 190, 90, 110, 100, 100, 100, 110, 110, 110, 120],
            borderColor: '#fca5a5',
            backgroundColor: 'rgba(252, 165, 165, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#fca5a5',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          },
          {
            label: 'Jumlah User',
            data: [110, 80, 280, 130, 150, 130, 110, 110, 200, 190, 140, 140],
            borderColor: '#7dd3fc',
            backgroundColor: 'rgba(125, 211, 252, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#7dd3fc',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }
        ]
      },
      chartLegends: [
        { label: 'Jumlah Korban', color: '#a5b4fc' },
        { label: 'Jumlah Reservasi', color: '#fca5a5' },
        { label: 'Jumlah User', color: '#7dd3fc' }
      ]
    }
  },
  methods: {
    handleYearChange(year) {
      console.log('Year changed to:', year)
      // Update chart data based on selected year
    }
  }
}
</script>

<style scoped>
.home-page {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  margin-left: 250px;
}

.content-wrapper {
  padding: 2rem;
}

/* Statistics Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-col {
  min-width: 0;
}

/* Chart and Info Row */
.chart-info-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.chart-col {
  min-width: 0;
}

.info-col {
  min-width: 0;
}

.info-cards-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .chart-info-row {
    grid-template-columns: 1.5fr 1fr;
  }
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 200px;
  }
  
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-info-row {
    grid-template-columns: 1fr;
  }
  
  .info-cards-wrapper {
    flex-direction: row;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .stats-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .chart-info-row {
    gap: 1rem;
  }
  
  .info-cards-wrapper {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .content-wrapper {
    padding: 1rem;
  }
}
</style>