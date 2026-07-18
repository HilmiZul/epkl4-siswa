<template>
  <div v-if="isMobile" class="card">
    <div class="card-header">
      <span class="h5 fw-bold">Jurnal / Buat baru</span>
      <NuxtLink to="/jurnal" class="float-end btn btn-light btn-sm border border-2 border-dark">Kembali</NuxtLink>
    </div>
    <div class="card-body">
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
        class="btn btn-dark btn-sm me-2 border border-2 border-dark">
        <span v-if="!isPosting"><i class="bi bi-send"></i> Kirim</span>
        <span v-else>Sedang mengirim</span>
      </button>
      <button @click="buatJurnalBaru(true)" v-if="form.foto && form.elemen" class="btn btn-light btn-sm border border-2 border-dark float-end"><i class="bi bi-save"></i> Simpan draft</button>
    </div>
  </div>
</template>


<script setup>
import Compressor from 'compressorjs'

definePageMeta({ middleware: 'auth' })
useHead({ title: "Jurnal — e-PKL / SMKN 4 Tasikmalaya." })

let { isMobile } = useDevice()
if(!isMobile) navigateTo('/jurnal')

let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let isLoading = ref(true)
let isPosting = ref(false)
let isSaved = ref(false)
let elements = ref([])
let pemetaan = ref([])

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

let havePostJournalToday = ref(false)
let today = useServerDay()
let currStudent = ref('')
let currIduka = ref('')


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
    navigateTo('/jurnal')
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
    convertTypes: ['image/webp'],
    mimeType: 'auto',
    quality: 0.4,
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
        if(havePostJournalToday) navigateTo('/jurnal')
      }
    }
  } catch (error) {
  }
}

onMounted(() => {
  getElemenCp()
  isTodayPostJournal()
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

</style>
