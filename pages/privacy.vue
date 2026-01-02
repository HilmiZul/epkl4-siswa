<template>
  <nuxt-link to="/" class="btn btn-light btn-sm border border-2 border-dark"><i class="bi bi-arrow-left"></i>
    Kembali</nuxt-link>
  <nuxt-link to="/terms" class="btn btn-info btn-sm border border-2 border-dark ms-2">Aturan & Syarat Penggunaan</nuxt-link>
  <div class="card mt-3">
    <div class="card-header bg-warning fw-bold fs-5">
      Kebijakan Privasi
    </div>
    <div class="card-body text-dark">
      <p class="text-muted small">
        Diperbaharui pada 2 Januari 2026
      </p>
      <p>
        Kebijakan Privasi ini bertujuan untuk membantu Anda memahami data yang kami kumpulkan. Dengan
        menggunakan aplikasi e-PKL, maka Anda setuju dengan dokumen kebijakan privasi ini.
      </p>
      <h5 class="fw-bold text-grey">Informasi yang Kami Simpan</h5>
      <div class="fw-bold">Informasi Personal</div>
      <p>
        Kami menyimpan informasi personal Anda diantaranya Nama, Email, Grup Program Keahlian,
        Password dan Mood (suasana hati) dalam bentuk emoji.
      </p>
      <div class="fw-bold">Informasi Jurnal</div>
      <p>
        Kami mengumpulkan dan menyimpan informasi aktivitas Jurnal harian Anda pada masing-masing program keahlian
        setiap hari
        sebanyak jumlah peserta didik.
      </p>
      <div class="fw-bold">Informasi Nilai</div>
      <p>
        Kami mengumpulkan dan menyimpan nilai PKL dari IDUKA yang diserahkan oleh peserta didik.
      </p>
      <div class="fw-bold">Informasi Mood</div>
      <p>
        Kami juga mengumpulkan pembaharuan Mood yang dilakukan oleh Peserta.
      </p>
      <h5 class="fw-bold text-grey">Bagaimana Kami Menggunakan Informasi Anda</h5>
      <p>
        Informasi personal Anda kami gunakan untuk pembagian otoritas pada masing-masing program keahlian diantaranya
        mengelola Elemen Mapel PKL, Guru Pembimbing, IDUKA dan Jurnal harian.
      </p>
      <p>
        Kami menggunakan jurnal harian peserta untuk mengelompokkan aktivitas harian yang sesuai dengan
        Elemen Mapel PKL serta digunakan untuk analitik data.
      </p>
      <p>
        Kami menggunakan nilai peserta didik untuk Rapor PKL dan/atau pencetakan Sertifikat.
      </p>
      <p>
        Kami juga menggunakan informasi Mood peserta untuk dibagikan pada halaman Kepoin Mood setiap peserta melakukan update. 
        Dan Mood peserta dapat dilihat oleh peserta lain pada halaman Kepoin Mood.
      </p>
      <h5 class="fw-bold text-grey">Bagaimana Kami Menjaga Keamanan Informasi Anda</h5>
      <p>
        Kami mengupayakan menjaga keamanan seluruh informasi Anda tetap aman agar tidak dicuri.
        Sebagai contoh, kami menyimpan <em>password</em> menggunakan mekanisme <em>hashing</em>, tidak dalam
        bentuk karakter asli. Selain itu kami membatasi akses terhadap semua informasi yang tersimpan pada
        aplikasi e-PKL, dengan kata lain hanya yang memiliki akun dan otoritas tertentu yang dapat mengakses informasi
        didalam aplikasi e-PKL.
        Apabila seluruh/salah satu informasi terekspos dan disalahgunakan dengan/tanpa sengaja oleh Anda,
        maka itu menjadi tanggung jawab Anda.
        Kami tidak akan menggunakan informasi Anda untuk hal-hal lain diluar aplikasi e-PKL.
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'public' })
useHead({
  title: "Kebijakan Privasi — e-PKL / SMKN 4 Tasikmalaya.",
  meta: [
    { name: "description", content: "Kebijakan Privasi pada SaaS/App Pemetaan dan Jurnal Peserta PKL (Praktik Kerja Lapangan) tingkat SMK." }
  ]
})
</script>
