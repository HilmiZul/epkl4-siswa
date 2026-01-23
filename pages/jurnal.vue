<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 fw-bold"><i class="bi bi-journals"></i> Jurnal</span>
      <span v-if="$device.isMobile">
        <span v-if="pemetaan.length > 0 && !havePostJournalToday" class="float-end journal-button">
          <button data-bs-toggle="modal" data-bs-target="#buat-jurnal-baru"
            class="btn btn-info btn-sm border border-2 border-dark"><i class="bi bi-pencil-square"></i> Buat
            baru</button>
        </span>
      </span>

      <div v-if="$device.isMobile" class="modal" id="buat-jurnal-baru" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
            <div class="modal-header fw-bold bg-info rounded-0 border-0 border-bottom border-2 border-dark">
              <i class="bi bi-pencil-square me-2"></i> Buat Jurnal
              <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!--<form @submit.prevent="buatJurnalBaru">-->
                <div class="mb-3">
                  <label for="foto" class="text-muted label-berkas border-2 p-2"><i class="bi bi-camera-fill"></i> Ambil
                    foto kegiatan</label>
                  <div v-if="form.foto" class="small fst-italic">Foto: {{ form.foto?.name }}</div>
                  <input @change="compressFile"
                    class="form-control-file" type="file" id="foto" accept="image/*" capture="user" required />
                </div>
                <div class="mb-4">
                  <label for="elemen">Tujuan Pembelajaran</label>
                  <select v-model="form.elemen" :disabled="!form.foto" id="elemen" class="form form-control form-select" required>
                    <option disabled value="" selected>&#8212; Pilih &#8212;</option>
                    <option v-for="elemen in elements" :key="elemen.id" :value="elemen.id">{{ elemen.tujuan }}</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label for="deskripsi">Ceritakan Kegiatanmu!</label>
                  <textarea v-model="form.deskripsi" :disabled="form.foto && form.elemen.length < 1"
                    @input="removeSingleSpaceIfEmpty" id="deskripsi" class="form form-control mb-2"
                    placeholder="Gunakan bahasa indonesia baik dan benar. Sesuaikan dengan tujuan yang dipilih, boleh ditulis paragraf atau daftar urutan. Asal jangan curhat..."
                    rows="5" required></textarea>
                  <span class="mb-3 fw-bold small">
                    <i v-if="form.deskripsi.length > 124" class="bi bi-check-circle-fill text-success"></i>
                    {{ form.deskripsi.length }} <span v-if="form.deskripsi.length < 125" class="text-muted"> (min. 125
                      karakter)</span>
                  </span>
                </div>
                <div class="mb-4 smallest text-muted">
                  Saya udah baca dan setuju dengan <nuxt-link to="/privacy" target="_blank"
                    class="link text-muted">kebijakan privasi & syarat penggunaan</nuxt-link>.
                </div>
                <button @click="buatJurnalBaru(false)" :disabled="isPosting || (form.foto && form.deskripsi.length < 125)"
                  class="btn btn-info me-2 border border-2 border-dark" data-bs-dismiss="modal">
                  <span v-if="!isPosting"><i class="bi bi-send"></i> Kirim</span>
                  <span v-else>Sedang mengirim</span>
                </button>
                <span class="link small fw-bold text-muted" data-bs-dismiss="modal">Tutup</span>
                <div @click="buatJurnalBaru(true)" v-if="form.foto && form.elemen" data-bs-dismiss="modal" class="float-end pt-2 smallest fw-bold"><i class="bi bi-save"></i> Simpan draft</div>
              <!--</form>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ./card-heder -->

    <!-- TODO: create single modal Edit Jurnal 
        save draft and kirim button call diff function and querying must be UPDATE not CREATE -->
      <div v-if="$device.isMobile" class="modal" id="edit-jurnal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
            <div class="modal-header fw-bold bg-warning rounded-0 border-0 border-bottom border-2 border-dark">
              <i class="bi bi-pencil-square me-2"></i> Edit Jurnal
              <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                  <label for="foto" class="text-muted label-berkas border-2 p-2"><i class="bi bi-camera-fill"></i> Ganti 
                    foto kegiatan?</label>
                  <div v-if="formEdit.foto" class="small fst-italic">
                    <span v-if="formEdit.foto?.name">Foto baru: {{ formEdit.foto?.name }}</span>
                    <img v-else :src="`${host}/api/files/${formEdit.collectionId}/${formEdit.id}/${formEdit.foto}`" :alt="formEdit.id" width="65px" />
                  </div>
                  <input @change="compressFile"
                    class="form-control-file" type="file" id="foto" accept="image/*" capture="user" required />
                </div>
                <div class="mb-4">
                  <label for="elemen">Tujuan Pembelajaran</label>
                  <select v-model="formEdit.elemen" :disabled="!formEdit.foto" id="elemen" class="form form-control form-select" required>
                    <option disabled value="" selected>&#8212; Pilih &#8212;</option>
                    <option v-for="elemen in elements" :key="elemen.id" :value="elemen.id">{{ elemen.tujuan }}</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label for="deskripsi">Ceritain Kegiatan Lu!</label>
                  <textarea v-model="formEdit.deskripsi" :disabled="formEdit.foto && formEdit.elemen.length < 1"
                    @input="removeSingleSpaceIfEmpty" id="deskripsi" class="form form-control mb-2"
                    placeholder="Gunakan bahasa indonesia baik dan benar. Sesuaikan dengan tujuan yang dipilih, boleh ditulis paragraf atau daftar urutan. Asal jangan curhat..."
                    rows="5" required></textarea>
                  <span class="mb-3 fw-bold small">
                    <i v-if="formEdit.deskripsi.length > 124" class="bi bi-check-circle-fill text-success"></i>
                    {{ formEdit.deskripsi.length }} <span v-if="formEdit.deskripsi.length < 125" class="text-muted"> (min. 125
                      karakter)</span>
                  </span>
                </div>
                <div class="mb-4 smallest text-muted">
                  Saya udah baca dan setuju dengan <nuxt-link to="/privacy" target="_blank"
                    class="link text-muted">kebijakan privasi & syarat penggunaan</nuxt-link>.
                </div>
                <button @click="buatJurnalBaru(false, true)" :disabled="isPosting || (formEdit.foto && formEdit.deskripsi.length < 125)"
                  class="btn btn-info me-2 border border-2 border-dark" data-bs-dismiss="modal">
                  <span v-if="!isPosting"><i class="bi bi-send"></i> Kirim</span>
                  <span v-else>Sedang mengirim</span>
                </button>
                <span class="link small fw-bold text-muted" data-bs-dismiss="modal">Tutup</span>
                <div @click="buatJurnalBaru(true, true)" v-if="formEdit.foto && formEdit.elemen" data-bs-dismiss="modal" class="float-end pt-2 smallest fw-bold"><i class="bi bi-save"></i> Simpan draft</div>
            </div>
          </div>
        </div>
      </div>

    <!-- card-body -->
    <div class="card-body">
      <div class="row">
        <div class="col-md-12">
          <div v-if="countDraftJournal > 0 || notValidCount > 0" class="alert alert-warning small">
            <div v-if="countDraftJournal > 0">
              <span class="fw-bold">{{ countDraftJournal }}</span> Draft
            </div>
            <div v-if="notValidCount > 0">
              <span class="fw-bold">{{ notValidCount }}</span> Jurnal belum divalidasi 
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 p-0">
              <div v-if="!isLoadingJournals" class="mx-3 text-center text-muted smallest">
                <!-- <span v-if="journals.totalItems" class="float-start">Halaman <span class="fw-bold">{{ journals.page }}</span> dari <span class="fw-bold">{{ journals.totalPages }}</span></span> -->
                <!-- <span v-if="journals.totalItems">Menampilkan {{ journals.items.length }}  dari {{ journals.totalItems }} Jurnal</span> -->
                <span v-if="journals.totalItems" class="badge border border-dark text-dark">{{ journals.totalItems }} Jurnal</span>
              </div>
              <div v-if="!isLoadingJournals" class="text-center text-muted fw-bold fs-4">
                <span v-if="journals.totalItems == 0">
                  <div class="fs-1 pt-5"><i class="bi bi-database"></i></div>
                  Belum ada jurnal
                </span>
              </div>
              <Loading class="py-3" v-if="isLoadingJournals" />
              <div v-else v-for="journal in journals.items" :key="journal.id"
                class="card jurnal-hover jurnal-item no-shadow">
                <div class="card-body">
                  <div v-if="$device.isMobile" class="text-end">
                    <div v-if="journal.isDraft" data-bs-toggle="modal" data-bs-target="#edit-jurnal" @click="setModalEditJurnal(journal)" class="badge border border-1 border-danger text-danger mb-1">
                      <i class="bi bi-pencil-square"></i> Edit Draft
                    </div>
                  </div>
                  <!-- <div class="bookmark fs-2">
                    <div v-if="journal.expand.elemen.elemen == 'Lain-lain'" class="bookmark-icon text-danger"><i class="bi bi-bookmark-fill"></i></div>
                    <div v-else class="bookmark-icon text-info"><i class="bi bi-bookmark-fill"></i></div>
                  </div> -->
                  <div class="mb-1 smallest fw-bold text-muted">
                    <span v-if="journal.expand.elemen.elemen == 'Lain-lain'"><i
                        class="bi bi-bookmark-fill text-danger"></i> {{ journal.expand.elemen.elemen }}</span>
                    <span v-else><i class="bi bi-bookmark-fill text-info"></i> {{ journal.expand.elemen.elemen }}</span>
                  </div>
                  <span class="text-muted smallest"><i class="bi bi-calendar2-date"></i> {{ journal.created }}</span>
                  <article class="my-3 pre-text">
                    {{ journal.deskripsi }}
                  </article>

                  <div v-if="journal.foto" class="my-3 foto-container hand-cursor" data-bs-toggle="modal"
                    :data-bs-target="`#foto-${journal.id}`">
                    <img :src="`${host}/api/files/${journal.collectionId}/${journal.id}/${journal.foto}`"
                      :alt="journal.deskripsi" class="foto" />
                  </div>
                  <div v-if="journal.isValid" class="text-muted small float-start">
                    <span class="text-danger"><i class="bi bi-heart-fill"></i></span>
                  </div>
                  <div v-else class="text-muted small float-start">
                    <span class="text-danger"><i class="bi bi-heart"></i></span> Belum di Validasi
                  </div>

                  <div v-if="journal.isComment" @click="getKomentarByIdJurnal(journal)" class="float-end text-muted small hand-cursor" data-bs-toggle="modal" data-bs-target="#modal-lihat-komentar">
                    <i class="bi bi-chat-left-fill"></i> Lihat komentar
                  </div>

                </div>

                <!-- MODAL FOTO PREVIEW -->
                <div v-if="journal.foto" class="modal" :id="`foto-${journal.id}`" aria-hidden="true" tabindex="-1">
                  <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                      <div class="modal-header rounded-0 border-0 border-bottom border-3 border-dark fw-bold">
                        Preview
                        <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                      </div>
                      <div class="modal-body p-0">
                        <img :src="`${host}/api/files/${journal.collectionId}/${journal.id}/${journal.foto}`"
                          :alt="journal.deskripsi" class="foto-preview" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- single modal: lihat komentar -->
              <div class="modal" id="modal-lihat-komentar">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content rounded-0 border border-3 border-dark shadow-lg">
                    <div class="modal-body">
                      <loading-placeholder v-if="isLoadingKomentar" row="1" col="12" /> 
                      <div v-else>
                        <div v-if="pratinjauKomentar" class="text-muted small">{{ pratinjauKomentar.created }}</div>
                        <div v-if="pratinjauKomentar" class="my-2">
                          {{ pratinjauKomentar.komentar }}
                        </div>
                      </div>
                      <div class="text-end text-muted fw-bold mt-3 hand-cursor" data-bs-dismiss="modal">Tutup</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="row my-3 mb-2">
            <div v-if="!isLoadingJournals" class="col-md-12">
              <div v-if="isMovingPage" class="text-muted smallest mb-2 fst-italic">sedang memuat</div>
              <!--<div v-else>
                <div v-if="journals || isMovingPage" class="text-muted smallest mb-2">
                  <span v-if="journals.totalItems">Halaman {{ journals.page }} dari {{ journals.totalPages }}</span>
                </div>
              </div>
              <button v-if="journals.totalItems" :disabled="isMovingPage || journals.page < 2"
                @click="pagination(journals.page - 1, false)" class="btn btn-info me-2 border border-2 border-dark">
                sebelumnya
              </button>-->
              <div class="text-center">
                <button v-if="journals.totalItems" :disabled="isMovingPage || journals.page >= journals.totalPages" @click="pagination(journals.page + 1, false)" class="btn btn-info border border-2 border-dark">
                  muat lagi <i class="bi bi-arrow-down"></i>
                </button>
              </div>
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
let { isMobile } = useDevice()
let config = useRuntimeConfig()
let host = config.public.apiBaseUrl + ":" + config.public.apiPort
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
let perPage = 30 
let form = ref({
  "deskripsi": "",
  "elemen": "",
  "siswa": user.user.value.id,
  "pembimbing": "",
  "iduka": "",
  "program_keahlian": prokel,
  "foto": "",
  "isDraft": false
})
let formEdit = ref({
  "deskripsi": "",
  "elemen": "",
  "siswa": user.user.value.id,
  "pembimbing": "",
  "iduka": "",
  "program_keahlian": prokel,
  "foto": "",
})
let isMovingPage = ref(false)
let havePostJournalToday = ref(false)
let today = useServerDay()
let maxLenDesc = ref(50)
let currStudent = ref('')
let currIduka = ref('')
let notValidCount = ref(0)
let countDraftJournal = ref(0)
let isLoadingKomentar = ref(true)
let pratinjauKomentar = ref()

