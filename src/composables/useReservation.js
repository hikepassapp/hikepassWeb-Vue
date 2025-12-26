import { ref } from 'vue';
import reservationService from '../services/reservationService';

export function useReservation() {
  const reservations = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchReservations = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await reservationService.getReservations();
      const payload = response?.data?.data ?? response?.data ?? [];
      reservations.value = Array.isArray(payload) ? payload : (payload || []);
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengambil data reservasi';
      console.error('Error fetching reservations:', err);
    } finally {
      loading.value = false;
    }
  };

  const createReservation = async (formData) => {
    try {
      const response = await reservationService.createReservation(formData);
      await fetchReservations(); // Refresh data regardless
      return { success: true, data: response?.data?.data ?? response?.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal membuat reservasi';
      error.value = message;
      return { 
        success: false, 
        message,
        errors: err.response?.data?.errors 
      };
    }
  };

  const updateReservation = async (id, formData) => {
    try {
      const response = await reservationService.updateReservation(id, formData);
      await fetchReservations(); // Refresh data
      return { success: true, data: response?.data?.data ?? response?.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal mengupdate reservasi';
      error.value = message;
      return { 
        success: false, 
        message,
        errors: err.response?.data?.errors 
      };
    }
  };

  const deleteReservation = async (id) => {
    try {
      await reservationService.deleteReservation(id);
      reservations.value = reservations.value.filter(item => item.id !== id);
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal menghapus reservasi';
      return { success: false, message: error.value };
    }
  };

  return {
    reservations,
    loading,
    error,
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation
  };
}
