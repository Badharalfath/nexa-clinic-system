# 🎬 Video Demo — NEXA Clinic System
**Durasi target: 8–9 menit (batas maksimal 10 menit)**
**Resolusi: 1920×1080 (atau 1440p) · Format: MP4**
**Bahasa narasi: Indonesia**

---

## Ringkasan struktur video

| Scene | Topik | Durasi | Kumulatif |
|---|---|---|---|
| 1 | Intro & profil | 0:40 | 0:40 |
| 2 | Arsitektur & struktur project | 0:50 | 1:30 |
| 3 | Setup & menjalankan aplikasi | 1:00 | 2:30 |
| 4 | Login & Dashboard (Admin) | 1:30 | 4:00 |
| 5 | Master Data Pasien + pendaftaran (Petugas) | 1:30 | 5:30 |
| 6 | Antrean & Panggil Pasien | 1:00 | 6:30 |
| 7 | Pemeriksaan SOAP + resep (Dokter) | 1:30 | 8:00 |
| 8 | Riwayat & arsip pasien | 1:00 | 9:00 |
| 9 | Postman Collection & penutup | 1:00 | 10:00 |

---

## Scene 1 — Intro & profil (0:00 – 0:40)

**Aksi layar:** Logo Klinik Sehat (K+ monogram) di tengah layar putih, lalu fade ke teks.

**Narasi:**
> "Halo, perkenalkan saya [Nama]. Pada video ini saya akan mendemonstrasikan aplikasi *Mini Clinic Information System* — sebuah sistem informasi klinik yang dibangun untuk memenuhi technical test posisi Programmer di NEXA. Aplikasi ini mencakup pendaftaran pasien, manajemen antrean, pemeriksaan dokter dengan metode SOAP, resep obat, hingga riwayat pemeriksaan."

**Tips:**
- Jangan bertele-tele. 40 detik sudah cukup untuk perkenalan.
- Tampilkan teks overlay: nama, posisi yang dilamar, tanggal.

---

## Scene 2 — Arsitektur & struktur project (0:40 – 1:30)

**Aksi layar:** Tampilkan struktur folder di VS Code (atau `tree` di terminal), zoom ke `backend/src` dan `frontend/src`.

**Narasi:**
> "Arsitektur aplikasi ini saya pisahkan menjadi dua bagian: backend dan frontend. Backend dibangun dengan Node.js dan Express, menggunakan pola *Model-Controller-Route* dengan Sequelize ORM untuk PostgreSQL. Di sini bisa kita lihat pemisahan yang jelas: folder models, controllers, routes, middleware, validators, dan config. Frontend menggunakan React.js dengan Vite, terstruktur per halaman — ada halaman dashboard, pasien, pendaftaran, antrean, pemeriksaan, dan riwayat."

**Aksi layar:** Sekilas tampilkan `models/index.js` (relasi) lalu `routes/` (daftar endpoint).

**Narasi:**
> "Relasi antar tabel saya definisikan eksplisit di sini: pasien memiliki banyak pendaftaran, satu pendaftaran menghasilkan satu antrean, dan satu pendaftaran maksimal satu pemeriksaan medis."

---

## Scene 3 — Setup & menjalankan aplikasi (1:30 – 2:30)

**Aksi layar:** Terminal — tampilkan `.env.example` (blur password), lalu jalankan perintah.

**Narasi:**
> "Untuk menjalankan aplikasi, pertama kita siapkan file konfigurasi. Contoh konfigurasi sudah saya sediakan di `.env.example` — kita salin menjadi `.env` dan isi kredensial database. Perlu dicatat, file `.env` asli tidak saya commit ke repository, hanya contohnya saja, sesuai ketentuan."

**Aksi layar (terminal):**
```bash
cp backend/.env.example backend/.env
cd backend && npm install
npm run sync          # migrasi tabel
npm run dev           # backend di port 5000
```

**Aksi layar:** Terminal kedua:
```bash
cd frontend && npm install && npm run dev   # frontend di port 5174
```

**Narasi:**
> "Database saya jalankan lewat Docker PostgreSQL, lalu sinkronisasi tabel. Backend berjalan di port 5000, frontend di port 5174. Setelah itu, kita buka aplikasinya."

---

## Scene 4 — Login & Dashboard (2:30 – 4:00)

**Aksi layar:** Browser buka `localhost:5174`. Tampilkan halaman login dua kolom.

**Narasi:**
> "Ini halaman login. Ada tiga akun demo: administrator, dokter, dan petugas pendaftaran. Semua passwordnya *password123*. Ada juga kartu informasi akun demo di sebelah kanan — kita tinggal klik, form terisi otomatis."

**Aksi:** Klik kartu "Admin", klik Masuk.

**Narasi:**
> "Kita masuk sebagai Administrator. Ini dashboard dengan ringkasan hari ini: total pasien, jumlah kunjungan, antrean aktif, dan pemeriksaan yang selesai. Ada juga grafik kunjungan mingguan dan daftar antrean berikutnya."

**Aksi layar:** Scroll dashboard, tunjukkan grafik & antrean.

---

## Scene 5 — Master Data Pasien & Pendaftaran (4:00 – 5:30)

**Aksi:** Buka menu "Pasien" (Master Data Pasien).

**Narasi:**
> "Di menu pasien kita bisa melihat daftar pasien lengkap dengan nomor rekam medis otomatis berformat RM-tahunbulan-nomor urut, dan NIK yang divalidasi 16 digit."

**Aksi:** Klik "Tambah Pasien", isi form (tunjukkan NIK 16 digit valid, lalu coba NIK salah — muncul error inline).

