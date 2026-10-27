/**
 * ==============================================================================
 * MAT SMA / EXPO CITY - QUIZ CONTROLLER (controllers/QuizController.js)
 * ==============================================================================
 * Mengontrol evaluasi Persiapan Misi sesuai konsep PDF.
 * - 8 Soal Prasyarat Eksponen (True/False, Pilihan Ganda, Esai Singkat).
 * - Tombol Submit / Verifikasi Jawaban di bagian bawah kartu.
 * - Notifikasi Maskot Robot (setengah badan di dalam kotak, setengah badan di luar kotak).
 * - Panah Navigasi:
 *   * Halaman 1 (Soal 1): Tidak ada panah kembali (kiri).
 *   * Halaman 2..8: Ada panah kembali (kiri).
 *   * Panah kanan: Mati (disabled, warna redup) jika belum dijawab & diverifikasi benar.
 *     Setelah diverifikasi benar, panah kanan aktif/menyala warna emas.
 *   * Khusus akun admin (cripci): Bebas navigasi tanpa harus menjawab.
 * - Rekaman Jawaban:
 *   * Tidak ada panah navigasi, kembali melalui tombol "Kembali" di bagian paling bawah.
 *   * Khusus admin: dapat beralih antara Mode Soal dan Mode Rekaman.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const user = userModel.getUser();

  // Jika belum login, redirect ke Cover
  if (!user || !user.isLoggedIn) {
    window.location.href = 'index.html';
    return;
  }

  const isAdmin = !!(user.isAdmin || user.isSpecialAdmin);

  // Tombol Kembali di Header
  const headerBackBtn = document.getElementById('headerBackBtn');
  if (headerBackBtn) {
    if (isAdmin || user.quizCompleted) {
      headerBackBtn.style.display = 'inline-flex';
    } else {
      headerBackBtn.style.display = 'none';
    }
  }

  const questionNumberEl = document.getElementById('quizQuestionNumber');
  const totalQuestionsEl = document.getElementById('quizTotalQuestions');
  const questionTextEl = document.getElementById('quizQuestionText');
  const optionsContainerEl = document.getElementById('quizOptionsContainer');
  const quizActionsEl = document.querySelector('.quiz-actions');
  const btnPrevEl = document.getElementById('btnQuizPrev');
  const btnNextEl = document.getElementById('btnQuizNext');
  const btnSubmitQuiz = document.getElementById('btnSubmitQuiz');
  const quizSubmitBar = document.getElementById('quizSubmitBar');
  const quizFeedbackArea = document.getElementById('quizFeedbackArea');
  const resultCardEl = document.getElementById('quizResultArea');

  // Helper membuat notifikasi maskot robot (setengah di luar, setengah di dalam kotak notif)
  function createMascotFeedbackHtml(title, message, isCorrect = false, isPembahasan = false) {
    const robotImg = isPembahasan 
      ? "assets/images/r6.png" 
      : (isCorrect ? "assets/images/r2.png" : "assets/images/r3.png");
    const cardClass = isPembahasan ? "is-pembahasan" : (isCorrect ? "is-correct" : "is-wrong");
    const fallbackColor = isPembahasan ? "#0284C7" : (isCorrect ? "#10B981" : "#EF4444");
    const fallbackAccent = isPembahasan ? "#38BDF8" : (isCorrect ? "#34D399" : "#F87171");

    return `
      <div class="mascot-feedback-card ${cardClass}">
        <div class="mascot-peeking-badge">
          <img src="${robotImg}" alt="Maskot Robot" class="mascot-peeking-img" onerror="this.onerror=null; this.src=assets/images/robot_mascot.png;">
        </div>
        <div class="mascot-feedback-content">
          ${title ? `<div class="mascot-feedback-title">${title}</div>` : ""}
          <div class="mascot-feedback-message">${message}</div>
        </div>
      </div>
    `;
  }

  // Menampilkan layar review rekaman seluruh soal dan jawaban
  function showReviewMode() {
    if (questionTextEl) questionTextEl.style.display = 'none';
    if (optionsContainerEl) optionsContainerEl.style.display = 'none';
    if (quizActionsEl) quizActionsEl.style.display = 'none';
    if (quizSubmitBar) quizSubmitBar.style.display = 'none';
    if (quizFeedbackArea) quizFeedbackArea.style.display = 'none';
    // Di rekaman jawaban: Tidak perlu ada panah navigasi melayang
    if (btnPrevEl) btnPrevEl.style.display = 'none';
    if (btnNextEl) btnNextEl.style.display = 'none';

    const questions = quizModel.questions;
    const userAnswers = user.quizAnswers || {};

    let reviewHtml = `
      <div style="background: #FFFFFF; border: 2px solid #BAE6FD; border-radius: 16px; padding: 2rem 1.75rem; margin-top: 1rem; box-shadow: 0 12px 36px rgba(14, 116, 144, 0.08);">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 1rem; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; color: #0284C7; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
              REKAMAN JAWABAN SISWA // PERSIAPAN MISI
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.45rem; color: #0A2540; font-weight: 800; margin-top: 0.2rem;">
              Tinjauan Soal &amp; Rekaman Jawaban
            </h3>
          </div>
          <span style="font-size: 0.95rem; font-weight: 800; color: #0369A1; background: #E0F2FE; padding: 0.45rem 1rem; border-radius: 8px; border: 1.5px solid #BAE6FD;">
            Skor: ${user.quizScore || 0} / 100
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.75rem;">
    `;

    questions.forEach((q, idx) => {
      const ansData = userAnswers[idx];
      const studentAnswer = ansData ? (ansData.answer || (typeof ansData === 'string' ? ansData : '')) : '';
      const isAnswered = studentAnswer !== '';
      const isCorrect = isAnswered && quizModel.checkAnswer(idx, studentAnswer);

      let statusBadge = '';
      if (!isAnswered) {
        statusBadge = '<span style="color: #64748B; background: #F1F5F9; border: 1px solid #CBD5E1; padding: 0.25rem 0.65rem; border-radius: 6px; font-size: 0.8rem; font-weight: 700;">Tidak Dijawab</span>';
      } else if (isCorrect) {
        statusBadge = '<span style="color: #047857; background: #D1FAE5; border: 1px solid #10B981; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.8rem; font-weight: 800;">✓ Jawaban Anda Benar</span>';
      } else {
        statusBadge = '<span style="color: #B91C1C; background: #FEE2E2; border: 1px solid #EF4444; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.8rem; font-weight: 800;">✗ Jawaban Anda Salah</span>';
      }

      reviewHtml += `
        <div style="background: #F8FAFC; border: 1.5px solid ${isCorrect ? '#BAE6FD' : '#FCA5A5'}; border-radius: 12px; padding: 1.4rem; text-align: left;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem;">
            <span style="font-family: var(--font-mono); font-size: 0.82rem; color: #0284C7; font-weight: 800;">Soal ${idx + 1} dari ${questions.length}</span>
            ${statusBadge}
          </div>
          <p style="font-size: 1.05rem; font-weight: 700; color: #0F172A; line-height: 1.5; margin-bottom: 1.15rem;">
            ${q.questionText}
          </p>
      `;

      if (q.type === 'tf' || q.type === 'mc') {
        reviewHtml += `<div style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.15rem;">`;
        q.options.forEach(opt => {
          const isChosen = String(studentAnswer).trim().toLowerCase() === String(opt.key).trim().toLowerCase();
          const isActualCorrect = String(q.correctOption).trim().toLowerCase() === String(opt.key).trim().toLowerCase();

          let optStyle = 'background: #FFFFFF; border: 1.5px solid #E2E8F0; color: #334155;';
          let optBadge = '';

          if (isChosen && isActualCorrect) {
            optStyle = 'background: #ECFDF5; border: 2px solid #10B981; color: #064E3B; font-weight: 700;';
            optBadge = '<span style="margin-left: auto; color: #047857; font-size: 0.82rem; font-weight: 800;">[Jawaban Anda ✓]</span>';
          } else if (isChosen && !isActualCorrect) {
            optStyle = 'background: #FEF2F2; border: 2px solid #EF4444; color: #7F1D1D; font-weight: 700;';
            optBadge = '<span style="margin-left: auto; color: #B91C1C; font-size: 0.82rem; font-weight: 800;">[Jawaban Anda ✗]</span>';
          } else if (isActualCorrect) {
            optStyle = 'background: #F0FDF4; border: 1.5px solid #34D399; color: #065F46; font-weight: 700;';
            optBadge = '<span style="margin-left: auto; color: #047857; font-size: 0.82rem; font-weight: 800;">[Kunci Benar ★]</span>';
          }

          reviewHtml += `
            <div style="display: flex; align-items: center; gap: 0.85rem; padding: 0.8rem 1rem; border-radius: 8px; font-size: 0.95rem; ${optStyle}">
              <strong style="font-family: var(--font-mono); width: 24px; text-align: center;">${opt.key}.</strong>
              <span style="flex: 1;">${opt.label}</span>
              ${optBadge}
            </div>
          `;
        });
        reviewHtml += `</div>`;
      } else if (q.type === 'essay') {
        reviewHtml += `
          <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 1rem; margin-bottom: 1.15rem;">
            <div style="font-size: 0.82rem; color: #64748B; font-family: var(--font-mono); font-weight: 700; text-transform: uppercase; margin-bottom: 0.35rem;">Jawaban Anda:</div>
            <div style="font-size: 1rem; font-weight: 800; color: ${isCorrect ? '#047857' : '#B91C1C'};">${studentAnswer || '(Belum dijawab)'}</div>
            <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #0284C7; font-weight: 700;">
              Kunci Jawaban: ${q.correctKeywords.join(' / ')}
            </div>
          </div>
        `;
      }

      reviewHtml += `
          ${createMascotFeedbackHtml("PEMBAHASAN MATERI // MASKOT EDUKASI", q.explanation, false, true)}
        </div>
      `;
    });

    reviewHtml += `
        </div>

        <div style="margin-top: 2.25rem; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <a href="menu.html" style="padding: 0.85rem 2.25rem; background: linear-gradient(135deg, #F59E0B, #D97706); color: #FFFFFF; border: 1.5px solid #FEF08A; border-radius: 8px; text-decoration: none; font-size: 0.95rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);">
            ← Kembali
          </a>
          ${isAdmin ? `
            <button type="button" id="btnAdminOpenQuestionsQuiz" style="padding: 0.85rem 1.85rem; background: #0284C7; color: #FFFFFF; border: 1.5px solid #38BDF8; border-radius: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 800; text-transform: uppercase;">
              Buka Mode Soal
            </button>
          ` : ''}
        </div>
      </div>
    `;

    if (resultCardEl) {
      resultCardEl.innerHTML = reviewHtml;
      resultCardEl.scrollIntoView({ behavior: 'smooth' });

      const btnAdminOpenQ = document.getElementById('btnAdminOpenQuestionsQuiz');
      if (btnAdminOpenQ) {
        btnAdminOpenQ.addEventListener('click', () => {
          if (resultCardEl) resultCardEl.innerHTML = '';
          if (questionTextEl) questionTextEl.style.display = 'block';
          if (optionsContainerEl) optionsContainerEl.style.display = 'flex';
          if (quizSubmitBar) quizSubmitBar.style.display = 'flex';
          renderCurrentQuestion();
        });
      }
    }
  }

  function showCompletion(result) {
    if (quizActionsEl) quizActionsEl.style.display = 'none';
    if (questionTextEl) questionTextEl.style.display = 'none';
    if (optionsContainerEl) optionsContainerEl.style.display = 'none';
    if (btnPrevEl) btnPrevEl.style.display = 'none';
    if (btnNextEl) btnNextEl.style.display = 'none';
    if (quizSubmitBar) quizSubmitBar.style.display = 'none';
    if (quizFeedbackArea) quizFeedbackArea.style.display = 'none';

    if (resultCardEl) {
      resultCardEl.innerHTML = `
        <div style="background: #FFFFFF; border: 2px solid #BAE6FD; border-radius: 16px; padding: 2.25rem 2rem; text-align: center; margin-top: 0.5rem; box-shadow: 0 10px 30px rgba(14, 116, 144, 0.08);">
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: #0284C7; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.5rem;">
            EVALUASI PRASYARAT TUNTAS // REKAMAN DISIMPAN
          </div>
          <h3 style="color: #0A2540; font-family: var(--font-display); font-size: 1.7rem; font-weight: 800; margin-bottom: 0.75rem;">
            🎉 Persiapan Misi Berhasil Dituntaskan!
          </h3>
          <p style="color: #0F172A; font-size: 1.35rem; font-weight: 800;">
            Skor Total Anda: <strong style="color: #0284C7;">${result.score} / 100</strong> (${result.correctCount}/${result.total} Soal Benar)
          </p>
          <p style="color: #475569; font-size: 0.98rem; margin-top: 0.65rem; line-height: 1.6; max-width: 600px; margin-left: auto; margin-right: auto;">
            Rekaman jawaban Anda telah tersimpan. Otorisasi gerbang menuju sektor <strong>Misi Utama</strong> sekarang telah terbuka!
          </p>

          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.75rem; flex-wrap: wrap;">
            <!-- Tombol Review Rekaman Jawaban -->
            <button type="button" id="btnOpenReview" style="padding: 0.85rem 1.85rem; background: #FFFFFF; color: #0284C7; border: 1.5px solid #0284C7; border-radius: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; transition: all 0.2s ease;">
              Lihat Rekaman
            </button>

            <!-- Tombol Kembali ke Beranda -->
            <a href="menu.html" style="display: inline-block; padding: 0.85rem 2.25rem; background: linear-gradient(135deg, #F59E0B, #D97706); color: #FFFFFF; border: 1.5px solid #FEF08A; border-radius: 8px; text-decoration: none; font-size: 1rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; box-shadow: 0 4px 18px rgba(245, 158, 11, 0.4);">
              ← Kembali
            </a>

            ${isAdmin ? `
              <button type="button" id="btnAdminOpenQuestionsSummary" style="padding: 0.85rem 1.85rem; background: #0284C7; color: #FFFFFF; border: 1.5px solid #38BDF8; border-radius: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 800; text-transform: uppercase;">
                Buka Mode Soal
              </button>
            ` : ''}
          </div>
        </div>
      `;
      resultCardEl.scrollIntoView({ behavior: 'smooth' });

      const btnOpenReview = document.getElementById('btnOpenReview');
      if (btnOpenReview) {
        btnOpenReview.addEventListener('click', showReviewMode);
      }

      const btnAdminOpenSumm = document.getElementById('btnAdminOpenQuestionsSummary');
      if (btnAdminOpenSumm) {
        btnAdminOpenSumm.addEventListener('click', () => {
          if (resultCardEl) resultCardEl.innerHTML = '';
          if (questionTextEl) questionTextEl.style.display = 'block';
          if (optionsContainerEl) optionsContainerEl.style.display = 'flex';
          if (quizSubmitBar) quizSubmitBar.style.display = 'flex';
          renderCurrentQuestion();
        });
      }
    }

    if (headerBackBtn) {
      headerBackBtn.style.display = 'inline-flex';
    }
  }

  function renderCurrentQuestion() {
    const q = quizModel.getCurrentQuestion();
    const idx = quizModel.getCurrentIndex();
    const total = quizModel.getTotalQuestions();
    const savedAnswer = quizModel.getAnswer(idx);
    const isVerified = quizModel.isVerifiedCorrect(idx);

    if (questionNumberEl) questionNumberEl.textContent = idx + 1;
    if (totalQuestionsEl) totalQuestionsEl.textContent = total;
    if (questionTextEl) questionTextEl.textContent = q.questionText;

    // Reset feedback area
    if (quizFeedbackArea) {
      if (isVerified) {
        quizFeedbackArea.innerHTML = createMascotFeedbackHtml('', q.feedbackCorrect, true);
        quizFeedbackArea.style.display = 'block';
      } else if (pembahasanViewedMap[idx]) {
        showQuizPembahasan(idx, q, total);
      } else {
        quizFeedbackArea.innerHTML = '';
        quizFeedbackArea.style.display = 'none';
      }
    }

    // Render Options berdasarkan tipe soal
    if (optionsContainerEl) {
      if (q.type === 'tf' || q.type === 'mc') {
        let optsHtml = '';
        q.options.forEach(opt => {
          const isSelected = savedAnswer === opt.key;
          optsHtml += `
            <button type="button" class="option-btn ${isSelected ? 'selected' : ''}" data-opt="${opt.key}">
              <span class="option-key">${opt.key}</span>
              <span>${opt.label}</span>
            </button>
          `;
        });
        optionsContainerEl.innerHTML = optsHtml;

        const optionButtons = optionsContainerEl.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            const selected = btn.getAttribute('data-opt');
            quizModel.setAnswer(idx, selected);
            updateSubmitButtonState();
            // Re-render selection style
            optionButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
          });
        });
      } else if (q.type === 'essay') {
        optionsContainerEl.innerHTML = `
          <div class="quiz-essay-wrap">
            <label class="quiz-essay-label" for="quizEssayInput">Tuliskan Jawaban Anda:</label>
            <input type="text" id="quizEssayInput" class="quiz-essay-input" placeholder="Ketik hasil perhitungan Anda di sini..." value="${savedAnswer || ''}" autocomplete="off" />
          </div>
        `;

        const essayInput = document.getElementById('quizEssayInput');
        if (essayInput) {
          essayInput.addEventListener('input', () => {
            quizModel.setAnswer(idx, essayInput.value);
            updateSubmitButtonState();
          });
          essayInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              if (btnSubmitQuiz && !btnSubmitQuiz.disabled) {
                btnSubmitQuiz.click();
              }
            }
          });
        }
      }
    }

    // Navigasi Panah Kiri (Kembali):
    // "di halaman pertama level gaperlu panah kembali (panah kiri),,, sesuaikan pada semua level misi utama"
    if (btnPrevEl) {
      btnPrevEl.style.display = idx === 0 ? 'none' : 'flex';
      btnPrevEl.innerHTML = `
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      `;
    }

    // Navigasi Panah Kanan:
    // "untuk soal yang belum dijawab ini tanda panahnya warnanya matiin dulu aja,,, kalau sudah dijawab baru munculin warnanya"
    // "tetapi panah kanan warnanya mati blm bisa diklik jika belum menjawab soal dan diverifikasi jawaban benar."
    updateArrowNextState();

    // Tombol Verifikasi / Submit di Bawah
    updateSubmitButtonState();
  }

  // Lacak jumlah percobaan salah per soal dan status membuka pembahasan
  const questionAttempts = {};
  const pembahasanViewedMap = {};

  function updateArrowNextState() {
    const idx = quizModel.getCurrentIndex();
    const total = quizModel.getTotalQuestions();
    const isVerified = quizModel.isVerifiedCorrect(idx);
    const isPembahasanDone = !!pembahasanViewedMap[idx];
    // Admin bebas lanjut kapan saja pakai panah; siswa harus benar ATAU membaca pembahasan
    const canGoNext = isVerified || isPembahasanDone || isAdmin;

    if (btnNextEl) {
      btnNextEl.style.display = 'flex';
      btnNextEl.innerHTML = `
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      `;

      if (canGoNext) {
        btnNextEl.classList.remove('disabled');
        btnNextEl.disabled = false;
        btnNextEl.setAttribute('title', idx === total - 1 ? 'Soal Terakhir (Tuntaskan Evaluasi)' : 'Lanjut ke Soal Berikutnya');
      } else {
        btnNextEl.classList.add('disabled');
        btnNextEl.disabled = true;
        btnNextEl.setAttribute('title', 'Verifikasi jawaban dengan benar terlebih dahulu atau pelajari pembahasan');
      }
    }
  }

  function updateSubmitButtonState() {
    if (!btnSubmitQuiz) return;
    const idx = quizModel.getCurrentIndex();
    const currentAnswer = quizModel.getAnswer(idx);
    const hasInput = currentAnswer !== null && String(currentAnswer).trim().length > 0;

    if (hasInput || isAdmin) {
      btnSubmitQuiz.classList.remove('disabled');
      btnSubmitQuiz.disabled = false;
    } else {
      btnSubmitQuiz.classList.add('disabled');
      btnSubmitQuiz.disabled = true;
    }

    // Tombol Khusus Admin untuk kembali ke Review saat melihat Mode Soal
    let adminReviewBtn = document.getElementById('btnAdminQuizReturnReview');
    if (isAdmin && user.quizCompleted) {
      if (!adminReviewBtn && quizSubmitBar) {
        adminReviewBtn = document.createElement('button');
        adminReviewBtn.type = 'button';
        adminReviewBtn.id = 'btnAdminQuizReturnReview';
        adminReviewBtn.style.cssText = 'padding: 0.75rem 1.4rem; background: #0284C7; color: #FFFFFF; border: 1.5px solid #38BDF8; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 0.88rem; text-transform: uppercase; margin-left: 0.75rem;';
        adminReviewBtn.textContent = 'Lihat Rekaman';
        adminReviewBtn.addEventListener('click', showReviewMode);
        quizSubmitBar.appendChild(adminReviewBtn);
      }
    }
  }

  function showQuizPembahasan(idx, q, total) {
    pembahasanViewedMap[idx] = true;
    updateArrowNextState();

    const correctAnswerDisplay = q.correctOption 
      ? `Opsi ${q.correctOption}` 
      : (q.correctKeywords ? q.correctKeywords.join(', ') : 'Sesuai konsep eksponen');

    if (!quizFeedbackArea) return;

    quizFeedbackArea.innerHTML = `
      <div class="mascot-feedback-card is-pembahasan">
        <div class="mascot-peeking-badge">
          <img src="assets/images/r6.png" alt="Maskot Robot Pembahasan" class="mascot-peeking-img" onerror="this.onerror=null; this.src='assets/images/robot_mascot.png';">
        </div>
        <div class="mascot-feedback-content">
          <div class="mascot-feedback-title" style="color: #0284C7;">PEMBAHASAN SOAL ${idx + 1}</div>
          <div class="mascot-feedback-message" style="font-size: 0.98rem; line-height: 1.6; color: #0F172A;">
            <div style="margin-bottom: 0.65rem;">
              <strong>Kunci Jawaban:</strong> 
              <span style="color: #047857; font-weight: 800; background: #D1FAE5; padding: 0.2rem 0.6rem; border-radius: 6px; border: 1px solid #10B981; margin-left: 0.35rem;">${correctAnswerDisplay}</span>
            </div>
            <div style="background: #F0F9FF; border-left: 4px solid #0284C7; padding: 0.75rem 1rem; border-radius: 6px; color: #0C4A6E; font-size: 0.95rem; line-height: 1.6;">
              ${q.explanation || 'Pelajari kembali sifat dan konsep dasar eksponen pada soal ini.'}
            </div>
            <div style="margin-top: 1.25rem;">
              <button type="button" id="btnQuizNextFromPembahasan" style="padding: 0.75rem 1.6rem; background: linear-gradient(135deg, #10B981, #059669); color: #FFFFFF; border: none; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 0.45rem; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);">
                ${idx === total - 1 ? 'Selesaikan Persiapan Misi ✓' : 'Lanjut ke Soal Berikutnya →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    quizFeedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const btnNext = document.getElementById('btnQuizNextFromPembahasan');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (idx === total - 1) {
          const result = quizModel.calculateResult();
          showCompletion(result);
        } else {
          quizModel.nextQuestion();
          renderCurrentQuestion();
        }
      });
    }
  }

  // Verifikasi Jawaban ketika tombol Verifikasi Jawaban diklik
  if (btnSubmitQuiz) {
    btnSubmitQuiz.addEventListener('click', () => {
      const idx = quizModel.getCurrentIndex();
      const q = quizModel.getCurrentQuestion();
      const total = quizModel.getTotalQuestions();
      const currentAnswer = quizModel.getAnswer(idx);

      if (!currentAnswer && !isAdmin) {
        alert('Tuliskan atau pilih jawaban Anda terlebih dahulu!');
        return;
      }

      // Verifikasi jawaban murni - Admin cripci TETAP salah jika opsi salah!
      const isCorrect = currentAnswer ? quizModel.checkAnswer(idx, currentAnswer) : false;
      quizModel.setVerification(idx, isCorrect);

      if (quizFeedbackArea) {
        if (isCorrect) {
          // Jawaban Benar: Maskot r2.png, panah kanan aktif
          quizFeedbackArea.innerHTML = createMascotFeedbackHtml('', q.feedbackCorrect, true);
          quizFeedbackArea.style.display = 'block';
          quizFeedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          updateArrowNextState();
        } else {
          // Jawaban Salah: Maskot r3.png
          // Admin tetap dapat feedback salah dan batas kesempatan berjalan
          questionAttempts[idx] = (questionAttempts[idx] || 0) + 1;
          const attemptsUsed = questionAttempts[idx];

          if (attemptsUsed < 2) {
            // Cukup satu kesempatan menjawab ulang setelah salah (total 2 percobaan)
            const retryMsg = `
              ${q.feedbackWrongText}
              <div style="margin-top: 0.85rem; padding: 0.6rem 0.85rem; background: #FEF2F2; border: 1.5px dashed #EF4444; border-radius: 8px; color: #991B1B; font-weight: 700; font-size: 0.88rem;">
                ⚠️ Kesempatan mencoba tersisa: 1 kali lagi. Silakan coba kembali!
              </div>
            `;
            quizFeedbackArea.innerHTML = createMascotFeedbackHtml(q.feedbackWrongTitle, retryMsg, false);
            quizFeedbackArea.style.display = 'block';
            quizFeedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            updateArrowNextState();
          } else {
            // Kesempatan kedua salah: kesempatan habis -> arahkan ke tombol "Lihat Pembahasan"
            const exhaustedMsg = `
              <div class="mascot-feedback-card is-wrong">
                <div class="mascot-peeking-badge">
                  <img src="assets/images/r3.png" alt="Maskot Robot" class="mascot-peeking-img" onerror="this.onerror=null; this.src='assets/images/robot_mascot.png';">
                </div>
                <div class="mascot-feedback-content">
                  <div class="mascot-feedback-title">${q.feedbackWrongTitle}</div>
                  <div class="mascot-feedback-message">
                    ${q.feedbackWrongText}
                    <div style="margin-top: 0.85rem; padding: 0.6rem 0.85rem; background: #FEF2F2; border: 1.5px dashed #EF4444; border-radius: 8px; color: #991B1B; font-weight: 700; font-size: 0.9rem;">
                      ⚠️ Kesempatan menjawab untuk soal ini telah habis.
                    </div>
                    <div style="margin-top: 1rem;">
                      <button type="button" id="btnQuizOpenPembahasan" style="padding: 0.65rem 1.4rem; background: #0284C7; color: #FFFFFF; border: 1.5px solid #38BDF8; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 0.92rem; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);">
                        📖 Lihat Pembahasan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `;
            quizFeedbackArea.innerHTML = exhaustedMsg;
            quizFeedbackArea.style.display = 'block';
            quizFeedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            const btnOpenPembahasan = document.getElementById('btnQuizOpenPembahasan');
            if (btnOpenPembahasan) {
              btnOpenPembahasan.addEventListener('click', () => {
                showQuizPembahasan(idx, q, total);
              });
            }
            updateArrowNextState();
          }
        }
      }
    });
  }

  // Panah Kiri (Prev)
  if (btnPrevEl) {
    btnPrevEl.addEventListener('click', () => {
      if (quizModel.prevQuestion()) {
        renderCurrentQuestion();
      }
    });
  }

  // Panah Kanan (Next)
  if (btnNextEl) {
    btnNextEl.addEventListener('click', () => {
      const idx = quizModel.getCurrentIndex();
      const total = quizModel.getTotalQuestions();
      const isVerified = quizModel.isVerifiedCorrect(idx);
      const isPembahasanDone = !!pembahasanViewedMap[idx];

      // Admin bebas lanjut kapan saja pakai panah walaupun salah
      if (!isVerified && !isPembahasanDone && !isAdmin) {
        alert('Perhatian: Anda harus memverifikasi jawaban dengan benar terlebih dahulu atau menyelesaikan pembahasan sebelum melanjutkan!');
        return;
      }

      if (idx === total - 1) {
        // Tuntaskan kuis jika di soal terakhir
        const result = quizModel.calculateResult();
        showCompletion(result);
      } else {
        quizModel.nextQuestion();
        renderCurrentQuestion();
      }
    });
  }

  // Jika siswa sebelumnya sudah tuntas persiapan misi, langsung tampilkan ringkasan + review
  if (user.quizCompleted) {
    const prevScore = user.quizScore || 100;
    const totalQ = quizModel.getTotalQuestions();
    const correctCount = Math.round((prevScore / 100) * totalQ);
    showCompletion({
      score: prevScore,
      correctCount: correctCount,
      total: totalQ,
      xpEarned: 0
    });
  } else {
    renderCurrentQuestion();
  }

  // Event Listeners Modal Petunjuk Persiapan Misi
  const modalPetunjukKuis = document.getElementById('modalPetunjukKuis');
  const btnOpenPetunjukKuis = document.getElementById('btnOpenPetunjukKuis');
  const btnClosePetunjukKuis = document.getElementById('btnClosePetunjukKuis');
  const btnUnderstoodPetunjukKuis = document.getElementById('btnUnderstoodPetunjukKuis');

  function openPetunjukKuis() {
    if (modalPetunjukKuis) {
      modalPetunjukKuis.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closePetunjukKuis() {
    if (modalPetunjukKuis) {
      modalPetunjukKuis.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (btnOpenPetunjukKuis) btnOpenPetunjukKuis.addEventListener('click', openPetunjukKuis);
  if (btnClosePetunjukKuis) btnClosePetunjukKuis.addEventListener('click', closePetunjukKuis);
  if (btnUnderstoodPetunjukKuis) btnUnderstoodPetunjukKuis.addEventListener('click', closePetunjukKuis);

  window.addEventListener('click', (e) => {
    if (e.target === modalPetunjukKuis) closePetunjukKuis();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePetunjukKuis();
  });

  console.log('[Mat SMA - Expo City] QuizController siap.');
});
