<template>
  <div class="card shadow-lg">
    <div class="card-body">
      <h3 class="text-center fw-bold mb-4">LOGIN</h3>
      <form @submit.prevent="handleLogin">
        <div v-if="isError" class="mb-4">
          <div class="alert alert-danger rounded-0 border border-2 border-dark">Kombinasi salah! Coba lagi besok!</div>
        </div>
        <div class="mb-4">
          <label for="email">Username</label>
          <input v-model="username" type="text" class="form form-control form-control-lg mb-2" name="email" id="email" placeholder="gunakan NIS" required autofocus>
          <span data-bs-toggle="modal" data-bs-target="#lupa-nis" class="float-end smallest hand-cursor text-muted link">Lupa NIS sendiri? 😁</span>
        </div>
        <div class="mb-4">
          <label for="password">Password</label>
          <input v-model="password" :disabled="username.length < 3" type="password" class="form form-control form-control-lg" name="password" id="password" placeholder="ketik password-nya" required>
        </div>
        <div class="d-grid gap-2 mt-5">
          <button :disabled="sending || username.length < 3 || password.length < 5" class="btn btn-warning btn-lg">
            <span v-if="!sending"><i class="bi bi-send"></i> Gass masuk!</span>
            <span v-else>tunggu bentar...</span>
          </button>
        </div>
      </form>
      <div class="modal" id="lupa-nis" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
          <div class="modal-content rounded-0 border border-2 border-dark">
            <div class="modal-header bg-warning rounded-0 border-0 border-bottom border-2 border-dark">
              <span class="fs-5 fw-bold">Lupa NIS yah? 😁</span>
              <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body small">
              <div class="mb-3">
                <input v-model="keyword" @input="getStudents" class="form form-control" type="search" placeholder="🔎 Cari bedasarkan nama kamu">
              </div>
              <div v-if="students && students.totalItems < 1" class="my-3 text-center fw-bold">Tidak ditemukan</div>
              <ul v-else class="list-group mb-3">
                <li v-for="student in students.items" :key="student.id" class="list-group-item">
                  <strong>{{ student.nis }}</strong>
                  <div class="text-grey small">{{ student.nama }}</div>
                </li>
              </ul>
              <button :disabled="students.page < 2" @click="pagination(students.page - 1)" class="btn btn-warning btn-sm me-2 float-start"><i class="bi bi-arrow-left"></i> sebelumnya</button>
              <button :disabled="students.page >= students.totalPages" @click="pagination(students.page + 1)" class="btn btn-warning btn-sm float-end">lanjut <i class="bi bi-arrow-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
definePageMeta({
  layout: 'login',
  middleware: 'check-auth'
})
useHead({ title: "Login — e-PKL / SMKN 4 Tasikmalaya." })

let client = usePocketBaseClient()
let user = usePocketBaseUser()
// console.log(user.value)
// if(user.value) navigateTo('/')
let username = ref('')
let password = ref('')
let isError = ref(false)
let sending = ref(false)
let isLoading = ref(true)
let perPage = ref(10)
let students = ref([])
let keyword = ref('')

async function handleLogin() {
  isError.value = false
  sending.value = true
  try {
    client.autoCancellation(false)
    let authData = await client.collection('users_siswa').authWithPassword(
      username.value,
      password.value
    )
    if(authData) {
      sending.value = false
      navigateTo('/')
    }
  } catch (error) {
    isError.value = true
    sending.value = false
    password.value = ''
  }
}

async function getStudents() {
  isLoading.vaue = true
  let queryFilter = ""
  if(keyword.value.length > 0) {
    queryFilter = "nama~'"+keyword.value+"'"
  }
  client.autoCancellation(false)
  let res = await client.collection('siswa').getList(1, perPage.value, {
    filter: queryFilter,
    expand: "program_keahlian",
    sort: "program_keahlian, kelas, nama"
  })
  if(res) {
    isLoading.value = false
    students.value = res
  }
}

async function pagination(page) {
  isLoading.value = true
  client.autoCancellation(false)
  let res = await client.collection('siswa').getList(page, perPage.value, {
    expand: "program_keahlian",
    sort: "program_keahlian, kelas, nama"
  })
  if(res) {
    isLoading.value = false
    students.value = res
  }
}

onMounted(() => getStudents())
</script>

