<template>
  <div class="">
    <div class="h4 fw-bold text-center text-grey">
      <span v-if="meta_pemetaan">{{ form.nama }}</span>
      <span v-else>IDUKA</span>
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <loading v-if="isLoading" />
      <div v-else class="row">
        <div v-if="!meta_pemetaan" class="col-md-12">
          <div class="text-center text-muted pb-5">
            <div class="fs-1 pt-5"><i class="bi bi-database"></i></div>
            <span class="fw-bold fs-4">Belum pemetaan tempat</span>
          </div>
        </div>
        <div v-else class="col-md-6">
          <form @submit.prevent="updateIduka">
            <div class="mb-4">
              <label for="pimpinan">Pimpinan <span class="text-danger">*</span></label>
              <input v-model="form.pimpinan" :disabled="isLoading || isSaving" type="text" id="pimpinan"
                class="form form-control" placeholder="nama pimpinan/direktur" required>
            </div>
            <div class="mb-4">
              <label for="kontak">Kontak <span class="text-danger">*</span></label>
              <input v-model="form.kontak" :disabled="isLoading || isSaving" type="text" id="kontak"
                class="form form-control" placeholder="nomor telepon/HP kantor" required>
            </div>
            <div class="mb-4">
              <label for="email">Email (opsional)</label>
              <input v-model="form.email" :disabled="isLoading || isSaving" type="email" id="email"
                class="form form-control" placeholder="email kantor kalo ada">
            </div>
            <div class="mb-4">
              <label for="instruktur">Instruktur/Pembimbing <span class="text-danger">*</span></label>
              <input v-model="form.pembimbing_iduka" :disabled="isLoading || isSaving" type="text" id="instruktur"
                class="form form-control" placeholder="nama pembimbing dikantor" required>
            </div>
            <button :disabled="isSaving" class="btn btn-info border border-2 border-dark">
              <span v-if="isSaving">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
            <span v-if="isSaved" class="ms-2 fst-italic text-muted fw-bold small">Berhasil tersimpan!</span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Identitas IDUKA — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let prokel = user.user.value.program_keahlian
let peserta_id = user.user.value.siswa
let isLoading = ref(true)
let isSaving = ref(false)
let isSaved = ref(false)
let form = ref({
  "pimpinan": "loading",
  "kontak": "loading",
  "email": "loading",
  "pembimbing_iduka": "loading",
})
let meta_pemetaan = ref()

async function getIdukaByIdPeserta(loading = true) {
  isLoading.value = loading
  client.autoCancellation(false)
  try {
    let res = await client.collection('pemetaan').getFirstListItem(`siswa="${peserta_id}"`, {
      expand: "iduka"
    })
    if (res) {
      isLoading.value = false
      form.value = res.expand.iduka
      meta_pemetaan.value = res.expand.iduka
    }
  } catch {
    meta_pemetaan.value = ""
    isLoading.value = false
  }
}

async function updateIduka() {
  isSaving.value = true
  isSaved.value = false
  client.autoCancellation(false)
  let res = await client.collection('iduka').update(form.value.id, {
    "pimpinan": form.value.pimpinan,
    "kontak": form.value.kontak,
    "email": form.value.email,
    "pembimbing_iduka": form.value.pembimbing_iduka,
  })
  if (res) {
    isSaving.value = false
    isSaved.value = true
  }
}

onMounted(() => {
  getIdukaByIdPeserta()
})
</script>
