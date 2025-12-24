<template>
  <div class="data-gunung-page">
    <Sidebar />
    <div class="main-content">
      <Navbar pageTitle="Gunung" />
      <div class="content-wrapper">
        <div class="header-section">
          <h2 class="section-title">Data Gunung</h2>
          <button class="btn-add" @click="addMountain">
            + Tambah Data
          </button>
        </div>
        <div class="filter-section">
          <div class="show-entries">
            <span>Show</span>
            <select v-model="itemsPerPage" @change="updateItemsPerPage" class="form-select">
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="16">16</option>
            </select>
            <span>Data</span>
          </div>
          <div class="search-box">
            <span>Search:</span>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control"
              placeholder="Cari gunung..."
            />
          </div>
        </div>
        <div class="mountains-grid">
          <MountainCard 
            v-for="mountain in paginatedMountains" 
            :key="mountain.id"
            :mountain="mountain"
            @edit="editMountain"
            @delete="deleteMountain"
          />
        </div>
        <Pagination 
          :currentPage="currentPage"
          :totalPages="totalPages"
          @page-change="changePage"
        />
      </div>
    </div>

    <!-- Modal Components -->
    <ModalEditGunung 
      :show="showEditModal"
      :mountain="selectedMountain"
      @close="closeEditModal"
      @save="saveMountain"
    />

    <ModalAddGunung 
      :show="showAddModal"
      @close="closeAddModal"
      @save="saveNewMountain"
    />

    <ModalDeleteGunung 
      :show="showDeleteModal"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />

    <ModalFeedbackGunung 
      :show="showFeedbackModal"
      :message="feedbackMessage"
      @close="closeFeedbackModal"
    />
  </div>
</template>

<script src="./scriptDataGunung.js"></script>

<style scoped src="./styleDataGunung.css"></style>