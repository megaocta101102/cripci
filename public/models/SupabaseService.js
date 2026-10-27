/**
 * ==============================================================================
 * EDUTECH CITY - SUPABASE SERVICE (models/SupabaseService.js)
 * ==============================================================================
 * Menghubungkan aplikasi vanilla JavaScript dengan REST API Supabase.
 * Menggunakan kredensial dari config/env.js tanpa hardcoding.
 * Dilengkapi graceful fallback untuk mode offline/pengujian lokal.
 * ==============================================================================
 */

class SupabaseService {
  constructor() {
    const config = getSupabaseConfig();
    this.url = config.url;
    this.anonKey = config.anonKey;
    this.isConfigured = this.url && !this.url.includes('your-project-id');
  }

  getHeaders(authToken = null) {
    const headers = {
      'apikey': this.anonKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    } else {
      headers['Authorization'] = `Bearer ${this.anonKey}`;
    }
    return headers;
  }

  // Mengambil data tabel dari Supabase (PostgREST)
  async queryTable(tableName, queryParams = '') {
    if (!this.isConfigured) {
      console.info(`[EduTech City] Supabase belum dikonfigurasi di .env. Menggunakan cache lokal untuk ${tableName}.`);
      return null;
    }

    try {
      const endpoint = `${this.url}/rest/v1/${tableName}${queryParams ? '?' + queryParams : ''}`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data dari ${tableName}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.warn('[EduTech City] Error saat query Supabase:', err.message);
      return null;
    }
  }

  // Menyimpan data ke tabel Supabase
  async insertData(tableName, payload, authToken = null) {
    if (!this.isConfigured) {
      console.info(`[EduTech City] Supabase belum dikonfigurasi. Data ${tableName} disimpan di localStorage.`);
      return payload;
    }

    try {
      const endpoint = `${this.url}/rest/v1/${tableName}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getHeaders(authToken),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gagal menyimpan data ke ${tableName}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.warn('[EduTech City] Error saat insert Supabase:', err.message);
      return null;
    }
  }
}

// Inisialisasi Singleton Service
const supabaseService = new SupabaseService();
