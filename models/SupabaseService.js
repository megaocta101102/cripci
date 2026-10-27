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

  async queryTable(tableName, queryParams = '') {
    if (!this.isConfigured) return null;
    try {
      const endpoint = `${this.url}/rest/v1/${tableName}${queryParams ? '?' + queryParams : ''}`;
      const response = await fetch(endpoint, { method: 'GET', headers: this.getHeaders() });
      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (err) {
      console.warn('Error query Supabase:', err.message);
      return null;
    }
  }

  async insertData(tableName, payload, authToken = null) {
    if (!this.isConfigured) return payload;
    try {
      const endpoint = `${this.url}/rest/v1/${tableName}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getHeaders(authToken),
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (err) {
      console.warn('Error insert Supabase:', err.message);
      return null;
    }
  }
}

const supabaseService = new SupabaseService();
