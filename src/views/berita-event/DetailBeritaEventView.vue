<template>
  <div class="detail-berita-page">
    <Sidebar />

    <div class="main-content">
      <Navbar pageTitle="Detail Berita & Event" />

      <div class="content-wrapper">
        <button @click="goBack" class="btn-back">
          <i class="bi bi-arrow-left"></i>
          Kembali
        </button>

        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Memuat data...</p>
        </div>

        <div v-else-if="error" class="error-container">
          <i class="bi bi-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <button @click="loadData" class="btn-retry">Coba Lagi</button>
        </div>

        <div v-else-if="berita" class="detail-container">
          <div class="detail-header">
            <h1 class="detail-title">{{ berita.judul }}</h1>
            <span class="badge-jenis" :class="jenisClass(berita.jenis)">
              {{ berita.jenis }}
            </span>
          </div>

          <div class="detail-image-section">
            <img
              :src="berita.gambar"
              :alt="berita.judul"
              class="detail-image"
            />
          </div>

          <div class="info-grid">
            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-person"></i>
              </div>
              <div class="info-content">
                <label>Penulis</label>
                <p>{{ berita.penulis }}</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-calendar-event"></i>
              </div>
              <div class="info-content">
                <label>Tanggal Terbit</label>
                <p>{{ formatDate(berita.tanggalTerbit) }}</p>
              </div>
            </div>
          </div>

          <div class="description-section">
            <h3>Isi {{ berita.jenis }}</h3>
            <p>{{ berita.deskripsi }}</p>
          </div>

          <div class="action-section">
            <button @click="handleEdit" class="btn-edit">
              <i class="bi bi-pencil"></i>
              Edit {{ berita.jenis }}
            </button>
            <button @click="showDeleteModal = true" class="btn-delete">
              <i class="bi bi-trash"></i>
              Hapus {{ berita.jenis }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <DeleteConfirmModal
      :isOpen="showDeleteModal"
      :itemName="berita?.judul"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
import DeleteConfirmModal from "@/components/paket-wisata/DeleteConfirmModal.vue";
import beritaEventService from "@/services/beritaEventService";
import { formatDate, getImageUrl } from "@/utils/formatters";

export default {
  name: "DetailBeritaEventView",
  components: {
    Sidebar,
    Navbar,
    DeleteConfirmModal,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const berita = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const showDeleteModal = ref(false);

    const jenisClass = computed(() => {
      return (jenis) =>
        jenis?.toLowerCase() === "event" ? "badge-event" : "badge-berita";
    });

    const loadData = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await beritaEventService.getBeritaEventById(
          route.params.id
        );
        const item = response.data.data;

        berita.value = {
          id: item.id,
          gambar: getImageUrl(item.image),
          judul: item.judul,
          jenis: item.jenis,
          tanggalTerbit: item.tanggal_publish,
          penulis: item.penulis,
          deskripsi: item.deskripsi,
        };
      } catch (err) {
        error.value = err.response?.data?.message || "Gagal mengambil data";
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      router.push("/berita-event");
    };

    const handleEdit = () => {
      router.push(`/berita/edit/${route.params.id}`);
    };

    const handleDelete = async () => {
      try {
        await beritaEventService.deleteBeritaEvent(route.params.id);
        router.push("/berita-event");
      } catch (err) {
        error.value = err.response?.data?.message || "Gagal menghapus data";
      }
    };

    onMounted(() => {
      loadData();
    });

    return {
      berita,
      loading,
      error,
      showDeleteModal,
      jenisClass,
      loadData,
      goBack,
      handleEdit,
      handleDelete,
      formatDate,
    };
  },
};
</script>

<style scoped>
/* Sama seperti DetailPaketWisataView.vue */
.detail-berita-page {
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
  max-width: 1200px;
  margin: 0 auto;
}

.btn-back {
  background: white;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-back:hover {
  background-color: #f8f9fa;
  border-color: #1a7a7a;
  color: #1a7a7a;
}

.detail-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.detail-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.detail-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  flex: 1;
}

.badge-jenis {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-berita {
  background-color: #3b82f6;
  color: white;
}

.badge-event {
  background-color: #ffc107;
  color: #000;
}

.detail-image-section {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
}

.detail-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.info-icon {
  width: 48px;
  height: 48px;
  background: #1a7a7a;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-content label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-content p {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  margin: 0;
}

.description-section {
  margin-bottom: 2rem;
}

.description-section h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.description-section p {
  color: #666;
  line-height: 1.8;
  font-size: 1rem;
  white-space: pre-wrap;
}

.action-section {
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-edit {
  background-color: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1a7a7a;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container {
  color: #dc3545;
}

.error-container i {
  font-size: 3rem;
}

.btn-retry {
  background-color: #1a7a7a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .detail-container {
    padding: 1.5rem;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .detail-header {
    flex-direction: column;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-section {
    flex-direction: column;
  }
}
</style>
