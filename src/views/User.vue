<template>
  <div class="user-page">
    <Sidebar />

    <div class="main-content">
      <Navbar pageTitle="User" />

      <div class="content-wrapper">
        <!-- Tab Navigation -->
        <TabNavigation :tabs="tabs" :activeTab="activeTab" @change-tab="changeTab" />

        <!-- Section Title and Add Button -->
        <div class="section-header">
          <h2 class="section-title">{{ sectionTitle }}</h2>
          <button class="btn-add" @click="addData">
            + Tambah Data
          </button>
        </div>

        <!-- Filter Section -->
        <div class="filter-section">
          <div class="show-entries">
            <span>Show</span>
            <select v-model="itemsPerPage" @change="updateItemsPerPage" class="form-select">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>Data</span>
          </div>

          <div class="search-box">
            <span>Search:</span>
            <input type="text" v-model="searchQuery" class="form-control" placeholder="Cari..." />
          </div>
        </div>

        <!-- Table Content -->
        <TableUser 
          v-if="activeTab === 'user'" 
          :users="paginatedUsers" 
          @view-detail="viewUserDetail"
          @edit-user="editUser"
          @delete-user="deleteUser" 
        />

        <TableAdmin 
          v-if="activeTab === 'admin'" 
          :admins="paginatedAdmins" 
          @view-detail="viewAdminDetail"
          @edit-admin="editAdmin"
          @delete-admin="deleteAdmin" 
        />

        <!-- Pagination -->
        <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
      </div>
    </div>

    <!-- Modal for User Detail -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-detail" @click.stop>
        <button class="modal-close" @click="closeDetailModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <h3 class="modal-title">Detail {{ activeTab === 'user' ? 'User' : 'Admin' }}</h3>
        <div v-if="selectedData" class="detail-content">
          <div class="detail-info">
            <div class="info-item">
              <strong>Nama:</strong>
              <span>{{ selectedData.nama }}</span>
            </div>
            <div class="info-item">
              <strong>Email:</strong>
              <span>{{ selectedData.email }}</span>
            </div>
            <div v-if="activeTab === 'admin'" class="info-item">
              <strong>Posisi:</strong>
              <span>{{ selectedData.posisi }}</span>
            </div>
            <div v-if="activeTab === 'admin'" class="info-item">
              <strong>Ditambahkan Pada:</strong>
              <span>{{ selectedData.ditambahkanPada }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Delete Confirmation -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-detail modal-delete" @click.stop>
        <div class="delete-icon">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h3 class="modal-title text-center">Konfirmasi Hapus</h3>
        <p class="text-center">
          Apakah Anda yakin ingin menghapus {{ itemToDelete.label }}
          <strong>{{ itemToDelete.name }}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeDeleteModal">Batal</button>
          <button class="btn-confirm-delete" @click="confirmDelete">Hapus Sekarang</button>
        </div>
      </div>
    </div>

    <!-- Modal Edit User -->
    <ModalEditUser 
      :show="showModalEditUser" 
      :userData="editFormData"
      @close="showModalEditUser = false" 
      @submit="handleUpdateUser" 
    />

    <!-- Modal Edit Admin -->
    <ModalEditAdmin 
      :show="showModalEditAdmin" 
      :adminData="editFormData"
      @close="showModalEditAdmin = false" 
      @submit="handleUpdateAdmin" 
    />

    <!-- Modal Tambah User -->
    <ModalTambahUser 
      :show="showModalTambahUser" 
      @close="showModalTambahUser = false" 
      @submit="handleSubmitUser" 
    />

    <!-- Modal Tambah Admin -->
    <ModalTambahAdmin 
      :show="showModalTambahAdmin" 
      @close="showModalTambahAdmin = false" 
      @submit="handleSubmitAdmin" 
    />
  </div>
</template>

<script>
// 1. Import Komponen
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import TabNavigation from '../components/TabNavigation.vue'
import TableUser from '../components/TableUser.vue'
import TableAdmin from '../components/TableAdmin.vue'
import Pagination from '../components/Pagination.vue'
import ModalTambahUser from '../components/ModalTambahUser.vue'
import ModalTambahAdmin from '../components/ModalTambahAdmin.vue'
import ModalEditUser from '../components/ModalEditUser.vue'
import ModalEditAdmin from '../components/ModalEditAdmin.vue'

// 2. Import API Client
import apiClient from '../api/index.js'

export default {
  name: 'UserView',
  components: {
    Sidebar, Navbar, TabNavigation, TableUser, TableAdmin,
    Pagination, ModalTambahUser, ModalTambahAdmin, ModalEditUser, ModalEditAdmin
  },
  data() {
    return {
      activeTab: 'user',
      searchQuery: '',
      itemsPerPage: 10,
      currentPage: 1,
      showDetailModal: false,
      showModalTambahUser: false,
      showModalTambahAdmin: false,
      showModalEditUser: false,
      showModalEditAdmin: false,
      editFormData: null,
      showDeleteModal: false,
      itemToDelete: { id: null, label: '', name: '' },
      selectedData: null,
      tabs: [
        { id: 'user', label: 'User' },
        { id: 'admin', label: 'Admin' }
      ],
      users: [],
      admins: []
    }
  },
  computed: {
    sectionTitle() {
      return this.activeTab === 'user' ? 'Daftar Akun User' : 'Daftar Akun Admin';
    },
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      if (!query) return this.users;
      return this.users.filter(u =>
        u.nama.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
      );
    },
    filteredAdmins() {
      const query = this.searchQuery.toLowerCase();
      if (!query) return this.admins;
      return this.admins.filter(a =>
        a.nama.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        (a.posisi && a.posisi.toLowerCase().includes(query))
      );
    },
    currentData() {
      return this.activeTab === 'user' ? this.filteredUsers : this.filteredAdmins;
    },
    totalPages() {
      return Math.ceil(this.currentData.length / this.itemsPerPage) || 1;
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredUsers.slice(start, start + this.itemsPerPage);
    },
    paginatedAdmins() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredAdmins.slice(start, start + this.itemsPerPage);
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // FETCH DATA
    async fetchData() {
      try {
        const [resUser, resAdmin] = await Promise.all([
          apiClient.get('/customers'),
          apiClient.get('/admins')
        ]);

        this.users = resUser.data.map(u => ({
          id: u.id,
          nama: u.name,
          email: u.email
        }));

        this.admins = resAdmin.data.map(a => ({
          id: a.id,
          nama: a.name,
          email: a.email,
          posisi: a.posisi || 'Administrator',
          ditambahkanPada: new Date(a.created_at).toLocaleDateString('id-ID')
        }));
      } catch (error) {
        this.handleError(error, "Gagal memuat data pengguna");
      }
    },

    // TAMBAH USER
    async handleSubmitUser(formData) {
      try {
        await apiClient.post('/users', {
          name: formData.nama,
          email: formData.email,
          password: formData.password,
          role: 'customer'
        });
        this.showModalTambahUser = false;
        alert('User berhasil ditambahkan!');
        this.fetchData();
      } catch (error) {
        this.handleError(error, "Gagal menambah user");
      }
    },

    // TAMBAH ADMIN
    async handleSubmitAdmin(formData) {
      try {
        await apiClient.post('/users', {
          name: formData.nama,
          email: formData.email,
          posisi: formData.posisi,
          password: formData.password,
          role: 'admin'
        });
        this.showModalTambahAdmin = false;
        alert('Admin berhasil ditambahkan!');
        this.fetchData();
      } catch (error) {
        this.handleError(error, "Gagal menambah admin");
      }
    },

    // EDIT USER
    editUser(user) {
      this.editFormData = { ...user };
      this.showModalEditUser = true;
    },

    // EDIT ADMIN
    editAdmin(admin) {
      this.editFormData = { ...admin };
      this.showModalEditAdmin = true;
    },

    // UPDATE USER
    async handleUpdateUser(updatedData) {
      try {
        const payload = {
          name: updatedData.nama,
          email: updatedData.email
        };
        
        // Hanya kirim password jika diisi
        if (updatedData.password && updatedData.password.trim() !== '') {
          payload.password = updatedData.password;
        }

        await apiClient.put(`/users/${updatedData.id}`, payload);
        
        this.showModalEditUser = false;
        alert('Data user berhasil diperbarui!');
        this.fetchData();
      } catch (error) {
        this.handleError(error, "Gagal memperbarui data user");
      }
    },

    // UPDATE ADMIN
    async handleUpdateAdmin(updatedData) {
      try {
        const payload = {
          name: updatedData.nama,
          email: updatedData.email,
          posisi: updatedData.posisi
        };
        
        // Hanya kirim password jika diisi
        if (updatedData.password && updatedData.password.trim() !== '') {
          payload.password = updatedData.password;
        }

        await apiClient.put(`/users/${updatedData.id}`, payload);
        
        this.showModalEditAdmin = false;
        alert('Data admin berhasil diperbarui!');
        this.fetchData();
      } catch (error) {
        this.handleError(error, "Gagal memperbarui data admin");
      }
    },

    // DELETE USER
    deleteUser(user) {
      this.itemToDelete = {
        id: user.id,
        label: 'User',
        name: user.nama
      };
      this.showDeleteModal = true;
    },

    // DELETE ADMIN
    deleteAdmin(admin) {
      this.itemToDelete = {
        id: admin.id,
        label: 'Admin',
        name: admin.nama
      };
      this.showDeleteModal = true;
    },

    // CONFIRM DELETE
    async confirmDelete() {
      try {
        await apiClient.delete(`/users/${this.itemToDelete.id}`);
        alert(`${this.itemToDelete.label} berhasil dihapus!`);
        this.showDeleteModal = false;
        this.fetchData();
      } catch (error) {
        this.handleError(error, `Gagal menghapus ${this.itemToDelete.label}`);
      }
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.itemToDelete = { id: null, label: '', name: '' };
    },

    // UI METHODS
    handleError(error, msg) {
      console.error(error);
      if (error.response?.status === 401) {
        this.$router.push('/login');
      } else {
        alert(msg);
      }
    },
    changeTab(tabId) {
      this.activeTab = tabId;
      this.currentPage = 1;
      this.searchQuery = '';
    },
    changePage(page) {
      this.currentPage = page;
    },
    updateItemsPerPage() {
      this.currentPage = 1;
    },
    addData() {
      this.activeTab === 'user' ? this.showModalTambahUser = true : this.showModalTambahAdmin = true;
    },
    viewUserDetail(user) { 
      this.selectedData = user; 
      this.showDetailModal = true; 
    },
    viewAdminDetail(admin) { 
      this.selectedData = admin; 
      this.showDetailModal = true; 
    },
    closeDetailModal() { 
      this.showDetailModal = false; 
      this.selectedData = null; 
    }
  }
}
</script>

<style scoped>
.user-page {
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
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

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.show-entries {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.show-entries span {
  color: #666;
  font-weight: 500;
}

.show-entries .form-select {
  width: 80px;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-box span {
  color: #666;
  font-weight: 500;
}

.search-box .form-control {
  width: 250px;
  padding: 0.4rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-detail {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  color: #333;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item strong {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.info-item span {
  color: #666;
  font-size: 1rem;
}

.modal-delete {
  max-width: 400px;
  text-align: center;
}

.delete-icon {
  font-size: 3.5rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.text-center {
  text-align: center;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background-color: #d5d5d5;
}

.btn-confirm-delete {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm-delete:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

/* Responsive */
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

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filter-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-box .form-control {
    width: 100%;
  }

  .modal-detail {
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .content-wrapper {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.3rem;
  }
}
</style>