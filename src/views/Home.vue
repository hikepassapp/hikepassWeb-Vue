<template>
  <div class="home-page">
    <Sidebar />
    
    <div class="main-content">
      <Navbar pageTitle="Dashboard" />
      
      <div class="content-wrapper">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat data dashboard...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <i class="bi bi-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <button @click="fetchDashboardData" class="retry-btn">Coba Lagi</button>
        </div>

        <!-- Dashboard Content -->
        <template v-else>
          <!-- Statistics Cards Row -->
          <div class="stats-row">
            <div class="stat-col">
              <StatCard 
                label="Total Pendapatan"
                :value="dashboardStats.totalRevenue"
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
                label="Jumlah User"
                :value="dashboardStats.totalUsers"
                year="2025"
                iconClass="bi bi-person"
                iconColor="#f59e0b"
                iconBgColor="#fef3c7"
                badgeColor="#fef3c7"
              />
            </div>
            
            <div class="stat-col">
              <StatCard 
                label="Jumlah Gunung"
                :value="dashboardStats.totalMountains"
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
                v-if="chartDataReady"
                title="Statistik Dalam Satu Tahun"
                :chartData="chartData"
                :legends="chartLegends"
                @year-change="handleYearChange"
              />
            </div>
            
            <div class="info-col">
              <div class="info-cards-wrapper">
                <InfoCard 
                  title="Jumlah Laporan"
                  :value="dashboardStats.totalLaporans"
                  badge="Laporan"
                  badgeColor="#10b981"
                />
                
                <InfoCard 
                  title="Jumlah Yang Sedang Naik"
                  :value="dashboardStats.currentClimbers"
                  badge="Pendaki"
                  badgeColor="#ef4444"
                />
              </div>
            </div>
          </div>
        </template>
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
import axios from 'axios'

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
      loading: false,
      error: null,
      chartDataReady: false,
      selectedYear: new Date().getFullYear(),
      dashboardStats: {
        totalRevenue: 0,
        totalUsers: 0,
        totalMountains: 0,
        totalLaporans: 0,
        currentClimbers: 0,
        totalClimbers: 0
      },
      chartData: {
        labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        datasets: [
          {
            label: 'Jumlah Laporan',
            data: Array(12).fill(0),
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
            label: 'Jumlah Pendaki',
            data: Array(12).fill(0),
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
            data: Array(12).fill(0),
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
        { label: 'Jumlah Laporan', color: '#a5b4fc' },
        { label: 'Jumlah Pendaki', color: '#fca5a5' },
        { label: 'Jumlah User', color: '#7dd3fc' }
      ]
    }
  },
  mounted() {
    this.fetchDashboardData()
  },
  methods: {
    getAuthToken() {
      // Ambil token dari localStorage (sesuai dengan login page)
      return localStorage.getItem('token')
    },

    getAxiosConfig() {
      const token = this.getAuthToken()
      
      // Jika tidak ada token, redirect ke login
      if (!token) {
        this.$router.push('/login')
        return null
      }
      
      return {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    },

    async fetchEndpoint(url, name) {
      try {
        const config = this.getAxiosConfig()
        
        // Jika config null (tidak ada token), return empty
        if (!config) {
          return {
            success: false,
            data: [],
            name,
            error: 'No authentication token'
          }
        }
        
        const response = await axios.get(url, config)
        return {
          success: true,
          data: response.data.data || response.data || [],
          name
        }
      } catch (error) {
        // Jika 401 Unauthorized, redirect ke login
        if (error.response && error.response.status === 401) {
          console.error('Session expired or unauthorized')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          this.$router.push('/login')
        }
        
        console.warn(`Failed to fetch ${name}:`, error.message)
        return {
          success: false,
          data: [],
          name,
          error: error.message
        }
      }
    },

    async fetchDashboardData() {
      this.loading = true
      this.error = null
      this.chartDataReady = false

      try {
        // Fetch all data dengan error handling individual
        const results = await Promise.all([
          this.fetchEndpoint('http://127.0.0.1:8000/api/reservations/all', 'reservations'),
          this.fetchEndpoint('http://127.0.0.1:8000/api/checkins', 'checkins'),
          this.fetchEndpoint('http://localhost:8000/api/customers', 'customers'),
          this.fetchEndpoint('http://127.0.0.1:8000/api/mountains', 'mountains'),
          this.fetchEndpoint('http://127.0.0.1:8000/api/laporans', 'laporans')
        ])

        // Check jika semua gagal
        const allFailed = results.every(r => !r.success)
        if (allFailed) {
          throw new Error('Gagal memuat data dashboard. Pastikan server backend berjalan dan Anda sudah login.')
        }

        // Extract data
        const reservations = results[0].data
        const checkins = results[1].data
        const users = results[2].data
        const mountains = results[3].data
        const laporans = results[4].data

        // Calculate statistics
        this.calculateStats(reservations, checkins, users, mountains, laporans)
        
        // Update chart data
        this.updateChartData(reservations, checkins, users, laporans)

        // Set chart ready
        this.$nextTick(() => {
          this.chartDataReady = true
        })

        // Show warning for failed endpoints
        const failedEndpoints = results.filter(r => !r.success)
        if (failedEndpoints.length > 0) {
          console.warn('Some endpoints failed:', failedEndpoints.map(f => f.name))
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        this.error = err.message || 'Gagal memuat data dashboard. Pastikan server backend berjalan.'
      } finally {
        this.loading = false
      }
    },

    calculateStats(reservations, checkins, users, mountains, laporans) {
      // Total Revenue from reservations/all
      this.dashboardStats.totalRevenue = Array.isArray(reservations) 
        ? reservations.reduce((sum, res) => {
            return sum + (parseFloat(res.price || res.total_price || res.harga || 0))
          }, 0)
        : 0

      // Total Users
      this.dashboardStats.totalUsers = Array.isArray(users) ? users.length : 0

      // Total Mountains
      this.dashboardStats.totalMountains = Array.isArray(mountains) ? mountains.length : 0

      // Total Laporans
      this.dashboardStats.totalLaporans = Array.isArray(laporans) ? laporans.length : 0

      // Current Climbers (yang sedang naik = jumlah checkins)
      this.dashboardStats.currentClimbers = Array.isArray(checkins) ? checkins.length : 0

      // Total Climbers = total dari reservations/all
      this.dashboardStats.totalClimbers = Array.isArray(reservations) ? reservations.length : 0
    },

    updateChartData(reservations, checkins, users, laporans) {
      // Initialize arrays for each month (0-11)
      const laporansByMonth = Array(12).fill(0)
      const climbersByMonth = Array(12).fill(0)
      const usersByMonth = Array(12).fill(0)

      // Count laporans by month
      if (Array.isArray(laporans)) {
        laporans.forEach(laporan => {
          try {
            const dateStr = laporan.created_at || laporan.tanggal || laporan.date
            if (dateStr) {
              const date = new Date(dateStr)
              if (date.getFullYear() === this.selectedYear) {
                const month = date.getMonth()
                if (month >= 0 && month < 12) {
                  laporansByMonth[month]++
                }
              }
            }
          } catch (e) {
            console.warn('Error parsing laporan date:', e)
          }
        })
      }

      // Count climbers by month (from reservations/all)
      if (Array.isArray(reservations)) {
        reservations.forEach(reservation => {
          try {
            const dateStr = reservation.created_at || reservation.tanggal_naik || reservation.check_in_date || reservation.tanggal
            if (dateStr) {
              const date = new Date(dateStr)
              if (date.getFullYear() === this.selectedYear) {
                const month = date.getMonth()
                if (month >= 0 && month < 12) {
                  climbersByMonth[month]++
                }
              }
            }
          } catch (e) {
            console.warn('Error parsing reservation date:', e)
          }
        })
      }

      // Count users by month
      if (Array.isArray(users)) {
        users.forEach(user => {
          try {
            const dateStr = user.created_at || user.tanggal_daftar || user.registration_date
            if (dateStr) {
              const date = new Date(dateStr)
              if (date.getFullYear() === this.selectedYear) {
                const month = date.getMonth()
                if (month >= 0 && month < 12) {
                  usersByMonth[month]++
                }
              }
            }
          } catch (e) {
            console.warn('Error parsing user date:', e)
          }
        })
      }

      // Update chart datasets
      this.chartData.datasets[0].data = [...laporansByMonth]
      this.chartData.datasets[1].data = [...climbersByMonth]
      this.chartData.datasets[2].data = [...usersByMonth]
    },

    handleYearChange(year) {
      this.selectedYear = year
      this.chartDataReady = false
      this.fetchDashboardData()
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
  color: #ef4444;
  text-align: center;
  padding: 2rem;
}

.error-state i {
  font-size: 3rem;
}

.error-state p {
  max-width: 500px;
}

.retry-btn {
  padding: 0.5rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #2563eb;
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