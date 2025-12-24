import Sidebar from '../../components/Sidebar.vue'
import Navbar from '../../components/Navbar.vue'
import MountainCard from '../../components/dataGunung/MountainCard.vue'
import Pagination from '../../components/Pagination.vue'
import ModalEditGunung from '../../components/dataGunung/ModalEditGunung.vue'
import ModalAddGunung from '../../components/dataGunung/ModalAddGunung.vue'
import ModalDeleteGunung from '../../components/dataGunung/ModalDeleteGunung.vue'
import ModalFeedbackGunung from '../../components/dataGunung/ModalFeedbackGunung.vue'
import axios from 'axios'

export default {
    name: 'DataGunungView',
    components: {
        Sidebar,
        Navbar,
        MountainCard,
        Pagination,
        ModalEditGunung,
        ModalAddGunung,
        ModalDeleteGunung,
        ModalFeedbackGunung
    },
    data() {
        return {
            searchQuery: '',
            itemsPerPage: 8,
            currentPage: 1,
            showEditModal: false,
            showAddModal: false,
            showDeleteModal: false,
            showFeedbackModal: false,
            feedbackMessage: '',
            mountainToDelete: null,
            selectedMountain: null,
            API_URL: 'http://127.0.0.1:8000/api/mountains',
            mountains: []
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
    mounted() {
        this.fetchMountains()
    },
    methods: {
        async fetchMountains() {
            try {
                const response = await axios.get(this.API_URL)
                this.mountains = response.data
            } catch (error) {
                console.error('Error fetching mountains:', error)
                this.feedbackMessage = 'Gagal memuat data gunung'
                this.showFeedbackModal = true
            }
        },
        changePage(page) {
            this.currentPage = page;
        },
        updateItemsPerPage() {
            this.currentPage = 1;
        },
        addMountain() {
            this.showAddModal = true;
        },
        closeAddModal() {
            this.showAddModal = false;
        },
        async saveNewMountain(formData) {
            try {
                await axios.post(this.API_URL, formData)
                await this.fetchMountains()
                this.closeAddModal()
                this.feedbackMessage = 'Data gunung berhasil ditambahkan!'
                this.showFeedbackModal = true
            } catch (error) {
                console.error('Error adding mountain:', error)
                this.feedbackMessage = 'Gagal menambahkan data gunung'
                this.showFeedbackModal = true
            }
        },
        editMountain(mountain) {
            this.selectedMountain = mountain;
            this.showEditModal = true;
        },
        closeEditModal() {
            this.showEditModal = false;
            this.selectedMountain = null;
        },
        async saveMountain(formData) {
            if (this.selectedMountain) {
                try {
                    await axios.put(`${this.API_URL}/${this.selectedMountain.id}`, formData)
                    await this.fetchMountains()
                    this.closeEditModal()
                    this.feedbackMessage = 'Data gunung berhasil diperbarui!'
                    this.showFeedbackModal = true
                } catch (error) {
                    console.error('Error updating mountain:', error)
                    this.feedbackMessage = 'Gagal memperbarui data gunung'
                    this.showFeedbackModal = true
                }
            }
        },
        deleteMountain(mountainData) {
            this.mountainToDelete = mountainData;
            this.showDeleteModal = true;
        },
        async confirmDelete() {
            if (this.mountainToDelete) {
                try {
                    console.log('Deleting mountain with ID:', this.mountainToDelete.id)
                    const response = await axios.delete(`${this.API_URL}/${this.mountainToDelete.id}`)
                    console.log('Delete response:', response)
                    await this.fetchMountains()
                    this.showDeleteModal = false
                    this.mountainToDelete = null
                    this.feedbackMessage = 'Data gunung berhasil dihapus!'
                    this.showFeedbackModal = true
                } catch (error) {
                    console.error('Error deleting mountain:', error)
                    console.error('Error details:', error.response)
                    this.feedbackMessage = 'Gagal menghapus data gunung: ' + (error.response?.data?.message || error.message)
                    this.showFeedbackModal = true
                    this.showDeleteModal = false
                    this.mountainToDelete = null
                }
            } else {
                console.error('No mountain selected for deletion')
            }
        },
        cancelDelete() {
            this.showDeleteModal = false;
            this.mountainToDelete = null;
        },
        closeFeedbackModal() {
            this.showFeedbackModal = false;
            this.feedbackMessage = '';
        }
    }
}
