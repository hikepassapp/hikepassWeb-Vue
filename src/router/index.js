import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import RegisterData from '../views/RegisterData.vue'
import DataGunung from '../views/dataGunung/DataGunung.vue'
import Laporan from '../views/Laporan.vue'
import DaftarLaporan from '../views/DaftarLaporan.vue'
import User from '../views/User.vue'
import Reservasi from '../views/Reservasi.vue'
import Berita from '../views/Berita.vue'
import PaketWisata from '../views/PaketWisata.vue'
import Informasi from '../views/Informasi.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
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
    path: '/informasi',
    name: 'Informasi',
    component: Informasi
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
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
