/**
 * ==============================================================================
 * MAT SMA / EXPO CITY - MISSION LEVEL CONTROLLER (controllers/MissionLevelController.js)
 * ==============================================================================
 * Mengontrol alur Misi Utama:
 * - District 1: Eco Dome (Persis sesuai instruksi Dokumen Konsep Skripsi 13 Halaman)
 *   7 Halaman Soal Berjenjang + Halaman 8 (Rekaman Jawaban Siswa).
 * - District 2: Expo Central Control Lab
 * - Navigasi Panah Floating:
 *   - Halaman 1: Tanpa panah kiri. Panah kanan mati (disabled) sampai terverifikasi benar.
 *   - Halaman 2 s.d 6: Ada panah kiri & kanan. Panah kanan mati sampai terverifikasi benar.
 *   - Halaman 7 (terakhir): Ada panah kiri. Tidak ada panah kanan ke level berikutnya.
 *   - Halaman 8 (Rekaman): Tanpa panah floating sama sekali. Kembali lewat tombol bawah.
 * - Khusus Admin Cripci: Bebas buka Mode Soal & Lihat Rekaman kapan saja tanpa teks liar.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const user = userModel.getUser();

  // 1. Verifikasi Autentikasi
  if (!user || !user.isLoggedIn) {
    window.location.href = 'index.html';
    return;
  }

  const levelNum = window.CURRENT_LEVEL || 1;
  const isAdmin = !!(user.isAdmin || user.isSpecialAdmin);

  // 2. Verifikasi Izin Akses Misi Utama
  if (!userModel.isMissionUnlocked()) {
    alert('Akses Ditolak: Anda wajib menuntaskan evaluasi "Persiapan Misi" terlebih dahulu!');
    window.location.href = 'menu.html';
    return;
  }

  // 3. Verifikasi Izin Akses District Ini
  if (!userModel.canAccessMissionLevel(levelNum)) {
    alert(`District ${levelNum} Terkunci: Tuntaskan District sebelumnya terlebih dahulu!`);
    window.location.href = 'misi.html';
    return;
  }

  const district = missionModel.getLevel(levelNum);
  const isDistrictCompleted = userModel.isMissionLevelCompleted(levelNum);

  // DOM Elements
  const challengeView = document.getElementById('challengeView');
  const reviewView = document.getElementById('reviewView');
  const stageContentPanel = document.getElementById('stageContentPanel');
  const reviewStagesList = document.getElementById('reviewStagesList');
  const reviewClosingArea = document.getElementById('reviewClosingArea');
  const btnPrevStage = document.getElementById('btnPrevStage');
  const btnNextStage = document.getElementById('btnNextStage');
  const btnAdminViewQuestions = document.getElementById('btnAdminViewQuestions');

  // State penyimpanan jawaban
  let currentStageIndex = 0; // 0 to 6 untuk hal 1-7
  let answersMap = {};

  if (user.missionLevelAnswers && user.missionLevelAnswers[levelNum] && user.missionLevelAnswers[levelNum].answersMap) {
    answersMap = { ...user.missionLevelAnswers[levelNum].answersMap };
  }

  // Helper Robot Speech Box (Karakter Robot di Luar & Balon Percakapan di Dekat Kepala Robot)
  function createRobotCard(speechText, senderLabel = 'MASKOT ROBOT') {
    return `
      <div class="robot-speech-card">
        <div class="robot-speech-character">
          <img src="assets/images/mascot-robot.png" alt="Maskot Robot" class="mascot-robot-img" onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='block';" style="display:none;" />
          <svg class="mascot-robot-svg" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Antenna -->
            <line x1="40" y1="14" x2="40" y2="4" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
            <circle cx="40" cy="4" r="4.5" fill="#38BDF8"/>
            <circle cx="40" cy="4" r="2" fill="#FFFFFF"/>
            <!-- Head -->
            <rect x="18" y="14" width="44" height="34" rx="12" fill="#FFFFFF" stroke="#0284C7" stroke-width="2.5"/>
            <!-- Headset Ears -->
            <rect x="12" y="24" width="6" height="14" rx="3" fill="#0284C7"/>
            <rect x="62" y="24" width="6" height="14" rx="3" fill="#0284C7"/>
            <!-- Visor Screen -->
            <rect x="23" y="19" width="34" height="23" rx="7" fill="#0F172A"/>
            <!-- Eyes -->
            <ellipse cx="32" cy="30" rx="4" ry="4.5" fill="#38BDF8"/>
            <circle cx="33" cy="28.5" r="1.5" fill="#FFFFFF"/>
            <ellipse cx="48" cy="30" rx="4" ry="4.5" fill="#38BDF8"/>
            <circle cx="49" cy="28.5" r="1.5" fill="#FFFFFF"/>
            <!-- Smile -->
            <path d="M36 37 Q40 40 44 37" stroke="#38BDF8" stroke-width="1.8" stroke-linecap="round" fill="none"/>
            <!-- Body -->
            <rect x="34" y="48" width="12" height="5" rx="2" fill="#94A3B8"/>
            <rect x="20" y="53" width="40" height="26" rx="9" fill="#F8FAFC" stroke="#0284C7" stroke-width="2.2"/>
            <circle cx="40" cy="65" r="5" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.5"/>
            <circle cx="40" cy="65" r="2.5" fill="#38BDF8"/>
            <rect x="9" y="56" width="10" height="16" rx="4" fill="#CBD5E1" stroke="#0284C7" stroke-width="1.5"/>
            <rect x="61" y="56" width="10" height="16" rx="4" fill="#CBD5E1" stroke="#0284C7" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="robot-speech-body">
          <div class="robot-speech-sender">${senderLabel}</div>
          <div class="robot-speech-text">${speechText}</div>
        </div>
      </div>
    `;
  }

  // Helper Notifikasi Maskot Robot (Setengah Badan di Luar, Setengah di Dalam Kotak Notif)
  function createMascotFeedbackCard(title, message, isCorrect = false, extraAction = '') {
    const badgeColor = isCorrect ? '#10B981' : '#0284C7';
    const accentColor = isCorrect ? '#34D399' : '#38BDF8';
    return `
      <div class="mascot-feedback-card ${isCorrect ? 'is-correct' : 'is-wrong'}">
        <div class="mascot-peeking-badge">
          <svg class="mascot-peeking-svg" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Antenna -->
            <line x1="37" y1="12" x2="37" y2="3" stroke="${badgeColor}" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="37" cy="3" r="3.5" fill="${accentColor}"/>
            <!-- Head -->
            <rect x="17" y="12" width="40" height="32" rx="10" fill="#FFFFFF" stroke="${badgeColor}" stroke-width="2.2"/>
            <!-- Ears -->
            <rect x="12" y="21" width="5" height="12" rx="2" fill="${badgeColor}"/>
            <rect x="57" y="21" width="5" height="12" rx="2" fill="${badgeColor}"/>
            <!-- Visor Screen -->
            <rect x="22" y="17" width="30" height="20" rx="6" fill="#0F172A"/>
            <!-- Glowing Eyes -->
            <ellipse cx="29" cy="27" rx="3.5" ry="4" fill="${accentColor}"/>
            <circle cx="30" cy="25.5" r="1.2" fill="#FFFFFF"/>
            <ellipse cx="45" cy="27" rx="3.5" ry="4" fill="${accentColor}"/>
            <circle cx="46" cy="25.5" r="1.2" fill="#FFFFFF"/>
            <!-- Smile -->
            <path d="M34 32 Q37 35 40 32" stroke="${accentColor}" stroke-width="1.6" stroke-linecap="round" fill="none"/>
            <!-- Robot Paws / Hands resting over the card border (Half inside, half outside) -->
            <rect x="19" y="42" width="11" height="8" rx="4" fill="#E2E8F0" stroke="${badgeColor}" stroke-width="1.8"/>
            <rect x="44" y="42" width="11" height="8" rx="4" fill="#E2E8F0" stroke="${badgeColor}" stroke-width="1.8"/>
          </svg>
        </div>
        <div class="mascot-feedback-content">
          ${title ? `<div class="mascot-feedback-title">${title}</div>` : ''}
          <div class="mascot-feedback-message">${message}</div>
          ${extraAction ? `<div style="margin-top: 0.85rem;">${extraAction}</div>` : ''}
        </div>
      </div>
    `;
  }

  // Menampilkan Umpan Balik / Feedback pada Setiap Tahap Misi
  function showStageFeedback(containerEl, isCorrect, correctMsg, wrongMsg, explanation = '', onNextCallback = null, stageKey = '') {
    if (!containerEl) return;

    const title = isCorrect ? 'Analisis Tepat!' : 'Analisis Belum Tepat';
    const message = isCorrect ? correctMsg : wrongMsg;

    let extraAction = '';
    if (isCorrect && onNextCallback) {
      const btnId = `btnFeedbackNext_${stageKey || Math.random().toString(36).substr(2, 9)}`;
      extraAction = `
        <button type="button" class="btn btn-primary" id="${btnId}" style="margin-top: 0.6rem; padding: 0.55rem 1.25rem; font-size: 0.9rem; font-weight: 600; border-radius: 8px; cursor: pointer;">
          Lanjut ke Tahap Berikutnya ➔
        </button>
      `;
    }

    containerEl.innerHTML = createMascotFeedbackCard(title, message, isCorrect, extraAction);
    containerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (isCorrect && onNextCallback) {
      const nextBtn = containerEl.querySelector('button[id^="btnFeedbackNext_"]');
      if (nextBtn) {
        nextBtn.addEventListener('click', onNextCallback);
      }
    }

    if (typeof updateArrows === 'function') {
      updateArrows();
    }
  }

  // ============================================================================
  // DISTRICT 1: ECO DOME (7 HALAMAN SOAL + HALAMAN 8 REKAMAN)
  // ============================================================================

  function renderDistrict1Stage(idx) {
    currentStageIndex = Math.max(0, Math.min(6, idx));
    if (challengeView) challengeView.style.display = 'block';
    if (reviewView) reviewView.style.display = 'none';

    let html = '';

    // --------------------------------------------------------------------------
    // HALAMAN 1 (Orientasi Siswa pada Masalah)
    // --------------------------------------------------------------------------
    if (currentStageIndex === 0) {
      const stageData = district.stages[0];
      const savedAns = answersMap.stage_1 || {};
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 1 // Eco Dome</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        ${createRobotCard(stageData.robotGreeting)}

        <div id="h1_step_see" style="text-align: left;">
          <button type="button" id="btnH1AyoLihat" class="btn-inline-action">
            Ayo Lihat 🔍
          </button>
        </div>

        <div id="h1_narrative_wrap" style="${savedAns.chosenKey ? 'display: block;' : 'display: none;'}">
          <div class="story-narrative-card">
            ${stageData.storyText}
          </div>

          ${createRobotCard(stageData.robotPrompt)}

          <div id="h1_step_help" style="text-align: left;">
            <button type="button" id="btnH1Bantu" class="btn-inline-action">
              Bantu 🤝
            </button>
          </div>
        </div>

        <div id="h1_question_wrap" style="${savedAns.chosenKey ? 'display: block;' : 'display: none;'}">
          <div class="pbl-phase-outside">${stageData.phaseTitle}</div>

          <div class="story-narrative-card" style="font-weight: 700; color: #0A2540;">
            ${stageData.riddle}
          </div>

          <div class="objective-list" id="h1_options">
            ${stageData.options.map(opt => `
              <div class="objective-item ${savedAns.chosenKey === opt.key ? 'selected' : ''}" data-key="${opt.key}">
                <div class="obj-indicator">${opt.key}</div>
                <div>${opt.text}</div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn-mission-action" id="btnH1Verify">
            ${isVerified ? '✓ Jawaban Terverifikasi Tepat' : 'Verifikasi Jawaban 🔓'}
          </button>

          <div id="h1_feedback" class="mission-feedback-wrap"></div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      // Event Listeners Halaman 1
      const btnSee = document.getElementById('btnH1AyoLihat');
      const narWrap = document.getElementById('h1_narrative_wrap');
      const btnHelp = document.getElementById('btnH1Bantu');
      const qWrap = document.getElementById('h1_question_wrap');
      const optItems = stageContentPanel.querySelectorAll('#h1_options .objective-item');
      const btnVerify = document.getElementById('btnH1Verify');
      const fbBox = document.getElementById('h1_feedback');

      let currentChosen = savedAns.chosenKey || null;

      if (btnSee) {
        btnSee.addEventListener('click', () => {
          if (narWrap) narWrap.style.display = 'block';
          btnSee.style.display = 'none';
        });
      }

      if (btnHelp) {
        btnHelp.addEventListener('click', () => {
          if (qWrap) qWrap.style.display = 'block';
          btnHelp.style.display = 'none';
        });
      }

      optItems.forEach(el => {
        el.addEventListener('click', () => {
          optItems.forEach(i => i.classList.remove('selected'));
          el.classList.add('selected');
          currentChosen = el.dataset.key;
        });
      });

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          if (!currentChosen && !isAdmin) {
            alert('Pilih salah satu jawaban terlebih dahulu!');
            return;
          }
          const chosen = currentChosen || stageData.correctKey;
          const isCorrect = chosen === stageData.correctKey;

          answersMap.stage_1 = {
            chosenKey: chosen,
            isCorrect: isCorrect
          };

          showStageFeedback(fbBox, isCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Masalah utama yang dihadapi adalah menentukan apakah kapasitas sistem penyerapan Eco Dome mencukupi untuk menangani populasi organisme setelah 4 jam.', () => renderDistrict1Stage(1), 'stage_1');
        });
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 2 (Mengorganisasikan Siswa untuk Belajar)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 1) {
      const stageData = district.stages[1];
      const savedAns = answersMap.stage_2 || { diketahui: [], ditanya: [] };
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 2 // Eco Dome</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        <div class="pbl-phase-outside">${stageData.phaseTitle}</div>

        ${createRobotCard(stageData.robotGreeting1)}
        ${createRobotCard(stageData.robotGreeting2)}

        <div id="h2_step_ok" style="text-align: left;">
          <button type="button" id="btnH2Oke" class="btn-inline-action">
            Oke 👍
          </button>
        </div>

        <div id="h2_body_wrap" style="${savedAns.diketahui && savedAns.diketahui.length > 0 ? 'display: block;' : 'display: none;'}">
          <div class="story-narrative-card">
            <strong style="color: #0A2540; font-size: 1.05rem;">${stageData.storyRecapTitle}</strong>
            <p style="margin-top: 0.5rem; white-space: pre-line;">${stageData.storyRecapText}</p>
          </div>

          <div style="font-weight: 700; color: #0A2540; margin-bottom: 0.75rem; font-size: 1.05rem;">
            ${stageData.instruction}
          </div>

          <div style="font-weight: 800; color: #0284C7; font-size: 1rem; margin-top: 1rem;">Diketahui:</div>
          <div class="eco-checkbox-group" id="h2_diketahui_group">
            ${stageData.diketahuiOptions.map(opt => `
              <label class="eco-checkbox-label ${(savedAns.diketahui || []).includes(opt.id) ? 'checked' : ''}">
                <input type="checkbox" name="h2_diketahui" value="${opt.id}" ${(savedAns.diketahui || []).includes(opt.id) ? 'checked' : ''}>
                <span>${opt.text}</span>
              </label>
            `).join('')}
          </div>

          <div style="font-weight: 800; color: #0284C7; font-size: 1rem; margin-top: 1rem;">Ditanyakan:</div>
          <div class="eco-checkbox-group" id="h2_ditanya_group">
            ${stageData.ditanyaOptions.map(opt => `
              <label class="eco-checkbox-label ${(savedAns.ditanya || []).includes(opt.id) ? 'checked' : ''}">
                <input type="checkbox" name="h2_ditanya" value="${opt.id}" ${(savedAns.ditanya || []).includes(opt.id) ? 'checked' : ''}>
                <span>${opt.text}</span>
              </label>
            `).join('')}
          </div>

          <button type="button" class="btn-mission-action" id="btnH2Verify">
            ${isVerified ? '✓ Jawaban Terverifikasi Tepat' : 'Verifikasi Jawaban 🔓'}
          </button>

          <div id="h2_feedback" class="mission-feedback-wrap"></div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      const btnOke = document.getElementById('btnH2Oke');
      const bodyWrap = document.getElementById('h2_body_wrap');
      const btnVerify = document.getElementById('btnH2Verify');
      const fbBox = document.getElementById('h2_feedback');

      if (btnOke) {
        btnOke.addEventListener('click', () => {
          if (bodyWrap) bodyWrap.style.display = 'block';
          btnOke.style.display = 'none';
        });
      }

      stageContentPanel.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
          cb.closest('label').classList.toggle('checked', cb.checked);
        });
      });

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          const selectedD = Array.from(stageContentPanel.querySelectorAll('input[name="h2_diketahui"]:checked')).map(el => el.value);
          const selectedT = Array.from(stageContentPanel.querySelectorAll('input[name="h2_ditanya"]:checked')).map(el => el.value);

          if (selectedD.length === 0 && selectedT.length === 0 && !isAdmin) {
            alert('Pilih jawaban Diketahui dan Ditanyakan terlebih dahulu!');
            return;
          }

          // Kunci Benar: Diketahui d2, d3, d5, d7 | Ditanya t1
          const dCorrectKeys = ['d2', 'd3', 'd5', 'd7'];
          const tCorrectKeys = ['t1'];

          const isDMatch = dCorrectKeys.length === selectedD.length && dCorrectKeys.every(k => selectedD.includes(k));
          const isTMatch = tCorrectKeys.length === selectedT.length && tCorrectKeys.every(k => selectedT.includes(k));
          const isAllCorrect = isDMatch && isTMatch;

          answersMap.stage_2 = {
            diketahui: selectedD,
            ditanya: selectedT,
            isCorrect: isAllCorrect
          };

          showStageFeedback(fbBox, isAllCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Informasi yang diketahui meliputi populasi awal (240 organisme), laju pembelahan (2 kali lipat setiap 60 menit), lama penanganan (4 jam), dan kapasitas penyerapan maksimum (4.000 organisme). Hal yang ditanyakan adalah apakah populasi akhir melebihi kapasitas.', () => renderDistrict1Stage(2), 'stage_2');
        });
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 3 (Membimbing Penyelidikan - Bagian 1 & Time Scanner)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 2) {
      const stageData = district.stages[2];
      const savedAns = answersMap.stage_3 || {};
      const isVerified = (savedAns.isCorrectPart1 && savedAns.isCorrectPart2) || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 3 // Eco Dome</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        <div class="pbl-phase-outside">${stageData.phaseTitle}</div>

        ${createRobotCard(stageData.robotPromptPart1)}

        <div class="objective-list" id="h3_options_p1">
          ${stageData.optionsPart1.map(opt => `
            <div class="objective-item ${savedAns.chosenKeyPart1 === opt.key ? 'selected' : ''}" data-key="${opt.key}">
              <div class="obj-indicator">${opt.key}</div>
              <div>${opt.text}</div>
            </div>
          `).join('')}
        </div>

        <button type="button" class="btn-mission-action" id="btnH3VerifyP1">
          Verifikasi Langkah Awal 🔓
        </button>

        <div id="h3_feedback_p1" class="mission-feedback-wrap"></div>

        <div id="h3_scanner_wrap" style="${savedAns.chosenKeyPart1 ? 'display: block;' : 'display: none;'} margin-top: 1.75rem;">
          ${createRobotCard(stageData.robotPromptPart2, 'TIME SCANNER // SIKLUS')}

          <div style="margin-top: 0.75rem;">
            <input type="text" id="h3_scanner_input" class="short-essay-input" placeholder="Tuliskan selang waktu (contoh: 4 jam / 240 menit)..." value="${savedAns.answerPart2 || ''}">
          </div>

          <button type="button" class="btn-mission-action" id="btnH3VerifyP2">
            ${isVerified ? '✓ Jawaban Terverifikasi Tepat' : 'Verifikasi Selang Waktu 🔓'}
          </button>

          <div id="h3_feedback_p2" class="mission-feedback-wrap"></div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      const optItems = stageContentPanel.querySelectorAll('#h3_options_p1 .objective-item');
      const btnVerifyP1 = document.getElementById('btnH3VerifyP1');
      const fbBoxP1 = document.getElementById('h3_feedback_p1');
      const scannerWrap = document.getElementById('h3_scanner_wrap');
      const scannerInput = document.getElementById('h3_scanner_input');
      const btnVerifyP2 = document.getElementById('btnH3VerifyP2');
      const fbBoxP2 = document.getElementById('h3_feedback_p2');

      let chosenP1 = savedAns.chosenKeyPart1 || null;

      optItems.forEach(el => {
        el.addEventListener('click', () => {
          optItems.forEach(i => i.classList.remove('selected'));
          el.classList.add('selected');
          chosenP1 = el.dataset.key;
        });
      });

      if (btnVerifyP1) {
        btnVerifyP1.addEventListener('click', () => {
          if (!chosenP1 && !isAdmin) {
            alert('Pilih salah satu langkah terlebih dahulu!');
            return;
          }
          const chosen = chosenP1 || stageData.correctKeyPart1;
          const isCorrect = chosen === stageData.correctKeyPart1;

          if (!answersMap.stage_3) answersMap.stage_3 = {};
          answersMap.stage_3.chosenKeyPart1 = chosen;
          answersMap.stage_3.isCorrectPart1 = isCorrect;

          if (isCorrect && scannerWrap) {
            scannerWrap.style.display = 'block';
            scannerWrap.scrollIntoView({ behavior: 'smooth' });
          }

          showStageFeedback(fbBoxP1, isCorrect, stageData.feedbackCorrectPart1, stageData.feedbackWrongPart1, 'Sebelum menghitung banyaknya organisme, langkah pertama yang harus dilakukan adalah menentukan banyaknya selang waktu pembelahan.', () => {
            if (scannerWrap) {
              scannerWrap.style.display = 'block';
              scannerWrap.scrollIntoView({ behavior: 'smooth' });
            }
          }, 'stage_3_p1');
        });
      }

      if (btnVerifyP2) {
        btnVerifyP2.addEventListener('click', () => {
          const val = (scannerInput.value || '').trim();
          if (!val && !isAdmin) {
            alert('Tuliskan selang waktu terlebih dahulu!');
            return;
          }

          const isCorrect = stageData.correctAnswersPart2.some(ans => val.toLowerCase().includes(ans.toLowerCase()));
          if (!answersMap.stage_3) answersMap.stage_3 = {};
          answersMap.stage_3.answerPart2 = val || stageData.correctAnswersPart2[0];
          answersMap.stage_3.isCorrectPart2 = isCorrect;

          showStageFeedback(fbBoxP2, isCorrect, stageData.feedbackCorrectPart2, stageData.feedbackWrongPart2, 'Waktu pengamatan berlangsung dari pukul 08.00 hingga 12.00, yaitu selama 4 jam atau 240 menit.', () => renderDistrict1Stage(3), 'stage_3_p2');
        });
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 4 (Menentukan Model Matematika)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 3) {
      const stageData = district.stages[3];
      const savedAns = answersMap.stage_4 || {};
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 4 // Eco Dome</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        <div style="background: rgba(10, 37, 64, 0.65); border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
          <div style="font-weight: 700; color: #00F0FF; margin-bottom: 0.5rem;">${stageData.instruction}</div>
          <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.95rem; color: #E2E8F0;">
            ${stageData.knownInfo.map(info => `<div>${info}</div>`).join('')}
          </div>
        </div>

        ${createRobotCard(stageData.riddle)}

        <div class="objective-list" id="h4_options">
          ${stageData.options.map(opt => `
            <div class="objective-item ${savedAns.chosenKey === opt.key ? 'selected' : ''}" data-key="${opt.key}">
              <div class="obj-indicator">${opt.key}</div>
              <div>${opt.text}</div>
            </div>
          `).join('')}
        </div>

        <button type="button" class="btn-mission-action" id="btnH4Verify">
          ${isVerified ? '✓ Jawaban Terverifikasi Tepat' : 'Verifikasi Model Matematika 🔓'}
        </button>

        <div id="h4_feedback" class="mission-feedback-wrap"></div>
      `;

      stageContentPanel.innerHTML = html;

      const optItems = stageContentPanel.querySelectorAll('#h4_options .objective-item');
      const btnVerify = document.getElementById('btnH4Verify');
      const fbBox = document.getElementById('h4_feedback');

      let currentChosen = savedAns.chosenKey || null;

      optItems.forEach(el => {
        el.addEventListener('click', () => {
          optItems.forEach(i => i.classList.remove('selected'));
          el.classList.add('selected');
          currentChosen = el.dataset.key;
        });
      });

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          if (!currentChosen && !isAdmin) {
            alert('Pilih salah satu model matematika terlebih dahulu!');
            return;
          }

          const chosen = currentChosen || stageData.correctKey;
          const isCorrect = chosen === stageData.correctKey;

          answersMap.stage_4 = {
            chosenKey: chosen,
            isCorrect: isCorrect
          };

          showStageFeedback(fbBox, isCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Model matematika yang tepat adalah 2 × 3⁴ karena jumlah awal 2 organisme membelah menjadi 3 kali lipat sebanyak 4 kali siklus.', () => renderDistrict1Stage(4), 'stage_4');
        });
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 5 (Menghitung Jumlah Organisme Setelah Pembelahan)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 4) {
      const stageData = district.stages[4];
      const savedAns = answersMap.stage_5 || {};
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 5 // Eco Dome</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        ${createRobotCard(stageData.robotPrompt)}

        <div style="margin: 1.5rem 0;">
          <input type="number" id="h5_calc_input" class="short-essay-input" placeholder="Tuliskan hasil perhitungan (contoh: 162)..." value="${savedAns.answer || ''}">
        </div>

        <button type="button" class="btn-mission-action" id="btnH5Verify">
          ${isVerified ? '✓ Jawaban Terverifikasi Tepat' : 'Verifikasi Hasil Perhitungan 🔓'}
        </button>

        <div id="h5_feedback" class="mission-feedback-wrap"></div>
      `;

      stageContentPanel.innerHTML = html;

      const calcInput = document.getElementById('h5_calc_input');
      const btnVerify = document.getElementById('btnH5Verify');
      const fbBox = document.getElementById('h5_feedback');

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          const val = (calcInput.value || '').trim();
          if (!val && !isAdmin) {
            alert('Masukkan hasil perhitungan terlebih dahulu!');
            return;
          }

          const isCorrect = val === stageData.correctAnswer;
          answersMap.stage_5 = {
            answer: val || stageData.correctAnswer,
            isCorrect: isCorrect
          };

          showStageFeedback(fbBox, isCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Perhitungan populasi akhir: 240 × 2⁴ = 240 × 16 = 3.840 organisme.', () => renderDistrict1Stage(5), 'stage_5');
        });
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 6 (Menghitung Organisme yang Tersisa)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 5) {
      const stageData = district.stages[5];
      const savedAns = answersMap.stage_6 || {};
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 6 // Eco Dome</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        ${createRobotCard(stageData.robotPromptPart1)}

        <div id="h6_step1_wrap">
          <input type="text" id="h6_essay_input" class="short-essay-input" placeholder="Tuliskan cara yang perlu dilakukan..." value="${savedAns.essayPart1 || ''}">
          <button type="button" id="btnH6NextPart" class="btn-inline-action">
            Lanjut ⏩
          </button>
        </div>

        <div id="h6_step2_wrap" style="${savedAns.denominator ? 'display: block;' : 'display: none;'} margin-top: 1.5rem;">
          <div class="story-narrative-card" style="font-weight: 700; color: #0A2540;">
            ${stageData.instructionPart2}
          </div>

          <div style="text-align: center; margin: 1.5rem 0;">
            <div class="fraction-calc-box">
              <div class="fraction-vertical">
                <div class="fraction-num">162</div>
                <div class="fraction-den">
                  <input type="number" id="h6_den_input" class="fraction-input-small" placeholder="..." value="${savedAns.denominator || ''}">
                </div>
              </div>
              <div>=</div>
              <div>
                <input type="number" id="h6_res_input" class="fraction-input-small" style="width: 80px;" placeholder="..." value="${savedAns.result || ''}">
              </div>
            </div>
          </div>

          <button type="button" class="btn-mission-action" id="btnH6Verify">
            ${isVerified ? '✓ Jawaban Terverifikasi Tepat' : 'Verifikasi Jawaban 🔓'}
          </button>

          <div id="h6_feedback" class="mission-feedback-wrap"></div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      const btnStep1 = document.getElementById('btnH6NextPart');
      const step2Wrap = document.getElementById('h6_step2_wrap');
      const denInput = document.getElementById('h6_den_input');
      const resInput = document.getElementById('h6_res_input');
      const essayInput = document.getElementById('h6_essay_input');
      const btnVerify = document.getElementById('btnH6Verify');
      const fbBox = document.getElementById('h6_feedback');

      if (btnStep1) {
        btnStep1.addEventListener('click', () => {
          if (!essayInput.value.trim() && !isAdmin) {
            alert('Tuliskan jawaban Anda terlebih dahulu!');
            return;
          }
          if (step2Wrap) step2Wrap.style.display = 'block';
          btnStep1.style.display = 'none';
        });
      }

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          const den = (denInput.value || '').trim();
          const res = (resInput.value || '').trim();

          if ((!den || !res) && !isAdmin) {
            alert('Lengkapi nilai pembagian dan hasilnya!');
            return;
          }

          const isCorrect = (den === stageData.correctDenominator && res === stageData.correctResult);

          answersMap.stage_6 = {
            essayPart1: essayInput.value.trim(),
            denominator: den || stageData.correctDenominator,
            result: res || stageData.correctResult,
            isCorrect: isCorrect
          };

          showStageFeedback(fbBox, isCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Hubungan pertidaksamaannya adalah 3.840 < 4.000 sehingga sistem penyerapan Eco Dome aman (tidak overload).', () => renderDistrict1Stage(6), 'stage_6');
        });
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 7 (Menyajikan Hasil / Laporan Akhir)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 6) {
      const stageData = district.stages[6];
      const savedAns = answersMap.stage_7 || '';

      html = `
        <div class="panel-title">
          <span>Halaman 7 // Eco Dome</span>
          <span>STATUS: TAHAP AKHIR</span>
        </div>

        <div class="pbl-phase-outside">${stageData.phaseTitle}</div>

        ${createRobotCard(stageData.robotPrompt)}

        <div style="margin: 1.5rem 0;">
          <textarea id="h7_report_input" class="long-essay-textarea" placeholder="Tuliskan kesimpulan akhir...">${savedAns || stageData.initialPrefix}</textarea>
        </div>

        <button type="button" class="btn-mission-action" id="btnH7Submit">
          Kirim Laporan & Buka Rekaman Pembahasan 📜
        </button>
      `;

      stageContentPanel.innerHTML = html;

      const reportInput = document.getElementById('h7_report_input');
      const btnSubmit = document.getElementById('btnH7Submit');

      // Pastikan awalan selalu "Jadi " jika baru mulai
      if (!reportInput.value.trim()) {
        reportInput.value = stageData.initialPrefix;
      }

      if (btnSubmit) {
        btnSubmit.addEventListener('click', () => {
          const val = reportInput.value.trim();
          if (val.length < 5 && !isAdmin) {
            alert('Tuliskan kesimpulan akhir Anda terlebih dahulu!');
            return;
          }

          answersMap.stage_7 = val;

          // Selesaikan Misi District 1
          missionModel.completeDistrict(1, answersMap);

          // Pindah ke Halaman 8 (Rekaman)
          showDistrict1ReviewView();
        });
      }
    }

    // Khusus Admin Cripci: Kemudahan beralih kembali ke Rekaman saat melihat Mode Soal
    if (isAdmin && isDistrictCompleted && stageContentPanel) {
      const adminDiv = document.createElement('div');
      adminDiv.style.cssText = 'text-align: center; margin-top: 1.5rem;';
      adminDiv.innerHTML = `
        <button type="button" id="btnAdminReturnToReview1" class="btn-yellow-glow">
          Lihat Rekaman
        </button>
      `;
      stageContentPanel.appendChild(adminDiv);
      const btnAdminReturn = document.getElementById('btnAdminReturnToReview1');
      if (btnAdminReturn) {
        btnAdminReturn.onclick = () => showDistrict1ReviewView();
      }
    }

    updateArrows(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================================================================
  // HALAMAN 8: REKAMAN JAWABAN SISWA (MENGANALISIS DAN MENGEVALUASI)
  // ============================================================================
  function showDistrict1ReviewView() {
    if (challengeView) challengeView.style.display = 'none';
    if (reviewView) reviewView.style.display = 'block';

    // Di halaman rekaman, panah floating TIDAK ADA sama sekali
    if (btnPrevStage) btnPrevStage.style.display = 'none';
    if (btnNextStage) btnNextStage.style.display = 'none';

    const revData = district.reviewEvaluation;
    if (!revData) return;

    // Helper teks jawaban siswa per nomor
    function getStudentAnswerText(itemNum) {
      if (itemNum === 1) {
        const key = (answersMap.stage_1 && answersMap.stage_1.chosenKey) || 'B';
        const opt = district.stages[0].options.find(o => o.key === key);
        return `Opsi ${key}: ${opt ? opt.text : ''}`;
      }
      if (itemNum === 2) {
        const dIds = (answersMap.stage_2 && answersMap.stage_2.diketahui) || ['d2', 'd3', 'd5', 'd7'];
        const dTexts = district.stages[1].diketahuiOptions.filter(o => dIds.includes(o.id)).map(o => `• ${o.text}`).join('<br>');
        return dTexts || 'Tidak ada pilihan dicentang.';
      }
      if (itemNum === 3) {
        const tIds = (answersMap.stage_2 && answersMap.stage_2.ditanya) || ['t1'];
        const tTexts = district.stages[1].ditanyaOptions.filter(o => tIds.includes(o.id)).map(o => `• ${o.text}`).join('<br>');
        return tTexts || 'Tidak ada pilihan dicentang.';
      }
      if (itemNum === 4) {
        return (answersMap.stage_3 && answersMap.stage_3.answerPart2) || '4 jam';
      }
      if (itemNum === 5) {
        const key = (answersMap.stage_4 && answersMap.stage_4.chosenKey) || 'B';
        const opt = district.stages[3].options.find(o => o.key === key);
        return `Opsi ${key}: ${opt ? opt.text : ''}`;
      }
      if (itemNum === 6) {
        return (answersMap.stage_5 && answersMap.stage_5.answer) || '162 organisme';
      }
      if (itemNum === 7) {
        const den = (answersMap.stage_6 && answersMap.stage_6.denominator) || '2';
        const res = (answersMap.stage_6 && answersMap.stage_6.result) || '81';
        return `162 / ${den} = ${res} organisme`;
      }
      return '-';
    }

    function isItemCorrect(itemNum) {
      if (itemNum === 1) return (answersMap.stage_1 && answersMap.stage_1.isCorrect) ?? true;
      if (itemNum === 2 || itemNum === 3) return (answersMap.stage_2 && answersMap.stage_2.isCorrect) ?? true;
      if (itemNum === 4) return (answersMap.stage_3 && answersMap.stage_3.isCorrectPart2) ?? true;
      if (itemNum === 5) return (answersMap.stage_4 && answersMap.stage_4.isCorrect) ?? true;
      if (itemNum === 6) return (answersMap.stage_5 && answersMap.stage_5.isCorrect) ?? true;
      if (itemNum === 7) return (answersMap.stage_6 && answersMap.stage_6.isCorrect) ?? true;
      return true;
    }

    let reviewHtml = `
      <div class="pbl-phase-outside">${revData.phaseTitle}</div>
      ${createRobotCard(revData.robotPrompt)}
    `;

    revData.items.forEach(item => {
      const correct = isItemCorrect(item.num);
      const studentAns = getStudentAnswerText(item.num);
      const feedbackText = correct ? item.feedbackCorrect : item.feedbackWrong;

      reviewHtml += `
        <div style="background: #F8FAFC; border: 1.5px solid ${correct ? '#BAE6FD' : '#FECDD3'}; border-radius: 12px; padding: 1.5rem; text-align: left; margin-bottom: 1.25rem;">
          <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: #0A2540; margin-bottom: 0.65rem;">
            ${item.title}
          </div>

          <div style="font-size: 0.95rem; color: #475569; margin-bottom: 0.75rem; line-height: 1.5;">
            <strong style="color: #0F172A;">Soal yang Kamu Kerjakan:</strong><br>
            ${item.question}
          </div>

          <div style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.85rem; font-size: 0.95rem;">
            <strong style="color: #0F172A;">Jawaban awalmu:</strong><br>
            <div style="margin-top: 0.25rem; color: #0284C7; font-weight: 700;">${studentAns}</div>
          </div>

          <div style="font-weight: 800; font-size: 0.88rem; margin-bottom: 0.4rem; color: #475569;">Verifikasi Jawaban:</div>
          <div style="background: ${correct ? '#ECFDF5' : '#FFF1F2'}; border-left: 4px solid ${correct ? '#10B981' : '#F43F5E'}; padding: 0.85rem 1rem; border-radius: 6px; font-size: 0.92rem; line-height: 1.6; color: ${correct ? '#065F46' : '#9F1239'};">
            <div style="font-weight: 800; font-size: 1rem; margin-bottom: 0.35rem;">
              ${correct ? '✅ Jawabanmu benar!' : '❌ Jawabanmu belum tepat.'}
            </div>
            <div style="white-space: pre-line;">${feedbackText}</div>
          </div>
        </div>
      `;
    });

    if (reviewStagesList) {
      reviewStagesList.innerHTML = reviewHtml;
    }

    if (reviewClosingArea) {
      reviewClosingArea.innerHTML = createRobotCard(revData.closingText);
    }

    if (isAdmin && btnAdminViewQuestions) {
      btnAdminViewQuestions.style.display = 'inline-block';
      btnAdminViewQuestions.onclick = () => renderDistrict1Stage(0);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================================================================
  // DISTRICT 2: EXPO CENTRAL CONTROL LAB (9 HALAMAN SOAL + HALAMAN 10 REKAMAN)
  // ============================================================================

  function renderDistrict2Stage(idx) {
    currentStageIndex = Math.max(0, Math.min(8, idx));
    if (challengeView) challengeView.style.display = 'block';
    if (reviewView) reviewView.style.display = 'none';

    let html = '';

    // --------------------------------------------------------------------------
    // HALAMAN 1 (Orientasi Siswa pada Masalah)
    // --------------------------------------------------------------------------
    if (currentStageIndex === 0) {
      const stageData = district.stages[0];
      const savedAns = answersMap.stage_1 || {};
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 1 // Expo Central Control Lab</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        ${createRobotCard(stageData.robotGreeting)}

        <div style="margin: 1.25rem 0;" id="d2_h1_part1_action">
          <button type="button" class="btn-yellow-glow" id="btnD2H1AyoLihat">
            Ayo Lihat →
          </button>
        </div>

        <div id="d2_h1_part2" style="${isVerified ? 'display: block;' : 'display: none;'}">
          <div class="level-scenario-card" style="margin: 1.25rem 0; white-space: pre-line;">
            ${stageData.storyText}
          </div>

          ${createRobotCard(stageData.robotPrompt)}

          <div style="margin: 1.25rem 0;" id="d2_h1_part2_action">
            <button type="button" class="btn-yellow-glow" id="btnD2H1Bantu">
              Bantu 🛡️
            </button>
          </div>
        </div>

        <div id="d2_h1_part3" style="${isVerified ? 'display: block;' : 'display: none;'}">
          <div class="pbl-phase-outside">${stageData.phaseTitle}</div>

          <div style="background: #F8FAFC; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem;">
            <div style="font-weight: 700; color: #0F172A; font-size: 1.05rem; margin-bottom: 1rem; line-height: 1.5;">
              ${stageData.riddle}
            </div>

            <div class="objective-list" id="d2_h1_options_list">
              ${stageData.options.map(opt => `
                <div class="objective-item ${(savedAns.chosenKey === opt.key) ? 'selected' : ''}" data-key="${opt.key}">
                  <div class="objective-marker">${opt.key}</div>
                  <div class="objective-text">${opt.text}</div>
                </div>
              `).join('')}
            </div>

            <button type="button" class="btn-mission-action" id="btnD2H1Verify" style="margin-top: 1rem;">
              Verifikasi Jawaban 🔓
            </button>

            <div id="d2_h1_feedback" class="mission-feedback-wrap">
              ${isVerified ? `
                <div style="background: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 1.25rem; text-align: left; margin-top: 1.25rem;">
                  <div style="font-weight: 800; color: #047857; font-size: 1.05rem; margin-bottom: 0.35rem;">
                    ${stageData.feedbackCorrect}
                  </div>
                  <button type="button" id="btnD2H1NextInline" class="btn-yellow-glow" style="font-size: 0.9rem; padding: 0.5rem 1.4rem; margin-top: 0.75rem;">
                    Lanjut ke Halaman 2 →
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      // Event bindings H1
      const btnAyo = document.getElementById('btnD2H1AyoLihat');
      const part2 = document.getElementById('d2_h1_part2');
      const btnBantu = document.getElementById('btnD2H1Bantu');
      const part3 = document.getElementById('d2_h1_part3');
      const optItems = document.querySelectorAll('#d2_h1_options_list .objective-item');
      const btnVerify = document.getElementById('btnD2H1Verify');
      const fbBox = document.getElementById('d2_h1_feedback');

      if (btnAyo && part2) {
        btnAyo.addEventListener('click', () => {
          part2.style.display = 'block';
          btnAyo.parentElement.style.display = 'none';
        });
      }

      if (btnBantu && part3) {
        btnBantu.addEventListener('click', () => {
          part3.style.display = 'block';
          btnBantu.parentElement.style.display = 'none';
        });
      }

      let selectedKey = savedAns.chosenKey || null;
      optItems.forEach(item => {
        item.addEventListener('click', () => {
          optItems.forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
          selectedKey = item.dataset.key;
        });
      });

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          if (!selectedKey && !isAdmin) {
            alert('Pilih salah satu jawaban terlebih dahulu!');
            return;
          }
          const chosen = selectedKey || stageData.correctKey;
          const isCorrect = (chosen === stageData.correctKey);

          answersMap.stage_1 = {
            chosenKey: chosen,
            isCorrect: isCorrect
          };

          showStageFeedback(fbBox, isCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Masalah utama dalam misi ini adalah menentukan apakah kecepatan percobaan program sudah berada dalam batas aman setelah protokol penanganan bekerja selama 40 menit.', () => renderDistrict2Stage(1), 'stage_1');
        });
      }

      const btnNextExisting = document.getElementById('btnD2H1NextInline');
      if (btnNextExisting) {
        btnNextExisting.addEventListener('click', () => renderDistrict2Stage(1));
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 2 (Mengorganisasikan Siswa untuk Belajar)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 1) {
      const stageData = district.stages[1];
      const savedAns = answersMap.stage_2 || {};
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 2 // Expo Central Control Lab</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        <div class="pbl-phase-outside">${stageData.phaseTitle}</div>

        ${createRobotCard(stageData.robotPromptGroup)}
        ${createRobotCard(stageData.robotPromptCollect)}

        <div style="margin: 1.25rem 0;" id="d2_h2_action_oke">
          <button type="button" class="btn-yellow-glow" id="btnD2H2Oke">Oke →</button>
        </div>

        <div id="d2_h2_content" style="${isVerified ? 'display: block;' : 'display: none;'}">
          <div class="level-scenario-card" style="margin: 1.25rem 0;">
            <div style="font-weight: 800; color: #0284C7; font-size: 1.05rem; margin-bottom: 0.5rem;">
              ${stageData.recapTitle}
            </div>
            <div style="white-space: pre-line; line-height: 1.6;">
              ${stageData.recapText}
            </div>
          </div>

          <div style="font-weight: 700; color: #0F172A; margin: 1.25rem 0 0.5rem; font-size: 1rem;">
            ${stageData.instruction}
          </div>

          <div style="margin-top: 1rem;">
            <div style="font-weight: 800; font-size: 0.95rem; color: #0284C7; margin-bottom: 0.5rem;">
              Diketahui:
            </div>
            <div class="eco-checkbox-group">
              ${stageData.diketahuiOptions.map(opt => `
                <label class="eco-checkbox-label">
                  <input type="checkbox" name="d2_diketahui" value="${opt.id}" ${(savedAns.diketahui && savedAns.diketahui.includes(opt.id)) ? 'checked' : ''}>
                  <span>${opt.text}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div style="margin-top: 1.25rem;">
            <div style="font-weight: 800; font-size: 0.95rem; color: #0284C7; margin-bottom: 0.5rem;">
              Ditanya:
            </div>
            <div class="eco-checkbox-group">
              ${stageData.ditanyaOptions.map(opt => `
                <label class="eco-checkbox-label">
                  <input type="checkbox" name="d2_ditanya" value="${opt.id}" ${(savedAns.ditanya && savedAns.ditanya.includes(opt.id)) ? 'checked' : ''}>
                  <span>${opt.text}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <button type="button" class="btn-mission-action" id="btnD2H2Verify" style="margin-top: 1.5rem;">
            Verifikasi Identifikasi Masalah 🔓
          </button>

          <div id="d2_h2_feedback" class="mission-feedback-wrap">
            ${isVerified ? `
              <div style="background: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 1.25rem; text-align: left; margin-top: 1.25rem;">
                <div style="font-weight: 800; color: #047857; font-size: 1.05rem; margin-bottom: 0.35rem; white-space: pre-line;">
                  ${stageData.feedbackCorrect}
                </div>
                <button type="button" id="btnD2H2NextInline" class="btn-yellow-glow" style="font-size: 0.9rem; padding: 0.5rem 1.4rem; margin-top: 0.75rem;">
                  Susun Strategi →
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      const btnOke = document.getElementById('btnD2H2Oke');
      const contentBox = document.getElementById('d2_h2_content');
      const btnVerify = document.getElementById('btnD2H2Verify');
      const fbBox = document.getElementById('d2_h2_feedback');

      if (btnOke && contentBox) {
        btnOke.addEventListener('click', () => {
          contentBox.style.display = 'block';
          btnOke.parentElement.style.display = 'none';
        });
      }

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          const checkedD = Array.from(document.querySelectorAll('input[name="d2_diketahui"]:checked')).map(el => el.value);
          const checkedT = Array.from(document.querySelectorAll('input[name="d2_ditanya"]:checked')).map(el => el.value);

          if (checkedD.length === 0 && checkedT.length === 0 && !isAdmin) {
            alert('Pilih informasi yang diketahui dan hal yang ditanyakan terlebih dahulu!');
            return;
          }

          const correctD = ['d1', 'd3', 'd4', 'd5'];
          const correctT = ['t2'];

          const isDMatch = correctD.length === checkedD.length && correctD.every(id => checkedD.includes(id));
          const isTMatch = correctT.length === checkedT.length && correctT.every(id => checkedT.includes(id));
          const isCorrect = isDMatch && isTMatch;

          answersMap.stage_2 = {
            diketahui: checkedD,
            ditanya: checkedT,
            isCorrect: isCorrect
          };

          showStageFeedback(fbBox, isCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Informasi yang diketahui: kecepatan awal 1.250 percobaan/10 menit, berkurang 20% dari kecepatan yang tersisa tiap 10 menit, durasi 40 menit, dan batas maksimum kecepatan 600 percobaan/10 menit. Ditanyakan: apakah kecepatan akhir melebihi batas aman.', () => renderDistrict2Stage(2), 'stage_2');
        });
      }

      const btnNextExisting = document.getElementById('btnD2H2NextInline');
      if (btnNextExisting) {
        btnNextExisting.addEventListener('click', () => renderDistrict2Stage(2));
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 3 (Membimbing Penyelidikan)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 2) {
      const stageData = district.stages[2];
      const savedAns = answersMap.stage_3 || {};
      const isPart1Verified = savedAns.isCorrectPart1 || (isDistrictCompleted && !isAdmin);
      const isPart2Verified = savedAns.isCorrectPart2 || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 3 // Expo Central Control Lab</span>
          <span>${isPart2Verified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        <div class="pbl-phase-outside">${stageData.phaseTitle}</div>

        ${createRobotCard(stageData.robotPromptPart1)}

        <div style="background: #F8FAFC; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 1.25rem; margin: 1.25rem 0;">
          <div class="objective-list" id="d2_h3_p1_options">
            ${stageData.optionsPart1.map(opt => `
              <div class="objective-item ${(savedAns.chosenKeyPart1 === opt.key) ? 'selected' : ''}" data-key="${opt.key}">
                <div class="objective-marker">${opt.key}</div>
                <div class="objective-text">${opt.text}</div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn-mission-action" id="btnD2H3VerifyP1" style="margin-top: 1rem;">
            Verifikasi Langkah Awal 🔓
          </button>

          <div id="d2_h3_fb1" class="mission-feedback-wrap">
            ${isPart1Verified ? `
              <div style="background: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 1.25rem; text-align: left; margin-top: 1.25rem;">
                <div style="font-weight: 800; color: #047857; font-size: 1.05rem; margin-bottom: 0.35rem; white-space: pre-line;">
                  ${stageData.feedbackCorrectPart1}
                </div>
                <button type="button" id="btnD2H3Mulai" class="btn-yellow-glow" style="font-size: 0.9rem; padding: 0.5rem 1.4rem; margin-top: 0.75rem;">
                  Mulai ⏱️
                </button>
              </div>
            ` : ''}
          </div>
        </div>

        <div id="d2_h3_part2" style="${isPart1Verified ? 'display: block;' : 'display: none;'}">
          ${createRobotCard(stageData.robotPromptPart2)}

          <div style="background: #F8FAFC; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 1.25rem; margin: 1.25rem 0;">
            <div style="font-weight: 700; color: #0F172A; font-size: 0.95rem; margin-bottom: 0.75rem;">
              Banyaknya siklus pengurangan kecepatan:
            </div>
            <input type="text" id="d2_h3_scanner_input" class="short-essay-input" placeholder="Tuliskan jawaban Anda (misal: 4)..." value="${savedAns.answerPart2 || ''}">

            <button type="button" class="btn-mission-action" id="btnD2H3VerifyP2" style="margin-top: 1rem;">
              Verifikasi Siklus Penanganan 🔓
            </button>

            <div id="d2_h3_fb2" class="mission-feedback-wrap">
              ${isPart2Verified ? `
                <div style="background: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 1.25rem; text-align: left; margin-top: 1.25rem;">
                  <div style="font-weight: 800; color: #047857; font-size: 1.05rem; margin-bottom: 0.35rem;">
                    ${stageData.feedbackCorrectPart2}
                  </div>
                  <button type="button" id="btnD2H3NextInline" class="btn-yellow-glow" style="font-size: 0.9rem; padding: 0.5rem 1.4rem; margin-top: 0.75rem;">
                    Lanjut ke Halaman 4 →
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      // Part 1 bindings
      const p1Items = document.querySelectorAll('#d2_h3_p1_options .objective-item');
      const btnVerifyP1 = document.getElementById('btnD2H3VerifyP1');
      const fb1 = document.getElementById('d2_h3_fb1');
      const part2Box = document.getElementById('d2_h3_part2');

      let selectedP1 = savedAns.chosenKeyPart1 || null;
      p1Items.forEach(item => {
        item.addEventListener('click', () => {
          p1Items.forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
          selectedP1 = item.dataset.key;
        });
      });

      if (btnVerifyP1) {
        btnVerifyP1.addEventListener('click', () => {
          if (!selectedP1 && !isAdmin) {
            alert('Pilih salah satu langkah awal terlebih dahulu!');
            return;
          }
          const chosen = selectedP1 || stageData.correctKeyPart1;
          const isCorrect = (chosen === stageData.correctKeyPart1);

          if (!answersMap.stage_3) answersMap.stage_3 = {};
          answersMap.stage_3.chosenKeyPart1 = chosen;
          answersMap.stage_3.isCorrectPart1 = isCorrect;

          if (isCorrect && part2Box) {
            part2Box.style.display = 'block';
            part2Box.scrollIntoView({ behavior: 'smooth' });
          }

          showStageFeedback(fb1, isCorrect, stageData.feedbackCorrectPart1, stageData.feedbackWrongPart1, '', () => {
            if (part2Box) {
              part2Box.style.display = 'block';
              part2Box.scrollIntoView({ behavior: 'smooth' });
            }
          }, 'stage_3_p1');
        });
      }

      const inputP2 = document.getElementById('d2_h3_scanner_input');
      const btnVerifyP2 = document.getElementById('btnD2H3VerifyP2');
      const fb2 = document.getElementById('d2_h3_fb2');

      if (btnVerifyP2) {
        btnVerifyP2.addEventListener('click', () => {
          const val = (inputP2 ? inputP2.value : '').trim();
          if (!val && !isAdmin) {
            alert('Tuliskan banyaknya siklus pengurangan kecepatan terlebih dahulu!');
            return;
          }

          const isCorrect = stageData.correctAnswersPart2.some(ans => val.toLowerCase().includes(ans.toLowerCase()));
          if (!answersMap.stage_3) answersMap.stage_3 = {};
          answersMap.stage_3.answerPart2 = val || stageData.correctAnswersPart2[0];
          answersMap.stage_3.isCorrectPart2 = isCorrect;

          showStageFeedback(fb2, isCorrect, stageData.feedbackCorrectPart2, stageData.feedbackWrongPart2, 'Pengurangan kecepatan dilakukan sebanyak 40 / 10 = 4 kali siklus penanganan.', () => renderDistrict2Stage(3), 'stage_3_p2');
        });
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 4 (Menentukan Persentase Kecepatan yang Tersisa)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 3) {
      const stageData = district.stages[3];
      const savedAns = answersMap.stage_4 || {};
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 4 // Expo Central Control Lab</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        ${createRobotCard(stageData.robotPrompt)}

        <div style="background: #F8FAFC; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 1.25rem; margin: 1.25rem 0;">
          <div class="objective-list" id="d2_h4_options">
            ${stageData.options.map(opt => `
              <div class="objective-item ${(savedAns.chosenKey === opt.key) ? 'selected' : ''}" data-key="${opt.key}">
                <div class="objective-marker">${opt.key}</div>
                <div class="objective-text">${opt.text}</div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn-mission-action" id="btnD2H4Verify" style="margin-top: 1rem;">
            ${isVerified ? '✓ Jawaban Terverifikasi Tepat' : 'Verifikasi Persentase 🔓'}
          </button>

          <div id="d2_h4_feedback" class="mission-feedback-wrap"></div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      const optItems = document.querySelectorAll('#d2_h4_options .objective-item');
      const btnVerify = document.getElementById('btnD2H4Verify');
      const fbBox = document.getElementById('d2_h4_feedback');

      let currentChosen = savedAns.chosenKey || null;
      optItems.forEach(el => {
        el.addEventListener('click', () => {
          optItems.forEach(i => i.classList.remove('selected'));
          el.classList.add('selected');
          currentChosen = el.dataset.key;
        });
      });

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          if (!currentChosen && !isAdmin) {
            alert('Pilih salah satu persentase terlebih dahulu!');
            return;
          }

          const chosen = currentChosen || stageData.correctKey;
          const isCorrect = (chosen === stageData.correctKey);

          answersMap.stage_4 = {
            chosenKey: chosen,
            isCorrect: isCorrect
          };

          showStageFeedback(fbBox, isCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Jika berkurang sebesar 20%, maka persentase kecepatan yang tersisa adalah 100% - 20% = 80%.', () => renderDistrict2Stage(4), 'stage_4');
        });
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 5 (Menyederhanakan Persentase Menjadi Pecahan)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 4) {
      const stageData = district.stages[4];
      const savedAns = answersMap.stage_5 || {};
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 5 // Expo Central Control Lab</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        ${createRobotCard(stageData.robotPrompt)}

        <div style="background: #F8FAFC; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 1.25rem; margin: 1.25rem 0;">
          <div style="font-weight: 700; color: #0F172A; font-size: 1.05rem; margin-bottom: 1rem; white-space: pre-line;">
            ${stageData.instruction}
          </div>

          <div class="objective-list" id="d2_h5_options">
            ${stageData.options.map(opt => `
              <div class="objective-item ${(savedAns.chosenKey === opt.key) ? 'selected' : ''}" data-key="${opt.key}">
                <div class="objective-marker">${opt.key}</div>
                <div class="objective-text">${opt.text}</div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn-mission-action" id="btnD2H5Verify" style="margin-top: 1rem;">
            Verifikasi Pecahan 🔓
          </button>

          <div id="d2_h5_feedback" class="mission-feedback-wrap">
            ${isVerified ? `
              <div style="background: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 1.25rem; text-align: left; margin-top: 1.25rem;">
                <div style="font-weight: 800; color: #047857; font-size: 1.05rem; margin-bottom: 0.35rem; white-space: pre-line;">
                  ${stageData.feedbackCorrect}
                </div>
                <button type="button" id="btnD2H5NextInline" class="btn-yellow-glow" style="font-size: 0.9rem; padding: 0.5rem 1.4rem; margin-top: 0.75rem;">
                  Lanjut ke Halaman 6 →
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      const optItems = document.querySelectorAll('#d2_h5_options .objective-item');
      const btnVerify = document.getElementById('btnD2H5Verify');
      const fbBox = document.getElementById('d2_h5_feedback');

      let selectedKey = savedAns.chosenKey || null;
      optItems.forEach(item => {
        item.addEventListener('click', () => {
          optItems.forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
          selectedKey = item.dataset.key;
        });
      });

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          if (!selectedKey && !isAdmin) {
            alert('Pilih salah satu pecahan terlebih dahulu!');
            return;
          }
          const chosen = selectedKey || stageData.correctKey;
          const isCorrect = (chosen === stageData.correctKey);

          answersMap.stage_5 = {
            chosenKey: chosen,
            isCorrect: isCorrect
          };

          showStageFeedback(fbBox, isCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Pecahan 80% dapat disederhanakan dengan membagi pembilang dan penyebut dengan 20: 80/100 = 4/5.', () => renderDistrict2Stage(5), 'stage_5');
        });
      }

      const btnNextExisting = document.getElementById('btnD2H5NextInline');
      if (btnNextExisting) {
        btnNextExisting.addEventListener('click', () => renderDistrict2Stage(5));
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 6 (Menentukan Model Matematika)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 5) {
      const stageData = district.stages[5];
      const savedAns = answersMap.stage_6 || {};
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 6 // Expo Central Control Lab</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        <div class="level-scenario-card" style="margin-bottom: 1.25rem;">
          <div style="font-weight: 800; color: #0284C7; margin-bottom: 0.5rem;">
            ${stageData.instruction}
          </div>
          <div style="font-weight: 700; color: #0F172A; margin-bottom: 0.5rem;">Informasi yang diketahui:</div>
          <ul style="padding-left: 1.25rem; line-height: 1.7; color: #334155; margin: 0;">
            ${stageData.knownInfo.map(info => `<li>${info}</li>`).join('')}
          </ul>
        </div>

        ${createRobotCard(stageData.robotPrompt)}

        <div style="background: #F8FAFC; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 1.25rem; margin: 1.25rem 0;">
          <div style="font-weight: 700; color: #0F172A; font-size: 1.05rem; margin-bottom: 1rem; line-height: 1.5;">
            ${stageData.riddle}
          </div>

          <div class="objective-list" id="d2_h6_options">
            ${stageData.options.map(opt => `
              <div class="objective-item ${(savedAns.chosenKey === opt.key) ? 'selected' : ''}" data-key="${opt.key}">
                <div class="objective-marker">${opt.key}</div>
                <div class="objective-text">${opt.text}</div>
              </div>
            `).join('')}
          </div>

          <button type="button" class="btn-mission-action" id="btnD2H6Verify" style="margin-top: 1rem;">
            Verifikasi Model Matematika 🔓
          </button>

          <div id="d2_h6_feedback" class="mission-feedback-wrap">
            ${isVerified ? `
              <div style="background: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 1.25rem; text-align: left; margin-top: 1.25rem;">
                <div style="font-weight: 800; color: #047857; font-size: 1.05rem; margin-bottom: 0.35rem; white-space: pre-line;">
                  ${stageData.feedbackCorrect}
                </div>
                <button type="button" id="btnD2H6NextInline" class="btn-yellow-glow" style="font-size: 0.9rem; padding: 0.5rem 1.4rem; margin-top: 0.75rem;">
                  Lanjut ke Halaman 7 →
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      const optItems = document.querySelectorAll('#d2_h6_options .objective-item');
      const btnVerify = document.getElementById('btnD2H6Verify');
      const fbBox = document.getElementById('d2_h6_feedback');

      let selectedKey = savedAns.chosenKey || null;
      optItems.forEach(item => {
        item.addEventListener('click', () => {
          optItems.forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
          selectedKey = item.dataset.key;
        });
      });

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          if (!selectedKey && !isAdmin) {
            alert('Pilih salah satu model matematika terlebih dahulu!');
            return;
          }
          const chosen = selectedKey || stageData.correctKey;
          const isCorrect = (chosen === stageData.correctKey);

          answersMap.stage_6 = {
            chosenKey: chosen,
            isCorrect: isCorrect
          };

          showStageFeedback(fbBox, isCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Bentuk matematika yang tepat adalah 1250 × (4/5)⁴ karena kecepatan awal 1.250 dikalikan (4/5) sebanyak 4 kali.', () => renderDistrict2Stage(6), 'stage_6');
        });
      }

      const btnNextExisting = document.getElementById('btnD2H6NextInline');
      if (btnNextExisting) {
        btnNextExisting.addEventListener('click', () => renderDistrict2Stage(6));
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 7 (Menghitung Kecepatan Akhir Program Peretas)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 6) {
      const stageData = district.stages[6];
      const savedAns = answersMap.stage_7 || {};
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 7 // Expo Central Control Lab</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        ${createRobotCard(stageData.robotPrompt)}

        <div style="margin: 1.25rem 0;" id="d2_h7_action_oke">
          <button type="button" class="btn-yellow-glow" id="btnD2H7Oke">Oke →</button>
        </div>

        <div id="d2_h7_content" style="${isVerified ? 'display: block;' : 'display: none;'}">
          <div style="background: #F8FAFC; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 1.25rem; margin: 1.25rem 0;">
            <div style="font-weight: 700; color: #0F172A; font-size: 1.05rem; margin-bottom: 1rem; white-space: pre-line;">
              ${stageData.instruction}
            </div>

            <input type="text" id="d2_h7_calc_input" class="short-essay-input" placeholder="Tuliskan hasil angka..." value="${savedAns.answer || ''}">

            <button type="button" class="btn-mission-action" id="btnD2H7Verify" style="margin-top: 1.25rem;">
              Verifikasi Hasil Perhitungan 🔓
            </button>

            <div id="d2_h7_feedback" class="mission-feedback-wrap">
              ${isVerified ? `
                <div style="background: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 1.25rem; text-align: left; margin-top: 1.25rem;">
                  <div style="font-weight: 800; color: #047857; font-size: 1.05rem; margin-bottom: 0.35rem; white-space: pre-line;">
                    ${stageData.feedbackCorrect}
                  </div>
                  <button type="button" id="btnD2H7NextInline" class="btn-yellow-glow" style="font-size: 0.9rem; padding: 0.5rem 1.4rem; margin-top: 0.75rem;">
                    Lanjut ke Halaman 8 →
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      const btnOke = document.getElementById('btnD2H7Oke');
      const contentBox = document.getElementById('d2_h7_content');
      const calcInput = document.getElementById('d2_h7_calc_input');
      const btnVerify = document.getElementById('btnD2H7Verify');
      const fbBox = document.getElementById('d2_h7_feedback');

      if (btnOke && contentBox) {
        btnOke.addEventListener('click', () => {
          contentBox.style.display = 'block';
          btnOke.parentElement.style.display = 'none';
        });
      }

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          const val = (calcInput.value || '').trim();
          if (!val && !isAdmin) {
            alert('Tuliskan hasil perhitungan Anda terlebih dahulu!');
            return;
          }

          const isCorrect = (val === stageData.correctAnswer);

          answersMap.stage_7 = {
            answer: val || stageData.correctAnswer,
            isCorrect: isCorrect
          };

          showStageFeedback(fbBox, isCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Perhitungannya: 1250 × (4/5)⁴ = 1250 × (256/625) = 2 × 256 = 512 kombinasi kode akses setiap 10 menit.', () => renderDistrict2Stage(7), 'stage_7');
        });
      }

      const btnNextExisting = document.getElementById('btnD2H7NextInline');
      if (btnNextExisting) {
        btnNextExisting.addEventListener('click', () => renderDistrict2Stage(7));
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 8 (Membandingkan Kecepatan Akhir dengan Batas Maksimum)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 7) {
      const stageData = district.stages[7];
      const savedAns = answersMap.stage_8 || {};
      const isVerified = savedAns.isCorrect || (isDistrictCompleted && !isAdmin);

      html = `
        <div class="panel-title">
          <span>Halaman 8 // Expo Central Control Lab</span>
          <span>${isVerified ? '✓ TERVERIFIKASI' : 'STATUS: BELUM SELESAI'}</span>
        </div>

        ${createRobotCard(stageData.robotPrompt)}

        <div style="background: #F8FAFC; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 1.5rem; text-align: center; margin: 1.25rem 0;">
          <div class="inequality-box">
            <input type="text" id="d2_h8_left" class="inequality-input" placeholder="..." value="${savedAns.left || ''}">
            <span class="inequality-symbol">&lt;</span>
            <input type="text" id="d2_h8_right" class="inequality-input" placeholder="..." value="${savedAns.right || ''}">
          </div>

          <div>
            <button type="button" class="btn-mission-action" id="btnD2H8Verify" style="display: inline-block; min-width: 250px;">
              Verifikasi Pertidaksamaan 🔓
            </button>
          </div>

          <div id="d2_h8_feedback" class="mission-feedback-wrap">
            ${isVerified ? `
              <div style="background: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 1.25rem; text-align: left; margin-top: 1.25rem;">
                <div style="font-weight: 800; color: #047857; font-size: 1.05rem; margin-bottom: 0.35rem; white-space: pre-line;">
                  ${stageData.feedbackCorrect}
                </div>
                <button type="button" id="btnD2H8NextInline" class="btn-yellow-glow" style="font-size: 0.9rem; padding: 0.5rem 1.4rem; margin-top: 0.75rem;">
                  Lanjut ke Halaman 9 →
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      const inputLeft = document.getElementById('d2_h8_left');
      const inputRight = document.getElementById('d2_h8_right');
      const btnVerify = document.getElementById('btnD2H8Verify');
      const fbBox = document.getElementById('d2_h8_feedback');

      if (btnVerify) {
        btnVerify.addEventListener('click', () => {
          const l = (inputLeft.value || '').trim();
          const r = (inputRight.value || '').trim();

          if ((!l || !r) && !isAdmin) {
            alert('Isikan kedua ruas pertidaksamaan!');
            return;
          }

          const isCorrect = (l === stageData.correctLeft && r === stageData.correctRight);

          answersMap.stage_8 = {
            left: l || stageData.correctLeft,
            right: r || stageData.correctRight,
            isCorrect: isCorrect
          };

          showStageFeedback(fbBox, isCorrect, stageData.feedbackCorrect, stageData.feedbackWrong, 'Pertidaksamaannya adalah 512 < 600, yaitu kecepatan akhir peretas lebih kecil dari batas maksimum yang ditetapkan.', () => renderDistrict2Stage(8), 'stage_8');
        });
      }

      const btnNextExisting = document.getElementById('btnD2H8NextInline');
      if (btnNextExisting) {
        btnNextExisting.addEventListener('click', () => renderDistrict2Stage(8));
      }
    }

    // --------------------------------------------------------------------------
    // HALAMAN 9 (Menyajikan Hasil / Drag and Drop & Kesimpulan Akhir)
    // --------------------------------------------------------------------------
    else if (currentStageIndex === 8) {
      const stageData = district.stages[8];
      const savedAns = answersMap.stage_9 || {};
      const isDragVerified = savedAns.isCorrectDrag || (isDistrictCompleted && !isAdmin);

      const chosenCard = stageData.dragCards.find(c => c.id === savedAns.dragCardId);
      const slotText = chosenCard ? chosenCard.text : '[ Seret jawaban ke sini ]';

      html = `
        <div class="panel-title">
          <span>Halaman 9 // Expo Central Control Lab</span>
          <span>STATUS: TAHAP AKHIR</span>
        </div>

        <div class="pbl-phase-outside">${stageData.phaseTitle}</div>

        ${createRobotCard(stageData.robotPromptPart1)}

        <div style="background: #F8FAFC; border: 1.5px solid #BAE6FD; border-radius: 12px; padding: 1.5rem; margin: 1.25rem 0;">
          <div style="font-weight: 700; color: #0F172A; font-size: 1rem; margin-bottom: 1rem; line-height: 1.6; white-space: pre-line;">
            ${stageData.instructionDrag}
          </div>

          <div class="drag-drop-area">
            <div class="drop-target-slot ${(chosenCard) ? 'filled' : ''}" id="d2_h9_drop_slot">
              ${slotText}
            </div>

            <div class="drag-cards-wrapper" id="d2_h9_cards_wrapper">
              ${stageData.dragCards.map(c => `
                <div class="drag-item-card ${(savedAns.dragCardId === c.id) ? 'selected-active' : ''}" draggable="true" data-id="${c.id}" data-text="${c.text}">
                  ${c.text}
                </div>
              `).join('')}
            </div>
          </div>

          <button type="button" class="btn-mission-action" id="btnD2H9VerifyDrag" style="margin-top: 1rem;">
            Verifikasi Kondisi Sistem 🔓
          </button>

          <div id="d2_h9_feedback_drag" class="mission-feedback-wrap">
            ${isDragVerified ? `
              <div style="margin-top: 1.25rem;">
                ${createRobotCard(stageData.feedbackCorrectDrag)}
              </div>
            ` : ''}
          </div>
        </div>

        <div id="d2_h9_report_area" style="${isDragVerified ? 'display: block;' : 'display: none;'}">
          <div style="margin: 1.5rem 0;">
            <textarea id="d2_h9_report_input" class="long-essay-textarea" placeholder="Tuliskan kesimpulan akhir...">${savedAns.report || stageData.initialPrefix}</textarea>
          </div>

          <button type="button" class="btn-mission-action" id="btnD2H9Submit">
            Kirim Laporan & Buka Rekaman Pembahasan 📜
          </button>
        </div>
      `;

      stageContentPanel.innerHTML = html;

      const dropSlot = document.getElementById('d2_h9_drop_slot');
      const cardEls = document.querySelectorAll('.drag-item-card');
      const btnVerifyDrag = document.getElementById('btnD2H9VerifyDrag');
      const fbDrag = document.getElementById('d2_h9_feedback_drag');
      const reportArea = document.getElementById('d2_h9_report_area');
      const reportInput = document.getElementById('d2_h9_report_input');
      const btnSubmit = document.getElementById('btnD2H9Submit');

      let currentSelectedCardId = savedAns.dragCardId || null;

      function selectCard(cardId, cardText) {
        currentSelectedCardId = cardId;
        cardEls.forEach(el => {
          if (el.dataset.id === cardId) el.classList.add('selected-active');
          else el.classList.remove('selected-active');
        });
        if (dropSlot) {
          dropSlot.textContent = cardText;
          dropSlot.classList.add('filled');
        }
      }

      // Drag and drop HTML5 + click fallback
      cardEls.forEach(card => {
        card.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', card.dataset.id);
        });
        card.addEventListener('click', () => {
          selectCard(card.dataset.id, card.dataset.text);
        });
      });

      if (dropSlot) {
        dropSlot.addEventListener('dragover', (e) => {
          e.preventDefault();
          dropSlot.classList.add('hovered');
        });
        dropSlot.addEventListener('dragleave', () => {
          dropSlot.classList.remove('hovered');
        });
        dropSlot.addEventListener('drop', (e) => {
          e.preventDefault();
          dropSlot.classList.remove('hovered');
          const droppedId = e.dataTransfer.getData('text/plain');
          const matchedCard = stageData.dragCards.find(c => c.id === droppedId);
          if (matchedCard) {
            selectCard(matchedCard.id, matchedCard.text);
          }
        });
      }

      if (btnVerifyDrag) {
        btnVerifyDrag.addEventListener('click', () => {
          if (!currentSelectedCardId && !isAdmin) {
            alert('Seret atau klik salah satu kartu kondisi sistem terlebih dahulu!');
            return;
          }

          const chosen = currentSelectedCardId || stageData.correctDragId;
          const isCorrect = (chosen === stageData.correctDragId);

          if (!answersMap.stage_9) answersMap.stage_9 = {};
          answersMap.stage_9.dragCardId = chosen;
          answersMap.stage_9.isCorrectDrag = isCorrect;

          showStageFeedback(fbDrag, isCorrect, stageData.feedbackCorrectDrag, stageData.feedbackWrongDrag, 'Karena kecepatan akhir (512) tidak melebihi batas toleransi maksimum (600), maka Sistem Tidak Mengalami Crash.', () => { if (reportArea) { reportArea.style.display = 'block'; if (reportInput && !reportInput.value.trim()) { reportInput.value = stageData.initialPrefix; } reportArea.scrollIntoView({ behavior: 'smooth' }); } }, 'stage_9');
        });
      }

      if (btnSubmit) {
        btnSubmit.addEventListener('click', () => {
          const repVal = (reportInput ? reportInput.value : '').trim();
          if (repVal.length < 5 && !isAdmin) {
            alert('Tuliskan kesimpulan akhir Anda terlebih dahulu!');
            return;
          }

          if (!answersMap.stage_9) answersMap.stage_9 = {};
          answersMap.stage_9.report = repVal;

          missionModel.completeDistrict(2, answersMap);
          showDistrict2ReviewView();
        });
      }
    }

    // Khusus Admin Cripci: Kemudahan beralih kembali ke Rekaman saat melihat Mode Soal
    if (isAdmin && isDistrictCompleted && stageContentPanel) {
      const adminDiv = document.createElement('div');
      adminDiv.style.cssText = 'text-align: center; margin-top: 1.5rem;';
      adminDiv.innerHTML = `
        <button type="button" id="btnAdminReturnToReview2" class="btn-yellow-glow">
          Lihat Rekaman
        </button>
      `;
      stageContentPanel.appendChild(adminDiv);
      const btnAdminReturn = document.getElementById('btnAdminReturnToReview2');
      if (btnAdminReturn) {
        btnAdminReturn.onclick = () => showDistrict2ReviewView();
      }
    }

    updateArrows(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================================================================
  // HALAMAN 10: REKAMAN JAWABAN SISWA (DISTRICT 2 - 10 BUTIR EVALUASI)
  // ============================================================================
  function showDistrict2ReviewView() {
    if (challengeView) challengeView.style.display = 'none';
    if (reviewView) reviewView.style.display = 'block';

    // Di tampilan rekaman, panah floating TIDAK ADA (kembali hanya lewat tombol di bawah)
    if (btnPrevStage) btnPrevStage.style.display = 'none';
    if (btnNextStage) btnNextStage.style.display = 'none';

    const revData = district.reviewEvaluation;
    if (!revData) return;

    function getD2StudentAnswerText(itemNum) {
      if (itemNum === 1) {
        const key = (answersMap.stage_1 && answersMap.stage_1.chosenKey) || 'C';
        const opt = district.stages[0].options.find(o => o.key === key);
        return `Opsi ${key}: ${opt ? opt.text : ''}`;
      }
      if (itemNum === 2) {
        const dIds = (answersMap.stage_2 && answersMap.stage_2.diketahui) || ['d1', 'd3', 'd4', 'd5'];
        const dTexts = district.stages[1].diketahuiOptions.filter(o => dIds.includes(o.id)).map(o => `• ${o.text}`).join('<br>');
        return dTexts || 'Tidak ada pilihan dicentang.';
      }
      if (itemNum === 3) {
        const tIds = (answersMap.stage_2 && answersMap.stage_2.ditanya) || ['t2'];
        const tTexts = district.stages[1].ditanyaOptions.filter(o => tIds.includes(o.id)).map(o => `• ${o.text}`).join('<br>');
        return tTexts || 'Tidak ada pilihan dicentang.';
      }
      if (itemNum === 4) {
        return (answersMap.stage_3 && answersMap.stage_3.answerPart2) || '4 siklus';
      }
      if (itemNum === 5) {
        const key = (answersMap.stage_4 && answersMap.stage_4.chosenKey) || 'C';
        const opt = district.stages[3].options.find(o => o.key === key);
        return `Opsi ${key}: ${opt ? opt.text : '80%'}`;
      }
      if (itemNum === 6) {
        const key = (answersMap.stage_5 && answersMap.stage_5.chosenKey) || 'D';
        const opt = district.stages[4].options.find(o => o.key === key);
        return `Opsi ${key}: ${opt ? opt.text : '4 / 5'}`;
      }
      if (itemNum === 7) {
        const key = (answersMap.stage_6 && answersMap.stage_6.chosenKey) || 'C';
        const opt = district.stages[5].options.find(o => o.key === key);
        return `Opsi ${key}: ${opt ? opt.text : '1250 × (4/5)⁴'}`;
      }
      if (itemNum === 8) {
        return (answersMap.stage_7 && answersMap.stage_7.answer) || '512 kombinasi kode akses setiap 10 menit';
      }
      if (itemNum === 9) {
        const l = (answersMap.stage_8 && answersMap.stage_8.left) || '512';
        const r = (answersMap.stage_8 && answersMap.stage_8.right) || '600';
        return `${l} < ${r}`;
      }
      if (itemNum === 10) {
        const cardId = (answersMap.stage_9 && answersMap.stage_9.dragCardId) || 'B';
        const card = district.stages[8].dragCards.find(c => c.id === cardId);
        return card ? card.text : 'Kartu B: Sistem Tidak Mengalami Crash';
      }
      return '-';
    }

    function isD2ItemCorrect(itemNum) {
      if (itemNum === 1) return (answersMap.stage_1 && answersMap.stage_1.isCorrect) ?? true;
      if (itemNum === 2 || itemNum === 3) return (answersMap.stage_2 && answersMap.stage_2.isCorrect) ?? true;
      if (itemNum === 4) return (answersMap.stage_3 && answersMap.stage_3.isCorrectPart2) ?? true;
      if (itemNum === 5) return (answersMap.stage_4 && answersMap.stage_4.isCorrect) ?? true;
      if (itemNum === 6) return (answersMap.stage_5 && answersMap.stage_5.isCorrect) ?? true;
      if (itemNum === 7) return (answersMap.stage_6 && answersMap.stage_6.isCorrect) ?? true;
      if (itemNum === 8) return (answersMap.stage_7 && answersMap.stage_7.isCorrect) ?? true;
      if (itemNum === 9) return (answersMap.stage_8 && answersMap.stage_8.isCorrect) ?? true;
      if (itemNum === 10) return (answersMap.stage_9 && answersMap.stage_9.isCorrectDrag) ?? true;
      return true;
    }

    let reviewHtml = `
      <div class="pbl-phase-outside">${revData.phaseTitle}</div>
      ${createRobotCard(revData.robotPrompt)}
    `;

    revData.items.forEach(item => {
      const correct = isD2ItemCorrect(item.num);
      const studentAns = getD2StudentAnswerText(item.num);
      const feedbackText = correct ? item.feedbackCorrect : item.feedbackWrong;

      reviewHtml += `
        <div style="background: #F8FAFC; border: 1.5px solid ${correct ? '#BAE6FD' : '#FECDD3'}; border-radius: 12px; padding: 1.5rem; text-align: left; margin-bottom: 1.25rem;">
          <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: #0A2540; margin-bottom: 0.65rem;">
            ${item.title}
          </div>

          <div style="font-size: 0.95rem; color: #475569; margin-bottom: 0.75rem; line-height: 1.5;">
            <strong style="color: #0F172A;">Soal yang Kamu Kerjakan:</strong><br>
            ${item.question}
          </div>

          <div style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.85rem; font-size: 0.95rem;">
            <strong style="color: #0F172A;">Jawaban awalmu:</strong><br>
            <div style="margin-top: 0.25rem; color: #0284C7; font-weight: 700;">${studentAns}</div>
          </div>

          <div style="font-weight: 800; font-size: 0.88rem; margin-bottom: 0.4rem; color: #475569;">Verifikasi Jawaban:</div>
          <div style="background: ${correct ? '#ECFDF5' : '#FFF1F2'}; border-left: 4px solid ${correct ? '#10B981' : '#F43F5E'}; padding: 0.85rem 1rem; border-radius: 6px; font-size: 0.92rem; line-height: 1.6; color: ${correct ? '#065F46' : '#9F1239'};">
            <div style="font-weight: 800; font-size: 1rem; margin-bottom: 0.35rem;">
              ${correct ? '✅ Jawabanmu benar!' : '❌ Jawabanmu belum tepat.'}
            </div>
            <div style="white-space: pre-line;">${feedbackText}</div>
          </div>
        </div>
      `;
    });

    if (reviewStagesList) {
      reviewStagesList.innerHTML = reviewHtml;
    }

    if (reviewClosingArea) {
      reviewClosingArea.innerHTML = createRobotCard(revData.closingText);
    }

    if (isAdmin && btnAdminViewQuestions) {
      btnAdminViewQuestions.style.display = 'inline-block';
      btnAdminViewQuestions.onclick = () => renderDistrict2Stage(0);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================================================================
  // UPDATE STATUS PANAH NAVIGASI FLOATING
  // ============================================================================
  function updateArrows(forceEnableRight = false) {
    if (reviewView && reviewView.style.display === 'block') {
      if (btnPrevStage) btnPrevStage.style.display = 'none';
      if (btnNextStage) btnNextStage.style.display = 'none';
      return;
    }

    const totalPages = levelNum === 1 ? 7 : 9;
    const lastPageIndex = totalPages - 1;

    // 1. Panah Kiri:
    // Halaman pertama (0) tidak ada panah kiri. Halaman berikutnya ada panah kiri.
    if (btnPrevStage) {
      btnPrevStage.style.display = currentStageIndex === 0 ? 'none' : 'flex';
    }

    // 2. Panah Kanan:
    // Halaman terakhir TIDAK ADA panah kanan ke level berikutnya!
    if (btnNextStage) {
      if (currentStageIndex === lastPageIndex) {
        btnNextStage.style.display = 'none';
      } else {
        btnNextStage.style.display = 'flex';

        // Cek status verifikasi tahap saat ini
        let isStageDone = false;
        if (levelNum === 1) {
          if (currentStageIndex === 0) isStageDone = answersMap.stage_1 && answersMap.stage_1.isCorrect;
          if (currentStageIndex === 1) isStageDone = answersMap.stage_2 && answersMap.stage_2.isCorrect;
          if (currentStageIndex === 2) isStageDone = answersMap.stage_3 && answersMap.stage_3.isCorrectPart2;
          if (currentStageIndex === 3) isStageDone = answersMap.stage_4 && answersMap.stage_4.isCorrect;
          if (currentStageIndex === 4) isStageDone = answersMap.stage_5 && answersMap.stage_5.isCorrect;
          if (currentStageIndex === 5) isStageDone = answersMap.stage_6 && answersMap.stage_6.isCorrect;
        } else if (levelNum === 2) {
          if (currentStageIndex === 0) isStageDone = answersMap.stage_1 && answersMap.stage_1.isCorrect;
          if (currentStageIndex === 1) isStageDone = answersMap.stage_2 && answersMap.stage_2.isCorrect;
          if (currentStageIndex === 2) isStageDone = answersMap.stage_3 && answersMap.stage_3.isCorrectPart2;
          if (currentStageIndex === 3) isStageDone = answersMap.stage_4 && answersMap.stage_4.isCorrect;
          if (currentStageIndex === 4) isStageDone = answersMap.stage_5 && answersMap.stage_5.isCorrect;
          if (currentStageIndex === 5) isStageDone = answersMap.stage_6 && answersMap.stage_6.isCorrect;
          if (currentStageIndex === 6) isStageDone = answersMap.stage_7 && answersMap.stage_7.isCorrect;
          if (currentStageIndex === 7) isStageDone = answersMap.stage_8 && answersMap.stage_8.isCorrect;
        }

        const canNext = isStageDone || forceEnableRight || isAdmin || isDistrictCompleted;
        if (canNext) {
          btnNextStage.classList.remove('disabled');
          btnNextStage.disabled = false;
          btnNextStage.setAttribute('title', 'Lanjut ke Halaman Berikutnya');
        } else {
          btnNextStage.classList.add('disabled');
          btnNextStage.disabled = true;
          btnNextStage.setAttribute('title', 'Jawab dan verifikasi jawaban dengan benar terlebih dahulu');
        }
      }
    }
  }

  // Click Event Panah
  if (btnPrevStage) {
    btnPrevStage.addEventListener('click', () => {
      if (currentStageIndex > 0) {
        if (levelNum === 1) renderDistrict1Stage(currentStageIndex - 1);
        else if (levelNum === 2) renderDistrict2Stage(currentStageIndex - 1);
      }
    });
  }

  if (btnNextStage) {
    btnNextStage.addEventListener('click', () => {
      const maxIdx = levelNum === 1 ? 6 : 8;
      if (currentStageIndex < maxIdx) {
        if (levelNum === 1) renderDistrict1Stage(currentStageIndex + 1);
        else if (levelNum === 2) renderDistrict2Stage(currentStageIndex + 1);
      }
    });
  }

  // Inisialisasi:
  if (levelNum === 1) {
    if (isDistrictCompleted) {
      showDistrict1ReviewView();
    } else {
      renderDistrict1Stage(0);
    }
  } else if (levelNum === 2) {
    if (isDistrictCompleted) {
      showDistrict2ReviewView();
    } else {
      renderDistrict2Stage(0);
    }
  }

  // Modal Petunjuk District
  const btnOpenPetunjukLevel = document.getElementById('btnOpenPetunjukLevel');
  const btnClosePetunjukLevel = document.getElementById('btnClosePetunjukLevel');
  const btnUnderstoodPetunjukLevel = document.getElementById('btnUnderstoodPetunjukLevel');
  const modalPetunjukLevel = document.getElementById('modalPetunjukLevel');

  function openPetunjuk() {
    if (modalPetunjukLevel) modalPetunjukLevel.style.display = 'flex';
  }

  function closePetunjuk() {
    if (modalPetunjukLevel) modalPetunjukLevel.style.display = 'none';
  }

  if (btnOpenPetunjukLevel) btnOpenPetunjukLevel.addEventListener('click', openPetunjuk);
  if (btnClosePetunjukLevel) btnClosePetunjukLevel.addEventListener('click', closePetunjuk);
  if (btnUnderstoodPetunjukLevel) btnUnderstoodPetunjukLevel.addEventListener('click', closePetunjuk);
});
