import apiClient from './api';

export default {
  getAllPaketWisata(params = {}) {
    return apiClient.get('/paket-wisata', { params });
  },

  getPaketWisataById(id) {
    return apiClient.get(`/paket-wisata/${id}`);
  },

  createPaketWisata(formData) {
    return apiClient.post('/paket-wisata', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updatePaketWisata(id, formData) {
    return apiClient.put(`/paket-wisata/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deletePaketWisata(id) {
    return apiClient.delete(`/paket-wisata/${id}`);
  }
};