async function isTodayPostJournal() {
  try {
    client.autoCancellation(false)
    let response = await client.collection('jurnal')
      .getFirstListItem("siswa='" + user.user.value.id + "'", {
        sort: "-created"
      })
    if (response) {
      let res = response
      const date = new Date(res.created);
      const options = {
        dateStyle: "long",
      }
      res.created = new Intl.DateTimeFormat('id-ID', options).format(date)
      // memeriksa jurnal hari ini, jika belum mengirim maka tombol buat jurnal muncul
      // jika sudah maka tombol buat jurnal akan hilang :D
      if (res.created == today) {
        havePostJournalToday.value = true
      }
    }
  } catch (error) {
  }
}

function compressFile(e) {
  // kecilin ukuran file sebelum di unggah!
  // sedikit nguji mental hahaha
  // anw, Xiexie Fengyuan :thumb:
  let file = e.target.files[0]
  if (!file) return;
  let now = new Date()
  let tanggal = new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(now)
  new Compressor(file, {
    quality: 0.6,
    // drew: nempelin watermark ke foto agar tahu sumbernya dan sulit dipalsukan
    drew(context, canvas) {
      context.fillStyle = 'rgba(255, 255, 255, .8',
        context.font = '70px serif',
        context.textAlign = 'center'
      context.fillText('PKL SMKN 4 Tasikmalaya', canvas.width / 2, canvas.height / 2 - 100),
        context.fillText(currIduka.value, canvas.width / 2, canvas.height / 2)
      context.fillText(currStudent.value, canvas.width / 2, canvas.height / 2 + 100)
      context.fillText(tanggal, canvas.width / 2, canvas.height / 2 + 190)
    },
    success(result) {
      // jika nilai isUpdate, maka file berasa dari Edit Jurnal / Draft
      //if(formEdit.value.isUpdate) formEdit.value.foto = result
      //else form.value.foto = result
      form.value.foto = result
      formEdit.value.foto = result
    },
    error(err) {
      console.error(err.message)
    }
  })
}


