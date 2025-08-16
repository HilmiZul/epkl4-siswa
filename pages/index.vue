<template>
  <div class="card">
    <div class="card-header">
      <span class="h4"><i class="bi bi-info-square"></i> Overview</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-12">
          <Loading v-if="isLoading" />
          <div v-else>
            <div class="row small my-2">
              <div class="col-md-3">
                <div class="mb-3">
                  <div class="text-muted">Program Keahlian</div>
                  {{ iduka?.items[0].expand.program_keahlian.nama }}
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <div class="text-muted">Tempat PKL</div>
                  {{ iduka?.items[0].expand.iduka.nama }}
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <div class="text-muted">Wilayah</div>
                  {{ iduka?.items[0].expand.iduka.wilayah.charAt(0).toUpperCase() + iduka?.items[0].expand.iduka.wilayah.slice(1) }} kota
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <div class="text-muted">Guru Pembimbing</div>
                  {{ iduka?.items[0].expand.iduka.expand.pembimbing_sekolah.nama }}
                </div>
              </div>
            </div>
            <div class="row small mb-3">
              <div class="col-lg-6">
                <div class="text-muted mb-1 fw-medium">Teman yang juga satu tempat:</div>
                <table class="table table-striped border-0">
                  <tbody>
                    <tr v-for="(p,i) in pemetaan" :key="p.id">
                      <td width="3%">{{ i+1 }}.</td>
                      <td>{{ p.expand.siswa.nama }}</td>
                      <td>{{ p.expand.siswa.kelas }}</td>
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
                <div class="small">Jurnal Harian</div>
                <strong class="fs-4">{{ countJournal }}</strong>
                <span class="small"> halaman</span>
              </div>
            </div>
          </nuxt-link>
        </div>
        <div class="col-lg-3">
          <nuxt-link class="link" to="/jurnal">
            <div class="card bg-warning mb-3">
              <div class="card-body">
                <div class="small">Jurnal belum di validasi</div>
                <strong class="fs-4">3</strong>
                <span class="small"> halaman</span>
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

async function getCountJournal() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_journal = await client.collection('jurnal').getFullList({
    filter: "siswa='"+user.user.value.id+"'",
    fields: "id",
  })
  if(res_journal) {
    isLoading.value = false
    countJournal.value = res_journal.length
  }
}

async function getPemetaan() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_iduka = await client.collection('pemetaan').getList(1,1, {
    filter: "siswa='"+user.user.value.siswa+"'",
    expand: "iduka, iduka.pembimbing_sekolah, program_keahlian"
  })
  if(res_iduka) {
    let res_pemetaan = await client.collection('pemetaan').getFullList({
      filter: "iduka='"+res_iduka.items[0].iduka+"' && siswa!='"+user.user.value.siswa+"'",
      expand: "iduka, siswa"
    })
    if(res_pemetaan) {
      isLoading.value = false
      iduka.value = res_iduka
      pemetaan.value = res_pemetaan
      console.log(res_pemetaan)
      console.log(user.user.value.siswa)
    }
  }
}

onMounted(() => {
  getCountJournal()
  getPemetaan()
})
</script>

<style scoped>
.small, .small table {
  font-size: 14px !important;
}
</style>
