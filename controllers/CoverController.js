/**
 * ==============================================================================
 * MAT SMA / EXPO CITY - COVER CONTROLLER (controllers/CoverController.js)
 * ==============================================================================
 * Mengatur interaksi halaman Cover dan navigasi tombol 'Masuk Kota' ke login.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroPrimaryBtn = document.getElementById('heroPrimaryCta');

  // Tombol "Masuk Kota" selalu mengarah ke halaman login
  if (heroPrimaryBtn) {
    heroPrimaryBtn.innerHTML = `<span>Masuk Kota</span> <span>→</span>`;
    heroPrimaryBtn.href = 'login.html';
  }

  console.log('[Mat SMA - Expo City] CoverController siap.');
});