// fungsi ini nerima 2 params
// isDraft untuk menyimpan draft dengan type bool
// isUpdate untuk membedakan antara Buat Baru atau Update yang berasal dari Edit Jurnal
// secara default isUpdate bernilai False, ini disesuein sama nama func-nya.
async function buatJurnalBaru(isDraft, isUpdate=false) {
  // console.log(form.value)
  isPosting.value = true
  isSaved.value = false
  client.autoCancellation(false)
  let response;
  if(isUpdate) {
    formEdit.value.isDraft = isDraft
    response = await client.collection('jurnal').update(formEdit.value.id, formEdit.value)
  } else {
    form.value.isDraft = isDraft
    response = await client.collection('jurnal').create(form.value)
  }
  if (response) {
    isPosting.value = false
    isSaved.value = true
    form.value.elemen = ""
    form.value.deskripsi = ""
    form.value.foto = ""
  }
}

async function getJournals(loading = true) {
  isLoadingJournals.value = loading
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(1, perPage, {
    filter: "siswa='" + user.user.value.id + "'",
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "-isDraft, isValid, -created"
  })
  if (res) {
    isLoadingJournals.value = false
    journals.value = res
    notValidCount.value = 0
    // console.log(journals.value)
    // konversi waktu UTC dari server ke full date lokal indo
    for (let i = 0; i < journals.value.items.length; i++) {
      const date = new Date(journals.value.items[i].created);
      const options = {
        dateStyle: "full",
        timeStyle: "short"
      };
      journals.value.items[i].created = new Intl.DateTimeFormat('id-ID', options).format(date);

      if (!journals.value.items[i].isValid) notValidCount.value++
    }
  }
}

