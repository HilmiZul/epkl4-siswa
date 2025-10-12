<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 fw-bold"><i class="bi bi-patch-check"></i> Nilai Sertifikat</span>
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
          <div class="col-lg-6">
            <form @submit.prevent="updateNilai">
              <!-- <div class="mb-4">
                <label for="fotonilai">Foto Halaman Nilai Jurnal (JPG/PNG)</label>
                <input @change="compressFile" class="form form-control" type="file" id="fotonilai" accept="image/*" capture="user" />
              </div> -->
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
                <div class="my-2"><img :src="`${host}/api/files/${certificate.collectionId}/${certificate.id}/${certificate.logo}`" alt="Foto jurnal nilai" width="70"></div>
                <!-- <input @change="compressFileLogo" class="form form-control" type="file" id="logo_iduka" accept="image/*" /> -->
              </div>
              <button :disabled="isSending" class="btn btn-success me-2 mb-2">
                <span v-if="isSending">Sedang menyimpan</span>
                <span v-else>Simpan</span>
              </button>
              <span v-if="isSaved" class="ms-2 mb-2 small fst-italic text-muted">Berhasil diperbaharui!</span>
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
          <div class="col-lg-6">
            <div class="fw-bold pb-3">Pratinjau Nilai Elemen</div>
            <img :src="`${host}/api/files/${certificate.collectionId}/${certificate.id}/${certificate.foto_jurnal_nilai}`" alt="Foto jurnal nilai" width="100%">
          </div>
        </div>
        <div v-else class="row">
          <div class="col-lg-12">
            <div class="text-center fs-4 fw-bold text-muted py-5">
              <i class="bi bi-patch-check fs-1"></i> <br>
              Belum ada Nilai Sertifikat.
              <div v-if="meta_pemetaan" class="mt-3">
                <nuxt-link to="/nilai/tambah" class="btn btn-info"><i class="bi bi-plus-lg"></i> Buat Baru</nuxt-link>
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
useHead({ title: "Nilai Sertifikat — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let config = useRuntimeConfig()
let host = config.public.apiBaseUrl+":"+config.public.apiPort
let isLoading = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let isError = ref(false)
let isCertificate = ref(false)
let isLoadingMetaPemetaan = ref(true)
let prokel = user.user.value.program_keahlian
let siswa_id = user.user.value.siswa
let meta_pemetaan = ref()
let certificate = ref()
let form = ref({
  "nilai_elemen1": 0,
  "nilai_elemen2": 0,
  "nilai_elemen3": 0,
  "nilai_elemen4": 0,
  "iduka": "",
  "siswa": "",
  "nama_pimpinan": "",
  "nip": "",
})

async function updateNilai() {
  form.value.iduka = meta_pemetaan.value.iduka
  form.value.siswa = siswa_id
  isSending.value = true
  isSaved.value = false
  try {
    let res = await client.collection('sertifikat').update(certificate.value.id, form.value)
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

async function getSertifikat() {
  isLoading.value = true
  isCertificate.value = false
  client.autoCancellation(false)
  try {
    let res = await client.collection('sertifikat').getFirstListItem(`siswa='${siswa_id}'`, {
      expand: "iduka, siswa"
    })
    if(res) {
      certificate.value = res
      form.value = res
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

onMounted(() => {
  getSertifikat()
  getIdukaByPeserta()
})
</script>
