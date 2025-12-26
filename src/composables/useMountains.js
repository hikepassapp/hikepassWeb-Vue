import { ref } from 'vue';
import reservationService from '../services/reservationService';

export function useMountains() {
  const mountains = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchMountains = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await reservationService.getMountains();
      // Flexible parsing: support both wrapped { data: [...] } and raw arrays
      const payload = response?.data?.data ?? response?.data ?? [];
      mountains.value = Array.isArray(payload) ? payload : (payload?.data ?? []);
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengambil data gunung';
      console.error('Error fetching mountains:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    mountains,
    loading,
    error,
    fetchMountains
  };
}
