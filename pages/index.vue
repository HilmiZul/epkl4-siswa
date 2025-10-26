<template>
  <div class="card">
    <div class="card-header">
      <span v-if="isLoading" class="fst-italic text-muted">loading</span>
      <span v-else-if="!isLoading && peserta" class="fw-bold">{{ peserta.nama.charAt(0).toUpperCase()+peserta.nama.toLowerCase() }}</span>
    </div>
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
            <div class="row small mb-3">
              <div class="col-lg-12">
                <div class="text-muted mb-1 fw-medium">Teman satu tim:</div>
                <table class="table table-striped border-0">
                  <tbody>
                    <tr v-if="pemetaan.length < 1">
                      <td class="text-muted fst-italic">Belum ada teman/pemetaan</td>
                    </tr>
                    <tr v-for="(p,i) in pemetaan" :key="p.id">
                      <td class="align-content-center" width="2%"><span class="badge bg-warning border border-2 border-dark">{{ i+1 }}</span></td>
                      <td>
                        <span class="fw-bold">{{ p.expand.siswa.nama }}</span> <br>
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

onMounted(() => {
  getCountJournal()
  getInfo()
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
</style>
