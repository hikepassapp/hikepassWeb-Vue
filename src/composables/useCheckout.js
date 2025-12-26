import { ref } from 'vue';
import reservationService from '../services/reservationService';

export function useCheckout() {
  const checkOuts = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchCheckOuts = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await reservationService.getCheckouts();
      const payload = response?.data?.data ?? response?.data ?? [];
      checkOuts.value = Array.isArray(payload) ? payload : (payload || []);
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengambil data check-out';
      console.error('Error fetching check-outs:', err);
    } finally {
      loading.value = false;
    }
  };

  const createCheckout = async (formData) => {
    try {
      const response = await reservationService.createCheckout(formData);
      await fetchCheckOuts(); // Refresh data
      return { success: true, data: response?.data?.data ?? response?.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal melakukan check-out';
      error.value = message;
      return { 
        success: false, 
        message,
        errors: err.response?.data?.errors 
      };
    }
  };

  return {
    checkOuts,
    loading,
    error,
    fetchCheckOuts,
    createCheckout
  };
}
