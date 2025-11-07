<template>
  <Navbar />
  <router-view />
  <div class="container text-center mt-5">
    <h1 class="text-primary">Hello Vue + Bootstrap 🎉</h1>

    <button class="btn btn-success mt-3">
      Klik Saya
    </button>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  components: { Navbar }
}
</script>
