<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 fw-bold"><i class="bi bi-patch-check"></i> Nilai</span>
      <!-- <span v-if="!isLoading" class="float-end">
        <nuxt-link v-if="!isCertificate" to="/nilai/tambah" class="btn btn-info btn-sm"><i class="bi bi-plus-lg"></i> Buat Baru</nuxt-link>
      </span> -->
    </div>
    <div class="card-body">
      <div v-if="isLoading" class="row py-3">
        <div class="col-lg-12">
          <loading />
        </div>
      </div>
      <div v-else>
        <div v-if="isCertificate" class="row">
          <div class="col-lg-12">
            <loading v-if="isLoading" />
            <div v-else-if="!certificate.isValid" class="alert alert-warning">
              <i class="bi bi-info-circle"></i> Nilai belum divalidasi Pembimbing
            </div>
            <form @submit.prevent="updateNilai">
              <div class="row">
                <div class="col-lg-6">
                  <div class="mb-4">
                    <div class="fw-bold pb-2"><i class="bi bi-image-fill"></i> Pratinjau Nilai Elemen</div>
                    <img :src="`${host}/api/files/${certificate.collectionId}/${certificate.id}/${tempNilaiImg}`" alt="Foto jurnal nilai" width="100%" class="border border-2 border-dark mb-2">
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="mb-4">
                    <div class="text-muted fw-bold">Nilai Elemen 1</div>
                    <span class="fw-bold">{{ form.nilai_elemen1 }}</span>
                  </div>
                  <div class="mb-4">
                    <div class="text-muted fw-bold">Nilai Elemen 2</div>
                    <span class="fw-bold">{{ form.nilai_elemen2 }}</span>
                  </div>
                  <div class="mb-4">
                    <div class="text-muted fw-bold">Nilai Elemen 3</div>
                    <span class="fw-bold">{{ form.nilai_elemen3 }}</span>
                  </div>
                  <div class="mb-4">
                    <div class="text-muted fw-bold">Nilai Elemen 4</div>
                    <span class="fw-bold">{{ form.nilai_elemen4 }}</span>
                    <!-- <input  type="number" min="0" max="100" id="el_wirausaha" class="form form-control" required> -->
                  </div>
                  <!-- <div class="mb-4">
                    <div class="fw-bold badge bg-info border border-1 border-dark">Total: {{ form.nilai_elemen1 + form.nilai_elemen2 + form.nilai_elemen3 + form.nilai_elemen4 }}</div>
                  </div> -->
                  <div v-if="$device.isMobile && !certificate.isValid" class="mb-4">
                    <label for="fotonilai">Upload ulang halaman nilai?</label>
                    <input @change="compressFile" class="form form-control" type="file" id="fotonilai" accept="image/*" capture="environment" />
                    <div v-if="isErrorCompressOrExt" class="my-2 fst-italic text-muted text-danger small">Silahkan periksa kembali file-nya (jpg/png).</div>
                  </div>
                  <hr v-if="!certificate.isValid">
                  <div v-if="!certificate.isValid" class="mb-4 form-check form-switch">
                    <input v-model="form.isEntrust" :checked="form.isEntrust" class="form-check-input" type="checkbox" id="entrust" switch>
                    <label for="entrust">Buatkan Sertifikat di Sekolah?</label>
                  </div>
                  <div v-if="form.isEntrust">
                    <div class="mb-4">
                      <div v-if="certificate.isValid" class="text-muted fw-bold">Pejabat Penandatangan</div>
                      <label v-else for="pj_penandatangan">Pejabat Penandatangan</label>
                      <span v-if="certificate.isValid" class="fw-bold">{{ certificate.pj_penandatangan }}</span>
                      <input v-else v-model="form.pj_penandatangan" type="text" id="pj_penandatangan" class="form form-control" placeholder="Contoh: CEO, Direktur, Kepala Dinas..." required>
                    </div>
                    <div class="mb-4">
                      <label for="logo_iduka">Logo IDUKA</label>
                      <div v-if="tempLogoImg" class="my-2"><img :src="`${host}/api/files/${certificate.collectionId}/${certificate.id}/${tempLogoImg}`" alt="Foto jurnal nilai" width="70"></div>
                      <input v-if="!certificate.isValid" @change="compressFileLogo" class="form form-control" type="file" id="logo_iduka" accept="image/*" />
                    </div>
                  </div>
                  <button v-if="!certificate.isValid" :disabled="isSending" class="btn btn-success me-2 mb-2 border border-2 border-dark">
                    <span v-if="isSending">Sedang menyimpan</span>
                    <span v-else>Simpan</span>
                  </button>
                  <span v-if="isSaved" class="ms-2 mb-2 small fst-italic text-muted fw-bold">Berhasil diperbaharui!</span>
                </div>
              </div>
            </form>
            <!-- <div class="card my-3 hand-cursor" data-bs-toggle="modal" data-bs-target="#preview">
              <div class="card-body">
                <div class="fw-bold fs-4 mb-3">{{ certificate?.expand.iduka.nama }}</div>
                <div class="fw-bold text-muted">{{ certificate?.expand.siswa.nama }}</div>
                <div class="text-muted">XII.{{ certificate?.expand.siswa.kelas }}</div>
              </div>
            </div>
            <div class="modal modal-lg" id="preview" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content rounded-0 border border-2 border-dark shadow-lg">
                  <div class="modal-header fw-bold bg-success rounded-0 border-0 border-bottom border-2 border-dark">
                    <span class="fs-4">Rincian Nilai</span>
                    <button class="btn-close" data-bs-dismiss="modal" label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <table class="table table-bordered border border-dark fw-bold">
                      <tbody>
                        <tr>
                          <td>Internalisasi dan penerapan soft skills</td>
                          <td width="1%">:</td>
                          <td class="text-center">{{ certificate?.nilai_elemen1 }}</td>
                        </tr>
                        <tr>
                          <td>Penerapan hard skills</td>
                          <td width="1%">:</td>
                          <td class="text-center">{{ certificate?.nilai_elemen2 }}</td>
                        </tr>
                        <tr>
                          <td>Peningkatan dan pengembangan hard skills</td>
                          <td width="1%">:</td>
                          <td class="text-center">{{ certificate?.nilai_elemen3 }}</td>
                        </tr>
                        <tr>
                          <td>Penyiapan Kemandirian Berwirausaha</td>
                          <td width="1%">:</td>
                          <td class="text-center">{{ certificate?.nilai_elemen4 }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </div>
        <div v-else class="row">
          <div class="col-lg-12">
            <div class="text-center fs-4 fw-bold text-muted py-5">
              <i class="bi bi-database fs-1"></i> <br>
              Belum ada nilai
              <div v-if="meta_pemetaan" class="mt-3">
                <nuxt-link to="/nilai/tambah" class="btn btn-info border border-2 border-dark"><i class="bi bi-plus-lg"></i> Buat Pengajuan</nuxt-link>
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
useHead({ title: "Nilai — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let config = useRuntimeConfig()
let host = config.public.apiBaseUrl+":"+config.public.apiPort
let isLoading = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let isError = ref(false)
let isErrorCompressOrExt = ref(false)
let isCertificate = ref(false)
let isLoadingMetaPemetaan = ref(true)
let prokel = user.user.value.program_keahlian
let siswa_id = user.user.value.siswa
let meta_pemetaan = ref()
let certificate = ref()
let tempLogoImg = ref()
let tempNilaiImg = ref()
let form = ref({
  "nilai_elemen1": 0,
  "nilai_elemen2": 0,
  "nilai_elemen3": 0,
  "nilai_elemen4": 0,
  "pj_penandatangan": "",
  "foto_jurnal_nilai": "",
  "logo": "",
  "isEntrust": false,
  "isValid": ""
})

async function updateNilai() {
  form.value.iduka = meta_pemetaan.value.iduka
  form.value.siswa = siswa_id
  isSending.value = true
  isSaved.value = false
  try {
    let res = await client.collection('nilai').update(certificate.value.id, form.value)
    if(res) {
      isSending.value = false
      isSaved.value = true
    }
  } catch(err) {
    isSending.value = false
    isSaved.value = false
    isError.value = true
  }
}

async function getNilai(loading=true, isCert=false) {
  isLoading.value = loading
  isCertificate.value = isCert
  client.autoCancellation(false)
  try {
    let res = await client.collection('nilai').getFirstListItem(`siswa='${siswa_id}'`, {
      expand: "iduka, siswa"
    })
    if(res) {
      certificate.value = res
      form.value = res
      tempLogoImg.value = certificate.value.logo
      tempNilaiImg.value = certificate.value.foto_jurnal_nilai
      isLoading.value = false
      isCertificate.value = true
    }
  } catch(error) {
    isLoading.value = false
    isCertificate.value = false
  }
}

async function getIdukaByPeserta() {
  isLoadingMetaPemetaan.value = true
  client.autoCancellation(false)
  try {
    let res = await client.collection('pemetaan').getFirstListItem(`siswa='${siswa_id}'`)
    if(res) {
      meta_pemetaan.value = res
      isLoadingMetaPemetaan.value = false
    }
  } catch(err) {
    isError.value = true
    isLoadingMetaPemetaan.value = false
    meta_pemetaan.value = ""
  }
}

function compressFile(e) {
  isErrorCompressOrExt.value = false
  let file = e.target.files[0]
  if(!file) return;
  new Compressor(file, {
    quality: 0.6,
    success(result) {
      form.value.foto_jurnal_nilai = result
    },
    error(err) {
      console.error(err.message)
      isErrorCompressOrExt.value = true
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

onMounted(() => {
  getNilai()
  getIdukaByPeserta()
  client.autoCancellation(false)
  client.collection('nilai').subscribe('*', function(e) {
    // getNilai params:
    // - isLoading nilai default na true
    // - isCert nilai default na false
    if(e.action == 'update') getNilai(false, true)
  },{})
})
</script>
