<template>
  <div class="card">
    <div class="card-header">
      <span class="h4"><i class="bi bi-journals"></i> Jurnal Harian</span>
      <span v-if="pemetaan.length > 0 && !havePostJournalToday" class="float-end journal-button">
        <button data-bs-toggle="modal" data-bs-target="#buat-jurnal-baru" class="btn btn-info btn-sm"><i class="bi bi-pencil-square"></i> Buat baru</button>
      </span>
      <div class="modal" id="buat-jurnal-baru" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
            <div class="modal-header fw-bold bg-success rounded-0 border-0 border-bottom border-2 border-dark">
              Buat Jurnal Baru
              <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="buatJurnalBaru">
                <div class="mb-3">
                  <select v-model="form.elemen" class="form form-control form-select" required>
                    <option disabled value="" selected>&#8212; Pilih Elemen &#8212;</option>
                    <option v-for="elemen in elements" :key="elemen.id" :value="elemen.id">{{ elemen.elemen }}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <textarea v-model="form.deskripsi" :disabled="form.elemen.length < 1" @input="removeSingleSpaceIfEmpty" class="form form-control mb-2" placeholder="Uraikan kegiatan kamu disini..." rows="5" required></textarea>
                  <span class="mb-3 text-muted fst-italic small float-end">{{ form.deskripsi.length }} karakter</span>
                </div>
                <div class="mb-3">
                  <label for="foto" class="text-muted label-berkas p-2 hand-cursor"><i class="bi bi-camera-fill"></i> Ambil foto kegiatan? <sup class="text-muted">(opsional)</sup></label>
                  <div v-if="form.foto" class="small fst-italic">Foto: {{ form.foto.name }}</div>
                  <input @change="compressFile" :disabled="form.elemen.length < 1 || form.deskripsi.length < 50" class="form-control-file" type="file" id="foto" accept="image/*" capture="user" />
                </div>
                <button :disabled="isPosting || form.elemen.length < 1 || form.deskripsi.length < 50" class="btn btn-success btn-sm me-2" data-bs-dismiss="modal">
                  <span v-if="!isPosting"><i class="bi bi-send"></i> Kirim</span>
                  <span v-else>Sedang mengirim</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="row">
        <!-- <div v-if="pemetaan.length > 0" class="col-md-4 mb-3 journal-form">
          <form @submit.prevent="buatJurnalBaru">
            <div class="mb-3">
              <select v-model="form.elemen" class="form form-control form-select" required>
                <option disabled value="" selected>&#8212; Pilih Elemen &#8212;</option>
                <option v-for="elemen in elements" :key="elemen.id" :value="elemen.id">{{ elemen.elemen }}</option>
              </select>
            </div>
            <div class="mb-3">
              <textarea v-model="form.deskripsi" :disabled="form.elemen.length < 1" class="form form-control mb-2" placeholder="Uraikan kegiatan kamu disini..." rows="5" required></textarea>
              <span class="mb-3 text-muted fst-italic small float-end">min 50 karakter</span>
            </div>
            <div class="mb-3">
              <label for="foto" class="text-muted label-berkas p-2 hand-cursor"><i class="bi bi-camera-fill"></i> Ambil foto kegiatan? <sup class="text-muted">(opsional)</sup></label>
              <div v-if="form.foto" class="small fst-italic">Foto: {{ form.foto.name }}</div>
              <input @change="compressFile" :disabled="form.elemen.length < 1 || form.deskripsi.length < 50" class="form-control-file" type="file" id="foto" accept="image/*" capture="user" />
            </div>
            <button :disabled="isPosting || form.elemen.length < 1 || form.deskripsi.length < 50" class="btn btn-success me-2">
              <span v-if="!isPosting"><i class="bi bi-send"></i> Kirim</span>
              <span v-else>Sedang mengirim</span>
            </button>
            <div v-if="isSaved" class="mt-3">
              <span class="text-grey fst-italic">Berhasil terkirim</span>
            </div>
          </form>
        </div> -->
        <div class="col-md-12">
          <div class="row">
            <div class="col-md">
              <div v-if="!isLoadingJournals" class="mb-2 text-end text-muted small">
                <span v-if="journals.totalItems" class="float-start">Halaman {{ journals.page }} dari {{ journals.totalPages }}</span>
                Menampilkan
                <span v-if="journals.items">{{ journals.items.length }}</span>  dari {{ journals.totalItems }} Jurnal
              </div>
              <div v-if="!isLoadingJournals" class="text-center text-muted fst-italic">
                <span v-if="journals.totalItems == 0">
                  <div class="fs-1 pt-5"><i class="bi bi-journals"></i></div>
                  Belum ada jurnal
                </span>
              </div>
              <Loading v-if="isLoadingJournals" />
              <div v-else v-for="journal in journals.items" :key="journal.id" class="card jurnal-hover">
                <div class="card-body">
                  <div class="bookmark fs-2">
                    <div v-if="journal.expand.elemen.elemen == 'Lain-lain'" class="bookmark-icon text-danger"><i class="bi bi-bookmark-fill"></i></div>
                    <div v-else class="bookmark-icon text-info"><i class="bi bi-bookmark-fill"></i></div>
                  </div>
                  <div class="mb-1 mt-3 smallest fw-bold">
                    <span v-if="journal.expand.elemen.elemen == 'Lain-lain'">{{ journal.expand.elemen.elemen }}</span>
                    <span v-else>{{ journal.expand.elemen.elemen }}</span>
                  </div>
                  <span class="text-muted fst-italic smallest"><i class="bi bi-calendar2-date"></i> {{ journal.created }}</span>
                  <article class="my-3 pre-text">
                    {{ journal.deskripsi }}
                  </article>
                  <div v-if="journal.foto" class="my-3 foto-container hand-cursor" data-bs-toggle="modal" :data-bs-target="`#foto-${journal.id}`">
                    <img :src="`${host}/api/files/${journal.collectionId}/${journal.id}/${journal.foto}`" :alt="journal.deskripsi" class="foto" />
                  </div>
                  <div v-if="journal.isValid" class="small">
                    <span class="text-danger"><i class="bi bi-heart-fill"></i></span> Valid
                  </div>
                  <div v-else class="text-muted small">
                    <span class="text-danger"><i class="bi bi-heart"></i></span> Belum di Validasi
                  </div>
                </div>
                <!-- MODAL FOTO PREVIEW -->
                <div class="modal" :id="`foto-${journal.id}`" aria-hidden="true" tabindex="-1">
                  <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
                      <div class="modal-header rounded-0 border-0 border-bottom border-2 border-dark">
                        <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                      </div>
                      <div class="modal-body p-0">
                        <img :src="`${host}/api/files/${journal.collectionId}/${journal.id}/${journal.foto}`" :alt="journal.deskripsi" class="foto-preview" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row my-4 mb-2">
            <div v-if="!isLoadingJournals" class="col-md-12">
              <div v-if="isMovingPage" class="text-muted small mb-2 fst-italic">sedang berpindah halaman</div>
              <div v-else>
                <div v-if="journals || isMovingPage" class="text-muted small mb-2">
                  <span v-if="journals.totalItems">Halaman {{ journals.page }} dari {{ journals.totalPages }}</span>
                </div>
              </div>
              <button :disabled="isMovingPage || journals.page < 2" @click="pagination(journals.page - 1, false)" class="btn btn-info me-2">
                <span v-if="isMovingPage">bentar</span>
                <span v-else><i class="bi bi-arrow-left"></i> sebelumnya</span>
              </button>
              <button :disabled="isMovingPage || journals.page >= journals.totalPages" @click="pagination(journals.page + 1, false)" class="btn btn-info">
                <span v-if="isMovingPage">bentar</span>
                <span v-else>lanjut <i class="bi bi-arrow-right"></i></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Compressor from 'compressorjs'

