<template>
  <div class="card shadow-lg">
    <div class="card-body">
      <h3 class="text-center fw-bold mb-4">LOGIN</h3>
      <form @submit.prevent="handleLogin">
        <div v-if="isError" class="mb-4">
          <div class="alert alert-danger rounded-0 border border-2 border-dark">Kombinasi salah. <br> Silahkan periksa kembali!</div>
        </div>
        <div class="mb-4">
          <label for="email">Username</label>
          <input v-model="username" type="text" class="form form-control form-control-lg mb-2" name="email" id="email" placeholder="gunakan NIPD" required autofocus>
        </div>
        <div class="mb-4">
          <label for="password">Password</label>
          <input v-model="password" :disabled="username.length < 3" type="password" class="form form-control form-control-lg" name="password" id="password" placeholder="jangan lupa password-nya" autocomplete="off" required>
        </div>
        <div class="d-grid gap-2 mt-5">
          <button :disabled="sending || username.length < 3 || password.length < 8" class="btn btn-warning btn-lg border border-3 border-dark">
            <span v-if="!sending"><i class="bi bi-send"></i> Masuk</span>
            <span v-else>tunggu bentar...</span>
          </button>
        </div>
      </form>
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
let isLoading = ref(false)
let perPage = ref(10)
let students = ref([])
let keyword = ref('')

async function handleLogin() {
  isError.value = false
  sending.value = true
  try {
    client.autoCancellation(false)
    let authData = await client.collection('student_users').authWithPassword(
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

async function cariPesertaByNama() {
  isLoading.vaue = true
  let queryFilter = ""
  if(keyword.value.length > 0) {
    queryFilter = "nama~'"+keyword.value+"'"
    client.autoCancellation(false)
    let res = await client.collection('siswa').getList(1, perPage.value, {
      filter: queryFilter,
      sort: "kelas, nama"
    })
    if(res) {
      isLoading.value = false
      students.value = res
    }
  } else {
    students.value = []
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
</script>