async function pagination(page, loading = true) {
  isLoadingJournals.value = loading
  isMovingPage.value = true
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(page, perPage, {
    filter: "siswa='" + user.user.value.id + "'",
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "isValid, -created"
  })
  if (res) {
    for(let i=0; i<res.items.length; i++) {
      const date = new Date(res.items[i].created);
      const options = {
        dateStyle: "full",
        timeStyle: "short"
      };
      res.items[i].created = new Intl.DateTimeFormat('id-ID', options).format(date);
    }
    
    journals.value.page = res.page
    journals.value.perPage = res.perPage
    journals.value.totalItems = res.totalItems
    journals.value.totalPages = res.totalPages
    journals.value.items = journals.value.items.concat(res.items)
    isLoadingJournals.value = false
    isMovingPage.value = false
  }
}

async function getElemenCp() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_elemen = await client.collection('elemen_cp').getFullList({
    filter: "program_keahlian='" + prokel + "'",
    sort: 'created'
  })
  let res_user = await client.collection('student_users').getOne(user.user.value.id, {
    expand: "siswa"
  })

  if (res_elemen && res_user) {
    elements.value = res_elemen
    let res_pemetaan = await client.collection('pemetaan').getFullList({
      filter: "siswa='" + res_user.siswa + "'",
      expand: "iduka"
    })
    if (res_pemetaan) {
      isLoading.value = false
      pemetaan.value = res_pemetaan
      // currIduka: menyimpan nama IDUKA untuk ditempel kedalam watermark foto
      currIduka.value = res_pemetaan[0].expand.iduka.nama
      if (res_pemetaan.length > 0) {
        form.value.iduka = res_pemetaan[0].iduka
        form.value.pembimbing = res_pemetaan[0].expand.iduka.pembimbing_sekolah
        // console.log(res_pemetaan[0].iduka)
        // console.log(res_pemetaan[0].expand.iduka.pembimbing_sekolah)
      }
    }
  }
}

