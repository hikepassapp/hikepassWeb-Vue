<template>
  <div class="user-page">
    <Sidebar />
    
    <div class="main-content">
      <Navbar pageTitle="User" />
      
      <div class="content-wrapper">
        <!-- Tab Navigation -->
        <TabNavigation 
          :tabs="tabs"
          :activeTab="activeTab"
          @change-tab="changeTab"
        />
        
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
            <input 
              type="text" 
              v-model="searchQuery" 
              class="form-control"
              placeholder="Cari..."
            />
          </div>
        </div>
        
        <!-- Table Content -->
        <TableUser 
          v-if="activeTab === 'user'"
          :users="paginatedUsers"
          @view-detail="viewUserDetail"
          @delete-user="deleteUser"
        />
        
        <TableAdmin 
          v-if="activeTab === 'admin'"
          :admins="paginatedAdmins"
          @view-detail="viewAdminDetail"
          @delete-admin="deleteAdmin"
        />
        
        <!-- Pagination -->
        <Pagination 
          :currentPage="currentPage"
          :totalPages="totalPages"
          @page-change="changePage"
        />
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
            <div v-if="activeTab === 'user'" class="info-item">
              <strong>Kontak:</strong>
              <span>{{ selectedData.kontak }}</span>
            </div>
            <div v-if="activeTab === 'user'" class="info-item">
              <strong>NIK:</strong>
              <span>{{ selectedData.nik }}</span>
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
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import TabNavigation from '../components/TabNavigation.vue'
import TableUser from '../components/TableUser.vue'
import TableAdmin from '../components/TableAdmin.vue'
import Pagination from '../components/Pagination.vue'
import ModalTambahUser from '../components/ModalTambahUser.vue'
import ModalTambahAdmin from '../components/ModalTambahAdmin.vue'

export default {
  name: 'UserView',
  components: {
    Sidebar,
    Navbar,
    TabNavigation,
    TableUser,
    TableAdmin,
    Pagination,
    ModalTambahUser,
    ModalTambahAdmin
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
      selectedData: null,
      tabs: [
        { id: 'user', label: 'User' },
        { id: 'admin', label: 'Admin' }
      ],
      users: [
        {
          id: 1,
          nama: 'abcd',
          email: 'abcd@gmail.com',
          kontak: '081247423835',
          nik: '320XXXXXXXXXXXXXXX'
        },
        {
          id: 2,
          nama: 'abcd',
          email: 'abcd@gmail.com',
          kontak: '081247423835',
          nik: '320XXXXXXXXXXXXXXX'
        }
      ],
      admins: [
        {
          id: 1,
          nama: 'abcd',
          posisi: 'Developer',
          email: 'abcd@gmail.com',
          ditambahkanPada: '00/00/0000'
        },
        {
          id: 2,
          nama: 'abcd',
          posisi: 'Customer Service',
          email: 'abcd@gmail.com',
          ditambahkanPada: '00/00/0000'
        },
        {
          id: 3,
          nama: 'abcd',
          posisi: 'Content Creator',
          email: 'abcd@gmail.com',
          ditambahkanPada: '00/00/0000'
        },
        {
          id: 4,
          nama: 'abcd',
          posisi: 'Administrator',
          email: 'abcd@gmail.com',
          ditambahkanPada: '00/00/0000'
        },
        {
          id: 5,
          nama: 'abcd',
          posisi: 'Administrator',
          email: 'abcd@gmail.com',
          ditambahkanPada: '00/00/0000'
        }
      ]
    }
  },
  computed: {
    sectionTitle() {
      return this.activeTab === 'user' ? 'Daftar Akun User' : 'Daftar Akun Admin';
    },
    filteredUsers() {
      if (!this.searchQuery) return this.users;
      return this.users.filter(user => 
        user.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.kontak.includes(this.searchQuery) ||
        user.nik.includes(this.searchQuery)
      );
    },
    filteredAdmins() {
      if (!this.searchQuery) return this.admins;
      return this.admins.filter(admin => 
        admin.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        admin.posisi.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    currentData() {
      return this.activeTab === 'user' ? this.filteredUsers : this.filteredAdmins;
    },
    totalPages() {
      return Math.ceil(this.currentData.length / this.itemsPerPage);
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    paginatedAdmins() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredAdmins.slice(start, end);
    }
  },
  methods: {
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
      if (this.activeTab === 'user') {
        this.showModalTambahUser = true;
      } else {
        this.showModalTambahAdmin = true;
      }
    },
    handleSubmitUser(formData) {
      // Generate ID baru
      const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
      
      // Tambah user baru
      const newUser = {
        id: newId,
        nama: formData.nama,
        email: formData.email,
        kontak: formData.kontak,
        nik: formData.nik,
        tanggalLahir: formData.tanggalLahir,
        jenisKelamin: formData.jenisKelamin,
        alamat: formData.alamat
      };
      
      this.users.push(newUser);
      this.showModalTambahUser = false;
      alert('User berhasil ditambahkan!');
    },
    handleSubmitAdmin(formData) {
      // Generate ID baru
      const newId = this.admins.length > 0 ? Math.max(...this.admins.map(a => a.id)) + 1 : 1;
      
      // Tambah admin baru
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
      
      const newAdmin = {
        id: newId,
        nama: formData.email.split('@')[0], // Extract name from email
        posisi: formData.peran,
        email: formData.email,
        ditambahkanPada: formattedDate
      };
      
      this.admins.push(newAdmin);
      this.showModalTambahAdmin = false;
      alert('Admin berhasil ditambahkan!');
    },
    viewUserDetail(user) {
      this.selectedData = user;
      this.showDetailModal = true;
    },
    viewAdminDetail(admin) {
      this.selectedData = admin;
      this.showDetailModal = true;
    },
    deleteUser(id) {
      if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        this.users = this.users.filter(user => user.id !== id);
        console.log('Deleted user with id:', id);
      }
    },
    deleteAdmin(id) {
      if (confirm('Apakah Anda yakin ingin menghapus admin ini?')) {
        this.admins = this.admins.filter(admin => admin.id !== id);
        console.log('Deleted admin with id:', id);
      }
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