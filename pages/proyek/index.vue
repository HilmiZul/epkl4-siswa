<template>
  <div class="card">
    <div class="card-header h4 fw-bold">
      <i class="bi bi-easel"></i> Proyek
    </div>

    <div v-if="isProjectCreated" class="card-body">
      <div class="row">
        <div class="col-md-6 small">

          <div v-if="isSaved" class="alert alert-success">
            Proyek berhasil disimpan!
          </div>

          <form @submit.prevent="updateProject">
            <div class="mb-4">
              <label for="judul">Judul Proyek <span class="text-danger">*</span></label>
              <input :disabled="isSending" v-model="form.judul" class="form form-control" type="text" placeholder="Tulis judulnya..." required />
            </div>
            <div class="mb-4">
              <label for="deskripsi">Deskripsi <span class="text-muted">(opsional)</span></label>
              <textarea :disabled="isSending" v-model="form.deskripsi" class="form form-control" name="deskripsi" id="deskripsi" rows="4" placeholder="Deskripsikan proyeknya..." required></textarea>
            </div>
            <div class="mb-4">
              <label for="url">URL <span class="text-muted">(http://)</span></label>
              <input :disabled="isSending" v-model="form.url" class="form form-control" type="url" placeholder="(Web/Drive/Github/Figma/Canva)" required />
            </div>

            <button :disabled="isLoading && isSending" class="btn btn-info border border-2 border-dark">
              <span v-if="isSending">Sedang menyimpan</span>
              <span v-else>Simpan</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <div v-else class="card-body">
      <div class="text-center fs-4 fw-bold text-muted py-5">
        <i class="bi bi-database fs-1"></i> <br>
        Belum ada proyek
        <div class="mt-3">
          <nuxt-link to="/proyek/tambah" class="btn btn-info border border-2 border-dark"><i class="bi bi-send"></i> Buat proyek</nuxt-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Proyek — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let siswa_id = user?.user.value.siswa
let isLoading = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let isError = ref(false)
let form = ref({
  judul: '',
  deskripsi: '',
  url: ''
})
let isProjectCreated = ref(false)
let id_project = ref()

async function getProject() {
  isLoading.value = true
  isProjectCreated.value = false

  try {
    let res = await client.collection('proyek').getFirstListItem(`siswa='${siswa_id}'`, {
      expand: `program_keahlian, siswa`
    })

    if(res) {
      isProjectCreated.value = true
      form.value = res
      id_project.value = res.id
    } else {
      isProjectCreated.value = false
    }
  } catch (err) {
    isProjectCreated.value = false
  }
}


async function updateProject() {
  isLoading.value = true
  isSending.value = true
  isError.value = false
  isSaved.value = false

  try {
    let response = await client.collection('proyek').update(id_project.value, form.value)
    if(response) {
      isLoading.value = false
      isSending.value = false
      isError.value = false
      isSaved.value = true
    }
  } catch (err) {
    isError.value = true
    isSaved.value = false
    isSending.value = false
    isLoading.value = false
  }
}

onMounted(() => {
  getProject()
})



</script>
