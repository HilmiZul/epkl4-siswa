<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 fw-bold">Buat Pengajuan Nilai</span>
      <span class="float-end">
        <nuxt-link to="/nilai" class="btn btn-warning btn-sm border border-2 border-dark">Kembali</nuxt-link>
      </span>
    </div>
    <div class="card-body">
      <Loading v-if="isLoadingMetaPemetaan" />
      <div v-else class="row">
        <div v-if="$device.isMobile" class="col-lg-6">
          <form @submit.prevent="buatBaru">
            <div class="mb-4 form-check form-switch">
              <input v-model="form.isEntrust" class="form-check-input" type="checkbox" id="entrust" switch>
              <label for="entrust">Buatkan Sertifikat di Sekolah?</label>
            </div>
            <hr>
            <div class="mb-4">
              <label for="fotonilai">Foto Halaman Nilai</label>
              <input @change="compressFile" class="form form-control" type="file" id="fotonilai" accept="image/*" capture="environment" required />
            </div>
            <div class="mb-4">
              <label for="el_softskill">Nilai Elemen 1</label>
              <input v-model="form.nilai_elemen1" type="number" min="0" max="100" id="el_softskill" class="form form-control" required>
            </div>
            <div class="mb-4">
              <label for="el_hardskill">Nilai Elemen 2</label>
              <input :disabled="form.nilai_elemen1 < 1" v-model="form.nilai_elemen2" type="number" min="0" max="100" id="el_hardskill" class="form form-control" required>
            </div>
            <div class="mb-4">
              <label for="el_pengembangan_hardskill">Nilai Elemen 3</label>
              <input :disabled="form.nilai_elemen2 < 1" v-model="form.nilai_elemen3" type="number" min="0" max="100" id="el_pengembangan_hardskill" class="form form-control" required>
            </div>
            <div class="mb-4">
              <label for="el_wirausaha">Nilai Elemen 4</label>
              <input :disabled="form.nilai_elemen2 < 1" v-model="form.nilai_elemen4" type="number" min="0" max="100" id="el_wirausaha" class="form form-control" required>
            </div>
            <div v-if="form.isEntrust">
              <hr>
              <div class="mb-4">
                <label for="pj_penandatangan">Pejabat Penandatangan</label>
                <input :disabled="form.nilai_elemen4 < 1" v-model="form.pj_penandatangan" type="text" id="pj_penandatangan" class="form form-control" placeholder="Contoh: CEO, Direktur, Kepala Dinas..." required>
              </div>
              <div class="mb-4">
                <label for="logo_iduka">Logo IDUKA</label>
                <input @change="compressFileLogo" class="form form-control" type="file" id="logo_iduka" accept="image/*" required />
              </div>
            </div>
            <button :disabled="isSending || form.nilai_elemen1 < 1 || form.nilai_elemen2 < 1 || form.nilai_elemen3 < 1 || form.nilai_elemen4 < 1" class="btn btn-success me-2 border border-2 border-dark">
              <span v-if="isSending">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
            <nuxt-link to="/nilai" class="btn btn-warning border border-2 border-dark">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-3 small fst-italic text-muted">Nilai berhasil diajukan!</span>
          </form>
        </div>
        <div v-else class="col-lg-12">
          <div class="alert alert-warning border border-2 border-dark">
            Silahkan gunakan <em>Smartphone</em>!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Compressor from 'compressorjs'
definePageMeta({ middleware: 'auth' })
useHead({ title: "Buat Nilai — e-PKL / SMKN 4 Tasikmalaya." })
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
  "foto_jurnal_nilai": "",
  "iduka": "",
  "siswa": "",
  "program_keahlian": prokel,
  "pj_penandatangan": "",
  "logo": "",
  "isEntrust": false,
  "isValid": false,
})

async function buatBaru() {
  form.value.iduka = meta_pemetaan.value.iduka
  form.value.siswa = siswa_id
  isSending.value = true
  isSaved.value = false
  try {
    let res = await client.collection('nilai').create(form.value)
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

async function getNilai() {
  isLoading.value = true
  isCertificate.value = false
  try {
    client.autoCancellation(false)
    let res = await client.collection('nilai').getFirstListItem(`siswa='${siswa_id}'`)
    if(res) {
      // jika nilai sudah diajuin, redir ke halaman nilai
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
  getNilai()
  getIdukaByPeserta()
})
</script>
