import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import RegisterData from '../views/RegisterData.vue'
import DataGunung from '../views/DataGunung.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
