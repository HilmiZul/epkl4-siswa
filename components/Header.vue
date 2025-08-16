<template>
  <div class="card mb-5 border border-2 border-dark bg-warning">
    <div class="fs-1 text-center lexend-mega py-1">
      <span>e-PKL.</span>
    </div>
  </div>
</template>

<script setup>
let user = usePocketBaseUser()
</script>

<style scoped>
.card {
  background-color: transparent;
}
.text-shadow {
  text-shadow: 3px -2px #fff;
}
.card.mb-5 {
  margin-bottom: 2em !important;
}
</style>
