import { ref } from 'vue';
import beritaEventService from '../services/beritaEventService';
import { getImageUrl } from '../utils/formatters';

export function useBeritaEvent() {
  const beritaData = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const fetchBeritaData = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await beritaEventService.getAllBeritaEvent(filters);
      beritaData.value = response.data.data.map(item => ({
        id: item.id,
        gambar: getImageUrl(item.image),
        judul: item.judul,
        jenis: item.jenis,
        tanggalTerbit: item.tanggal_publish,
        penulis: item.penulis,
        deskripsi: item.deskripsi
      }));
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengambil data';
      console.error('Error fetching data:', err);
    } finally {
      loading.value = false;
    }
  };
  const deleteBeritaEvent = async (id) => {
    try {
      await beritaEventService.deleteBeritaEvent(id);
      beritaData.value = beritaData.value.filter(item => item.id !== id);
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal menghapus data';
      return { success: false, message: error.value };
    }
  };

  return {
    beritaData,
    loading,
    error,
    fetchBeritaData,
    deleteBeritaEvent
  };
}