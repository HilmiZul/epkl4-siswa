<template>
  <div class="bg-transparent">
    <div class="pb-2 ps-0 pe-0 text-center">
      <Loading v-if="isLoading" />
      <span v-else-if="!isLoading && peserta">
        <span @click="() => isOpenEmojis = !isOpenEmojis" class="mood-container hand-cursor">
          <span v-if="!currentMood" class="emoji">
            <i class="bi bi-emoji-smile"></i><sup class="text-muted fw-normal"><i class="bi bi-plus"></i></sup>
          </span>
          <span v-else class="emoji">
            <div class="mood-bubble">I feel {{ currentMood.name }}!</div>
            {{ currentMood.emoji }}
          </span>
          <div v-if="isOpenEmojis" class="mood-item shadow-lg">
            <div class="smallest p-2">Apa mood lu hari ini?</div>
            <ul v-for="(emoji, i) in emojis" :key="i">
              <li @click="handleMood(emoji)" class="hand-cursor">{{ emoji.emoji }}</li>
            </ul>
          </div>
        </span>
        <div class="fw-bold text-grey">
          <!--{{ peserta.nama.charAt(0).toUpperCase()+peserta.nama.toLowerCase().slice(1) }}-->
          {{ peserta.nama }}
        </div>
      </span>
    </div>
  </div>

  <Loading v-if="isLoadingJournaToday" />
  <div v-else class="mb-3">
    <nuxt-link v-if="countDraftJournal > 0" to="/jurnal" class="link">
      <div class="alert alert-danger text-center small p-2">
        Lu punya <span class="fw-bold">{{ countDraftJournal }}</span> draft jurnal. Segera kirim! <i class="bi bi-arrow-right"></i>
      </div>
    </nuxt-link>
    <nuxt-link to="/jurnal" class="link">
      <div v-if="!havePostJournalToday" class="alert alert-warning text-center small p-2">
        <i class="bi bi-pencil-square"></i> Ayo buat Jurnal hari ini <i class="bi bi-arrow-right"></i>
      </div>
    </nuxt-link>
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
                  <span v-if="peserta" class="fw-bold text-grey">{{ peserta.kelas }}</span>
                  <span v-else>&#8212;</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <nuxt-link to="/iduka" class="link">
                    <div class="text-muted">Tempat PKL <i v-if="iduka" class="bi bi-pencil-square"></i></div>
                  </nuxt-link>
                  <span v-if="iduka" class="fw-bold text-grey">{{ iduka?.items[0].expand.iduka.nama }}</span>
                  <span v-else>Belum pemetaan</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <div class="text-muted">Wilayah</div>
                  <span v-if="iduka" class="fw-bold text-grey">{{ iduka?.items[0].expand.iduka.wilayah.charAt(0).toUpperCase() + iduka?.items[0].expand.iduka.wilayah.slice(1) }} kota</span>
                  <span v-else>Belum pemetaan</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <div class="text-muted">Guru Pembimbing</div>
                  <span v-if="emptyPemetaan">Belum pemetaan</span>
                  <span v-if="iduka?.totalItems < 0" class="fw-bold text-grey">Belum pemetaan</span>
                  <span v-else>
                    <span v-if="iduka?.items[0].expand.iduka?.pembimbing_sekolah == '' || iduka?.items[0].expand.iduka?.pembimbing_sekolah == '-'">Belum pemetaan</span>
                    <span v-else class="fw-bold text-grey">{{ iduka?.items[0].expand.iduka?.expand.pembimbing_sekolah.nama }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-4">
    <div class="fw-bold text-grey fs-5 pb-1"><i class="bi bi-people"></i> Temen Satu Tim</div>
    <Loading v-if="isLoading" />
    <div v-else class="card">
      <div class="card-body p-0">
        <div v-if="pemetaan.length < 1" class="text-center text-muted small p-3">Belum ada temen / elu PKL sendirian</div>
        <div v-for="p in pemetaan" :key="p.id" class="list-group list-group-flush">
          <div class="list-group-item border-bottom border-1 border-dark">
            <div class="float-start fs-4 me-2">{{ p.expand.siswa.currentMood?.emoji }}</div>
            <span class="small fw-bold text-grey pb-0 mb-0">{{ p.expand.siswa.nama }}</span> <br>
            <span class="smallest text-muted">{{ p.expand.siswa.kelas }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3 small">
      <nuxt-link to="/mood" class="link">Kepoin mood orang laen <i class="bi bi-arrow-right"></i></nuxt-link>
    </div>
  </div>

  <div class="mt-4">
    <div class="">
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
let isLoadingJournaToday = ref(true)
let countJournal = ref(0)
let countJournalNotValid = ref(0)
let pemetaan = ref([])
let iduka = ref()
let peserta = ref()
let emptyPemetaan = ref(false)
let isOpenEmojis = ref(false)
let emojis = ref([
  {
    "name": "good", 
    "emoji": "😊"
  },
  {
    "name": "happy",
    "emoji": "😃"
  },
  {
    "name": "tired",
    "emoji": "😔"
  },
  {
    "name": "headache",
    "emoji": "🤯" 
  },
  {
    "name": "fire",
    "emoji": "🔥"
  }
])
let currentMood = ref('')
let today = useServerDay()
let havePostJournalToday = ref(false)
let countDraftJournal = ref(0)

async function getCountJournal(loading=true) {
  isLoading.value = loading
  client.autoCancellation(false)
  let res_journal = await client.collection('jurnal').getFullList({
    filter: "siswa='"+user.user.value.id+"'",
    fields: "id",
  })
  let res_journal2 = await client.collection('jurnal').getFullList({
    filter: `siswa="${user.user.value.id}" && isValid=false`,
    fields: `id`
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

async function isTodayPostJournal() {
  try {
    isLoadingJournaToday.value = true
    let response = await client.collection('jurnal').getFirstListItem(`siswa="${user.user.value.id}"`, {
      sort: "-created"
    })
    if(response) {
      let res = response
      const date = new Date(res.created)
      const options = {
        dateStyle: "long"
      }
      res.created = new Intl.DateTimeFormat('id-ID', options).format(date)
      if(res.created == today) havePostJournalToday.value = true
      isLoadingJournaToday.value = false
    }
  } catch(error) {
    isLoadingJournaToday.value = false
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

async function getCountDraftJournal() {
  let res = await client.collection('jurnal').getFullList({
    filter: `siswa="${user.user.value.id}" && isDraft=true`
  })
  if(res) {
    countDraftJournal.value = res.length
  }
}

onMounted(() => {
  getCountJournal()
  getInfo()
  getCurrentMood()
  isTodayPostJournal()
  getCountDraftJournal()
  client.autoCancellation(false)
  client.collection('pemetaan').subscribe('*', function(e){
    if(e.action == 'create' || e.action == 'update') getInfo(false)
  }, {})
  client.collection('jurnal').subscribe('*', function(e){
    if(e.action == 'create' || e.action == 'update') {
      getCountJournal()
      isTodayPostJournal()
      getCountDraftJournal()
    } 
  }, {})
  client.collection('siswa').subscribe('*', function(e) {
    if(e.action == 'update') getCurrentMood()
  }, {})
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
.mood-bubble {
  position: absolute;
  left: 53%;
  top: 0%;
  background-color: #000;
  border-radius: 10px;
  color: #fff;
  padding: 7px;
  font-size: .8rem 
}
.emoji {
  font-size: 3rem
}
.smallest {
  font-size: 10pt
}
</style>
