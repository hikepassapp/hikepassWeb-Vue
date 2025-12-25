import { ref, computed } from 'vue';

export function usePagination(items, itemsPerPageDefault = 10) {
  const currentPage = ref(1);
  const itemsPerPage = ref(itemsPerPageDefault);

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage.value);
  });

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return items.value.slice(start, end);
  });

  const startIndex = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value;
  });

  const changePage = (page) => {
    currentPage.value = page;
  };

  const updateItemsPerPage = (newValue) => {
    itemsPerPage.value = newValue;
    currentPage.value = 1;
  };

  const resetToFirstPage = () => {
    currentPage.value = 1;
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    startIndex,
    changePage,
    updateItemsPerPage,
    resetToFirstPage
  };
}