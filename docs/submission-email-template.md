# 📧 Template Email Pengumpulan — Technical Test Programmer NEXA

> Ganti semua teks di dalam [kurung siku]. Lampirkan juga bukti pendukung jika diminta.

---

## Subjek (pilih salah satu)

```
[Subjek 1 — formal] Pengumpulan Technical Test — Programmer — [Nama Lengkap]
[Subjek 2 — singkat] Submission Technical Test NEXA — [Nama Lengkap]
```

---

## Isi Email

```
Kepada Yth. Tim Rekrutmen NEXA,

Dengan hormat,

Saya [Nama Lengkap], melampirkan hasil pengerjaan technical test
posisi Programmer — Mini Clinic Information System.

Berikut ringkasan deliverables yang telah saya selesaikan:

1. Source code frontend (React.js) dan backend (Node.js/Express)
2. Database PostgreSQL lengkap (8 tabel, relasi, schema.sql)
3. ERD — terlampir (docs/ERD.png)
4. Postman collection (23 request, 7 folder, auto-token script)
5. README dengan panduan instalasi & dokumentasi API
6. Repositori GitHub publik:
   https://github.com/Badharalfath/nexa-clinic-system

Ringkasan teknis:
- Arsitektur: frontend React + Vite, backend Express + Sequelize, PostgreSQL
- Autentikasi: JWT + role-based access (administrator / dokter / petugas)
- Alur bisnis: pendaftaran → antrean → pemeriksaan SOAP → tindakan & resep
- Validasi NIK 16 digit di frontend & backend, error handling terpusat
- Pengembangan menggunakan Git dengan commit bertahap (bukan satu commit)

Cara menjalankan singkat (detail lengkap di README):
- Database: buat DB clinic_system lalu jalankan backend/database/schema.sql
- Backend: cd backend && npm install && npm run sync:force && npm run dev
- Frontend: cd frontend && npm install && npm run dev (buka localhost:5174)
- Akun demo: admin (administrator), dr.sari / dr.budi (dokter),
  petugas1 (petugas pendaftaran) — password demo tercantum di README/seed

Saya juga telah membuat video demo aplikasi bila diperlukan untuk
presentasi, dan siap memaparkan lebih lanjut jika Bapak/Ibu berkenan.

Demikian saya sampaikan. Atas waktu dan kesempatannya saya ucapkan
terima kasih.

Hormat saya,
[Nama Lengkap]
[No. HP / WhatsApp]
[Email]
[Kota, tanggal]
```

---

## Checklist sebelum kirim

- [ ] Repo GitHub **public** & link sudah benar
- [ ] ERD.png terlampir (atau link repo docs/ERD.png)
- [ ] Lampiran: `schema.sql` (jika diminta terpisah) + Postman collection `.json`
- [ ] Backend & frontend sudah dites jalan (screenshot boleh dilampirkan)
- [ ] Video demo direkam (≤10 menit) bila diperlukan
- [ ] Subjek email mengandung nama & posisi
- [ ] Nama file lampiran rapi, tanpa spasi aneh (mis. `nexa-erd.png`)
- [ ] Email tidak menyertakan file `.env` / password asli / token

---

## Tips

1. **Taruh link repo di paragraf paling atas** — rekruter tidak perlu scroll.
2. **Jangan lampirkan node_modules / .env / folder berukuran besar** — cukup
   link repo + file kecil (ERD, schema.sql, Postman collection).
3. **Jika batas lampiran email kecil** — cukup kirim link repo GitHub + ERD.png,
   semua file lain sudah ada di repo.
4. **Video demo** — upload ke YouTube unlisted / Google Drive, tempel linknya
   di email (jangan lampirkan file video besar ke email).
5. **Ganti repo URL** jika nama repo berbeda dari `nexa-clinic-system`.
