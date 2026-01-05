<template>
  <div class="detail-wisata-page">
    <Sidebar />

    <div class="main-content">
      <Navbar pageTitle="Detail Paket Wisata" />

      <div class="content-wrapper">
        <!-- Back Button -->
        <button @click="goBack" class="btn-back">
          <i class="bi bi-arrow-left"></i>
          Kembali
        </button>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Memuat data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <i class="bi bi-exclamation-triangle"></i>
          <p>{{ error }}</p>
          <button @click="loadData" class="btn-retry">Coba Lagi</button>
        </div>

        <!-- Detail Content -->
        <div v-else-if="wisata" class="detail-container">
          <!-- Header Section -->
          <div class="detail-header">
            <h1 class="detail-title">{{ wisata.judul }}</h1>
            <div class="detail-meta">
              <span class="badge-jenis">{{ wisata.jenis }}</span>
            </div>
          </div>

          <!-- Image Section -->
          <div class="detail-image-section">
            <img
              :src="wisata.gambar"
              :alt="wisata.judul"
              class="detail-image"
            />
          </div>

          <!-- Info Grid -->
          <div class="info-grid">
            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-person-badge"></i>
              </div>
              <div class="info-content">
                <label>Penulis/Publisher</label>
                <p>{{ wisata.penulis }}</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-person-video3"></i>
              </div>
              <div class="info-content">
                <label>Guide</label>
                <p>{{ wisata.guide }}</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-telephone"></i>
              </div>
              <div class="info-content">
                <label>Kontak</label>
                <p>{{ wisata.kontak }}</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-calendar-event"></i>
              </div>
              <div class="info-content">
                <label>Tanggal Trip</label>
                <p>{{ formatDate(wisata.tanggalTerbit) }}</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-geo-alt"></i>
              </div>
              <div class="info-content">
                <label>Titik Kumpul</label>
                <p>{{ wisata.titikKumpul }}</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-clock"></i>
              </div>
              <div class="info-content">
                <label>Waktu Keberangkatan</label>
                <p>{{ wisata.waktu }}</p>
              </div>
            </div>
          </div>

          <!-- Price Section -->
          <div class="price-section">
            <label>Harga Paket</label>
            <h2 class="price">{{ formatRupiah(wisata.harga) }}</h2>
          </div>

          <!-- Description Section -->
          <div class="description-section">
            <h3>Deskripsi</h3>
            <p>{{ wisata.deskripsi }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="action-section">
            <button @click="handleEdit" class="btn-edit">
              <i class="bi bi-pencil"></i>
              Edit Paket
            </button>
            <button @click="showDeleteModal = true" class="btn-delete">
              <i class="bi bi-trash"></i>
              Hapus Paket
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :isOpen="showDeleteModal"
      :itemName="wisata?.judul"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
import DeleteConfirmModal from "@/components/paket-wisata/DeleteConfirmModal.vue";
import paketWisataService from "@/services/paketWisataService";
import { formatRupiah, formatDate, getImageUrl } from "@/utils/formatters";

export default {
  name: "DetailPaketWisataView",
  components: {
    Sidebar,
    Navbar,
    DeleteConfirmModal,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const wisata = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const showDeleteModal = ref(false);

    const loadData = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await paketWisataService.getPaketWisataById(
          route.params.id
        );
        const item = response.data.data;

        wisata.value = {
          id: item.id,
          gambar: getImageUrl(item.image),
          judul: item.judul,
          jenis: item.jenis,
          kontak: item.kontak,
          tanggalTerbit: item.tanggal,
          guide: item.guide,
          harga: item.biaya,
          deskripsi: item.deskripsi,
          penulis: item.penulis,
          titikKumpul: item.titik_kumpul,
          waktu: item.waktu,
        };
      } catch (err) {
        error.value = err.response?.data?.message || "Gagal mengambil data";
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      router.push("/paket-wisata");
    };

    const handleEdit = () => {
      router.push(`/wisata/edit/${route.params.id}`);
    };

    const handleDelete = async () => {
      try {
        await paketWisataService.deletePaketWisata(route.params.id);
        router.push("/paket-wisata");
      } catch (err) {
        error.value = err.response?.data?.message || "Gagal menghapus data";
      }
    };

    onMounted(() => {
      loadData();
    });

    return {
      wisata,
      loading,
      error,
      showDeleteModal,
      loadData,
      goBack,
      handleEdit,
      handleDelete,
      formatRupiah,
      formatDate,
    };
  },
};
</script>

<style scoped>
.detail-wisata-page {
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
}

.detail-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge-jenis {
  background-color: #ffc107;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
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

.price-section {
  background: linear-gradient(135deg, #1a7a7a 0%, #145f5f 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.price-section label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.price {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
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

/* Loading & Error */
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

/* Responsive */
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

  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-section {
    flex-direction: column;
  }

  .price {
    font-size: 2rem;
  }
}
</style>