**Narasi:**
> "Validasi dilakukan di frontend dan backend. Coba perhatikan: kalau NIK kurang dari 16 digit, muncul pesan error langsung di form. Di sisi backend, validasi juga diperiksa ulang dengan Joi sehingga data tidak valid tetap ditolak."

**Aksi:** Simpan pasien baru, lalu buka menu "Pendaftaran", daftarkan pasien baru tersebut (pilih poli, dokter, keluhan).

**Narasi:**
> "Setelah data pasien tersimpan, kita daftarkan untuk kunjungan hari ini. Sistem otomatis membuat nomor antrean dan statusnya 'Menunggu'."

---

## Scene 6 — Antrean & Panggil Pasien (5:30 – 6:30)

**Aksi:** Buka menu "Antrean".

**Narasi:**
> "Di halaman antrean, pasien yang baru kita daftarkan muncul di daftar. Ada kartu 'Sedang Dipanggil' untuk pasien yang aktif, dan tombol 'Panggil Berikutnya' untuk memanggil antrean berikutnya secara eksplisit."

**Aksi:** Klik tombol "Panggil" pada pasien yang menunggu.

**Narasi:**
> "Begitu dipanggil, status pasien berubah dari 'Menunggu' menjadi 'Dipanggil'. Status ini sinkron juga dengan data pendaftaran."

---

## Scene 7 — Pemeriksaan SOAP & Resep (6:30 – 8:00)

**Aksi:** Login ulang sebagai "Dokter" (dr.sari) — atau buka tab lain. Buka menu "Pemeriksaan".

**Narasi:**
> "Sekarang kita masuk sebagai dokter untuk melakukan pemeriksaan. Di panel kiri ada daftar pasien yang sudah dipanggil. Kita pilih pasiennya."

**Aksi:** Pilih pasien, isi form SOAP: Subjective (keluhan), Objective (tensi, suhu, berat, tinggi), Assessment (diagnosa), Plan (terapi).

**Narasi:**
> "Pemeriksaan dicatat dengan metode SOAP: Subjective untuk keluhan pasien, Objective untuk hasil pemeriksaan fisik, Assessment untuk diagnosa, dan Plan untuk rencana terapi. Dokter juga bisa menambahkan tindakan medis beserta biayanya."

**Aksi:** Tambahkan tindakan medis, tambahkan resep obat (nama obat, dosis, aturan pakai), klik "Simpan Pemeriksaan Selesai".

**Narasi:**
> "Kita tambahkan tindakan medis dan resep obat. Setelah disimpan, status pemeriksaan otomatis menjadi 'Selesai', dan semua data — termasuk resep — tersimpan ke database."

---

## Scene 8 — Riwayat & Arsip Pasien (8:00 – 9:00)

**Aksi:** Buka menu "Riwayat".

**Narasi:**
> "Di menu riwayat, pasien yang pernah diperiksa tampil otomatis, diurutkan dari kunjungan terbaru. Kita klik salah satu pasien untuk melihat detail pemeriksaan lengkapnya: keluhan, diagnosa, tindakan, dan resep."

**Aksi:** Klik pasien, tunjukkan kartu riwayat lengkap. Lalu kembali ke Pasien, klik ikon hapus.

**Narasi:**
> "Satu lagi yang saya bangun: ketika pasien dihapus, muncul dialog konfirmasi yang menghitung data terkait — pendaftaran, pemeriksaan, resep. Default-nya pasien diarsipkan supaya riwayat medis tetap tersimpan. Khusus administrator, ada opsi hapus permanen dengan konfirmasi ketik nama pasien."

**Aksi:** Tampilkan modal arsip (jangan benar-benar menghapus pasien asli — batalkan).

---

## Scene 9 — Postman & Penutup (9:00 – 10:00)

**Aksi:** Buka Postman, tampilkan collection 7 folder, buka salah satu request (misal Login atau Daftar Pasien), klik Send, tunjukkan response.

**Narasi:**
> "Sebagai dokumentasi API, saya menyediakan Postman Collection yang lengkap — mencakup semua endpoint, lengkap dengan environment dan contoh response. Collection ini bisa diimpor dan langsung dicoba. Source code lengkap, file SQL, ERD, dan dokumentasi bisa dilihat di repository GitHub."

**Aksi layar:** Tampilkan repo GitHub (README, commit history) sekilas.

**Narasi:**
> "Sekian demo aplikasi Mini Clinic Information System ini. Terima kasih atas waktunya, dan saya siap menjawab pertanyaan lebih lanjut."

---

## Checklist produksi

- [ ] Rekam layar 1080p/1440p (OBS atau QuickTime)
- [ ] Matikan notifikasi & tab browser lain
- [ ] Backend + frontend + Postgres **sudah hidup sebelum rekam**
- [ ] Data demo sudah disiapkan (2-3 pasien dengan riwayat)
- [ ] Satu take per scene; potong antar scene (jangan rekam sekali jalan)
- [ ] Zoom tidak berlebihan (1 zoom per scene cukup)
- [ ] Jangan tampilkan `.env` asli / password asli (pakai overlay blur)
- [ ] Cek audio: narasi jelas, tanpa noise background
- [ ] Durasi total ≤ 10:00 (potong scene 9 kalau mepet)

## Alur cepat pengingat saat rekam

```
login admin → dashboard → pasien (tambah, validasi NIK) → pendaftaran
→ antrean (panggil) → login dokter → pemeriksaan SOAP + resep
→ riwayat (detail) → arsip dialog → Postman (send) → repo → penutup
```
