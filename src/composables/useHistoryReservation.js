import { ref } from 'vue';
import reservationService from '../services/reservationService';

export function useHistoryReservation() {
  const histories = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchHistories = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await reservationService.getHistories();
      const payload = response?.data?.data ?? response?.data ?? [];
      histories.value = Array.isArray(payload) ? payload : (payload || []);
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengambil data riwayat';
      console.error('Error fetching histories:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    histories,
    loading,
    error,
    fetchHistories
  };
}
