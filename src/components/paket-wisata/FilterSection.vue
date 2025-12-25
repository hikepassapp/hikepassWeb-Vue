<template>
  <div class="filter-section">
    <div class="show-entries">
      <span>Show</span>
      <select 
        :value="itemsPerPage" 
        @change="handleItemsPerPageChange"
        class="form-select"
      >
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
        :value="search"
        @input="$emit('update:search', $event.target.value)"
        class="form-control" 
        placeholder="Cari paket wisata..." 
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterSection',
  props: {
    search: {
      type: String,
      default: ''
    },
    itemsPerPage: {
      type: Number,
      default: 10
    }
  },
  emits: ['update:search', 'update:itemsPerPage'],
  methods: {
    handleItemsPerPageChange(event) {
      this.$emit('update:itemsPerPage', Number(event.target.value));
    }
  }
}
</script>

<style scoped>
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

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-box .form-control {
    width: 100%;
  }
}
</style>