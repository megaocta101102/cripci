/**
 * ==============================================================================
 * EDUTECH CITY - FINAL CONTROLLER (controllers/FinalController.js)
 * ==============================================================================
 * Mengontrol logika halaman reward siswa yang masih kosongan.
 * Menampilkan nama dan XP pengguna aktif serta navigasi kembali.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const user = userModel.getUser();

  // Jika belum login, redirect ke Cover
  if (!user || !user.isLoggedIn) {
    window.location.href = 'index.html';
    return;
  }

  const finalUserNameEl = document.getElementById('finalUserName');
  const finalUserXpEl = document.getElementById('finalUserXp');
  const finalBadgeNameEl = document.getElementById('finalBadgeName');
  const finalScoreValueEl = document.getElementById('finalScoreValue');

  if (finalUserNameEl) {
    finalUserNameEl.textContent = user.fullName || user.username || 'Siswa Digital';
  }

  if (finalBadgeNameEl) {
    const mission = (typeof missionModel !== 'undefined') ? missionModel.getActiveMission() : null;
    finalBadgeNameEl.textContent = (mission && mission.badgeName) ? mission.badgeName : 'Arsitek Jaringan Siber';
  }

  if (finalScoreValueEl) {
    // Tampilkan nilai evaluasi kuis siswa (jika belum ada skor, default 100)
    const score = (typeof user.quizScore === 'number' && user.quizScore > 0) ? user.quizScore : 100;
    finalScoreValueEl.textContent = score;
  }

  if (finalUserXpEl) {
    finalUserXpEl.textContent = (user.totalXp || 150) + ' XP';
  }

  console.log('[EduTech City] FinalController aktif untuk:', user.username);
});