async function getPesertaByIdUser() {
  let res = await client.collection('student_users').getOne(user?.user.value.id, {
    expand: `siswa`
  })
  if (res) {
    // currStudent: menyimpan nama peserta untuk ditempel kedalam watermark foto
    currStudent.value = res.expand.siswa.nama
  }
}

let removeSingleSpaceIfEmpty = computed(() => {
  if (form.value.deskripsi.length < 1 || form.value.deskripsi[0] == ' ') form.value.deskripsi = ''
  if (formEdit.value.deskripsi.length < 1 || formEdit.value.deskripsi[0] == ' ') formEdit.value.deskripsi = ''
})

// copy data dari form ke formEdit agar tidak mengubah data sementara
// yang ditampilkan pada list
function setModalEditJurnal(jurnal) {
  formEdit.value = jurnal
}

async function getCountDraftJournal() {
  let res = await client.collection('jurnal').getFullList({
    filter: `siswa="${user.user.value.id}" && isDraft=true`
  })
  if(res) {
    countDraftJournal.value = res.length
  }
}

async function getKomentarByIdJurnal(journal) {
  isLoadingKomentar.value = true
  let res = await client.collection('jurnal_komentar').getList(1,1, {
    filter: `idJurnal="${journal.id}"`
  })
  if(res) {
    pratinjauKomentar.value = res.items[0]
    await client.collection('jurnal_komentar').update(pratinjauKomentar.value.id, { isOpen: true })
    isLoadingKomentar.value = false
    const date = new Date(pratinjauKomentar.value.created);
    const options = {
      dateStyle: "full",
      timeStyle: "short"
    }
    pratinjauKomentar.value.created = new Intl.DateTimeFormat('id-ID', options).format(date);
  }
}

onMounted(() => {
  getElemenCp()
  getJournals()
  isTodayPostJournal()
  getPesertaByIdUser()
  getCountDraftJournal()
  client.autoCancellation(false)
  client.collection('jurnal').subscribe('*', function (e) {
    if (e.action == 'create' || e.action == 'update') {
      getJournals(false)
      isTodayPostJournal()
      getCountDraftJournal()
    }
  }, {})
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
  background-color: #f9f9f9;
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
  top: -20px;
  right: -5px;
}

.jurnal-item {
  border: none !important;
  border-bottom: 1px solid #000 !important
}

.no-shadow {
  box-shadow: none !important;
}
</style>
