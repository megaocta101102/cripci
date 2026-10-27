-- ==============================================================================
-- EDUTECH CITY - SKEMA DATABASE SUPABASE (db.sql)
-- ==============================================================================
-- Petunjuk Penggunaan:
-- 1. Buka dashboard proyek Supabase Anda (https://supabase.com/dashboard)
-- 2. Masuk ke menu "SQL Editor" pada sidebar kiri
-- 3. Buat New Query, lalu copy-paste seluruh isi skrip ini dan klik "Run"
-- ==============================================================================

-- 1. AKTIFKAN EXTENSION UUID (Bila belum aktif)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFIL PENGGUNA (Terkoneksi dengan auth.users Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    city_level INT DEFAULT 1,
    total_xp INT DEFAULT 0,
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABEL MODUL PEMBELAJARAN (Bab / Topik Pembelajaran)
CREATE TABLE IF NOT EXISTS public.learning_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABEL MISI UTAMA (Misi Pembelajaran Interaktif)
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES public.learning_modules(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    objective TEXT,
    reward_xp INT DEFAULT 100,
    badge_name VARCHAR(100) DEFAULT 'Teknolog Pemula',
    order_index INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABEL SOAL KUIS SINGKAT
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES public.learning_modules(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    explanation TEXT,
    points INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABEL PROGRES MISI PENGGUNA
CREATE TABLE IF NOT EXISTS public.user_mission_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, mission_id)
);

-- 7. TABEL RIWAYAT KUIS PENGGUNA
CREATE TABLE IF NOT EXISTS public.user_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.learning_modules(id) ON DELETE SET NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    score NUMERIC(5,2) NOT NULL,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- KEAMANAN: ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policy untuk Profiles
CREATE POLICY "Profil dapat dibaca semua pengguna login" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Pengguna dapat mengubah profil sendiri" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Pengguna dapat menambahkan profil sendiri" 
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy untuk Modul Pembelajaran
CREATE POLICY "Modul pembelajaran dapat dibaca semua orang" 
    ON public.learning_modules FOR SELECT USING (true);

-- Policy untuk Misi
CREATE POLICY "Misi dapat dibaca semua orang" 
    ON public.missions FOR SELECT USING (true);

-- Policy untuk Kuis
CREATE POLICY "Soal kuis dapat dibaca semua orang" 
    ON public.quiz_questions FOR SELECT USING (true);

-- Policy untuk Progres Misi
CREATE POLICY "Pengguna dapat mengelola progres misi miliknya" 
    ON public.user_mission_progress FOR ALL USING (auth.uid() = user_id);

-- Policy untuk Riwayat Kuis
CREATE POLICY "Pengguna dapat mengelola riwayat kuis miliknya" 
    ON public.user_quiz_attempts FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- DATA AWAL / SEED DATA UNTUK MEMPERMUDAH PENGUJIAN
-- ==============================================================================
INSERT INTO public.learning_modules (code, title, description, order_index)
VALUES 
    ('MOD-01', 'Fondasi Kota Digital', 'Mengenal infrastruktur komputasi dan arsitektur data perkotaan cerdas.', 1),
    ('MOD-02', 'Jaringan & Keamanan Siber', 'Memahami protokol transmisi aman dan enkripsi pada smart city.', 2)
ON CONFLICT (code) DO NOTHING;

-- Seed Misi Utama
INSERT INTO public.missions (title, description, objective, reward_xp, badge_name, order_index)
VALUES
    ('Misi 1: Mengaktifkan Sentra Data Kota', 'Bangun pemahaman awal mengenai pusat kendali lalu lintas data.', 'Pelajari alur data dan aktifkan 3 node komunikasi utama.', 150, 'Arsitek Jaringan', 1),
    ('Misi 2: Pertahanan Firewall Siber', 'Lindungi gateway kota teknologi dari anomali data.', 'Konfigurasi aturan proteksi data port 443.', 200, 'Penjaga Siber', 2)
ON CONFLICT DO NOTHING;

-- Seed Soal Kuis Singkat
INSERT INTO public.quiz_questions (question_text, option_a, option_b, option_c, option_d, correct_option, explanation, points)
VALUES
    ('Apa peran utama arsitektur Model-View-Controller (MVC) dalam pengembangan web?', 
     'Memisahkan logika data, tampilan antarmuka, dan pengontrol alur.', 
     'Mempercepat kecepatan internet pengguna secara otomatis.', 
     'Menyimpan password langsung di dalam file HTML.', 
     'Menghapus kebutuhan akan basis data pada server.', 
     'A', 
     'MVC memisahkan komponen menjadi Model (Data), View (Antarmuka Tampilan), dan Controller (Logika Penghubung).', 
     20),
    ('Mengapa kredensial penting seperti API Key tidak boleh ditulis langsung (hardcoded) dalam kode sumber?',
     'Agar ukuran file HTML menjadi lebih besar.',
     'Untuk mencegah kebocoran data rahasia dan mempermudah rotasi kunci konfigurasi.',
     'Karena browser akan menolak membaca file JavaScript.',
     'Supaya tampilan website menjadi lebih berwarna.',
     'B',
     'Menyimpan kredensial dalam environment variable (.env) melindungi keamanan aplikasi dari peretasan dan kebocoran di repositori publik.',
     20),
    ('Pada Supabase, fitur apakah yang digunakan untuk mengatur izin akses data di tingkat baris tabel?',
     'Continuous Integration (CI)',
     'Row Level Security (RLS)',
     'Model View Presenter (MVP)',
     'Cascading Style Sheets (CSS)',
     'B',
     'Row Level Security (RLS) adalah fitur PostgreSQL di Supabase untuk mengamankan data pengguna di tingkat baris tabel.',
     20)
ON CONFLICT DO NOTHING;
