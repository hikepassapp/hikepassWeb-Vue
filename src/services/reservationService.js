import apiClient from '../api/index'

// Interceptor khusus untuk reservationService: handle FormData
apiClient.interceptors.request.use(
  (config) => {
    // Jika FormData, biarkan browser set Content-Type dengan boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      // Untuk JSON request, set Content-Type
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const BASE_URL = ''

const reservationService = {
  // Reservation API
  getReservations() {
    return apiClient.get(`${BASE_URL}/reservations`)
  },

  createReservation(data) {
    return apiClient.post(`${BASE_URL}/reservations`, data)
  },

  getReservationById(id) {
    return apiClient.get(`${BASE_URL}/reservations/${id}`)
  },

  updateReservation(id, data) {
    return apiClient.post(`${BASE_URL}/reservations/${id}`, data, {
      params: {
        _method: 'PUT'
      }
    })
  },

  deleteReservation(id) {
    return apiClient.delete(`${BASE_URL}/reservations/${id}`)
  },

  // Checkin API
  getCheckins() {
    return apiClient.get(`${BASE_URL}/checkins`)
  },

  createCheckin(data) {
    return apiClient.post(`${BASE_URL}/checkins`, data)
  },

  getCheckinById(id) {
    return apiClient.get(`${BASE_URL}/checkins/${id}`)
  },

  updateCheckin(id, data) {
    return apiClient.post(`${BASE_URL}/checkins/${id}`, data, {
      params: {
        _method: 'PUT'
      }
    })
  },

  deleteCheckin(id) {
    return apiClient.delete(`${BASE_URL}/checkins/${id}`)
  },

  // Checkout API
  getCheckouts() {
    return apiClient.get(`${BASE_URL}/checkouts`)
  },

  createCheckout(data) {
    return apiClient.post(`${BASE_URL}/checkouts`, data)
  },

  getCheckoutById(id) {
    return apiClient.get(`${BASE_URL}/checkouts/${id}`)
  },

  updateCheckout(id, data) {
    return apiClient.post(`${BASE_URL}/checkouts/${id}`, data, {
      params: {
        _method: 'PUT'
      }
    })
  },

  deleteCheckout(id) {
    return apiClient.delete(`${BASE_URL}/checkouts/${id}`)
  },

  // History API
  getHistories() {
    return apiClient.get(`${BASE_URL}/histories`)
  },

  getHistoryById(id) {
    return apiClient.get(`${BASE_URL}/histories/${id}`)
  },

  createHistoryFromCheckout(checkoutId) {
    return apiClient.post(`${BASE_URL}/histories/checkout/${checkoutId}`)
  },

  // Mountain API
  getMountains() {
    return apiClient.get(`${BASE_URL}/mountains`)
  }
}

export default reservationService
