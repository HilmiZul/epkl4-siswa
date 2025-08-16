<template>
  <div class="card">
    <div class="card-header">
      <span class="h5"><i class="bi bi-journal-bookmark-fill"></i> Elemen</span>
    </div>
    <div class="card-body">
      <div class="alert alert-warning pb-0">
        <ul>
          <li>Berikut Elemen PKL yang sesuai dengan Program Keahlian</li>
          <li>Elemen berikut berkaitan dengan <nuxt-link to="/jurnal" class="link">Jurnal Harian</nuxt-link> yang ditulis</li>
          <li>Setiap Jurnal kegiatan harus memiliki elemen</li>
          <li><code>Lain-lain</code> adalah pilihan di luar konteks elemen</li>
          <li>Klik item berikut untuk melihat CP dan Tujuan Pembelajaran</li>
        </ul>
      </div>
      <loading v-if="isLoading" />
      <ul v-else v-for="elemen in elements" :key="elemen.id" class="list-group rounded-0">
        <nuxt-link data-bs-toggle="modal" :data-bs-target="`#elemen-${elemen.id}`" class="list-group-item hand-cursor"><i class="bi bi-chevron-right"></i> {{ elemen.elemen }}</nuxt-link>
        <div :id="`elemen-${elemen.id}`" class="modal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
              <div class="modal-header fw-bold bg-success rounded-0 border-bottom borer-2 border-dark">
                {{ elemen.elemen }}
                <button type="button" class="btn-close" data-bs-dismiss="modal" aira-label="Close"></button>
              </div>
              <div class="modal-body small">
                <article>
                  <strong>CP</strong>
                  <p>{{ elemen.cp }}</p>
                </article>
                <article>
                  <strong>Tujuan</strong>
                  <p class="pre-text">{{ elemen.tujuan }}</p>
                </article>
              </div>
              <div class="modal-footer">
                <button class="btn btn-danger" data-bs-dismiss="modal">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Elemen — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoading = ref(true)
let elements = ref([])

async function getElemenCp() {
  isLoading.value = true
  client.autoCancellation(false)
  let res = await client.collection('elemen_cp').getFullList({
    filter: "program_keahlian='"+prokel+"'",
    sort: 'created'
  })
  if(res) {
    isLoading.value = false
    elements.value = res
  }
}

onMounted(() => getElemenCp())
</script>

<style scoped>
.list-group .list-group-item a:hover {
  color: #b5d2ad;
}
.pre-text {
  white-space: pre-wrap;
}
</style>
