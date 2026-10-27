/**
 * ==============================================================================
 * MAT SMA / EXPO CITY - MISSION HUB CONTROLLER (controllers/MissionController.js)
 * ==============================================================================
 * Mengelola hub Misi Utama:
 * 1. Menampilkan 3 pilihan level (Level 1, Level 2, Level 3).
 * 2. Mengatur status level (Selesai, Mulai, atau Terkunci).
 * 3. Menampilkan Reward & Barcode Google Drive tepat di bawah pilihan level
 *    HANYA JIKA seluruh 3 level misi telah terselesaikan (isAllCompleted).
 * 4. Modal petunjuk misi utama.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const user = userModel.getUser();

  // 1. Verifikasi Autentikasi
  if (!user || !user.isLoggedIn) {
    window.location.href = 'index.html';
    return;
  }

  const isAdmin = !!(user.isAdmin || user.isSpecialAdmin);

  // 2. Verifikasi Izin Akses Misi Utama (Siswa wajib tuntas kuis persiapan misi)
  if (!userModel.isMissionUnlocked()) {
    alert('Akses Ditolak: Anda wajib menuntaskan evaluasi "Persiapan Misi" terlebih dahulu!');
    window.location.href = 'menu.html';
    return;
  }

  // Elemen DOM
  const cardLvl1 = document.getElementById('cardLvl1');
  const cardLvl2 = document.getElementById('cardLvl2');
  const statusTagLvl1 = document.getElementById('statusTagLvl1');
  const statusTagLvl2 = document.getElementById('statusTagLvl2');
  const rewardSection = document.getElementById('rewardSection');
  const finalUserName = document.getElementById('finalUserName');
  const finalUserXp = document.getElementById('finalUserXp');
  const missionStatusPill = document.getElementById('missionStatusPill');

  // Status penyelesaian per district (hanya 2 district: District 1 & District 2)
  const lvl1Done = userModel.isMissionLevelCompleted(1);
  const lvl2Done = userModel.isMissionLevelCompleted(2);

  // Status izin buka per district
  const lvl2Unlocked = isAdmin || userModel.canAccessMissionLevel(2) || lvl1Done;

  // 1. Render Status District 1
  if (cardLvl1 && statusTagLvl1) {
    if (lvl1Done) {
      cardLvl1.classList.add('completed');
      statusTagLvl1.className = 'lvl-status-tag done';
      statusTagLvl1.textContent = '✓ Selesai';
    } else {
      statusTagLvl1.className = 'lvl-status-tag active';
      statusTagLvl1.textContent = '● Mulai';
    }
  }

  // 2. Render Status District 2
  if (cardLvl2 && statusTagLvl2) {
    if (lvl2Done) {
      cardLvl2.classList.add('completed');
      cardLvl2.classList.remove('locked');
      statusTagLvl2.className = 'lvl-status-tag done';
      statusTagLvl2.textContent = '✓ Selesai';
    } else if (lvl2Unlocked) {
      cardLvl2.classList.remove('locked');
      statusTagLvl2.className = 'lvl-status-tag active';
      statusTagLvl2.textContent = '● Mulai';
    } else {
      cardLvl2.classList.add('locked');
      statusTagLvl2.className = 'lvl-status-tag lock';
      statusTagLvl2.textContent = '🔒 Terkunci';
      cardLvl2.addEventListener('click', (e) => {
        e.preventDefault();
        alert('District 2 Terkunci: Tuntaskan District 1 terlebih dahulu untuk membuka akses sektor ini!');
      });
    }
  }

  // 3. Periksa Apakah Seluruh District Terselesaikan (Khusus Admin Cripci tetap selalu ada halaman reward & barcode)
  const isAllMissionsDone = (lvl1Done && lvl2Done) || isAdmin;

  if (rewardSection) {
    if (isAllMissionsDone) {
      rewardSection.style.display = 'block';

      if (finalUserName) {
        finalUserName.textContent = user.fullName || user.username || (isAdmin ? 'Admin Cripci' : 'Siswa Digital');
      }
      if (finalUserXp) {
        finalUserXp.textContent = `${user.totalXp || 300} XP`;
      }
      if (missionStatusPill) {
        if (lvl1Done && lvl2Done) {
          missionStatusPill.className = 'mission-status-pill all-completed';
          missionStatusPill.innerHTML = '<span style="color: #047857; font-weight: 900; font-size: 0.95rem;">✓</span> SELURUH DISTRICT TUNTAS';
        } else {
          missionStatusPill.className = 'mission-status-pill';
          const completedCount = (lvl1Done ? 1 : 0) + (lvl2Done ? 1 : 0);
          missionStatusPill.textContent = `● ESCAPE ROOM // ${completedCount} DARI 2 TUNTAS`;
        }
      }
    } else {
      rewardSection.style.display = 'none';
      if (missionStatusPill) {
        missionStatusPill.className = 'mission-status-pill';
        const completedCount = (lvl1Done ? 1 : 0) + (lvl2Done ? 1 : 0);
        missionStatusPill.textContent = `● ESCAPE ROOM // ${completedCount} DARI 2 TUNTAS`;
      }
    }
  }

  // 5. Modal Petunjuk Misi Utama
  const btnOpenPetunjukMisi = document.getElementById('btnOpenPetunjukMisi');
  const btnClosePetunjukMisi = document.getElementById('btnClosePetunjukMisi');
  const btnUnderstoodPetunjukMisi = document.getElementById('btnUnderstoodPetunjukMisi');
  const modalPetunjukMisi = document.getElementById('modalPetunjukMisi');

  function openPetunjuk() {
    if (modalPetunjukMisi) modalPetunjukMisi.style.display = 'flex';
  }

  function closePetunjuk() {
    if (modalPetunjukMisi) modalPetunjukMisi.style.display = 'none';
  }

  if (btnOpenPetunjukMisi) btnOpenPetunjukMisi.addEventListener('click', openPetunjuk);
  if (btnClosePetunjukMisi) btnClosePetunjukMisi.addEventListener('click', closePetunjuk);
  if (btnUnderstoodPetunjukMisi) btnUnderstoodPetunjukMisi.addEventListener('click', closePetunjuk);
});
