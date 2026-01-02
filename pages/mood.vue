<template>
  <div class="fw-bold text-grey text-center mb-3">Kepoin Mood Orang laen 👀</div>
  <div class="card">
    <div class="card-body pt-0 pb-3 ps-2 pe-2">
      <div class="list-group list-group-flush">
        <Loading v-if="isLoading" />
        <div v-else-if="!isLoading && moods.length < 1" class="text-center text-muted pt-3">
          <h1>🧐</h1>
          Yaah belom pada ngupdate~
        </div>
        <div v-else v-for="m in moods" :key="m.id" class="list-group-item ps-0 pe-0 mt-2">
          <div class="smallest text-muted">{{ m.updated }}</div>
          <div class="small text-muted fw-bold">
            {{ m.nama.charAt(0).toUpperCase() + m.nama.slice(1).toLowerCase() }} <span class="fw-normal">feels {{ m.currentMood?.name }} &#8212;</span> {{ m.currentMood?.emoji }}
          </div>
          <!--<div data-bs-toggle="modal" data-bs-target="#openModalEmoji" @click="setModalEmoji(m)" class="hand-cursor smallest text-muted mt-2">
            <i class="bi bi-emoji-smile"></i><sup><i class="bi bi-plus"></i></sup>
          </div>-->
        </div>
      </div>

      <!-- single modal: emoji motivations -->
      <div class="modal" id="openModalEmoji">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
            <div class="modal-body text-center">
              <h1>👀</h1>
              Nothing to see here &#8212; yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: "Mood — e-PKL / SMKN 4 Tasikmalaya." })
definePageMeta({ middleware: 'auth' })
const client = usePocketBaseClient()
const isLoading = ref(true)
const moods = ref([])
const tempStudent = ref({})
const motivations = ref([
  {
    "name": "semangat",
    "emoji": "💪🏻"
  },
  {
    "name": "gua juga",
    "emoji": "✋🏻",
  }
])

function setModalEmoji(mood) {
  tempStudent.value = mood
}

function formatTanggal(date) {
  let d = new Date(date)
  let option = {
    dateStyle: "long",
    timeStyle: "short"
  }
  return new Intl.DateTimeFormat("id-ID", option).format(d)
}

// TODO: Create table called `student_mood`
// add some field: 
// - siswa (FK to siswa)
// - siswaMotivator (FK to siswa)
// - currentMotivation JSON
async function getAllMood(loading=true) {
  isLoading.value = loading 
  let response = await client.collection("siswa").getFullList({
    filter: `currentMood != null`,
    sort: `-updated`
  })
  if(response) {
    moods.value = response
    isLoading.value = false
    for (let i = 0; i < response.length; i++) {
      moods.value[i].updated = formatTanggal(response[i].updated) 
    }
  }
}

onMounted(() => {
  getAllMood()
  client.autoCancellation(false)
  client.collection("siswa").subscribe("*", function(e) {
    if(e.action == "update") getAllMood(false)
  },{})
})
</script>

<style scoped>
.smallest {
  font-size: 11px;
}
</style>
