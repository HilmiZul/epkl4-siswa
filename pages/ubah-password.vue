<template>
  <div class="card">
    <div class="card-header">
      <span class="h4 fw-bold"><i class="bi bi-key"></i> Ubah Password</span>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <div class="alert alert-info small">
            Kalo berhasil ubah password, sistem akan auto-logout dan lo diminta login lagi.
          </div>
          <div class="text-muted hand-cursor mb-3" @click="showHidePassword">
            <span v-if="isShowPassword"><i class="bi bi-eye-slash"></i> Sembunyiin password</span>
            <span v-else><i class="bi bi-eye"></i> Tampilin password</span>
          </div>
          <form @submit.prevent="ubahPassword">
            <div v-if="isError" class="alert alert-danger border border-2 border-dark">Konfirmasi Password tidak sama.</div>
            <div v-if="isErrorOldPass" class="alert alert-danger border border-2 border-dark">Password saat ini salah.</div>
            <div class="mb-4">
              <label for="oldPassword">Password saat ini</label>
              <input v-if="isShowPassword" v-model="form.oldPassword" type="text" id="oldPassword" class="form form-control" placeholder="masukkan password saat ini" autocomplete="off" required>
              <input v-else v-model="form.oldPassword" type="password" id="oldPassword" class="form form-control" placeholder="masukkan password saat ini" autocomplete="off" required>
            </div>
            <div class="mb-4">
              <label for="password">Password baru</label>
              <input v-if="isShowPassword" v-model="form.password" :disabled="form.oldPassword.length < 8" type="text" id="password" class="form form-control" placeholder="masukkan password baru" autocomplete="off" required>
              <input v-else v-model="form.password" :disabled="form.oldPassword.length < 8" type="password" id="password" class="form form-control" placeholder="masukkan password baru" autocomplete="off" required>
            </div>
            <div class="my-4">
              <label for="passwordConfirm">Konfirmasi password baru</label>
              <input v-if="isShowPassword" v-model="form.passwordConfirm" :disabled="form.password.length < 8" type="text" id="newPassword" class="form form-control" placeholder="ketik ulang password baru" autocomplete="off" required>
              <input v-else v-model="form.passwordConfirm" :disabled="form.password.length < 8" type="password" id="newPassword" class="form form-control" placeholder="ketik ulang password baru" autocomplete="off" required>
            </div>
            <button :disabled="isSending || form.oldPassword.length < 8 || form.password.length < 8 || form.passwordConfirm.length < 8" class="btn btn-info me-2 border border-2 border-dark">
              <span v-if="!isSending">Simpan</span>
              <span v-else>Sedang menyimpan</span>
            </button>
            <span v-if="isSaved" class="ms-2 mb-3"><em>Berhasil diubah!</em></span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Ubah Password — e-PKL / SMKN 4 Tasikmalaya'})
let user = usePocketBaseUser()
let client = usePocketBaseClient()
let isSaved = ref(false)
let isSending = ref(false)
let isLoading = ref(true)
let isError = ref(false)
let isErrorOldPass = ref(false)
let form = ref({
  password: '',
  passwordConfirm: '',
  oldPassword: '',
})
let isShowPassword = ref(false)

async function ubahPassword() {
  isSending.value = true
  isSaved.value = false
  isError.value = false
  isErrorOldPass.value = false
  if(form.value.password == form.value.passwordConfirm) {
    try {
      let data = await client.collection('student_users').update(user.user.value.id, form.value)
      if(data) {
        isSending.value = false
        isSaved.value = true
        isError.value = false
        client.authStore.clear()
        client.realtime.unsubscribe()
        navigateTo('/login')
      }
    } catch {
      isSending.value = false
      isSaved.value = false
      isErrorOldPass.value = true
    }
  } else {
    isSending.value = false
    isSaved.value = false
    isError.value = true
  }
}

function showHidePassword() {
  if(isShowPassword.value) isShowPassword.value = false
  else isShowPassword.value = true
}
</script>
