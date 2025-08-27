<template>
  <div class="card mb-5 border border-2 border-dark bg-warning">
    <div class="text-center py-1">
      <span class="fs-1 lexend-mega">e-PKL<span class="text-info">.</span></span>
      <span class="fw-bold smallest ">peserta</span>
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
