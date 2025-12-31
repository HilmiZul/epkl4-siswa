<template>
  <div>
    <div class="card-header pb-3 ps-0 pe-0 text-center">
      <span v-if="isLoading" class="fst-italic text-muted">loading</span>
      <span v-else-if="!isLoading && peserta">
        <span @click="() => isOpenEmojis = !isOpenEmojis" class="mood-container hand-cursor">
          <span v-if="!currentMood" class="emoji">
            <i class="bi bi-emoji-smile"></i><sup class="text-muted fw-normal"><i class="bi bi-plus"></i></sup>
          </span>
          <span v-else class="emoji">
            {{ currentMood }}
          </span>
          <div v-if="isOpenEmojis" class="mood-item shadow-lg">
            <div class="smallest p-2">Apa mood lu saat ini?</div>
            <ul v-for="(emoji, i) in emojis" :key="i">
              <li @click="handleMood(emoji)" class="hand-cursor">{{ emoji }}</li>
            </ul>
          </div>
        </span>
        <div class="fw-bold text-muted small">
          <!--{{ peserta.nama.charAt(0).toUpperCase()+peserta.nama.toLowerCase().slice(1) }}-->
          {{ peserta.nama }}
        </div>
      </span>
    </div>
  </div>

  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-md-12">
          <Loading v-if="isLoading" />
          <div v-else>
            <div class="row">
              <div class="col-md-3">
                <div class="mb-3">
                  <div class="text-muted">Kelas</div>
                  <span v-if="peserta" class="fw-bold">{{ peserta.kelas }}</span>
                  <span v-else>&#8212;</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <nuxt-link to="/iduka" class="link">
                    <div class="text-muted">Tempat PKL <i v-if="iduka" class="bi bi-pencil-square"></i></div>
                  </nuxt-link>
                  <span v-if="iduka" class="fw-bold">{{ iduka?.items[0].expand.iduka.nama }}</span>
                  <span v-else>Belum pemetaan</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <div class="text-muted">Wilayah</div>
                  <span v-if="iduka" class="fw-bold">{{ iduka?.items[0].expand.iduka.wilayah.charAt(0).toUpperCase() + iduka?.items[0].expand.iduka.wilayah.slice(1) }} kota</span>
                  <span v-else>Belum pemetaan</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <div class="text-muted">Guru Pembimbing</div>
                  <span v-if="emptyPemetaan">Belum pemetaan</span>
                  <span v-if="iduka?.totalItems < 0" class="fw-bold">Belum pemetaan</span>
                  <span v-else>
                    <span v-if="iduka?.items[0].expand.iduka?.pembimbing_sekolah == '' || iduka?.items[0].expand.iduka?.pembimbing_sekolah == '-'">Belum pemetaan</span>
                    <span v-else class="fw-bold">{{ iduka?.items[0].expand.iduka?.expand.pembimbing_sekolah.nama }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-lg-12">
                <div class="text-muted mb-1">Temen satu tim:</div>
                <table class="table table-striped border-0">
                  <tbody>
                    <tr v-if="pemetaan.length < 1">
                      <td class="text-muted fst-italic">Belum ada teman/pemetaan</td>
                    </tr>
                    <tr v-for="(p) in pemetaan" :key="p.id">
                      <td>
                        <span class="fw-bold">{{ p.expand.siswa.currentMood }} {{ p.expand.siswa.nama }}</span> <br>
                        <span class="smallest text-muted">{{ p.expand.siswa.kelas }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-3">
          <nuxt-link class="link" to="/jurnal">
            <div class="card bg-info mb-3">
              <div class="card-body">
                <strong class="fs-4">{{ countJournal }}</strong>
                <div class="small">Jurnal Harian</div>
                <!-- <span class="small"> halaman</span> -->
              </div>
            </div>
          </nuxt-link>
        </div>
        <div v-if="countJournalNotValid > 0" class="col-lg-3">
          <nuxt-link class="link" to="/jurnal">
            <div class="card bg-danger mb-3">
              <div class="card-body">
                <strong class="fs-4">{{ countJournalNotValid }}</strong>
                <div class="small">Jurnal belum di validasi</div>
                <!-- <span class="small"> halaman</span> -->
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Overview — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoading = ref(true)
let countJournal = ref(0)
let countJournalNotValid = ref(0)
let pemetaan = ref([])
let iduka = ref()
let peserta = ref()
let emptyPemetaan = ref(false)
let isOpenEmojis = ref(false)
let emojis = ref(["😃", "😥", "😔", "🤯", "🔥"])
let currentMood = ref('')

async function getCountJournal(loading=true) {
  isLoading.value = loading
  client.autoCancellation(false)
  let res_journal = await client.collection('jurnal').getFullList({
    filter: "siswa='"+user.user.value.id+"'",
    fields: "id",
  })
  let res_journal2 = await client.collection('jurnal').getFullList({
    filter: "siswa='"+user.user.value.id+"' && isValid=false",
    fields: "id"
  })
  if(res_journal && res_journal2) {
    isLoading.value = false
    countJournal.value = res_journal.length
    countJournalNotValid.value = res_journal2.length
  }
}

async function getInfo(loading=true) {
  isLoading.value = loading
  client.autoCancellation(false)
  let res_siswa = await client.collection('siswa').getOne(user.user.value.siswa, {
    expand: "program_keahlian"
  })
  let res_iduka = await client.collection('pemetaan').getList(1,1, {
    filter: "siswa='"+user.user.value.siswa+"'",
    expand: "iduka, iduka.pembimbing_sekolah, program_keahlian, siswa"
  })
  if(res_iduka && res_siswa) {
    peserta.value = res_siswa
    if(res_iduka.items.length > 0) {
      let res_pemetaan = await client.collection('pemetaan').getFullList({
        filter: "iduka='"+res_iduka?.items[0].iduka+"' && siswa!='"+user.user.value.siswa+"'",
        expand: "iduka, siswa"
      })
      if(res_pemetaan) {
        isLoading.value = false
        iduka.value = res_iduka
        pemetaan.value = res_pemetaan
        // console.log(res_pemetaan)
        // console.log(user.user.value.siswa)
      }
    } else {
      emptyPemetaan.value = true
    }
  }
}

async function handleMood(emoji) {
  currentMood.value = emoji
  isOpenEmojis.value ? false : true
  let res = await client.collection('siswa').update(user.user.value.siswa, {
    "currentMood": currentMood.value
  })
}

async function getCurrentMood() {
  let res = await client.collection('siswa').getOne(user.user.value.siswa, {})
  if(res) {
    currentMood.value = res.currentMood
  }
}

onMounted(() => {
  getCountJournal()
  getInfo()
  getCurrentMood()
  client.autoCancellation(false)
  client.collection('pemetaan').subscribe('*', function(e){
    if(e.action == 'create' || e.action == 'update') getInfo(false)
  })
  client.collection('jurnal').subscribe('*', function(e){
    if(e.action == 'update') getCountJournal(false)
  })
})
</script>

<style scoped>
.small, .small table {
  font-size: 14px !important;
}
.card .card-header {
  font-size: 1.2rem;
  background-color: transparent;
  border-bottom: none !important;
}
ul {
  padding: 0 7px 0 7px;
  list-style-type: none;
  display: inline-block !important;
}
ul li {
  font-size: 1.5rem;
}
.mood-container {
  position: relative;
  padding-bottom: 0 !important;
  padding-top: 5px;
  display: block;
  z-index: 1
}
.mood-item {
  position: absolute; 
  left: 40%;
  bottom: -90px;
  background-color: #fff;
  border: 2px solid #000;
}
.emoji {
  font-size: 3rem
}
.smallest {
  font-size: 10pt
}
</style>
