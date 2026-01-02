<template>
  <nuxt-link to="/" class="btn btn-light btn-sm border border-2 border-dark"><i class="bi bi-arrow-left"></i>
    Kembali</nuxt-link>
  <nuxt-link to="/privacy" class="btn btn-info btn-sm border border-2 border-dark ms-2">Kebijakan Privasi</nuxt-link>
  <div class="card mt-3">
    <div class="card-header bg-warning fw-bold fs-5">
      Aturan dan Syarat Penggunaan
    </div>
    <div class="card-body text-dark">
      <p class="text-muted small">
        Diperbaharui pada 2 Januari 2026
      </p>
      <h5 class="fw-bold text-grey">Akun Anggota e-PKL</h5>
      <ul>
        <li>Peserta didik aktif di SMKN 4 Tasikmalaya.</li>
        <li>Setiap anggota yang terdaftar artinya sepakat dengan Kebijakan Privasi aplikasi e-PKL.</li>
        <li>Setiap anggota berhak dan dianjurkan memperbaharui password secara berkala.</li>
        <li>e-PKL berhak menonaktifkan akun anggota apabila terjadi hal lain misalnya cuti atau mengundurkan diri.</li>
      </ul>
      <h5 class="fw-bold text-grey">Terkait Elemen</h5>
      <ul>
        <li>
          Berdasarkan keputusan <nuxt-link to="https://kurikulum.kemdikbud.go.id/file/1687442514_manage_file.pdf" target="_blank">Kepala Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP)</nuxt-link>
          Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi yang mengatur elemen Capaian Pembelajaran untuk mata pelajaran
          PKK dan PKL dalam kurikulum merdeka.
        </li>
        <li>Elemen berisi CP dan tujuan Mapel PKL.</li>
        <li>Elemen ini akan digunakan oleh peserta didik untuk mengisi Jurnal Harian.</li>
        <li>Jobdesc yang tidak sesuai dengan elemen dan bukan lintas keahlian, gunakan <strong>Lain-lain</strong>.</li>
      </ul>
      <h5 class="fw-bold text-grey">Terkait Jurnal Harian</h5>
      <ul>
        <li>Jurnal harian merupakan aktivitas kegiatan harian peserta di IDUKA yang harus didokumentasikan.</li>
        <li>Jurnal diisi 1 x sehari sesuai elemen mapel PKL, lintas konsentrasi keahlian dan atau masih berhubungan
          dengan <em>jobdesc</em>.</li>
        <li>Peserta didik wajib menyematkan swafoto (<em>selfie</em>) menggunakan HP kedalam jurnal harian sesuai
          aktivitasnya.</li>
        <li>Guru Pembimbing hanya akan memvalidasi Jurnal apabila:
          <table class="table text-muted small mt-3">
            <tbody>
              <tr>
                <td><i class="bi bi-bookmark-fill text-primary"></i> Pita Biru</td>
                <td>: Sesuai dengan elemen yang dipilih</td>
              </tr>
              <tr>
                <td><i class="bi bi-bookmark-fill text-primary"></i> Pita Biru</td>
                <td>: Ada hubungannya dengan elemen yang dipilih</td>
              </tr>
              <tr>
                <td> <i class="bi bi-bookmark-fill text-danger"></i> Pita Merah</td>
                <td>: Lintas konsentrasi keahlian atau aktivitas masih berhubungan dengan pekerjaan</td>
              </tr>
            </tbody>
          </table>
        </li>
        <li>Guru Pembimbing tidak akan memvalidasi jurnal selain yang tercantum diatas.</li>
        <li>Dilarang mengunggah foto dan teks yang mengandung SARA.</li>
        <li>Segala bentuk teks dan foto yang diunggah adalah tanggung jawab yang bersangkutan.</li>
      </ul>
      <h5 class="fw-bold text-grey">Terkait Nilai</h5>
      <ul>
        <li>Nilai akan digunakan untuk Rapor PKL dan/atau penitipan Sertifikat bagi IDUKA yang tidak dapat menerbitkan.</li>
        <li>Peserta didik berkewajiban menyerahkan nilai PKL yang diberikan oleh instruktur/pembimbing IDUKA melalui aplikasi e-PKL.</li>
        <li>Nilai yang diserahkan akan diperiksa oleh Guru pembimbing sekolah sampai dinyatakan valid.</li>
      </ul>
      <h5 class="fw-bold text-grey">Terkait Mood</h5>
      <ul>
        <li>Peserta dapat menggunakan fitur Mood untuk meluapkan perasaan saat/setelah bekerja (PKL).</li>
        <li>Peserta bebas melakukan update Mood kapan saja selama masa PKL dan masih aktif sebagai peserta didik.</li>
        <li>Peserta dapat melihat Mood teman satu tim dan luar tim.</li>
        <li>Guru Pembimbing dapat melihat Mood peserta pada halaman validasi Jurnal, hanya peserta yang dibimbingnya.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'public' })
useHead({
  title: "Aturan dan Syarat Penggunaan — e-PKL / SMKN 4 Tasikmalaya.",
  meta: [
    { name: "description", content: "Aturan dan Syarat Penggunaan pada SaaS/App Pemetaan dan Jurnal Peserta PKL (Praktik Kerja Lapangan) tingkat SMK." }
  ]
})
</script>
