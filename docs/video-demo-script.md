# Video Demo — NEXA Clinic System (Demo Aplikasi)

**Durasi target: 8–9 menit (maksimal 10 menit)**
**Resolusi: 1920×1080 · Format: MP4 · Narasi: Bahasa Indonesia**

> Skrip ini murni demo aplikasi — alur pelayanan end-to-end.
> Struktur project, cara install, dan dokumentasi API **tidak dibahas**
> di video karena sudah lengkap di README.

---

## Ringkasan scene

| Scene | Topik | Durasi | Kumulatif |
|---|---|---|---|
| 1 | Intro singkat | 0:30 | 0:30 |
| 2 | Login & Dashboard (Admin) | 1:00 | 1:30 |
| 3 | Master Data Pasien (validasi NIK) | 1:30 | 3:00 |
| 4 | Pendaftaran pasien | 1:00 | 4:00 |
| 5 | Antrean & panggil pasien | 1:00 | 5:00 |
| 6 | Pemeriksaan SOAP + resep (Dokter) | 2:00 | 7:00 |
| 7 | Riwayat & arsip pasien | 1:30 | 8:30 |
| 8 | Penutup singkat | 0:30 | 9:00 |

---

## Scene 1 — Intro (0:00 – 0:30)

**Aksi layar:** Tampilkan halaman login aplikasi langsung (tidak perlu logo animasi panjang).

**Narasi:**
> "Halo, saya [Nama]. Ini demo aplikasi *Mini Clinic Information System* untuk technical test posisi Programmer NEXA. Saya akan perlihatkan alur pelayanan lengkapnya, mulai dari pendaftaran pasien sampai pemeriksaan dokter."

**Tips:**
- Langsung masuk ke aplikasi. Perkenalan cukup 2 kalimat.
- Teks overlay: nama + posisi yang dilamar.

---

## Scene 2 — Login & Dashboard Admin (0:30 – 1:30)

**Aksi layar:** Halaman login, klik kartu akun "Administrator" (form terisi otomatis), klik Masuk.

**Narasi:**
> "Ini halaman login. Ada tiga akun demo — administrator, dokter, dan petugas pendaftaran. Kartu akun di samping bisa diklik, username langsung terisi. Sekarang saya masuk sebagai administrator."

**Aksi layar:** Tampilkan dashboard, scroll ringan.

**Narasi:**
> "Ini dashboard: ringkasan pasien hari ini, jumlah kunjungan, antrean aktif, dan pemeriksaan selesai. Ada juga grafik kunjungan mingguan dan daftar antrean berikutnya."

---

## Scene 3 — Master Data Pasien & Validasi NIK (1:30 – 3:00)

**Aksi:** Buka menu "Pasien".

**Narasi:**
> "Di menu pasien terlihat daftar lengkap, lengkap nomor rekam medis otomatis berformat RM-tahunbulan-nomor urut, dan NIK 16 digit."

**Aksi:** Klik "Tambah Pasien", isi form dengan NIK yang benar (16 digit), lalu sengaja coba NIK kurang dari 16 digit.

**Narasi:**
> "Validasi berjalan di frontend dan backend. Perhatikan: saat NIK kurang dari 16 digit, muncul pesan error langsung di form. Data tidak valid tidak akan tersimpan."

**Aksi:** Perbaiki NIK, simpan pasien baru.

---

## Scene 4 — Pendaftaran Pasien (3:00 – 4:00)

**Aksi:** Buka menu "Pendaftaran", klik daftarkan pasien baru (pilih poli, dokter, tulis keluhan, jenis pembayaran), simpan.

**Narasi:**
> "Pasien yang barusan dibuat kita daftarkan untuk kunjungan hari ini. Pilih poliklinik dan dokter, isi keluhan. Begitu disimpan, sistem otomatis membuat nomor antrean dan statusnya 'Menunggu'."

---

## Scene 5 — Antrean & Panggil Pasien (4:00 – 5:00)

**Aksi:** Buka menu "Antrean".

