<template>
  <div class="card">
    <div class="card-header">
      <span class="h5"><i class="bi bi-journal-bookmark-fill"></i> Elemen</span>
    </div>
    <div class="card-body">
      <div class="alert alert-warning pb-0 small">
        <ul>
          <li>Berikut Elemen PKL yang sesuai dengan Program Keahlian</li>
          <li>Elemen berikut berkaitan dengan <nuxt-link to="/jurnal" class="link">Jurnal Harian</nuxt-link> yang ditulis</li>
          <li>Setiap Jurnal kegiatan harus memiliki elemen</li>
          <li><code>Lain-lain</code> adalah pilihan di luar konteks elemen</li>
          <li>Klik item berikut untuk melihat CP dan Tujuan Pembelajaran</li>
        </ul>
      </div>
      <loading v-if="isLoading" />
      <div v-if="elements" class="accordion accordion-flush" id="accordion-parent">
        <div v-for="elemen in elements" :key="elemen.id" class="accordion-item border-bottom border-1 border-dark">
          <div class="accordion-header fw-bold">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-${elemen.id}`" aria-expanded="false" :aria-controls="`flush-${elemen.id}`">
              {{ elemen.elemen }}
            </button>
          </div>
          <div :id="`flush-${elemen.id}`" class="accordion-collapse collapse" data-bs-parent="#accordion-parent">
            <div class="accordion-body">
              <strong>CP</strong>
              <p>{{ elemen.cp }}</p>
              <strong>Tujuan</strong>
              <p class="pre-text">{{ elemen.tujuan }}</p>
            </div>
          </div>
        </div>
      </div>
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
