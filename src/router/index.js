import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import RegisterData from '../views/RegisterData.vue'
import DataGunung from '../views/dataGunung/DataGunung.vue'
import Laporan from '../views/Laporan.vue'
import DaftarLaporan from '../views/DaftarLaporan.vue'
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
    path: '/register-data',
    name: 'RegisterData',
    component: RegisterData
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/data-gunung',
    name: 'DataGunung',
    component: DataGunung
  },
  {
    path: '/reservasi',
    name: 'Reservasi',
    component: Reservasi
  },
  {
    path: '/berita',
    name: 'Berita',
    component: Berita
  },
  {
    path: '/paket-wisata',
    name: 'PaketWisata',
    component: PaketWisata
  },
  {
    path: '/wisata/tambah',
    name: 'TambahPaketWisata',
    component: TambahPaketWisataView
  },
  {
    path: '/wisata/detail/:id',
    name: 'DetailPaketWisata',
    component: DetailPaketWisataView
  },
  {
    path: '/wisata/edit/:id',
    name: 'EditPaketWisata',
    component: EditPaketWisataView
  },
  {
    path: '/informasi',
    name: 'Informasi',
    component: Informasi
  },
  {
    path: '/berita-event',
    name: 'BeritaEvent',
    component: BeritaEventView
  },
  {
    path: '/berita/tambah',
    name: 'TambahBeritaEvent',
    component: TambahBeritaEventView
  },
  {
    path: '/berita/detail/:id',
    name: 'DetailBeritaEvent',
    component: DetailBeritaEventView
  },
  {
    path: '/berita/edit/:id',
    name: 'EditBeritaEvent',
    component: EditBeritaEventView
  },
  {
    path: '/laporan',
    name: 'Laporan',
    component: DaftarLaporan
  },
  {
    path: '/laporan/buat',
    name: 'laporan-buat',
    component: Laporan
  },
  {
    path: '/user',
    name: 'user',
    component: User
  },
  {
    path: '/laporan-list',
    name: 'LaporanList',
    component: LaporanList
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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
