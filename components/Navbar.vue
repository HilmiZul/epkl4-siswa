<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary bg-white border-top border-bottom border-3 border-dark mb-3">
    <div class="container-fluid">
      <nuxt-link v-if="user" class="navbar-brand lexend-mega text-grey" to="/"><span class="border-3 border-bottom">{{ username.toUpperCase() }}</span>.</nuxt-link>
      <button class="navbar-toggler rounded-0 border-3 border-dark" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <i class="bi-three-dots-vertical fs-1 text-dark"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav text-center fw-bold">
          <li v-if="!$device.isMobile" class="nav-item">
            <nuxt-link  class="nav-link" to="/"><i class="bi bi-house-door"></i> Home</nuxt-link>
          </li>
          <li v-if="!$device.isMobile" class="nav-item">
            <nuxt-link  class="nav-link" to="/iduka"><i class="bi bi-buildings"></i> IDUKA</nuxt-link>
          </li>
          <li v-if="!$device.isMobile" class="nav-item">
            <nuxt-link  class="nav-link" to="/elemen"><i class="bi bi-journal-bookmark-fill"></i> Elemen</nuxt-link>
          </li>
          <li v-if="!$device.isMobile" class="nav-item">
            <nuxt-link class="nav-link" to="/jurnal"><i class="bi bi-journals"></i> Jurnal Harian</nuxt-link>
          </li>
          <li v-if="!$device.isMobile" class="nav-item">
            <nuxt-link class="nav-link" to="/nilai"><i class="bi bi-patch-check"></i> Nilai</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/ubah-password"><i class="bi bi-key"></i> Ubah Password</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link text-danger" to="/logout"><i class="bi bi-box-arrow-right"></i> Keluar</nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = ref()
let nama = user?.user.value.nama
let role = user?.user.value.role
let username = user?.user.value.username
</script>

<style scoped>
@media screen and (min-width: 992px) {
  .navbar {
    display: none;
  }
}
.nav-item a {
  color: #000;
}
</style>
