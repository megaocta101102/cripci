const ENV_CONFIG = {
  SUPABASE_URL: (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL) 
    || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.SUPABASE_URL)
    || 'https://your-project-id.supabase.co',

  SUPABASE_ANON_KEY: (typeof process !== 'undefined' && process.env && process.env.SUPABASE_ANON_KEY)
    || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.SUPABASE_ANON_KEY)
    || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-sample-anon-key',

  APP_ENV: (typeof process !== 'undefined' && process.env && process.env.APP_ENV)
    || (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.APP_ENV)
    || 'development',

  APP_NAME: 'EduTech City'
};

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
