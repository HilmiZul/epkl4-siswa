<template>
  <div class="card">
    <div class="card-header h4 fw-bold">
      <i class="bi bi-easel"></i> Serahkan Proyek 
      <span class="float-end">
        <nuxt-link to="/proyek" class="btn btn-light btn-sm border border-2 border-dark">Kembali</nuxt-link>
      </span>
    </div>

    <div class="card-body">
      <div class="row">
        <div class="col-md-6 small">
          <form @submit.prevent="createProject">
            <div class="mb-4">
              <label for="judul">Judul <span class="text-danger">*</span></label>
              <input v-model="form.judul" class="form form-control" type="text" placeholder="Tulis proyek..." required />
            </div>
            <div class="mb-4">
              <label for="deskripsi">Deskripsi <span class="text-danger">*</span></label>
              <textarea v-model="form.deskripsi" class="form form-control" name="deskripsi" id="deskripsi" rows="4" placeholder="Deskripsikan proyekmu..." required></textarea>
            </div>
            <div class="mb-4">
              <label for="url">URL <span class="text-danger">*</span> <span class="text-muted">(Web/Github/Drive/Youtube)</span></label>
              <input v-model="form.url" class="form form-control" type="url" placeholder="https://..." required />
            </div>

            <button class="btn btn-info border border-2 border-dark">Serahkan</button>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: "Tambah Proyek — e-PKL / SMKN 4 Tasikmalaya." })
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let siswa_id = user.user.value.siswa
let isLoading = ref(true)
let isSending = ref(false)
let isSaved = ref(false)
let isError = ref(false)
let form = ref({
  judul: '',
  deskripsi: '',
  url: '',
  program_keahlian: user?.user.value.program_keahlian,
  siswa: user?.user.value.siswa,
  iduka: '',
})
let isProjectCreated = ref(false)


async function createProject() {
  isLoading.value = true
  isSending.value = true
  isError.value = false
  isSaved.value = false

  try {
    let res_iduka = await client.collection('pemetaan').getFirstListItem(`siswa="${siswa_id}"`, {})

    if(res_iduka) {
      form.value.iduka = res_iduka.iduka

      let response = await client.collection('proyek').create(form.value)

      if(response) {
        isLoading.value = false
        isSending.value = false
        isError.value = false
        isSaved.value = true
        navigateTo("/proyek")
      }
    }
  } catch (err) {
    isError.value = true
    isSaved.value = false
    isSending.value = false
    isLoading.value = false
  }
}

async function getProject() {
  isLoading.value = true
  isProjectCreated.value = false

  try {
    let res = await client.collection('proyek').getFirstListItem(`siswa='${siswa_id}'`, {
      expand: `program_keahlian, siswa`
    })


    if(res) {
      navigateTo('/proyek')
      isProjectCreated.value = true
    } else {
      isProjectCreated.value = false
    }
  } catch (err) {
    isProjectCreated.value = false
  }
}

onMounted(() => {
  getProject()
})



</script>
