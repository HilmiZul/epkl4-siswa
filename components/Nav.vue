<template>
  <div class="col-lg-3 side-nav">
    <Header />
    <div class="card shadow-lg">
      <div class="card-body p-0">
        <!-- <div v-if="user" class="lexend-mega text-center py-2 border-2 border-bottom border-dark">Halo, <span class="border-2 border-bottom border-dark">{{ username.toUpperCase() }}</span>! 😆</div> -->
        <nav>
          <ol class="list-group list-group-flush quicksand fw-bold">
            <nuxt-link to="/">
              <li class="list-group-item"><i class="bi bi-info-square"></i> Overview</li>
            </nuxt-link>
            <nuxt-link to="/elemen">
              <li class="list-group-item"><i class="bi bi-journal-bookmark-fill"></i> Elemen</li>
            </nuxt-link>
            <nuxt-link to="/jurnal">
              <li class="list-group-item"><i class="bi bi-journals"></i> Jurnal Harian</li>
            </nuxt-link>
            <nuxt-link to="/sertifikat">
              <li class="list-group-item"><i class="bi bi-patch-check"></i> Sertifikat</li>
            </nuxt-link>
            <nuxt-link to="/ubah-password">
              <li class="list-group-item"><i class="bi bi-key"></i> Ubah Password</li>
            </nuxt-link>
            <nuxt-link to="/logout">
              <li class="list-group-item text-danger"><i class="bi bi-box-arrow-right"></i> Keluar</li>
            </nuxt-link>
          </ol>
        </nav>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
let user = usePocketBaseUser()
let prokel = ref({})
let nama = user?.user.value.nama
let role = user?.user.value.role
let username = user?.user.value.username
</script>

<style scoped>
a {
  text-decoration: none;
}
a:hover > li {
  background-color: #f0f0f0;
}
.list-group-item {
  font-size: 1.2em;
  border: none !important;
  border-bottom: 2px solid #000 !important;
}
.list-group-item:hover {
  background-color: #fafa96;
}
@media screen and (max-width: 992px) {
  .side-nav {
    display: none;
  }
}
</style>
