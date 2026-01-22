<template>
  <nav class="navbar navbar-expand fixed-bottom bg-white border-top border-3 border-dark p-0">
    <div class="container-fluid justify-content-around">
      <ul class="navbar-nav text-center fw-bold">
        <li class="nav-item me-3">
          <nuxt-link class="nav-link text-dark" to="/" :activeClass="activeClass">
            <i class="bi bi-house-door fs-5"></i> <br>
            <span class="smallest">Home</span>
          </nuxt-link>
        </li>
        <li class="nav-item me-3">
          <nuxt-link class="nav-link  text-dark" to="/iduka" :activeClass="activeClass">
            <i class="bi bi-buildings fs-5"></i> <br>
            <span class="smallest">IDUKA</span>
          </nuxt-link>
        </li>
        <li class="nav-item me-3">
          <nuxt-link class="nav-link  text-dark" to="/jurnal" :activeClass="activeClass">
            <div v-if="countDraft > 0" class="badge draft bg-danger rounded-5 smallest">
              {{ countDraft }}
            </div>
            <div v-if="countUnreadJournalComment > 0" class="badge comment bg-dark rounded-5 smallest">
              {{ countUnreadJournalComment }}
            </div>
            <i class="bi bi-journals fs-5"></i> <br>
            <span class="smallest">Jurnal</span>
          </nuxt-link>
        </li>
        <li class="nav-item me-3">
          <nuxt-link class="nav-link text-dark" href="/nilai" :activeClass="activeClass">
            <i class="bi bi-patch-check fs-5"></i> <br>
            <span class="smallest">Nilai</span>
          </nuxt-link>
        </li>
        <li class="nav-item">
          <nuxt-link class="nav-link  text-dark" to="/elemen" :activeClass="activeClass">
            <i class="bi bi-journal-bookmark-fill fs-5"></i> <br>
            <span class="smallest">Elemen</span>
          </nuxt-link>
        </li>
        <!-- <li class="nav-item">
          <nuxt-link class="nav-link  text-dark" href="/ubah-password">
            <i class="bi bi-key fs-4"></i> <br>
            <span class="smallest">Password</span>
          </nuxt-link>
        </li> -->
      </ul>
    </div>
  </nav>
</template>


<script setup>
let activeClass = ref('list-group-item-active')
let client = usePocketBaseClient()
let user = usePocketBaseUser()
let countUnreadJournalComment = ref(0)
let countDraft = ref(0)

async function getCountUnreadJournalComment() {
  let res = await client.collection('jurnal_komentar').getList(1,1, {
    filter: `idJurnal.siswa.id="${user.user.value.id}" && isOpen=false`
  })
  if(res) {
    countUnreadJournalComment.value = res.totalItems
  }
}

async function getCountDraft() {
  let res = await client.collection('jurnal').getList(1,1, {
    filter: `siswa.id="${user.user.value.id}" && isDraft=true`
  })
  if(res) {
    countDraft.value = res.totalItems
  }
}

onMounted(() => {
  getCountDraft()
  getCountUnreadJournalComment()
  client.collection('jurnal_komentar').subscribe('*', function(e){
    if(e.action == 'create' || e.action == 'update') getCountUnreadJournalComment()
  },{})
  client.collection('jurnal').subscribe('*', function(e){
    if(e.action == 'create' || e.action == 'update') getCountDraft()
  },{})
})
</script>

<style scoped>
.nav-item {
  position: relative;
} 
.nav-item .badge.comment {
  color: #fff !important;
  border: 2px solid #fff;
  position: absolute;
  right: 0;
  top: 0;
}
.nav-item .badge.draft {
  color: #fff !important;
  border: 2px solid #fff;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