definePageMeta({ middleware: 'auth' })
useHead({ title: "Jurnal — e-PKL / SMKN 4 Tasikmalaya." })
let config = useRuntimeConfig()
let host = config.public.apiBaseUrl+":"+config.public.apiPort
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoading = ref(true)
let isLoadingJournals = ref(true)
let isPosting = ref(false)
let isSaved = ref(false)
let elements = ref([])
let journals = ref([])
let pemetaan = ref([])
let perPage = 5
let form = ref({
  "deskripsi": "",
  "elemen": "",
  "siswa": user.user.value.id,
  "pembimbing": "",
  "iduka": "",
  "program_keahlian": prokel,
  "foto": ""
})
let isMovingPage = ref(false)
let havePostJournalToday = ref(false)
let today = useServerDay()
let maxLenDesc = ref(50)

async function isTodayPostJournal() {
  try {
    client.autoCancellation(false)
    let response = await client.collection('jurnal')
      .getFirstListItem("siswa='"+user.user.value.id+"'",{
        sort: "-created"
      })
    if(response) {
      let res = response
      const date = new Date(res.created);
      const options = {
        dateStyle: "long",
      }
      res.created = new Intl.DateTimeFormat('id-ID', options).format(date)
      // memeriksa jurnal hari ini, jika belum mengirim maka tombol buat jurnal muncul
      // jika sudah maka tombol buat jurnal akan hilang :D
      if(res.created == today) {
        havePostJournalToday.value = true
      }
    }
  } catch(error) {
    console.error("Belum membuat jurnal.")
  }
}

