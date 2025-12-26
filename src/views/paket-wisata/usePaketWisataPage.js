import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePaketWisata } from '@/composables/usePaketWisata';
import { usePagination } from '@/composables/usePagination';
import { useSearch } from '@/composables/useSearch';
import { useModal } from '@/composables/useModal';

export function usePaketWisataPage() {
  const router = useRouter();
  
  const {
    wisataData,
    loading,
    error,
    fetchWisataData,
    deleteWisata
  } = usePaketWisata();

  const {
    searchQuery,
    filteredData
  } = useSearch(wisataData, ['judul', 'guide', 'jenis', 'kontak', 'penulis']);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedWisata,
    startIndex,
    changePage,
    updateItemsPerPage
  } = usePagination(filteredData, 10);

  const imageModal = useModal();
  const detailModal = useModal();

  const loadData = async () => {
    await fetchWisataData();
  };
 console.log('Initial modal state:', detailModal.isOpen.value);
  const handleViewDetail = (wisata) => {
    console.log('handleViewDetail called with:', wisata);
    detailModal.openModal(wisata);
  };

  const handleViewImage = (image) => {
    imageModal.openModal(image);
  };

  const handleTambahWisata = () => {
    router.push('/wisata/tambah');
  };

  onMounted(() => {
    console.log('Component mounted, loading data...');
    loadData();
  });

  return {
    wisataData,
    loading,
    error,
    loadData,
    searchQuery,
    filteredData,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedWisata,
    startIndex,
    changePage,
    updateItemsPerPage,
    imageModal,
    detailModal,
    handleViewDetail,
    handleViewImage,
    handleTambahWisata,
    deleteWisata  
  };
}