# 🏙️ EduTech City - Media Pembelajaran Digital

Platform media pembelajaran interaktif bertema **Kota Teknologi Futuristik** (*Tech City*) dengan palet warna biru dan putih elegan. Dibangun menggunakan **JavaScript murni (Vanilla JS) tanpa framework apapun**, mengadopsi arsitektur folder **Model-View-Controller (MVC)** yang bersih, terstruktur, dan sangat mudah untuk Anda kembangkan lebih lanjut.

---

## 📁 Struktur Folder MVC

Proyek ini dipisahkan secara modular agar masing-masing fungsi dapat dikelola secara independen:

```text
edutech-city/
├── .env                  # Variabel lingkungan lokal (berisi URL & Key Supabase)
├── .env.example          # Template environment variable untuk GitHub
├── vercel.json           # Konfigurasi routing bersih untuk hosting di Vercel
├── README.md             # Panduan lengkap dokumentasi proyek
│
├── database/
│   └── db.sql            # Script skema database PostgreSQL Supabase siap copy-paste
│
├── config/
│   └── env.js            # Modul konfigurasi runtime (tanpa hardcode credentials)
│
├── models/               # [M] MODEL: Logika data, autentikasi, & komunikasi database
│   ├── SupabaseService.js# Jembatan komunikasi REST API ke Supabase
│   ├── UserModel.js      # Pengelolaan data siswa, level kota, & perolehan XP
│   ├── QuizModel.js      # Pengelolaan soal, opsi jawaban, & kalkulasi skor kuis
│   └── MissionModel.js   # Pengelolaan daftar objektif misi & pencapaian badge
│
├── views/ (atau public/) # [V] VIEW: Halaman web format HTML independen
│   ├── index.html        # 1. Halaman Cover / Beranda Utama
│   ├── login.html        # 2. Halaman Login / Portal Identitas
│   ├── menu.html         # 3. Halaman Menu Hub / Observatorium
│   ├── kuis.html         # 4. Halaman Kuis Singkat Interaktif
│   └── misi.html         # 5. Halaman Misi Utama
│
├── controllers/          # [C] CONTROLLER: Penghubung antara View dan Model
│   ├── CoverController.js# Interaksi halaman Cover & navigasi CTA
│   ├── LoginController.js# Validasi form login & redirect pengguna
│   ├── MenuController.js # Tampilan status profil & navigasi antar sektor
│   ├── QuizController.js # Interaksi pilihan soal kuis & kalkulasi hasil
│   └── MissionController.js# Interaksi checklist misi & verifikasi tugas
│
└── assets/
    ├── css/              # Setiap halaman HTML memiliki 1 file CSS terpisah
    │   ├── cover.css     # Styling independen halaman Cover
    │   ├── login.css     # Styling independen halaman Login
    │   ├── menu.css      # Styling independen halaman Menu
    │   ├── kuis.css      # Styling independen halaman Kuis
    │   └── misi.css      # Styling independen halaman Misi
    └── images/           # Placeholder background kota teknologi tiap halaman
        ├── bg-cover.svg  # Skyline kota cerdas dengan menara data
        ├── bg-login.svg  # Portal gerbang keamanan siber heksagonal
        ├── bg-menu.svg   # Observatorium kubah kota futuristik
        ├── bg-kuis.svg   # Ruang evaluasi data sirkuit teknologi
        └── bg-misi.svg   # Dek taktis pemetaan misi perkotaan
```

---

## 🗄️ Panduan Menyiapkan Database Supabase

Seluruh skrip database telah disiapkan dalam file `database/db.sql`. Ikuti langkah berikut untuk mengaktifkannya di Supabase:

1. Buat akun dan proyek baru di [Supabase](https://supabase.com/).
2. Masuk ke **SQL Editor** pada menu sidebar kiri dashboard Supabase Anda.
3. Klik tombol **New Query**.
4. Buka file `database/db.sql` di proyek ini, salin (*copy*) seluruh isinya, dan tempel (*paste*) ke editor Supabase.
5. Klik tombol **Run**.
6. Skema database akan otomatis terbuat beserta:
   - Tabel `profiles`: Profil pengguna, level kota, XP.
   - Tabel `learning_modules`: Bab dan modul media pembelajaran.
   - Tabel `missions`: Misi pembelajaran dan lencana penghargaan.
   - Tabel `quiz_questions`: Soal-soal kuis singkat interaktif.
   - Tabel `user_mission_progress` & `user_quiz_attempts`: Riwayat pengerjaan siswa.
   - Pengaturan keamanan **Row Level Security (RLS)** yang siap pakai.
   - Data awal (*seed data*) pengujian.

---

## 🔐 Konfigurasi File `.env`

Agar kredensial database tidak bocor di repositori publik (GitHub), proyek ini membaca konfigurasi langsung dari file `.env`:

1. Buka dashboard Supabase Anda -> **Project Settings** -> **API**.
2. Salin **Project URL** dan **anon public key**.
3. Buka file `.env` di komputer Anda, lalu perbarui nilainya:
   ```env
   SUPABASE_URL="https://proyek-anda.supabase.co"
   SUPABASE_ANON_KEY="kunci-anon-milik-anda"
   APP_ENV="development"
   APP_URL="http://localhost:3000"
   ```
4. File `.gitignore` telah dikonfigurasi untuk melindungi file `.env` agar tidak terunggah ke GitHub.

---

## 🚀 Panduan Hosting di Vercel & GitHub

### 1. Unggah ke GitHub
```bash
git init
git add .
git commit -m "Inisialisasi EduTech City MVC Vanilla JS"
git branch -M main
git remote add origin https://github.com/username-anda/edutech-city.git
git push -u origin main
```

### 2. Hubungkan ke Vercel
1. Buka [Vercel](https://vercel.com/) dan login menggunakan akun GitHub Anda.
2. Klik **Add New Project**, lalu pilih repositori `edutech-city`.
3. Pada bagian **Environment Variables**, tambahkan:
   - `SUPABASE_URL`: (URL Supabase Anda)
   - `SUPABASE_ANON_KEY`: (Anon Key Supabase Anda)
4. Klik **Deploy**.
5. File `vercel.json` yang telah disediakan akan langsung mengatur URL bersih (misal: `/menu`, `/kuis`, `/misi`) secara otomatis.

---

## 🎨 Karakteristik Desain & Warna
- **Tema Utama:** Kota Teknologi Futuristik (*Tech City*).
- **Palet Warna:** Variasi Biru Teknologi (`#0284C7`, `#38BDF8`, `#00E5FF`, `#0369A1`), Latar Gelap Bersih (`#030B17`), dan Teks Putih Kontras Tinggi (`#FFFFFF`).
- **CSS Terpisah:** Tiap halaman memiliki 1 file CSS khusus (`cover.css`, `login.css`, `menu.css`, `kuis.css`, `misi.css`).
- **Background Berbeda:** Tiap halaman memiliki background visual SVG kota teknologi yang unik di folder `assets/images/`.
- **Kanvas Kosong Placeholder:** Tiap halaman memiliki area kontainer bersih bertanda *SLOT PLACEHOLDER* yang siap diisi materi media pembelajaran sesuai hasil diskusi.
