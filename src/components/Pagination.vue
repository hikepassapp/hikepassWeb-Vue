<template>
  <div class="pagination-wrapper">
    <button 
      class="btn-page" 
      @click="prevPage"
      :disabled="currentPage === 1"
    >
      Prev
    </button>
    
    <button 
      v-for="page in pages" 
      :key="page"
      class="btn-page"
      :class="{ active: page === currentPage }"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>
    
    <button 
      class="btn-page" 
      @click="nextPage"
      :disabled="currentPage === totalPages"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  computed: {
    pages() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit('page-change', this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit('page-change', this.currentPage + 1);
      }
    },
    goToPage(page) {
      this.$emit('page-change', page);
    }
  }
}
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 2rem;
}

.btn-page {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-page:hover:not(:disabled) {
  background-color: #f0f0f0;
  border-color: #1a7a7a;
}

.btn-page.active {
  background-color: #1a7a7a;
  color: white;
  border-color: #1a7a7a;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>