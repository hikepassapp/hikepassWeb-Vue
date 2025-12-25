import { ref, computed } from 'vue';

export function useSearch(data, searchFields = []) {
  const searchQuery = ref('');

  const filteredData = computed(() => {
    if (!searchQuery.value) {
      return data.value;
    }

    const query = searchQuery.value.toLowerCase();
    
    return data.value.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  });

  const clearSearch = () => {
    searchQuery.value = '';
  };

  return {
    searchQuery,
    filteredData,
    clearSearch
  };
}