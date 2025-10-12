<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 fw-bold">Buat Nilai Sertifikat</span>
      <span class="float-end">
        <nuxt-link to="/nilai" class="btn btn-warning btn-sm">Kembali</nuxt-link>
      </span>
    </div>
    <div class="card-body">
      <Loading v-if="isLoadingMetaPemetaan" />
      <div v-else class="row">
        <div class="col-lg-6">
          <form @submit.prevent="buatBaru">
            <div class="mb-4">
              <label for="fotonilai">Foto Halaman Nilai Jurnal (JPG/PNG)</label>
              <input @change="compressFile" class="form form-control" type="file" id="fotonilai" accept="image/*" capture="environment" required />
            </div>
            <div class="mb-4">
              <label for="el_softskill">Nilai Internalisasi dan penerapan soft skills</label>
              <input v-model="form.nilai_elemen1" type="number" min="0" max="100" id="el_softskill" class="form form-control" required>
            </div>
            <div class="mb-4">
              <label for="el_hardskill">Nilai Penerapan hard skills</label>
              <input v-model="form.nilai_elemen2" type="number" min="0" max="100" id="el_hardskill" class="form form-control" required>
            </div>
            <div class="mb-4">
              <label for="el_pengembangan_hardskill">Peningkatan dan pengembangan hard skills</label>
              <input v-model="form.nilai_elemen3" type="number" min="0" max="100" id="el_pengembangan_hardskill" class="form form-control" required>
            </div>
            <div class="mb-4">
              <label for="el_wirausaha">Nilai Penyiapan Kemandirian Berwirausaha</label>
              <input v-model="form.nilai_elemen4" type="number" min="0" max="100" id="el_wirausaha" class="form form-control" required>
            </div>
            <div class="mb-4">
              <label for="pimpinan">Nama Pimpinan</label>
              <input v-model="form.nama_pimpinan" type="text" id="pimpinan" class="form form-control" placeholder="Nama Lengkap dan Gelar" required>
            </div>
            <div class="mb-4">
              <label for="nip">Nomor Induk</label>
              <input v-model="form.nip" type="text" id="nip" class="form form-control" placeholder="Nomor Induk Pimpinan" required>
            </div>
            <div class="mb-4">
              <label for="logo_iduka">Logo IDUKA</label>
              <input @change="compressFileLogo" class="form form-control" type="file" id="logo_iduka" accept="image/*" required />
            </div>
            <button :disabled="isSending" class="btn btn-success me-2">
              <span v-if="isSending">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link to="/nilai" class="btn btn-warning">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-3 small fst-italic text-muted">Nilai sertifikat berhasil dibuat!</span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Compressor from 'compressorjs'
definePageMeta({ middleware: 'auth' })
useHead({ title: "Buat Nilai Sertifikat — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let isLoading = ref(false)
let isCertificate = ref(false)
let isSending = ref(false)
let isSaved = ref(false)
let isError = ref(false)
let isLoadingMetaPemetaan = ref(true)
let prokel = user.user.value.program_keahlian
let siswa_id = user.user.value.siswa
let meta_pemetaan = ref()
let form = ref({
  "nilai_elemen1": 0,
  "nilai_elemen2": 0,
  "nilai_elemen3": 0,
  "nilai_elemen4": 0,
  "iduka": "",
  "siswa": "",
  "nama_pimpinan": "",
  "nip": "",
  "foto_jurnal_nilai": "",
  "logo": "",
})

async function buatBaru() {
  form.value.iduka = meta_pemetaan.value.iduka
  form.value.siswa = siswa_id
  isSending.value = true
  isSaved.value = false
  try {
    let res = await client.collection('sertifikat').create(form.value)
    if(res) {
      isSending.value = false
      isSaved.value = true
      navigateTo('/nilai')
    }
  } catch(err) {
    isSending.value = false
    isSaved.value = false
    isError.value = true
  }
}

function compressFile(e) {
  let file = e.target.files[0]
  if(!file) return;
  new Compressor(file, {
    quality: 0.6,
    success(result) {
      console.log(result)
      form.value.foto_jurnal_nilai = result
    },
    error(err) {
      console.error(err.message)
    }
  })
}

function compressFileLogo(e) {
  let file = e.target.files[0]
  if(!file) return
  new Compressor(file, {
    quality: 0.6,
    success(result) {
      console.log(result)
      form.value.logo = result
    },
    error(err) {
      console.log(err.message)
    }
  })
}

async function getIdukaByPeserta() {
  isLoadingMetaPemetaan.value = true
  client.autoCancellation(false)
  try {
    let res = await client.collection('pemetaan').getFirstListItem(`siswa='${siswa_id}'`, {
      expand: 'siswa'
    })
    if(res) {
      meta_pemetaan.value = res
      isLoadingMetaPemetaan.value = false
    }
  } catch(err) {
    navigateTo('/nilai')
    isLoadingMetaPemetaan.value = false
  }
}

async function getSertifikat() {
  isLoading.value = true
  isCertificate.value = false
  try {
    client.autoCancellation(false)
    let res = await client.collection('sertifikat').getFirstListItem(`siswa='${siswa_id}'`)
    if(res) {
      navigateTo('/nilai')
      isLoading.value = false
      isCertificate.value = true
    }
  } catch(error) {
    isLoading.value = false
    isCertificate.value = false
  }
}

onMounted(() => {
  getSertifikat()
  getIdukaByPeserta()
})
</script>
