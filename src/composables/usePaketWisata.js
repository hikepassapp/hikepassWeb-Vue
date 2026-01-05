import { ref, computed } from 'vue';
import paketWisataService from '../services/paketWisataService';
import { getImageUrl } from '../utils/formatters';

export function usePaketWisata() {
  const wisataData = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Fetch data dari API
  const fetchWisataData = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await paketWisataService.getAllPaketWisata(filters);
      
      // Transform data dari API ke format yang sesuai
      wisataData.value = response.data.data.map(item => ({
        id: item.id,
        gambar: getImageUrl(item.image),
        judul: item.judul,
        jenis: item.jenis,
        kontak: item.kontak,
        tanggalTerbit: item.tanggal,
        guide: item.guide,
        harga: item.biaya,
        deskripsi: item.deskripsi,
        penulis: item.penulis,
        titikKumpul: item.titik_kumpul,
        waktu: item.waktu
      }));
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengambil data';
      console.error('Error fetching data:', err);
    } finally {
      loading.value = false;
    }
  };

  // Delete paket wisata
  const deleteWisata = async (id) => {
    try {
      await paketWisataService.deletePaketWisata(id);
      wisataData.value = wisataData.value.filter(item => item.id !== id);
      return { success: true };
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal menghapus data';
      return { success: false, message: error.value };
    }
  };

  return {
    wisataData,
    loading,
    error,
    fetchWisataData,
    deleteWisata
  };
}