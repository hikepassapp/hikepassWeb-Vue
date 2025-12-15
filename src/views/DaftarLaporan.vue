<template>
    <div class="daftar-laporan-page">
        <Sidebar />

        <div class="main-content">
            <Navbar pageTitle="Laporan" />

            <div class="content-wrapper">
                <div class="page-header">
                    <h2 class="page-title">Daftar Laporan</h2>
                    <button class="btn-add" @click="$router.push('/laporan/buat')">
                        + Buat Laporan
                    </button>
                </div>

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
                        <input type="text" v-model="searchQuery" class="form-control" placeholder="Cari laporan..." />
                    </div>
                </div>

                <TableLaporan :reports="paginatedReports" @view-detail="viewDetail" @delete-report="deleteReport"
                    @view-image="viewImage" />

                <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
            </div>
        </div>

        <!-- Modal for Image Preview -->
        <div v-if="showImageModal" class="modal-overlay" @click="closeImageModal">
            <div class="modal-content" @click.stop>
                <button class="modal-close" @click="closeImageModal">
                    <i class="bi bi-x-lg"></i>
                </button>
                <img :src="selectedImage" alt="Preview" class="modal-image" />
            </div>
        </div>

        <!-- Modal for Detail -->
        <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
            <div class="modal-detail" @click.stop>
                <button class="modal-close" @click="closeDetailModal">
                    <i class="bi bi-x-lg"></i>
                </button>
                <h3 class="modal-title">Detail Laporan</h3>
                <div v-if="selectedReport" class="detail-content">
                    <img :src="selectedReport.image" alt="Report" class="detail-image" />
                    <div class="detail-info">
                        <div class="info-item">
                            <strong>Nama Pelapor:</strong>
                            <span>{{ selectedReport.namaPelapor }}</span>
                        </div>
                        <div class="info-item">
                            <strong>Tanggal Kejadian:</strong>
                            <span>{{ formatDate(selectedReport.tanggalKejadian) }}</span>
                        </div>
                        <div class="info-item">
                            <strong>Lokasi Kejadian:</strong>
                            <span>{{ selectedReport.lokasiKejadian }}</span>
                        </div>
                        <div class="info-item">
                            <strong>Deskripsi:</strong>
                            <p>{{ selectedReport.deskripsi }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
import TableLaporan from '../components/TableLaporan.vue'
import Pagination from '../components/Pagination.vue'

export default {
    name: 'DaftarLaporanView',
    components: {
        Sidebar,
        Navbar,
        TableLaporan,
        Pagination
    },
    data() {
        return {
            searchQuery: '',
            itemsPerPage: 10,
            currentPage: 1,
            showImageModal: false,
            showDetailModal: false,
            selectedImage: '',
            selectedReport: null,
            reports: [
                {
                    id: 1,
                    namaPelapor: 'Al-Fatihah',
                    tanggalKejadian: '2025-12-12',
                    lokasiKejadian: 'Pos 1',
                    deskripsi: 'ada sampah',
                    image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=300&h=200&fit=crop'
                },
                {
                    id: 2,
                    namaPelapor: 'Ahmad Dahlan',
                    tanggalKejadian: '2025-12-10',
                    lokasiKejadian: 'Pos 2',
                    deskripsi: 'Selama perjalanan menuju puncak, tim mendapati beberapa titik jalur pendakian yang cukup memprihatinkan, terutama di sekitar Pos 1 hingga Pos 2.',
                    image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=300&h=200&fit=crop'
                },
                {
                    id: 3,
                    namaPelapor: 'Siti Nurhaliza',
                    tanggalKejadian: '2025-12-08',
                    lokasiKejadian: 'Pos 3',
                    deskripsi: 'Ditemukan sampah plastik dan botol di sekitar jalur pendakian',
                    image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=300&h=200&fit=crop'
                },
                {
                    id: 4,
                    namaPelapor: 'Budi Santoso',
                    tanggalKejadian: '2025-12-05',
                    lokasiKejadian: 'Base Camp',
                    deskripsi: 'Terdapat kerusakan fasilitas toilet umum di base camp',
                    image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=300&h=200&fit=crop'
                }
            ]
        }
    },
    computed: {
        filteredReports() {
            if (!this.searchQuery) {
                return this.reports;
            }
            return this.reports.filter(report =>
                report.namaPelapor.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                report.lokasiKejadian.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                report.deskripsi.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        totalPages() {
            return Math.ceil(this.filteredReports.length / this.itemsPerPage);
        },
        paginatedReports() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredReports.slice(start, end);
        }
    },
    methods: {
        changePage(page) {
            this.currentPage = page;
        },
        updateItemsPerPage() {
            this.currentPage = 1;
        },
        viewDetail(report) {
            this.selectedReport = report;
            this.showDetailModal = true;
        },
        deleteReport(id) {
            if (confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
                this.reports = this.reports.filter(report => report.id !== id);
                console.log('Deleted report with id:', id);
            }
        },
        viewImage(image) {
            this.selectedImage = image;
            this.showImageModal = true;
        },
        closeImageModal() {
            this.showImageModal = false;
            this.selectedImage = '';
        },
        closeDetailModal() {
            this.showDetailModal = false;
            this.selectedReport = null;
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
    }
}
</script>

<style scoped>
.daftar-laporan-page {
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


.page-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    margin: 0;
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

.modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
}

.modal-image {
    max-width: 100%;
    max-height: 90vh;
    border-radius: 12px;
}

.modal-detail {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.5);
    color: white;
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
    background: rgba(0, 0, 0, 0.8);
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

.detail-image {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 12px;
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
}

.info-item strong {
    color: #333;
    font-weight: 600;
}

.info-item span,
.info-item p {
    color: #666;
    line-height: 1.6;
    margin: 0;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

    .page-title {
        font-size: 1.5rem;
    }
}
</style>