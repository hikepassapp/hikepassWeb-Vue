import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import RegisterData from '../views/RegisterData.vue'
import DataGunung from '../views/dataGunung/DataGunung.vue'
import Laporan from '../views/Laporan.vue'
import User from '../views/User.vue'
import Reservasi from '../views/reservation/Reservasi.vue'
import Berita from '../views/berita-event/BeritaEventView.vue'
import PaketWisata from '../views/paket-wisata/PaketWisataView.vue'
import Informasi from '../views/Informasi.vue'
import TambahPaketWisataView from '../views/paket-wisata/TambahPaketWisataView.vue'
import DetailPaketWisataView from '../views/paket-wisata/DetailPaketWisataView.vue'
import EditPaketWisataView from '../views/paket-wisata/EditPaketWisataView.vue'
import BeritaEventView from '../views/berita-event/BeritaEventView.vue'
import TambahBeritaEventView from '../views/berita-event/TambahBeritaEventView.vue'
import DetailBeritaEventView from '../views/berita-event/DetailBeritaEventView.vue'
import EditBeritaEventView from '../views/berita-event/EditBeritaEventView.vue'
import LaporanList from '../views/LaporanList.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import VerifyOTP from '../views/VerifyOTP.vue'
import ResetPassword from '../views/ResetPassword.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { guest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { guest: true }
  },
  {
    path: '/verify-otp/:email',
    name: 'VerifyOTP',
    component: VerifyOTP,
    meta: { guest: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { guest: true }
  },
  {
    path: '/register-data',
    name: 'RegisterData',
    component: RegisterData,
    meta: { requiresAuth: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/data-gunung',
    name: 'DataGunung',
    component: DataGunung,
    meta: { requiresAuth: true }
  },
  {
    path: '/reservasi',
    name: 'Reservasi',
    component: Reservasi,
    meta: { requiresAuth: true }
  },
  {
    path: '/berita',
    name: 'Berita',
    component: Berita,
    meta: { requiresAuth: true }
  },
  {
    path: '/paket-wisata',
    name: 'PaketWisata',
    component: PaketWisata,
    meta: { requiresAuth: true }
  },
  {
    path: '/wisata/tambah',
    name: 'TambahPaketWisata',
    component: TambahPaketWisataView,
    meta: { requiresAuth: true }
  },
  {
    path: '/wisata/detail/:id',
    name: 'DetailPaketWisata',
    component: DetailPaketWisataView,
    meta: { requiresAuth: true }
  },
  {
    path: '/wisata/edit/:id',
    name: 'EditPaketWisata',
    component: EditPaketWisataView,
    meta: { requiresAuth: true }
  },
  {
    path: '/informasi',
    name: 'Informasi',
    component: Informasi,
    meta: { requiresAuth: true }
  },
  {
    path: '/berita-event',
    name: 'BeritaEvent',
    component: BeritaEventView,
    meta: { requiresAuth: true }
  },
  {
    path: '/berita/tambah',
    name: 'TambahBeritaEvent',
    component: TambahBeritaEventView,
    meta: { requiresAuth: true }
  },
  {
    path: '/berita/detail/:id',
    name: 'DetailBeritaEvent',
    component: DetailBeritaEventView,
    meta: { requiresAuth: true }
  },
  {
    path: '/berita/edit/:id',
    name: 'EditBeritaEvent',
    component: EditBeritaEventView,
    meta: { requiresAuth: true }
  },
  {
    path: '/laporan',
    name: 'Laporan',
    component: LaporanList,
    meta: { requiresAuth: true }
  },
  {
    path: '/laporan/buat',
    name: 'laporan-buat',
    component: Laporan,
    meta: { requiresAuth: true }
  },
  {
    path: '/user',
    name: 'user',
    component: User,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  // Halaman yang memerlukan autentikasi
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
  // Halaman untuk guest
  else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      next({ path: '/home' })
    } else {
      next()
    }
  }
  else {
    next()
  }
})

export default router