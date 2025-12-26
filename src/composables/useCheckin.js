import { ref } from 'vue';
import reservationService from '../services/reservationService';

export function useCheckin() {
  const checkIns = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchCheckIns = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await reservationService.getCheckins();
      const payload = response?.data?.data ?? response?.data ?? [];
      checkIns.value = Array.isArray(payload) ? payload : (payload || []);
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengambil data check-in';
      console.error('Error fetching check-ins:', err);
    } finally {
      loading.value = false;
    }
  };

  const createCheckin = async (formData) => {
    try {
      const response = await reservationService.createCheckin(formData);
      await fetchCheckIns(); // Refresh data
      return { success: true, data: response?.data?.data ?? response?.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal melakukan check-in';
      error.value = message;
      return { 
        success: false, 
        message,
        errors: err.response?.data?.errors 
      };
    }
  };

  return {
    checkIns,
    loading,
    error,
    fetchCheckIns,
    createCheckin
  };
}
