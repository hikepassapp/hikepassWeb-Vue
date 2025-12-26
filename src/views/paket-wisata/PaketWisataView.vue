<template>
  <div class="paket-wisata-page">
    <Sidebar />

    <div class="main-content">
      <Navbar pageTitle="Paket Wisata" />

      <div class="content-wrapper">
        <LoadingState v-if="loading" />
        <ErrorState v-else-if="error" :message="error" @retry="loadData" />

        <template v-else>
          <PageHeader @add-wisata="handleTambahWisata" />

          <FilterSection
            v-model:search="searchQuery"
            v-model:itemsPerPage="itemsPerPage"
            @update:itemsPerPage="updateItemsPerPage"
          />

          <TableWisata
            :wisataList="paginatedWisata"
            :startIndex="startIndex"
            @view-detail="handleViewDetail"
            @delete-wisata="handleDeleteWisata"
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
      :itemName="selectedWisataName"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
import Pagination from "@/components/Pagination.vue";
import TableWisata from "@/components/TableWisata.vue";
import LoadingState from "@/components/paket-wisata/LoadingState.vue";
import ErrorState from "@/components/paket-wisata/ErrorState.vue";
import PageHeader from "@/components/paket-wisata/PageHeader.vue";
import FilterSection from "@/components/paket-wisata/FilterSection.vue";
import ImageModal from "@/components/paket-wisata/ImageModal.vue";
import DeleteConfirmModal from "@/components/paket-wisata/DeleteConfirmModal.vue";

import { usePaketWisataPage } from "./usePaketWisataPage";

export default {
  name: "PaketWisataView",
  components: {
    Sidebar,
    Navbar,
    Pagination,
    TableWisata,
    LoadingState,
    ErrorState,
    PageHeader,
    FilterSection,
    ImageModal,
    DeleteConfirmModal,
  },
  setup() {
    const router = useRouter();
    const pageState = usePaketWisataPage();

    const showDeleteModal = ref(false);
    const selectedWisataId = ref(null);
    const selectedWisataName = ref("");

    const handleViewDetail = (wisata) => {
      // Navigate ke halaman detail
      router.push(`/wisata/detail/${wisata.id}`);
    };

    const handleDeleteWisata = (id, name) => {
      // Show confirmation modal
      selectedWisataId.value = id;
      selectedWisataName.value = name;
      showDeleteModal.value = true;
    };

    const confirmDelete = async () => {
      const result = await pageState.deleteWisata(selectedWisataId.value);
      showDeleteModal.value = false;

      if (result.success) {
        if (
          pageState.paginatedWisata.value.length === 0 &&
          pageState.currentPage.value > 1
        ) {
          pageState.currentPage.value--;
        }
      } else {
        alert(`Gagal menghapus: ${result.message}`);
      }
    };

    const handleTambahWisata = () => {
      router.push("/wisata/tambah");
    };

    return {
      ...pageState,
      showDeleteModal,
      selectedWisataName,
      handleViewDetail,
      handleDeleteWisata,
      confirmDelete,
      handleTambahWisata,
    };
  },
};
</script>

<style src="./PaketWisataView.css" scoped></style>
