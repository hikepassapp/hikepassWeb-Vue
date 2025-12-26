<template>
  <div class="reservasi-page">
    <Sidebar />
    
    <div class="main-content">
      <Navbar pageTitle="Reservasi" />
      
      <div class="content-wrapper">
        <!-- Tab Navigation -->
        <TabNavigation 
          :tabs="tabs"
          :activeTab="activeTab"
          @change-tab="changeTab"
        />
        
        <!-- Section Header -->
        <div class="section-header">
          <h2 class="section-title">{{ sectionTitle }}</h2>
          <button v-if="activeTab === 'reservasi'" class="btn-add" @click="openAddReservationModal">
            <i class="bi bi-plus"></i> Tambah Reservasi
          </button>
        </div>
        
        <!-- Filter Section -->
        <div class="filter-section">
          <div class="show-entries">
            <span>Show</span>
            <select v-model.number="itemsPerPage" @change="updateItemsPerPage">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>Data</span>
          </div>
          
          <div class="search-box">
            <span>Search:</span>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Cari..."
            />
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat data...</p>
        </div>
        
        <!-- Reservation Table -->
        <TableReservasi 
          v-if="activeTab === 'reservasi' && !loading"
          :reservations="paginatedData"
          @view-detail="viewReservationDetail"
          @edit-reservasi="openEditReservationModal"
          @delete-reservasi="openDeleteReservationModal"
        />
        
        <!-- Checkin Table -->
        <TableCheckIn 
          v-if="activeTab === 'checkin' && !loading"
          :checkIns="paginatedData"
          @view-detail="viewCheckinDetail"
        />
        
        <!-- Checkout Table -->
        <TableCheckOut 
          v-if="activeTab === 'checkout' && !loading"
          :checkOuts="paginatedData"
          @view-detail="viewCheckinDetail"
        />
        
        <!-- History Table -->
        <TableHistory 
          v-if="activeTab === 'history' && !loading"
          :histories="paginatedData"
          @view-detail="viewHistoryDetail"
        />
        
        <!-- Pagination -->
        <div v-if="!loading && totalPages > 1" class="pagination-wrapper">
          <Pagination 
            :currentPage="currentPage"
            :totalPages="totalPages"
            @page-change="changePage"
          />
        </div>
      </div>
    </div>
    
    <!-- Reservation Modals -->
    <ModalReservasi 
      :isOpen="showFormModal"
      :mountains="mountains"
      :reservation="selectedReservation"
      @close="closeFormModal"
      @submit="submitReservationForm"
    />
    
    <ModalDetailReservasi 
      :isOpen="showDetailModal"
      :reservation="selectedReservation"
      @close="closeDetailModal"
      @checkin="openCheckinModal"
    />
    
    <ModalDeleteReservasi 
      :isOpen="showDeleteModal"
      :reservationId="deleteReservationId"
      @close="closeDeleteModal"
      @confirm="confirmDeleteReservation"
    />
    
    <!-- Checkin Modals -->
    <ModalCheckin 
      :isOpen="showCheckinModal"
      :reservation="selectedCheckinReservation"
      @close="closeCheckinModal"
      @submit="submitCheckinForm"
    />
    
    <ModalDetailCheckin 
      :isOpen="showDetailModal && activeTab === 'checkin'"
      :checkin="selectedCheckinForCheckout"
      @close="closeDetailModal"
      @checkout="openCheckoutModal"
    />
    
    <!-- Checkout Modals -->
    <ModalCheckout 
      :isOpen="showCheckoutModal"
      :checkin="selectedCheckinForCheckout"
      @close="closeCheckoutModal"
      @submit="submitCheckoutForm"
    />
    
    <ModalDetailCheckout 
      :isOpen="showDetailModal && activeTab === 'checkout'"
      :checkout="selectedCheckinForCheckout"
      @close="closeDetailModal"
      @finish="finishCheckout"
    />
    
    <!-- History Modal -->
    <ModalDetailHistory 
      :isOpen="showHistoryDetailModal"
      :history="selectedHistory"
      @close="closeHistoryDetailModal"
    />
    
    <!-- Notification System (if available) -->
    <div v-if="notification" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>



<script>
import Sidebar from '../../components/Sidebar.vue'
import Navbar from '../../components/Navbar.vue'
import TabNavigation from '../../components/TabNavigation.vue'
import TableReservasi from '../../components/reservation/TableReservasi.vue'
import TableCheckIn from '../../components/checkin/TableCheckIn.vue'
import TableCheckOut from '../../components/checkout/TableCheckOut.vue'
import TableHistory from '../../components/history/TableHistory.vue'
import Pagination from '../../components/Pagination.vue'
import ModalReservasi from '../../components/reservation/ModalReservasi.vue'
import ModalDetailReservasi from '../../components/reservation/ModalDetailReservasi.vue'
import ModalDeleteReservasi from '../../components/reservation/ModalDeleteReservasi.vue'
import ModalCheckin from '../../components/checkin/ModalCheckin.vue'
import ModalDetailCheckin from '../../components/checkin/ModalDetailCheckin.vue'
import ModalCheckout from '../../components/checkout/ModalCheckout.vue'
import ModalDetailCheckout from '../../components/checkout/ModalDetailCheckout.vue'
import ModalDetailHistory from '../../components/history/ModalDetailHistory.vue'
import { useReservationPage } from './useReservationPage'

export default {
  name: 'ReservasiView',
  components: {
    Sidebar,
    Navbar,
    TabNavigation,
    TableReservasi,
    TableCheckIn,
    TableCheckOut,
    TableHistory,
    Pagination,
    ModalReservasi,
    ModalDetailReservasi,
    ModalDeleteReservasi,
    ModalCheckin,
    ModalDetailCheckin,
    ModalCheckout,
    ModalDetailCheckout,
    ModalDetailHistory
  },
  setup() {
    const pageState = useReservationPage();

    // Additional methods for template compatibility
    const viewReservationDetail = (reservation) => {
      pageState.openDetailReservationModal(reservation);
    };

    const viewCheckinDetail = (checkin) => {
      pageState.openDetailCheckinModal(checkin);
    };

    const viewCheckoutDetail = (checkout) => {
      pageState.openDetailCheckoutModal(checkout);
    };

    const viewHistoryDetail = (history) => {
      pageState.openHistoryDetailModal(history);
    };

    return {
      ...pageState,
      viewReservationDetail,
      viewCheckinDetail,
      viewCheckoutDetail,
      viewHistoryDetail
    };
  }
}
</script>

<style scoped>
@import './Reservasi.css';
</style>