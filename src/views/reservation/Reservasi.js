import reservationService from '../../services/reservationService'

export default {
  name: 'ReservasiView',
  
  data() {
    return {
      activeTab: 'reservasi',
      searchQuery: '',
      itemsPerPage: 10,
      currentPage: 1,
      loading: false,
      
      // Reservation data
      reservations: [],
      showFormModal: false,
      showDetailModal: false,
      showDeleteModal: false,
      isEditMode: false,
      selectedReservation: null,
      deleteReservationId: null,
      formErrors: {},
      
      // Checkin data
      checkIns: [],
      showCheckinModal: false,
      selectedCheckinReservation: null,
      
      // Checkout data
      checkOuts: [],
      showCheckoutModal: false,
      selectedCheckinForCheckout: null,
      
      // History data
      histories: [],
      showHistoryDetailModal: false,
      selectedHistory: null,
      
      // Other
      mountains: [],
      tabs: [
        { id: 'reservasi', label: 'Reservasi' },
        { id: 'checkin', label: 'Check-In' },
        { id: 'checkout', label: 'Check-Out' },
        { id: 'history', label: 'Riwayat' }
      ]
    }
  },
  
  computed: {
    sectionTitle() {
      const titles = {
        reservasi: 'Daftar Reservasi',
        checkin: 'Daftar Check-in',
        checkout: 'Daftar Check-out',
        history: 'Daftar Riwayat'
      }
      return titles[this.activeTab]
    },
    
    filteredReservations() {
      if (!this.searchQuery) return this.reservations
      const query = this.searchQuery.toLowerCase()
      return this.reservations.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.nik.includes(query) ||
        r.phone_number.includes(query) ||
        r.id.toString().includes(query)
      )
    },
    
    filteredCheckIns() {
      if (!this.searchQuery) return this.checkIns
      const query = this.searchQuery.toLowerCase()
      return this.checkIns.filter(c =>
        c.reservation?.name?.toLowerCase().includes(query) ||
        c.reservation?.nik?.includes(query) ||
        c.reservation_id?.toString().includes(query)
      )
    },
    
    filteredCheckOuts() {
      if (!this.searchQuery) return this.checkOuts
      const query = this.searchQuery.toLowerCase()
      return this.checkOuts.filter(c =>
        c.checkin?.reservation?.name?.toLowerCase().includes(query) ||
        c.checkin?.reservation?.nik?.includes(query) ||
        c.checkin?.reservation_id?.toString().includes(query)
      )
    },
    
    filteredHistories() {
      if (!this.searchQuery) return this.histories
      const query = this.searchQuery.toLowerCase()
      return this.histories.filter(h =>
        h.checkout?.checkin?.reservation?.name?.toLowerCase().includes(query) ||
        h.checkout?.checkin?.reservation?.nik?.includes(query)
      )
    },
    
    currentFilteredData() {
      const dataMap = {
        reservasi: this.filteredReservations,
        checkin: this.filteredCheckIns,
        checkout: this.filteredCheckOuts,
        history: this.filteredHistories
      }
      return dataMap[this.activeTab]
    },
    
    totalPages() {
      return Math.ceil(this.currentFilteredData.length / this.itemsPerPage)
    },
    
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.currentFilteredData.slice(start, end)
    }
  },
  
  mounted() {
    this.fetchAllData()
  },
  
  methods: {
    async fetchAllData() {
      this.loading = true
      try {
        await Promise.all([
          this.fetchReservations(),
          this.fetchMountains(),
          this.fetchCheckIns(),
          this.fetchCheckOuts(),
          this.fetchHistories()
        ])
      } finally {
        this.loading = false
      }
    },
    
    async fetchReservations() {
      try {
        const response = await reservationService.getReservations()
        if (response.data.success) {
          this.reservations = response.data.data || []
        }
      } catch (error) {
        console.error('Error fetching reservations:', error)
        this.$emit('show-notification', {
          type: 'error',
          message: 'Gagal memuat data reservasi'
        })
      }
    },
    
    async fetchMountains() {
      try {
        const response = await reservationService.getMountains()
        let data = response.data
        if (data.success) {
          this.mountains = data.data || []
        } else if (Array.isArray(data)) {
          this.mountains = data
        } else if (data.data) {
          this.mountains = Array.isArray(data.data) ? data.data : []
        }
      } catch (error) {
        console.error('Error fetching mountains:', error)
        this.mountains = []
      }
    },
    
    async fetchCheckIns() {
      try {
        const response = await reservationService.getCheckins()
        if (response.data.success) {
          this.checkIns = response.data.data || []
        }
      } catch (error) {
        console.error('Error fetching check-ins:', error)
      }
    },
    
    async fetchCheckOuts() {
      try {
        const response = await reservationService.getCheckouts()
        if (response.data.success) {
          this.checkOuts = response.data.data || []
        }
      } catch (error) {
        console.error('Error fetching check-outs:', error)
      }
    },
    
    async fetchHistories() {
      try {
        const response = await reservationService.getHistories()
        if (response.data.success) {
          this.histories = response.data.data || []
        }
      } catch (error) {
        console.error('Error fetching histories:', error)
      }
    },
    
    changeTab(tabId) {
      this.activeTab = tabId
      this.currentPage = 1
      this.searchQuery = ''
    },
    
    changePage(page) {
      this.currentPage = page
    },
    
    updateItemsPerPage() {
      this.currentPage = 1
    },
    
    // Reservation Methods
    openAddReservationModal() {
      this.isEditMode = false
      this.selectedReservation = null
      this.formErrors = {}
      this.showFormModal = true
    },
    
    openEditReservationModal(reservation) {
      this.isEditMode = true
      this.selectedReservation = reservation
      this.formErrors = {}
      this.showFormModal = true
    },
    
    openDeleteReservationModal(reservationId) {
      this.deleteReservationId = reservationId
      this.showDeleteModal = true
    },
    
    async submitReservationForm(formData, formDataObj) {
      try {
        let response
        if (this.isEditMode) {
          response = await reservationService.updateReservation(
            this.selectedReservation.id,
            formDataObj
          )
        } else {
          response = await reservationService.createReservation(formDataObj)
        }
        
        if (response.data.success) {
          this.$emit('show-notification', {
            type: 'success',
            message: response.data.message || 'Data reservasi berhasil disimpan'
          })
          this.closeFormModal()
          await this.fetchReservations()
        }
      } catch (error) {
        if (error.response?.status === 422) {
          this.formErrors = error.response.data.errors || {}
        } else {
          this.$emit('show-notification', {
            type: 'error',
            message: error.response?.data?.message || 'Gagal menyimpan data reservasi'
          })
        }
      }
    },
    
    async confirmDeleteReservation() {
      try {
        const response = await reservationService.deleteReservation(this.deleteReservationId)
        if (response.data.success) {
          this.$emit('show-notification', {
            type: 'success',
            message: response.data.message || 'Reservasi berhasil dihapus'
          })
          this.closeDeleteModal()
          await this.fetchReservations()
        }
      } catch (error) {
        this.$emit('show-notification', {
          type: 'error',
          message: error.response?.data?.message || 'Gagal menghapus reservasi'
        })
      }
    },
    
    viewReservationDetail(reservation) {
      this.selectedReservation = reservation
      this.showDetailModal = true
    },
    
    // Checkin Methods
    openCheckinModal(reservation) {
      this.selectedCheckinReservation = reservation
      this.showCheckinModal = true
    },
    
    async submitCheckinForm(formData) {
      try {
        const response = await reservationService.createCheckin(formData)
        if (response.data.success) {
          this.$emit('show-notification', {
            type: 'success',
            message: response.data.message || 'Check-in berhasil'
          })
          this.closeCheckinModal()
          await Promise.all([
            this.fetchCheckIns(),
            this.fetchReservations()
          ])
          this.activeTab = 'checkin'
        }
      } catch (error) {
        this.$emit('show-notification', {
          type: 'error',
          message: error.response?.data?.message || 'Gagal melakukan check-in'
        })
      }
    },
    
    viewCheckinDetail(checkin) {
      // Find the full checkin data with relations
      const fullCheckin = this.checkIns.find(c => c.id === checkin.id)
      this.selectedCheckinForCheckout = fullCheckin
    },
    
    // Checkout Methods
    openCheckoutModal(checkin) {
      this.selectedCheckinForCheckout = checkin
      this.showCheckoutModal = true
    },
    
    async submitCheckoutForm(formData) {
      try {
        const response = await reservationService.createCheckout(formData)
        if (response.data.success) {
          this.$emit('show-notification', {
            type: 'success',
            message: response.data.message || 'Check-out berhasil'
          })
          this.closeCheckoutModal()
          await Promise.all([
            this.fetchCheckOuts(),
            this.fetchCheckIns(),
            this.fetchHistories()
          ])
          this.activeTab = 'checkout'
        }
      } catch (error) {
        this.$emit('show-notification', {
          type: 'error',
          message: error.response?.data?.message || 'Gagal melakukan check-out'
        })
      }
    },
    
    // History Methods
    viewHistoryDetail(history) {
      this.selectedHistory = history
      this.showHistoryDetailModal = true
    },
    
    // Modal close methods
    closeFormModal() {
      this.showFormModal = false
      this.selectedReservation = null
      this.formErrors = {}
    },
    
    closeDetailModal() {
      this.showDetailModal = false
      this.selectedReservation = null
    },
    
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteReservationId = null
    },
    
    closeCheckinModal() {
      this.showCheckinModal = false
      this.selectedCheckinReservation = null
    },
    
    closeCheckoutModal() {
      this.showCheckoutModal = false
      this.selectedCheckinForCheckout = null
    },
    
    closeHistoryDetailModal() {
      this.showHistoryDetailModal = false
      this.selectedHistory = null
    }
  }
}
