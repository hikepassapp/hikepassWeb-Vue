<script setup>
console.info("Hello vue");
const hello = "<b>Hello Vue</b>";
</script>

<template>
  <h1 class="hello">{{ hello }}</h1>
  <div v-html="hello"></div>
</template>

<style scoped>
.hello {
  color: blue;
}
</style>
