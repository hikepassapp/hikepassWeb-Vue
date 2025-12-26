import api from './api'

const BASE_URL = '/api'

const reservationService = {
  // Reservation API
  getReservations() {
    return api.get(`${BASE_URL}/reservations`)
  },

  createReservation(data) {
    return api.post(`${BASE_URL}/reservations`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  getReservationById(id) {
    return api.get(`${BASE_URL}/reservations/${id}`)
  },

  updateReservation(id, data) {
    return api.post(`${BASE_URL}/reservations/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        _method: 'PUT'
      }
    })
  },

  deleteReservation(id) {
    return api.delete(`${BASE_URL}/reservations/${id}`)
  },

  // Checkin API
  getCheckins() {
    return api.get(`${BASE_URL}/checkins`)
  },

  createCheckin(data) {
    return api.post(`${BASE_URL}/checkins`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  getCheckinById(id) {
    return api.get(`${BASE_URL}/checkins/${id}`)
  },

  updateCheckin(id, data) {
    return api.post(`${BASE_URL}/checkins/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        _method: 'PUT'
      }
    })
  },

  deleteCheckin(id) {
    return api.delete(`${BASE_URL}/checkins/${id}`)
  },

  // Checkout API
  getCheckouts() {
    return api.get(`${BASE_URL}/checkouts`)
  },

  createCheckout(data) {
    return api.post(`${BASE_URL}/checkouts`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  getCheckoutById(id) {
    return api.get(`${BASE_URL}/checkouts/${id}`)
  },

  updateCheckout(id, data) {
    return api.post(`${BASE_URL}/checkouts/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        _method: 'PUT'
      }
    })
  },

  deleteCheckout(id) {
    return api.delete(`${BASE_URL}/checkouts/${id}`)
  },

  // History API
  getHistories() {
    return api.get(`${BASE_URL}/histories`)
  },

  getHistoryById(id) {
    return api.get(`${BASE_URL}/histories/${id}`)
  },

  createHistoryFromCheckout(checkoutId) {
    return api.post(`${BASE_URL}/histories/checkout/${checkoutId}`)
  },

  // Mountain API
  getMountains() {
    return api.get(`${BASE_URL}/mountains`)
  }
}

export default reservationService
