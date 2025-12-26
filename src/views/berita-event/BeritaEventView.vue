<template>
  <div class="berita-page">
    <Sidebar />

    <div class="main-content">
      <Navbar pageTitle="Berita & Event" />

      <div class="content-wrapper">
        <LoadingState v-if="loading" />
        <ErrorState v-else-if="error" :message="error" @retry="loadData" />

        <template v-else>
          <div class="page-header">
            <h2 class="page-title">Daftar Berita & Event</h2>
            <button class="btn-add" @click="handleTambahBerita">
              + Tambah Berita
            </button>
          </div>

          <FilterSection
            v-model:search="searchQuery"
            v-model:itemsPerPage="itemsPerPage"
            @update:itemsPerPage="updateItemsPerPage"
            placeholder="Cari berita..."
          />

          <TableBerita
            :beritaList="paginatedBerita"
            :startIndex="startIndex"
            @view-detail="handleViewDetail"
            @delete-berita="handleDeleteBerita"
            @view-image="handleViewImage"
          />

          <Pagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            @page-change="changePage"
          />
        </template>
      </div>
    </div>

    <!-- Image Modal -->
    <ImageModal
      :isOpen="imageModal.isOpen.value"
      :imageSrc="imageModal.modalData.value"
      @close="imageModal.closeModal"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :isOpen="showDeleteModal"
      :itemName="selectedBeritaName"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
import Pagination from "@/components/Pagination.vue";
import TableBerita from "@/components/TableBerita.vue";
import LoadingState from "@/components/paket-wisata/LoadingState.vue";
import ErrorState from "@/components/paket-wisata/ErrorState.vue";
import FilterSection from "@/components/paket-wisata/FilterSection.vue";
import ImageModal from "@/components/paket-wisata/ImageModal.vue";
import DeleteConfirmModal from "@/components/paket-wisata/DeleteConfirmModal.vue";

import { useBeritaEventPage } from "./useBeritaEventPage";

export default {
  name: "BeritaEventView",
  components: {
    Sidebar,
    Navbar,
    Pagination,
    TableBerita,
    LoadingState,
    ErrorState,
    FilterSection,
    ImageModal,
    DeleteConfirmModal,
  },
  setup() {
    return useBeritaEventPage();
  },
};
</script>

<style scoped>
.berita-page {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  margin-left: 250px;
}

.content-wrapper {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.btn-add {
  background-color: #1a7a7a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-add:hover {
  background-color: #145f5f;
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 200px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .content-wrapper {
    padding: 1.5rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-add {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .content-wrapper {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>
