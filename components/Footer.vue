<template>
  <div>
    <footer class="my-4 text-muted text-center smallest">
      v{{ version }} <br>
      <span class="hand-cursor link-footer" data-bs-toggle="modal" data-bs-target="#privacy">Privacy</span> |
      <span class="hand-cursor link-footer" data-bs-toggle="modal" data-bs-target="#terms">Terms</span> <br>
      &copy;2018 - {{ year }} <span class="fw-bold hand-cursor link-footer" data-bs-toggle="modal" data-bs-target="#cooked">e-PKL</span>. <br>
    </footer>
    <!-- about e-PKL -->
    <div class="modal" id="cooked" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-0 border border-3 border-dark shadow-lg text-muted">
          <div class="modal-header border-bottom border-3 border-dark bg-success rounded-0">
            <span class="fs-5 fw-bold">What is e-PKL?</span>
            <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body small">
            <p>
              <strong>e-PKL</strong> (<strong>PKL</strong> stand for Praktik Kerja Lapangan) is an internship mapping app for students.
              I made this project is just for fun, because the Head of the Software Engineering Department challenged me to make an app that can generate letters.
            </p>
            <p>
              Original written in Python (with Django Framework) since 2018 and rewrite to Javascript (with Vue Framework) in 2022.
            </p>
            <p>
              This project is an open source software under MIT Licensed. Feel free if you want to contribute to this <nuxt-link to="https://github.com/hilmizul/epkl4" target="_blank" class="link-footer">project</nuxt-link>.
            </p>
            <div class="pt-3">
              Best regards,
              <div class="fw-bold">
                <nuxt-link to="https://zulhilmi.id" class="link-footer" target="_blank">Author</nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /about e-PKL -->

    <!-- Kebijakan Privasi -->
    <div class="modal" id="privacy" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-xl">
        <div class="modal-content rounded-0 border border-3 border-dark shadow-lg text-muted">
          <div class="modal-header border-bottom border-3 border-dark bg-warning rounded-0">
            <span class="fs-5 fw-bold">Kebijakan Privasi</span>
            <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-justify">
            <p>
              Kebijakan Privasi ini bertujuan untuk membantu Anda memahami data yang kami kumpulkan. Dengan
              menggunakan aplikasi e-PKL, maka Anda setuju dengan dokumen kebijakan privasi ini.
            </p>
            <h5 class="fw-bold text-grey">Informasi yang Kami Simpan</h5>
            <div class="fw-bold">Informasi Personal</div>
            <p>
              Kami menyimpan informasi personal Anda diantaranya Nama, Email, Grup Program Keahlian
              dan Password sesuai dengan Program Keahlian.
            </p>
            <div class="fw-bold">Informasi Jurnal</div>
            <p>
              Kami mengumpulkan dan menyimpan informasi aktivitas Jurnal harian Anda pada masing-masing program keahlian setiap hari
              sebanyak jumlah peserta didik.
            </p>
            <h5 class="fw-bold text-grey">Bagaimana Kami Menggunakan Informasi Anda</h5>
            <p>
              Informasi personal Anda kami gunakan untuk pembagian otoritas pada masing-masing program keahlian diantaranya
              mengelola Elemen Mapel PKL, Guru Pembimbing, IDUKA dan Jurnal harian.
            </p>
            <p>
              Kami juga menggunakan jurnal harian peserta untuk mengelompokkan aktivitas harian yang sesuai dengan
              Elemen Mapel PKL serta digunakan untuk analitik data.
            </p>
            <h5 class="fw-bold text-grey">Bagaimana Kami Menjaga Keamanan Informasi Anda</h5>
            <p>
              Kami mengupayakan menjaga keamanan seluruh informasi Anda tetap aman agar tidak dicuri.
              Sebagai contoh, kami menyimpan <em>password</em> menggunakan mekanisme <em>hashing</em>, tidak dalam
              bentuk karakter asli. Selain itu kami membatasi akses terhadap semua informasi yang tersimpan pada
              aplikasi e-PKL, dengan kata lain hanya yang memiliki akun dan otoritas tertentu yang dapat mengakses informasi didalam aplikasi e-PKL.
              Kami tidak akan menggunakan informasi Anda untuk hal-hal lain diluar aplikasi e-PKL.
            </p>

            <p class="pt-3 text-grey small">
              Diperbaharui pada 30 September 2025
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- /kebijakan privasi -->

    <!-- Aturan dan Syarat penggunaan -->
    <div class="modal" id="terms" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-xl">
        <div class="modal-content rounded-0 border border-3 border-dark shadow-lg text-muted">
          <div class="modal-header border-bottom border-3 border-dark bg-warning rounded-0">
            <span class="fs-5 fw-bold">Aturan dan Syarat Penggunaan</span>
            <button class="btn-close" label="Close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-justify">
            <h5 class="fw-bold text-grey">Akun Anggota e-PKL</h5>
            <ul>
              <li>Peserta didik aktif di SMKN 4 Tasikmalaya.</li>
              <li>Setiap anggota yang terdaftar artinya sepakat dengan Kebijakan Privasi aplikasi e-PKL.</li>
              <li>Setiap anggota berhak dan dianjurkan memperbaharui password secara berkala.</li>
              <li>e-PKL berhak menonaktifkan akun anggota apabila terjadi hal lain misalnya cuti atau mengundurkan diri.</li>
            </ul>
            <h5 class="fw-bold text-grey">Terkait Elemen</h5>
            <ul>
              <li>Elemen berisi CP dan tujuan Mapel PKL.</li>
              <li>Elemen ini akan digunakan oleh peserta didik untuk mengisi Jurnal Harian.</li>
              <li>Jobdesc yang tidak sesuai dengan elemen dan bukan lintas keahlian, gunakan <strong>Lain-lain</strong>.</li>
            </ul>
            <h5 class="fw-bold text-grey">Terkait Jurnal Harian</h5>
            <ul>
              <li>Jurnal harian merupakan aktivitas kegiatan harian peserta di IDUKA yang harus didokumentasikan.</li>
              <li>Jurnal diisi 1 x sehari sesuai elemen mapel PKL, lintas konsentrasi keahlian dan atau masih berhubungan dengan <em>jobdesc</em>.</li>
              <li>Peserta didik wajib menyematkan swafoto (<em>selfie</em>) menggunakan HP kedalam jurnal harian sesuai aktivitasnya.</li>
              <li>Guru Pembimbing hanya akan memvalidasi Jurnal apabila:
                <table class="table text-muted small mt-3">
                  <tbody>
                    <tr>
                      <th>Elemen</th>
                      <th>Konten</th>
                    </tr>
                    <tr>
                      <td><i class="bi bi-bookmark-fill text-primary"></i> Pita Biru (sesuai)</td>
                      <td>Sesuai dengan elemen yang dipilih</td>
                    </tr>
                    <tr>
                      <td><i class="bi bi-bookmark-fill text-primary"></i> Pita Biru (sesuai)</td>
                      <td>Ada hubungannya dengan elemen yang dipilih</td>
                    </tr>
                    <tr>
                      <td> <i class="bi bi-bookmark-fill text-danger"></i> Pita Merah (tidak sesuai)</td>
                      <td>Lintas konsentrasi keahlian atau aktivitas masih berhubungan dengan pekerjaan</td>
                    </tr>
                  </tbody>
                </table>
                Guru Pembimbing tidak akan memvalidasi jurnal selain yang tercantum diatas.
              </li>
            </ul>

            <p class="pt-3 text-grey small">
              Diperbaharui pada 30 September 2025
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- /aturan dan syarat penggunaan -->
  </div>

</template>

<script setup>
let config = useRuntimeConfig()
let version = config.public.appVersion
let author = config.public.author
let year = new Date().getFullYear()
let user = usePocketBaseUser()
</script>

<style scoped>
.smallest {
  font-size: .75em;
}
</style>
