import apiClient from './api';

export default {
  getAllBeritaEvent(params = {}) {
    return apiClient.get('/berita-event', { params });
  },

  getBeritaEventById(id) {
    return apiClient.get(`/berita-event/${id}`);
  },

  createBeritaEvent(formData) {
    return apiClient.post('/berita-event', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

updateBeritaEvent(id, formData) {
  return apiClient.put(`/berita-event/${id}`, formData);
},

  deleteBeritaEvent(id) {
    return apiClient.delete(`/berita-event/${id}`);
  }
};