function compressFile(e) {
  // kecilin ukuran file sebelum di unggah!
  // sedikit nguji mental hahaha
  // anw, Xiexie Fengyuan :thumb:
  let file = e.target.files[0]
  if(!file) return;
  new Compressor(file, {
    quality: 0.6,
    success(result) {
      form.value.foto = result
    },
    error(err) {
      console.error(err.message)
    }
  })
}

async function buatJurnalBaru() {
  // console.log(form.value)
  isPosting.value = true
  isSaved.value = false
  client.autoCancellation(false)
  let res = await client.collection('jurnal').create(form.value)
  if(res) {
    isPosting.value = false
    isSaved.value = true
    form.value.elemen = ""
    form.value.deskripsi = ""
    form.value.foto = ""
  }
}

async function getJournals(loading=true) {
  isLoadingJournals.value = loading
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(1, perPage, {
    filter: "siswa='"+user.user.value.id+"'",
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "isValid, -created"
  })
  if(res) {
    isLoadingJournals.value = false
    journals.value = res
    // console.log(journals.value)
    // konversi waktu UTC dari server ke full date lokal indo
    for(let i=0; i<journals.value.items.length; i++) {
      const date = new Date(journals.value.items[i].created);
      const options = {
        dateStyle: "full",
        timeStyle: "short"
      };
      journals.value.items[i].created = new Intl.DateTimeFormat('id-ID', options).format(date);
    }
  }
}

async function pagination(page, loading=true) {
  isLoadingJournals.value = loading
  isMovingPage.value = true
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(page, perPage, {
    filter: "siswa='"+user.user.value.id+"'",
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "isValid, -created"
  })
  if(res) {
    journals.value = res
    for(let i=0; i<journals.value.items.length; i++) {
      const date = new Date(journals.value.items[i].created);
      const options = {
        dateStyle: "full",
        timeStyle: "short"
      };
      journals.value.items[i].created = new Intl.DateTimeFormat('id-ID', options).format(date);
    }
    isLoadingJournals.value = false
    isMovingPage.value = false
  }
}

async function getElemenCp() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_elemen = await client.collection('elemen_cp').getFullList({
    filter: "program_keahlian='"+prokel+"'",
    sort: 'created'
  })
  let res_user = await client.collection('student_users').getOne(user.user.value.id, {
    expand: "siswa"
  })

  if(res_elemen && res_user) {
    elements.value = res_elemen
    let res_pemetaan = await client.collection('pemetaan').getFullList({
      filter: "siswa='"+res_user.siswa+"'",
      expand: "iduka"
    })
    if(res_pemetaan) {
      isLoading.value = false
      pemetaan.value = res_pemetaan
      if(res_pemetaan.length > 0) {
        form.value.iduka = res_pemetaan[0].iduka
        form.value.pembimbing = res_pemetaan[0].expand.iduka.pembimbing_sekolah
        // console.log(res_pemetaan[0].iduka)
        // console.log(res_pemetaan[0].expand.iduka.pembimbing_sekolah)
      }
    }
  }
}

let removeSingleSpaceIfEmpty = computed(() => {
  if(form.value.deskripsi.length < 1 || form.value.deskripsi[0] == ' ') form.value.deskripsi = ''
})

onMounted(() => {
  getElemenCp()
  getJournals()
  isTodayPostJournal()
  client.autoCancellation(false)
  client.collection('jurnal').subscribe('*', function(e) {
    if(e.action == 'create' || e.action == 'update' || e.action) {
      getJournals(false)
      isTodayPostJournal()
    }
  },{})
})
</script>

<style scoped>
.form-control-file {
  display: none;
}
.foto-container {
  width: 100%;
  height: 200px;
}
.foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.foto-preview {
  width: 100%;
  height: 100%;
}
.jurnal-hover:hover {
  background-color: #f7fddd;
}
.bg-danger {
  background-color: rgb(255, 99, 132) !important;
}
@media screen and (max-width: 992px) {
  .journal-form {
    display: none;
  }
}
/*@media screen and (min-width: 992px) {
  .journal-button {
    display: none;
  }
}*/
.pre-text {
  white-space: pre-wrap;
}
.bookmark {
  position: relative;
}
.bookmark .bookmark-icon {
  position: absolute;
  top: -32px;
  left: -5px;
}
</style>
