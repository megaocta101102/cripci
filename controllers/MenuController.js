/**
 * ==============================================================================
 * MAT SMA / EXPO CITY - MENU & BERANDA CONTROLLER (controllers/MenuController.js)
 * ==============================================================================
 * Mengontrol interaktivitas Beranda:
 * 1. Menampilkan profil aktif siswa/admin di header.
 * 2. Logika gembok Misi Utama (wajib tuntas Persiapan Misi untuk siswa reguler).
 * 3. Modal 1: Petunjuk Penggunaan Media Pembelajaran (Pop up besar tengah layar).
 * 4. Modal 2: Informasi Kurikulum & Tim Pengembang (Pop up sedang tengah layar).
 * 5. Logout dan pembersihan sesi.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const user = userModel.getUser();

  // 1. Validasi Autentikasi: Jika belum login, redirect ke Cover
  if (!user || !user.isLoggedIn) {
    window.location.href = 'index.html';
    return;
  }

  // Helper format nama siswa agar rapi dan tidak terlalu panjang
  function formatStudentName(fullName) {
    if (!fullName) return 'Siswa';
    const clean = fullName.trim();
    if (clean.length <= 18) return clean;
    const parts = clean.split(/\s+/);
    if (parts.length === 1) {
      return clean.slice(0, 15) + '..';
    }
    // Jika 2 kata atau lebih, singkat nama belakang: "Muhammad Rizky P."
    const abbreviatedLast = `${parts.slice(0, -1).join(' ')} ${parts[parts.length - 1][0]}.`;
    if (abbreviatedLast.length <= 19) return abbreviatedLast;
    // Jika masih panjang, singkat nama depan: "M. Rizky Pratama"
    const abbreviatedFirst = `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
    if (abbreviatedFirst.length <= 19) return abbreviatedFirst;
    return `${parts[0]} ${parts[1][0]}.`;
  }

  // 2. Tampilkan Info Profil di Header
  const userProfileBadge = document.getElementById('userProfileBadge');
  if (userProfileBadge) {
    if (user.isAdmin || user.isSpecialAdmin) {
      userProfileBadge.textContent = 'Penjelajah: Admin Cripci';
    } else {
      const studentName = formatStudentName(user.fullName || user.username || user.identifier);
      userProfileBadge.textContent = `Penjelajah: ${studentName}`;
    }
  }

  // 3. Tombol Logout di Header
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      userModel.logout();
      window.location.href = 'index.html';
    });
  }

  // 4. Logika Akses & Gembok Misi Utama
  const missionCard = document.getElementById('missionMenuCard');
  const missionArrow = document.getElementById('missionCardArrow');
  const lockAlertEl = document.getElementById('missionLockAlert');
  const closeAlertBtn = document.getElementById('closeLockAlertBtn');
  const isUnlocked = userModel.isMissionUnlocked();

  if (closeAlertBtn && lockAlertEl) {
    closeAlertBtn.addEventListener('click', () => {
      lockAlertEl.style.display = 'none';
    });
  }

  if (missionCard) {
    if (!isUnlocked) {
      // Siswa reguler yang belum tuntas Persiapan Misi: Kunci tombol Misi Utama
      missionCard.classList.add('locked-card');

      if (missionArrow) {
        missionArrow.innerHTML = `
          <span>🔒 Terkunci</span>
        `;
      }

      missionCard.addEventListener('click', (e) => {
        e.preventDefault();
        if (lockAlertEl) {
          lockAlertEl.style.display = 'block';
          lockAlertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    } else {
      // Terbuka untuk Admin (cripci) atau Siswa yang sudah tuntas persiapan misi
      missionCard.classList.remove('locked-card');
      missionCard.setAttribute('href', 'misi.html');

      if (missionArrow) {
        missionArrow.innerHTML = `
          <span>Mulai</span>
          <span class="arrow-sym">→</span>
        `;
      }
    }
  }

  // 5. MODAL 1: PETUNJUK PENGGUNAAN MEDIA
  const modalPetunjuk = document.getElementById('modalPetunjuk');
  const btnOpenPetunjuk = document.getElementById('btnOpenPetunjuk');
  const btnClosePetunjuk = document.getElementById('btnClosePetunjuk');
  const btnUnderstoodPetunjuk = document.getElementById('btnUnderstoodPetunjuk');

  function openPetunjukModal() {
    if (modalPetunjuk) {
      modalPetunjuk.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closePetunjukModal() {
    if (modalPetunjuk) {
      modalPetunjuk.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (btnOpenPetunjuk) btnOpenPetunjuk.addEventListener('click', openPetunjukModal);
  if (btnClosePetunjuk) btnClosePetunjuk.addEventListener('click', closePetunjukModal);
  if (btnUnderstoodPetunjuk) btnUnderstoodPetunjuk.addEventListener('click', closePetunjukModal);

  // 6. MODAL 2: INFORMASI CP, TP & TIM PENGEMBANG
  const modalKurikulum = document.getElementById('modalKurikulum');
  const btnOpenKurikulum = document.getElementById('btnOpenKurikulum');
  const btnCloseKurikulum = document.getElementById('btnCloseKurikulum');
  const btnDismissKurikulum = document.getElementById('btnDismissKurikulum');

  function openKurikulumModal() {
    if (modalKurikulum) {
      modalKurikulum.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeKurikulumModal() {
    if (modalKurikulum) {
      modalKurikulum.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (btnOpenKurikulum) btnOpenKurikulum.addEventListener('click', openKurikulumModal);
  if (btnCloseKurikulum) btnCloseKurikulum.addEventListener('click', closeKurikulumModal);
  if (btnDismissKurikulum) btnDismissKurikulum.addEventListener('click', closeKurikulumModal);

  // Klik backdrop untuk menutup modal
  window.addEventListener('click', (e) => {
    if (e.target === modalPetunjuk) closePetunjukModal();
    if (e.target === modalKurikulum) closeKurikulumModal();
  });

  // Tombol Escape keyboard untuk menutup modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePetunjukModal();
      closeKurikulumModal();
    }
  });

  // 7. SLIDER DI DALAM MODAL KURIKULUM
  const menuSlides = [
    { id: 'menuTabCP', title: 'Capaian Pembelajaran (CP)', counter: '01 / 03' },
    { id: 'menuTabTP', title: 'Tujuan Pembelajaran (TP)', counter: '02 / 03' },
    { id: 'menuTabTeam', title: 'Tim Pengembang Media', counter: '03 / 03' }
  ];

  let currentMenuSlide = 0;
  const menuSlidePrevBtn = document.getElementById('menuSlidePrevBtn');
  const menuSlideNextBtn = document.getElementById('menuSlideNextBtn');
  const menuSlideTitle = document.getElementById('menuSlideTitle');
  const menuSlideCounter = document.getElementById('menuSlideCounter');

  function updateMenuSlide(index) {
    currentMenuSlide = index;

    menuSlides.forEach((slide, idx) => {
      const el = document.getElementById(slide.id);
      if (el) {
        el.style.display = idx === currentMenuSlide ? 'block' : 'none';
      }
    });

    if (menuSlideTitle) {
      menuSlideTitle.textContent = menuSlides[currentMenuSlide].title;
    }
    if (menuSlideCounter) {
      menuSlideCounter.textContent = menuSlides[currentMenuSlide].counter;
    }

    if (menuSlidePrevBtn) {
      menuSlidePrevBtn.style.visibility = currentMenuSlide === 0 ? 'hidden' : 'visible';
    }
    if (menuSlideNextBtn) {
      menuSlideNextBtn.style.visibility = currentMenuSlide === menuSlides.length - 1 ? 'hidden' : 'visible';
    }
  }

  if (menuSlidePrevBtn) {
    menuSlidePrevBtn.addEventListener('click', () => {
      if (currentMenuSlide > 0) {
        updateMenuSlide(currentMenuSlide - 1);
      }
    });
  }

  if (menuSlideNextBtn) {
    menuSlideNextBtn.addEventListener('click', () => {
      if (currentMenuSlide < menuSlides.length - 1) {
        updateMenuSlide(currentMenuSlide + 1);
      }
    });
  }

  // Inisialisasi slide pertama
  updateMenuSlide(0);

  console.log('[Mat SMA - Expo City] MenuController siap.');
});
