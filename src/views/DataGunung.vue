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
          />
        </div>
        
        <Pagination 
          :currentPage="currentPage"
          :totalPages="totalPages"
          @page-change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import MountainCard from '../components/MountainCard.vue'
import Pagination from '../components/Pagination.vue'

export default {
  name: 'DataGunungView',
  components: {
    Sidebar,
    Navbar,
    MountainCard,
    Pagination
  },
  data() {
    return {
      searchQuery: '',
      itemsPerPage: 8,
      currentPage: 1,
      mountains: [
        {
          id: 1,
          name: 'Puncak Gunung Malabar',
          lmdh: 'LMDH',
          location: 'Pangalengan, Kab.Bandung',
          contact: '+62123443249209',
          price: 15000,
          duration: '+- 2 Jam',
          pos: 'Panorama, Cinyiruan',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
        },
        {
          id: 2,
          name: 'Puncak Gunung Malabar',
          lmdh: 'LMDH',
          location: 'Pangalengan, Kab.Bandung',
          contact: '+62123443249209',
          price: 15000,
          duration: '+- 2 Jam',
          pos: 'Panorama, Cinyiruan',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
        },
        {
          id: 3,
          name: 'Puncak Gunung Malabar',
          lmdh: 'LMDH',
          location: 'Pangalengan, Kab.Bandung',
          contact: '+62123443249209',
          price: 15000,
          duration: '+- 2 Jam',
          pos: 'Panorama, Cinyiruan',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
        },
        {
          id: 4,
          name: 'Puncak Gunung Malabar',
          lmdh: 'LMDH',
          location: 'Pangalengan, Kab.Bandung',
          contact: '+62123443249209',
          price: 15000,
          duration: '+- 2 Jam',
          pos: 'Panorama, Cinyiruan',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
        },
        {
          id: 5,
          name: 'Puncak Gunung Malabar',
          lmdh: 'LMDH',
          location: 'Pangalengan, Kab.Bandung',
          contact: '+62123443249209',
          price: 15000,
          duration: '+- 2 Jam',
          pos: 'Panorama, Cinyiruan',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
        },
        {
          id: 6,
          name: 'Puncak Gunung Malabar',
          lmdh: 'LMDH',
          location: 'Pangalengan, Kab.Bandung',
          contact: '+62123443249209',
          price: 15000,
          duration: '+- 2 Jam',
          pos: 'Panorama, Cinyiruan',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
        },
        {
          id: 7,
          name: 'Puncak Gunung Malabar',
          lmdh: 'LMDH',
          location: 'Pangalengan, Kab.Bandung',
          contact: '+62123443249209',
          price: 15000,
          duration: '+- 2 Jam',
          pos: 'Panorama, Cinyiruan',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
        },
        {
          id: 8,
          name: 'Puncak Gunung Malabar',
          lmdh: 'LMDH',
          location: 'Pangalengan, Kab.Bandung',
          contact: '+62123443249209',
          price: 15000,
          duration: '+- 2 Jam',
          pos: 'Panorama, Cinyiruan',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
        }
      ]
    }
  },
  computed: {
    filteredMountains() {
      if (!this.searchQuery) {
        return this.mountains;
      }
      return this.mountains.filter(mountain => 
        mountain.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        mountain.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredMountains.length / this.itemsPerPage);
    },
    paginatedMountains() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredMountains.slice(start, end);
    }
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
    updateItemsPerPage() {
      this.currentPage = 1;
    },
    addMountain() {
      // Navigasi ke halaman tambah data gunung
      console.log('Add Mountain');
    }
  }
}
</script>

<style scoped>
.data-gunung-page {
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
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

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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
  width: 200px;
  padding: 0.4rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
}

.mountains-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 1400px) {
  .mountains-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 200px;
  }
  
  .mountains-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .header-section {
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
  
  .mountains-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}
</style>