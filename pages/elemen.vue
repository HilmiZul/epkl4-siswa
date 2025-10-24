<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 fw-bold"><i class="bi bi-journal-bookmark-fill"></i> Elemen</span>
    </div>
    <div class="card-body">
      <div class="alert alert-warning pb-0 small">
        <ul class="px-2">
          <li>Elemen berikut berkaitan dengan <nuxt-link to="/jurnal" class="link">Jurnal</nuxt-link></li>
          <li><code>Lain-lain</code> adalah opsi di luar konteks elemen</li>
        </ul>
      </div>
      <loading v-if="isLoading" />
      <div v-if="elements" class="accordion accordion-flush border border-2 border-dark shadow-lg" id="accordion-parent">
        <div v-for="(elemen,i) in elements" :key="elemen.id" class="accordion-item border-bottom border-2 border-dark">
          <div class="accordion-header">
            <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" :data-bs-target="`#flush-${elemen.id}`" aria-expanded="false" :aria-controls="`flush-${elemen.id}`">
              <span class="badge bg-warning border border-2 border-dark me-2">{{ i+1 }}</span> {{ elemen.elemen }}
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
button:focus {
  box-shadow: none !important;
}
</style>
