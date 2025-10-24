<template>
  <nav class="navbar navbar-expand fixed-bottom bg-white border-top border-3 border-dark p-0">
    <div class="container-fluid justify-content-around">
      <ul class="navbar-nav text-center fw-bold">
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/" :activeClass="activeClass">
            <i class="bi bi-house-door fs-5"></i> <br>
            <span class="smallest">Home</span>
          </nuxt-link>
        </li>
        <li class="nav-item mx-4">
          <nuxt-link class="nav-link" to="/elemen">
            <i class="bi bi-journal-bookmark-fill fs-5"></i> <br>
            <span class="smallest">Elemen</span>
          </nuxt-link>
        </li>
        <li class="nav-item me-4">
          <nuxt-link class="nav-link" to="/jurnal">
            <i class="bi bi-journals fs-5"></i> <br>
            <span class="smallest">Jurnal</span>
          </nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link" href="/nilai">
            <i class="bi bi-patch-check fs-5"></i> <br>
            <span class="smallest">Nilai</span>
          </nuxt-link>
        </li>
        <!-- <li class="nav-item">
          <nuxt-link class="nav-link" href="/ubah-password">
            <i class="bi bi-key fs-4"></i> <br>
            <span class="smallest">Password</span>
          </nuxt-link>
        </li> -->
      </ul>
    </div>
  </nav>
</template>


<script setup>
let activeClass = ref('list-group-item-active')
</script>
