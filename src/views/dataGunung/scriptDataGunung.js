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
            feedbackType: 'success',
            mountainToDelete: null,
            selectedMountain: null,
            API_URL: 'http://127.0.0.1:8000/api/mountains',
            mountains: []
        }
    },
    computed: {
        filteredMountains() {
            // Ensure mountains is always an array
            if (!Array.isArray(this.mountains)) {
                return [];
            }
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
                console.log('📡 Fetching mountains from:', this.API_URL)
                const response = await axios.get(this.API_URL)
                // API returns data in response.data.data format
                const mountainsData = response.data.data || []
                console.log('✅ Mountains loaded:', mountainsData.length, 'items')
                this.mountains = mountainsData
            } catch (error) {
                console.error('❌ Error fetching mountains:', error)
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                })
                this.feedbackMessage = 'Gagal memuat data gunung: ' + (error.response?.data?.message || error.message)
                this.feedbackType = 'error'
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
            // Clear any error state in modal
            this.$refs.modalAddGunung?.clearErrors?.()
        },
        async saveNewMountain(formData) {
            try {
                console.log('➕ Adding new mountain')
                // Modal may emit an object with imageFile; convert to FormData if needed
                let payload = formData
                if (!(formData instanceof FormData)) {
                    payload = new FormData()
                    // append simple fields
                    payload.append('name', formData.name || '')
                    payload.append('status', formData.status || '')
                    payload.append('manager', formData.manager || '')
                    payload.append('quota', formData.quota || '')
                    payload.append('location', formData.location || '')
                    payload.append('contact', formData.contact || '')
                    payload.append('price', formData.price || '')
                    payload.append('duration', formData.duration || '')
                    payload.append('pos', formData.pos || '')

                    const imgOpt = formData.imageOption || 'default'
                    if (imgOpt === 'file' && formData.imageFile) {
                        payload.append('image', formData.imageFile)
                        payload.append('image_type', 'file')
                    } else if (imgOpt === 'url') {
                        payload.append('image_url', formData.imageUrl || formData.image || '')
                        payload.append('image_type', 'url')
                    } else {
                        // default path
                        payload.append('image_path', formData.image || 'mountains/defaultMountainPics.jpg')
                        payload.append('image_type', 'default')
                    }
                }

                const response = await axios.post(this.API_URL, payload, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                console.log('✅ Mountain added successfully:', response.data)
                await this.fetchMountains()
                this.closeAddModal()
                this.feedbackMessage = 'Data gunung berhasil ditambahkan!'
                this.feedbackType = 'success'
                this.showFeedbackModal = true
            } catch (error) {
                console.error('❌ Error adding mountain:', error)
                console.error('Error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                })
                this.feedbackMessage = 'Gagal menambahkan data gunung: ' + (error.response?.data?.message || error.message)
                this.feedbackType = 'error'
                this.showFeedbackModal = true
                this.$refs.modalAddGunung?.setGeneralError?.(this.feedbackMessage)
            } finally {
                this.$refs.modalAddGunung?.setSubmitting?.(false)
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
                    console.log('✏️ Updating mountain ID:', this.selectedMountain.id)
                    // FormData is already prepared by modal
                    const response = await axios.post(`${this.API_URL}/${this.selectedMountain.id}?_method=PUT`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    console.log('✅ Mountain updated successfully:', response.data)
                    await this.fetchMountains()
                    this.closeEditModal()
                    this.feedbackMessage = 'Data gunung berhasil diperbarui!'
                    this.feedbackType = 'success'
                    this.showFeedbackModal = true
                } catch (error) {
                    console.error('❌ Error updating mountain:', error)
                    console.error('Error details:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status,
                        mountainId: this.selectedMountain.id
                    })
                    this.feedbackMessage = 'Gagal memperbarui data gunung: ' + (error.response?.data?.message || error.message)
                    this.feedbackType = 'error'
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
                    console.log('🗑️ Deleting mountain ID:', this.mountainToDelete.id, 'Name:', this.mountainToDelete.name)
                    const response = await axios.delete(`${this.API_URL}/${this.mountainToDelete.id}`)
                    console.log('✅ Mountain deleted successfully:', response.data)
                    await this.fetchMountains()
                    this.showDeleteModal = false
                    this.mountainToDelete = null
                    this.feedbackMessage = 'Data gunung berhasil dihapus!'
                    this.feedbackType = 'success'
                    this.showFeedbackModal = true
                } catch (error) {
                    console.error('❌ Error deleting mountain:', error)
                    console.error('Error details:', {
                        message: error.message,
                        response: error.response?.data,
                        status: error.response?.status,
                        mountainId: this.mountainToDelete.id
                    })
                    this.feedbackMessage = 'Gagal menghapus data gunung: ' + (error.response?.data?.message || error.message)
                    this.feedbackType = 'error'
                    this.showFeedbackModal = true
                    this.showDeleteModal = false
                    this.mountainToDelete = null
                }
            } else {
                console.error('⚠️ No mountain selected for deletion')
                this.feedbackMessage = 'Tidak ada data yang dipilih untuk dihapus'
                this.feedbackType = 'error'
                this.showFeedbackModal = true
            }
        },
        cancelDelete() {
            this.showDeleteModal = false;
            this.mountainToDelete = null;
        },
        closeFeedbackModal() {
            this.showFeedbackModal = false;
            this.feedbackMessage = '';
            this.feedbackType = 'success';
        }
    }
}