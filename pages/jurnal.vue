<template>
  <div class="card">
    <div class="card-header">
      <span class="h5"><i class="bi bi-journals"></i> Jurnal Harian</span>
      <span class="float-end journal-button">
        <button data-bs-toggle="modal" data-bs-target="#buat-jurnal-baru" class="btn btn-info btn-sm"><i class="bi bi-pencil-square"></i> Buat baru</button>
      </span>
      <div class="modal" id="buat-jurnal-baru" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
            <div class="modal-header fw-bold bg-success rounded-0 border-bottom borer-2 border-dark">
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
                  <textarea v-model="form.deskripsi" :disabled="form.elemen.length < 1" class="form form-control mb-2" placeholder="Uraikan kegiatan kamu disini..." rows="5" required></textarea>
                  <span class="text-muted fst-italic small float-end">min 50 karakter</span>
                </div>
                <!-- <div class="mb-3">
                  <label for="foto" class="label-berkas p-2 hand-cursor"><i class="bi bi-camera-fill"></i> Ambil foto kegiatan?</label>
                  <input class="form-control-file" type="file" id="foto" accept="image/*" capture="user" />
                </div> -->
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
        <div class="col-md-4 mb-3 journal-form">
          <form @submit.prevent="buatJurnalBaru">
            <div class="mb-3">
              <select v-model="form.elemen" class="form form-control form-select" required>
                <option disabled value="" selected>&#8212; Pilih Elemen &#8212;</option>
                <option v-for="elemen in elements" :key="elemen.id" :value="elemen.id">{{ elemen.elemen }}</option>
              </select>
            </div>
            <div class="mb-3">
              <textarea v-model="form.deskripsi" :disabled="form.elemen.length < 1" class="form form-control mb-2" placeholder="Uraikan kegiatan kamu disini..." rows="5" required></textarea>
              <span class="text-muted fst-italic small float-end">min 50 karakter</span>
            </div>
            <!-- <div class="mb-3">
              <label for="foto" class="label-berkas p-2 hand-cursor"><i class="bi bi-camera-fill"></i> Ambil foto kegiatan?</label>
              <input class="form-control-file" type="file" id="foto" accept="image/*" capture="user" />
            </div> -->
            <button :disabled="isPosting || form.elemen.length < 1 || form.deskripsi.length < 50" class="btn btn-success me-2">
              <span v-if="!isPosting"><i class="bi bi-send"></i> Kirim</span>
              <span v-else>Sedang mengirim</span>
            </button>
            <div v-if="isSaved" class="mt-3">
              <span class="text-grey fst-italic">Berhasil terkirim</span>
            </div>
          </form>
        </div>
        <div class="col">
          <div class="row">
            <div class="col-md">
              <div v-if="!isLoadingJournals" class="text-center text-muted fst-italic">
                <span v-if="journals.totalItems == 0">Belum ada jurnal</span>
              </div>
              <Loading v-if="isLoadingJournals" />
              <div v-else v-for="journal in journals.items" :key="journal.id" class="card jurnal-hover">
                <div class="card-body">
                  <div class="mb-3 small">
                    <span v-if="journal.expand.elemen.elemen == 'Lain-lain'" class="border border-2 border-dark p-1 bg-danger"><i class="bi bi-journal-bookmark-fill"></i>
                      {{ journal.expand.elemen.elemen }}
                    </span>
                    <span v-else class="border border-2 border-dark p-1 bg-info"><i class="bi bi-journal-bookmark-fill"></i>
                      {{ journal.expand.elemen.elemen }}
                    </span>
                  </div>
                  <span class="text-muted fst-italic small"><i class="bi bi-calendar2-date"></i> {{ journal.created }}</span>
                  <article class="my-2 pre-text">
                    {{ journal.deskripsi }}
                  </article>
                  <!-- <div class="my-3 foto-container">
                    <img src="https://www.stonebridge.uk.com/blog/wp-content/uploads/2016/05/Web-design-and-development.jpg" alt="foto" class="foto" />
                  </div> -->
                  <div class="text-muted small">
                    <span class="text-danger"><i class="bi bi-heart"></i></span> Belum di Validasi
                  </div>
                  <div class="small">
                    <span class="text-danger"><i class="bi bi-heart-fill"></i></span> Valid
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row my-4 mb-2">
            <div v-if="!isLoadingJournals" class="col text-end">
              <button :disabled="journals.page < 2" @click="pagination(journals.page - 1)" class="btn btn-info me-2"><i class="bi bi-arrow-left"></i> sebelumnya</button>
              <button :disabled="journals.page >= journals.totalPages" @click="pagination(journals.page + 1)" class="btn btn-info">lanjut <i class="bi bi-arrow-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Jurnal — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoading = ref(true)
let isLoadingJournals = ref(true)
let isPosting = ref(false)
let isSaved = ref(false)
let elements = ref([])
let journals = ref([])
let perPage = 2
let form = ref({
  "deskripsi": "",
  "elemen": "",
  "siswa": user.user.value.id,
  "pembimbing": "",
  "iduka": "",
  "program_keahlian": prokel
})

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
  }
}

async function getJournals() {
  isLoadingJournals.value = true
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(1, perPage, {
    filter: "siswa='"+user.user.value.id+"'",
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "-created"
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

async function pagination(page) {
  isLoadingJournals.value = true
  client.autoCancellation(false)
  let res = await client.collection('jurnal').getList(page, perPage, {
    filter: "siswa='"+user.user.value.id+"'",
    expand: "iduka, pembimbing, siswa.siswa, elemen",
    sort: "-created"
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
  }
}

async function getElemenCp() {
  isLoading.value = true
  client.autoCancellation(false)
  let res_elemen = await client.collection('elemen_cp').getFullList({
    filter: "program_keahlian='"+prokel+"'",
    sort: 'created'
  })
  let res_user = await client.collection('users_siswa').getOne(user.user.value.id, {
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
      form.value.iduka = res_pemetaan[0].iduka
      form.value.pembimbing = res_pemetaan[0].expand.iduka.pembimbing_sekolah
      // console.log(res_pemetaan[0].iduka)
      // console.log(res_pemetaan[0].expand.iduka.pembimbing_sekolah)
    }
  }
}


onMounted(() => {
  getElemenCp()
  getJournals()
  client.autoCancellation(false)
  client.collection('jurnal').subscribe('*', function(e) {
    if(e.action == 'create') {
      getJournals()
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
@media screen and (min-width: 992px) {
  .journal-button {
    display: none;
  }
}
.pre-text {
  white-space: pre-wrap;
}
</style>
