import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBeritaEvent } from '@/composables/useBeritaEvent';
import { usePagination } from '@/composables/usePagination';
import { useSearch } from '@/composables/useSearch';
import { useModal } from '@/composables/useModal';

export function useBeritaEventPage() {
  const router = useRouter();
  
  const {
    beritaData,
    loading,
    error,
    fetchBeritaData,
    deleteBeritaEvent
  } = useBeritaEvent();

  const {
    searchQuery,
    filteredData
  } = useSearch(beritaData, ['judul', 'penulis', 'jenis']);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedBerita,
    startIndex,
    changePage,
    updateItemsPerPage
  } = usePagination(filteredData, 10);

  const imageModal = useModal();
  const showDeleteModal = ref(false);
  const selectedBeritaId = ref(null);
  const selectedBeritaName = ref('');

  const loadData = async () => {
    await fetchBeritaData();
  };

  const handleViewDetail = (berita) => {
    router.push(`/berita/detail/${berita.id}`);
  };

  const handleDeleteBerita = (id, name) => {
    selectedBeritaId.value = id;
    selectedBeritaName.value = name;
    showDeleteModal.value = true;
  };

  const confirmDelete = async () => {
    const result = await deleteBeritaEvent(selectedBeritaId.value);
    showDeleteModal.value = false;
    
    if (result.success) {
      if (paginatedBerita.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    } else {
      alert(`Gagal menghapus: ${result.message}`);
    }
  };

  const handleViewImage = (image) => {
    imageModal.openModal(image);
  };

  const handleTambahBerita = () => {
    router.push('/berita/tambah');
  };

  onMounted(() => {
    loadData();
  });

  return {
    beritaData,
    loading,
    error,
    loadData,
    searchQuery,
    filteredData,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedBerita,
    startIndex,
    changePage,
    updateItemsPerPage,
    imageModal,
    showDeleteModal,
    selectedBeritaName,
    handleViewDetail,
    handleDeleteBerita,
    confirmDelete,
    handleViewImage,
    handleTambahBerita
  };
}