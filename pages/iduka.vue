<template>
  <div class="card">
    <div class="card-header h4 fw-bold"><i class="bi bi-buildings"></i> {{ form.nama }}
    </div>
    <div class="card-body">
      <loading v-if="isLoading" />
      <div v-else class="row">
        <div class="col-md-6">
          <form @submit.prevent="updateIduka">
            <div class="mb-4">
              <label for="pimpinan">Pimpinan <span class="text-danger">*</span></label>
              <input v-model="form.pimpinan" :disabled="isLoading || isSaving" type="text" id="pimpinan" class="form form-control" placeholder="nama pimpinan/direktur" required>
            </div>
            <div class="mb-4">
              <label for="kontak">Kontak <span class="text-danger">*</span></label>
              <input v-model="form.kontak" :disabled="isLoading || isSaving" type="text" id="kontak" class="form form-control" placeholder="nomor telepon/HP kantor" required>
            </div>
            <div class="mb-4">
              <label for="email">Email (opsional)</label>
              <input v-model="form.email" :disabled="isLoading || isSaving" type="email" id="email" class="form form-control" placeholder="email kantor kalo ada">
            </div>
            <div class="mb-4">
              <label for="instruktur">Instruktur/Pembimbing <span class="text-danger">*</span></label>
              <input v-model="form.pembimbing_iduka" :disabled="isLoading || isSaving" type="text" id="instruktur" class="form form-control" placeholder="nama pembimbing lo kantor" required>
            </div>
            <button :disabled="isSaving" class="btn btn-success border border-2 border-dark">
              <span v-if="isSaving">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
            <span v-if="isSaved" class="ms-2 fst-italic text-muted fw-bold small">Berhasil diperbaharui!</span>
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

async function getIdukaByIdPeserta(loading=true) {
  isLoading.value = loading
  client.autoCancellation(false)
  let res = await client.collection('pemetaan').getFirstListItem(`siswa="${peserta_id}"`, {
    expand: "iduka"
  })
  if(res) {
    isLoading.value = false
    form.value = res.expand.iduka
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
  if(res) {
    isSaving.value = false
    isSaved.value = true
  }
}

onMounted(() => {
  getIdukaByIdPeserta()
})
</script>
