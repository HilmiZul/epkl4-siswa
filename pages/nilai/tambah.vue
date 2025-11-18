<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 fw-bold">Serahkan Nilai</span>
      <span class="float-end">
        <nuxt-link to="/nilai" class="btn btn-light btn-sm border border-2 border-dark">Kembali</nuxt-link>
      </span>
    </div>
    <div class="card-body">
      <Loading v-if="isLoadingMetaPemetaan" />
      <div v-else class="row">
        <div v-if="$device.isMobile" class="col-lg-6">
          <form @submit.prevent="buatBaru">
            <div class="mb-4">
              <label for="fotonilai">Foto Halaman Nilai <span class="text-danger">*</span></label>
              <input @change="compressFile" class="form form-control" type="file" id="fotonilai" accept="image/*" capture="environment" required />
            </div>
            <div class="mb-4">
              <label for="el_softskill">Nilai Elemen 1 <span class="text-danger">*</span></label>
              <input v-model="form.nilai_elemen1" type="number" min="0" max="100" id="el_softskill" class="form form-control" required>
            </div>
            <div class="mb-4">
              <label for="el_hardskill">Nilai Elemen 2 <span class="text-danger">*</span></label>
              <input :disabled="form.nilai_elemen1 < 1" v-model="form.nilai_elemen2" type="number" min="0" max="100" id="el_hardskill" class="form form-control" required>
            </div>
            <div class="mb-4">
              <label for="el_pengembangan_hardskill">Nilai Elemen 3 <span class="text-danger">*</span></label>
              <input :disabled="form.nilai_elemen2 < 1" v-model="form.nilai_elemen3" type="number" min="0" max="100" id="el_pengembangan_hardskill" class="form form-control" required>
            </div>
            <div class="mb-4">
              <label for="el_wirausaha">Nilai Elemen 4 <span class="text-danger">*</span></label>
              <input :disabled="form.nilai_elemen2 < 1" v-model="form.nilai_elemen4" type="number" min="0" max="100" id="el_wirausaha" class="form form-control" required>
            </div>
            <hr>
            <div class="mb-4 form-check form-switch">
              <input v-model="form.isEntrust" class="form-check-input" type="checkbox" id="entrust" switch>
              <label for="entrust">Buatkan Sertifikat di Sekolah?</label>
            </div>
            <div v-if="form.isEntrust">
              <div class="mb-4">
                <label for="pj_penandatangan">Pejabat Penandatangan <span class="text-danger">*</span></label>
                <input :disabled="form.nilai_elemen4 < 1" v-model="form.pj_penandatangan" type="text" id="pj_penandatangan" class="form form-control" placeholder="Contoh: CEO, Direktur, Kepala Dinas..." required>
              </div>
              <div class="mb-4">
                <label for="nama_pj_penandatangan">Nama Pejabat Penandatangan <span class="text-danger">*</span></label>
                <input :disabled="form.pj_penandatangan < 1" v-model="form.nama_pj_penandatangan" type="text" id="nama_pj_penandatangan" class="form form-control" placeholder="Tulis mama lengkapnya..." required>
              </div>
              <div class="mb-4">
                <label for="nomor_pegawai">Nomor Pegawai</label>
                <input v-model="form.nomor_pegawai" type="text" id="nomor_pegawai" class="form form-control" placeholder="Kosongkan jika tidak ada">
              </div>
              <div class="mb-4">
                <label for="nomor_sertifikat">Nomor Sertifikat</label>
                <input v-model="form.nomor_sertifikat" type="text" id="nomor_sertifikat" class="form form-control" placeholder="Kosongkat jika tidak ada">
              </div>
              <div class="mb-4">
                <label for="logo_iduka">Logo IDUKA <span class="text-muted">(apabila punya)</span></label>
                <input @change="compressFileLogo" class="form form-control" type="file" id="logo_iduka" accept="image/*" />
              </div>
            </div>
            <button :disabled="isSending || form.nilai_elemen1 < 1 || form.nilai_elemen2 < 1 || form.nilai_elemen3 < 1 || form.nilai_elemen4 < 1" class="btn btn-info me-2 border border-2 border-dark">
              <span v-if="isSending">Sedang mengirim</span>
              <span v-else>Serahkan</span>
            </button>
            <nuxt-link to="/nilai" class="btn btn-light border border-2 border-dark">Kembali</nuxt-link>
            <span v-if="isSaved" class="ms-3 small fst-italic text-muted">Nilai berhasil diserahkan!</span>
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
  "nama_pj_penandatangan": "",
  "nomor_sertifikat": "",
  "nomor_pegawai": ""
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