**Narasi:**
> "Di halaman antrean, pasien yang baru didaftarkan muncul. Ada tombol 'Panggil Berikutnya' untuk memanggil antrean secara eksplisit."

**Aksi:** Klik panggil pada pasien yang menunggu.

**Narasi:**
> "Begitu dipanggil, status berubah dari 'Menunggu' menjadi 'Dipanggil', dan status ini sinkron dengan data pendaftaran."

---

## Scene 6 — Pemeriksaan SOAP + Resep (Dokter) (5:00 – 7:00)

**Aksi:** Logout, login sebagai "Dokter" (dr.sari), buka menu "Pemeriksaan".

**Narasi:**
> "Sekarang saya masuk sebagai dokter untuk memeriksa pasien yang tadi dipanggil. Di panel kiri ada daftar pasien yang siap diperiksa."

**Aksi:** Pilih pasien, isi form SOAP: Subjective (keluhan), Objective (tensi, suhu, berat, tinggi), Assessment (diagnosa), Plan (terapi).

**Narasi:**
> "Pemeriksaan dicatat dengan metode SOAP: Subjective untuk keluhan, Objective untuk hasil pemeriksaan fisik, Assessment untuk diagnosa, dan Plan untuk rencana terapi."

**Aksi:** Tambah tindakan medis + biaya, tambah resep obat (nama obat, dosis, aturan pakai), klik "Simpan Pemeriksaan Selesai".

**Narasi:**
> "Dokter juga menambahkan tindakan medis dan resep obat. Setelah disimpan, status pemeriksaan otomatis menjadi 'Selesai' dan semua data tersimpan ke database."

---

## Scene 7 — Riwayat & Arsip Pasien (7:00 – 8:30)

**Aksi:** Buka menu "Riwayat".

**Narasi:**
> "Di menu riwayat, pasien yang sudah diperiksa tampil otomatis, diurutkan dari kunjungan terbaru."

**Aksi:** Klik salah satu pasien, tunjukkan detail lengkap (keluhan, diagnosa, tindakan, resep).

**Narasi:**
> "Detail pemeriksaan lengkap — mulai keluhan, hasil pemeriksaan, diagnosa, tindakan, sampai resep — semua tersimpan rapi."

**Aksi:** Kembali ke menu Pasien, klik hapus pada salah satu pasien (tampilkan modal konfirmasi, lalu batalkan).

**Narasi:**
> "Satu fitur lagi: saat pasien dihapus, muncul dialog yang menghitung data terkait — pendaftaran, pemeriksaan, resep. Default-nya pasien diarsipkan supaya riwayat medis tetap tersimpan. Hapus permanen hanya bisa dilakukan administrator."

---

## Scene 8 — Penutup (8:30 – 9:00)

**Aksi layar:** Tampilkan repo GitHub sekilas (README).

**Narasi:**
> "Source code, file SQL, ERD, dan dokumentasi lengkap ada di repository GitHub. Sekian demo aplikasi *Mini Clinic Information System* ini. Terima kasih atas waktunya, dan saya siap menjawab pertanyaan lebih lanjut."

---

## Checklist produksi

- [ ] Rekam layar 1080p/1440p (OBS atau QuickTime)
- [ ] Matikan notifikasi & tab browser lain
- [ ] Backend + frontend + Postgres **sudah hidup sebelum rekam**
- [ ] Data demo disiapkan: 2-3 pasien + 1 pasien dengan riwayat lengkap
- [ ] Satu take per scene; potong antar scene (jangan rekam sekali jalan)
- [ ] Zoom tidak berlebihan (1 zoom per scene cukup)
- [ ] Jangan tampilkan `.env` asli / password asli
- [ ] Cek audio: narasi jelas, tanpa noise background
- [ ] Durasi total ≤ 10:00 (potong scene 7 kalau mepet)

## Alur cepat pengingat saat rekam

```
login admin → dashboard → pasien (tambah, validasi NIK)
→ pendaftaran → antrean (panggil) → login dokter
→ pemeriksaan SOAP + resep → riwayat (detail) → arsip dialog
→ repo GitHub → penutup
```
