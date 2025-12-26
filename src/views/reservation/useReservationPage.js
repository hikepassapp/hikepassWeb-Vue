import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReservation } from '@/composables/useReservation';
import { useCheckin } from '@/composables/useCheckin';
import { useCheckout } from '@/composables/useCheckout';
import { useHistoryReservation } from '@/composables/useHistoryReservation';
import { useMountains } from '@/composables/useMountains';
import { usePagination } from '@/composables/usePagination';
import { useSearch } from '@/composables/useSearch';

export function useReservationPage() {
  const router = useRouter();

  // Tab Management
  const activeTab = ref('reservasi');
  const tabs = [
    { id: 'reservasi', label: 'Reservasi' },
    { id: 'checkin', label: 'Check-In' },
    { id: 'checkout', label: 'Check-Out' },
    { id: 'history', label: 'Riwayat' }
  ];

  // Data Composables
  const reservationState = useReservation();
  const checkinState = useCheckin();
  const checkoutState = useCheckout();
  const historyState = useHistoryReservation();
  const mountainsState = useMountains();

  // Search functionality
  const { searchQuery, filteredData: filteredReservations } = useSearch(
    reservationState.reservations,
    ['name', 'nik', 'phone_number', 'id']
  );

  const { filteredData: filteredCheckIns } = useSearch(
    checkinState.checkIns,
    ['reservation.name', 'reservation.nik', 'reservation_id']
  );

  const { filteredData: filteredCheckOuts } = useSearch(
    checkoutState.checkOuts,
    ['checkin.reservation.name', 'checkin.reservation.nik', 'checkin.reservation_id']
  );

  const { filteredData: filteredHistories } = useSearch(
    historyState.histories,
    ['checkout.checkin.reservation.name', 'checkout.checkin.reservation.nik']
  );

  // Current filtered data based on active tab
  const currentFilteredData = computed(() => {
    const dataMap = {
      reservasi: filteredReservations.value,
      checkin: filteredCheckIns.value,
      checkout: filteredCheckOuts.value,
      history: filteredHistories.value
    };
    return dataMap[activeTab.value];
  });

  // Pagination
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedData,
    changePage,
    updateItemsPerPage
  } = usePagination(currentFilteredData, 10);

  // Modal States
  const showFormModal = ref(false);
  const showDetailModal = ref(false);
  const showDeleteModal = ref(false);
  const showCheckinModal = ref(false);
  const showCheckoutModal = ref(false);
  const showHistoryDetailModal = ref(false);

  const isEditMode = ref(false);
  const selectedReservation = ref(null);
  const selectedCheckinReservation = ref(null);
  const selectedCheckinForCheckout = ref(null);
  const selectedHistory = ref(null);
  const deleteReservationId = ref(null);
  const formErrors = ref({});

  // Computed
  const sectionTitle = computed(() => {
    const titles = {
      reservasi: 'Daftar Reservasi',
      checkin: 'Daftar Check-in',
      checkout: 'Daftar Check-out',
      history: 'Daftar Riwayat'
    };
    return titles[activeTab.value];
  });

  const loading = computed(() => {
    return reservationState.loading.value || 
           checkinState.loading.value || 
           checkoutState.loading.value || 
           historyState.loading.value;
  });

  // Methods - Data Loading
  const fetchAllData = async () => {
    await Promise.all([
      reservationState.fetchReservations(),
      checkinState.fetchCheckIns(),
      checkoutState.fetchCheckOuts(),
      historyState.fetchHistories(),
      mountainsState.fetchMountains()
    ]);
  };

  // Methods - Tab Management
  const changeTab = (tabId) => {
    activeTab.value = tabId;
    currentPage.value = 1;
    searchQuery.value = '';
  };

  // Methods - Reservation Modal Handlers
  const openAddReservationModal = () => {
    isEditMode.value = false;
    selectedReservation.value = null;
    formErrors.value = {};
    showFormModal.value = true;
  };

  const openEditReservationModal = (reservation) => {
    isEditMode.value = true;
    selectedReservation.value = { ...reservation };
    formErrors.value = {};
    showFormModal.value = true;
  };

  const openDetailReservationModal = (reservation) => {
    selectedReservation.value = reservation;
    showDetailModal.value = true;
  };

  const openDeleteReservationModal = (id) => {
    deleteReservationId.value = id;
    showDeleteModal.value = true;
  };

  const closeFormModal = () => {
    showFormModal.value = false;
    isEditMode.value = false;
    selectedReservation.value = null;
    formErrors.value = {};
  };

  const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedReservation.value = null;
  };

  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    deleteReservationId.value = null;
  };

  // Methods - Reservation CRUD
  const submitReservationForm = async (formData) => {
    formErrors.value = {};
    
    let result;
    if (isEditMode.value && selectedReservation.value) {
      result = await reservationState.updateReservation(selectedReservation.value.id, formData);
    } else {
      result = await reservationState.createReservation(formData);
    }

    if (result.success) {
      closeFormModal();
      return { success: true };
    } else {
      if (result.errors) {
        formErrors.value = result.errors;
      }
      return { success: false, message: result.message };
    }
  };

  const confirmDeleteReservation = async () => {
    const result = await reservationState.deleteReservation(deleteReservationId.value);
    
    if (result.success) {
      closeDeleteModal();
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  // Methods - Checkin Handlers
  const openCheckinModal = (reservation) => {
    selectedCheckinReservation.value = reservation;
    showCheckinModal.value = true;
    closeDetailModal();
  };

  const closeCheckinModal = () => {
    showCheckinModal.value = false;
    selectedCheckinReservation.value = null;
  };

  const submitCheckinForm = async (formData) => {
    const result = await checkinState.createCheckin(formData.data);
    
    if (result.success) {
      closeCheckinModal();
      activeTab.value = 'checkin';
      await reservationState.fetchReservations(); // Refresh reservation list
      return { success: true };
    }
    return { success: false, message: result.message, errors: result.errors };
  };

  const openDetailCheckinModal = (checkin) => {
    selectedCheckinForCheckout.value = checkin;
    showDetailModal.value = true;
  };

  // Methods - Checkout Handlers
  const openCheckoutModal = (checkin) => {
    selectedCheckinForCheckout.value = checkin;
    showCheckoutModal.value = true;
    closeDetailModal();
  };

  const closeCheckoutModal = () => {
    showCheckoutModal.value = false;
    selectedCheckinForCheckout.value = null;
  };

  const submitCheckoutForm = async (formData) => {
    const result = await checkoutState.createCheckout(formData.data);
    
    if (result.success) {
      closeCheckoutModal();
      activeTab.value = 'checkout';
      await checkinState.fetchCheckIns(); // Refresh checkin list
      return { success: true };
    }
    return { success: false, message: result.message, errors: result.errors };
  };

  const openDetailCheckoutModal = (checkout) => {
    selectedHistory.value = { checkout };
    showDetailModal.value = true;
  };

  const finishCheckout = async () => {
    closeDetailModal();
    activeTab.value = 'history';
    await Promise.all([
      checkoutState.fetchCheckOuts(),
      historyState.fetchHistories()
    ]);
  };

  // Methods - History Handlers
  const openHistoryDetailModal = (history) => {
    selectedHistory.value = history;
    showHistoryDetailModal.value = true;
  };

  const closeHistoryDetailModal = () => {
    showHistoryDetailModal.value = false;
    selectedHistory.value = null;
  };

  // Lifecycle
  onMounted(() => {
    fetchAllData();
  });

  return {
    // Tab
    activeTab,
    tabs,
    changeTab,
    sectionTitle,

    // Data
    reservations: reservationState.reservations,
    checkIns: checkinState.checkIns,
    checkOuts: checkoutState.checkOuts,
    histories: historyState.histories,
    mountains: mountainsState.mountains,

    // States
    loading,
    searchQuery,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData,
    currentFilteredData,

    // Modal States
    showFormModal,
    showDetailModal,
    showDeleteModal,
    showCheckinModal,
    showCheckoutModal,
    showHistoryDetailModal,
    isEditMode,
    selectedReservation,
    selectedCheckinReservation,
    selectedCheckinForCheckout,
    selectedHistory,
    formErrors,

    // Methods
    changePage,
    updateItemsPerPage,
    fetchAllData,

    // Reservation
    openAddReservationModal,
    openEditReservationModal,
    openDetailReservationModal,
    openDeleteReservationModal,
    closeFormModal,
    closeDetailModal,
    closeDeleteModal,
    submitReservationForm,
    confirmDeleteReservation,

    // Checkin
    openCheckinModal,
    closeCheckinModal,
    submitCheckinForm,
    openDetailCheckinModal,

    // Checkout
    openCheckoutModal,
    closeCheckoutModal,
    submitCheckoutForm,
    openDetailCheckoutModal,
    finishCheckout,

    // History
    openHistoryDetailModal,
    closeHistoryDetailModal
  };
}
