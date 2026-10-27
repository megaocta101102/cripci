/**
 * ==============================================================================
 * EDUTECH CITY - KONFIGURASI LINGKUNGAN (config/env.js)
 * ==============================================================================
 * Mengatur variabel lingkungan tanpa hardcoding.
 * Mengambil nilai dari process.env (jika ada runtime build), window.__ENV__,
 * atau nilai konfigurasi terpusat.
 * ==============================================================================
 */

const ENV_CONFIG = {
  // URL Proyek Supabase
  SUPABASE_URL: (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL) 
    || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.SUPABASE_URL)
    || 'https://your-project-id.supabase.co',

  // Anon Key Supabase (Aman di frontend)
  SUPABASE_ANON_KEY: (typeof process !== 'undefined' && process.env && process.env.SUPABASE_ANON_KEY)
    || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.SUPABASE_ANON_KEY)
    || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-sample-anon-key',

  // Mode Lingkungan
  APP_ENV: (typeof process !== 'undefined' && process.env && process.env.APP_ENV)
    || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.APP_ENV)
    || 'development',

  // Nama Aplikasi
  APP_NAME: 'EduTech City'
};

// Helper untuk mengambil konfigurasi
function getEnv(key, fallback = '') {
  return ENV_CONFIG[key] || fallback;
}

function getSupabaseConfig() {
  return {
    url: ENV_CONFIG.SUPABASE_URL,
    anonKey: ENV_CONFIG.SUPABASE_ANON_KEY
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ENV_CONFIG, getEnv, getSupabaseConfig };
}
