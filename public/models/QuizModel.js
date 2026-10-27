/**
 * ==============================================================================
 * MAT SMA / EXPO CITY - QUIZ MODEL (models/QuizModel.js)
 * ==============================================================================
 * Model data persiapan misi sesuai konsep PDF (konsep_persiapan_misi_df3bf264.pdf).
 * Berisi 8 soal prasyarat eksponen:
 * - Soal 1: True / False (4^4 × 4^-3 = 16)
 * - Soal 2: Pilihan Ganda (4^3 × 3^2)
 * - Soal 3: Pilihan Ganda ((3/4)^2 × (3/4)^3)
 * - Soal 4: Pilihan Ganda ((2/3)^3)
 * - Soal 5: Pilihan Ganda (9 × (1/3)^3)
 * - Soal 6: True / False (6^-5 < 3^5)
 * - Soal 7: Esai Singkat (Amoeba Dr. Stone)
 * - Soal 8: Esai Singkat (Peluruhan Radioaktif Dr. Stone)
 * ==============================================================================
 */

class QuizModel {
  constructor() {
    this.questions = [
      {
        id: 1,
        type: 'tf',
        questionText: 'Sistem mendeteksi perhitungan: 4⁴ × 4⁻³ = 16. Apakah verifikasi ini BENAR atau SALAH?',
        options: [
          { key: 'Benar', label: 'Benar' },
          { key: 'Salah', label: 'Salah' }
        ],
        correctOption: 'Salah',
        feedbackCorrect: 'Jawaban kamu tepat!',
        feedbackWrongTitle: '[WARNING! AKSES DITOLAK]',
        feedbackWrongText: 'Agen, perhatikan basis bilangannya. Jika basis bilangan sama (yaitu 4), kamu hanya perlu menjumlahkan pangkatnya tanpa mengalikan basis bilangannya.\n\nGunakan sifat eksponen: aᵐ × aⁿ = aᵐ⁺ⁿ.',
        explanation: 'Basis bilangannya sama (4), sehingga pangkatnya dijumlahkan: 4⁴ × 4⁻³ = 4⁴⁺⁽⁻³⁾ = 4¹ = 4 (Bukan 16). Jadi pernyataan tersebut SALAH.'
      },
      {
        id: 2,
        type: 'mc',
        questionText: 'Hasil dari 4³ × 3² adalah …',
        options: [
          { key: 'A', label: '72' },
          { key: 'B', label: '144' },
          { key: 'C', label: '576' },
          { key: 'D', label: '12⁵' }
        ],
        correctOption: 'C',
        feedbackCorrect: 'Jawaban kamu tepat!',
        feedbackWrongTitle: '[WARNING! AKSES DITOLAK]',
        feedbackWrongText: 'Agen, kamu tidak bisa menggabungkan eksponen jika basis bilangan berbeda. Sifat perkalian eksponen aᵐ × aⁿ = aᵐ⁺ⁿ hanya berlaku jika basis bilangannya sama.\n\nUntuk soal 2, nilai dari masing-masing bilangan berpangkat tersebut (4³ dan 3²) harus dihitung secara terpisah terlebih dahulu.',
        explanation: 'Karena basisnya berbeda (4 dan 3), hitung masing-masing: 4³ = 64 dan 3² = 9. Maka 64 × 9 = 576.'
      },
      {
        id: 3,
        type: 'mc',
        questionText: 'Bentuk sederhana dari (3/4)² × (3/4)³ adalah …',
        options: [
          { key: 'A', label: '(3/4)⁶' },
          { key: 'B', label: '(3/4)⁵' },
          { key: 'C', label: '(9/16)⁵' },
          { key: 'D', label: '(9/16)⁶' }
        ],
        correctOption: 'B',
        feedbackCorrect: 'Jawaban kamu tepat!',
        feedbackWrongTitle: '[KALIBRASI GAGAL]',
        feedbackWrongText: 'Perhatikan basis pecahannya. Karena basisnya sama, yaitu 3/4, kamu bisa langsung menerapkan sifat perkalian eksponen dengan menjumlahkan pangkatnya.\n\nGunakan sifat eksponen: aᵐ × aⁿ = aᵐ⁺ⁿ.',
        explanation: 'Basis kedua pecahan sama yaitu (3/4). Berdasarkan sifat aᵐ × aⁿ = aᵐ⁺ⁿ, maka (3/4)² × (3/4)³ = (3/4)²⁺³ = (3/4)⁵.'
      },
      {
        id: 4,
        type: 'mc',
        questionText: 'Hasil dari (2/3)³, adalah …',
        options: [
          { key: 'A', label: '6/9' },
          { key: 'B', label: '8/9' },
          { key: 'C', label: '8/27' },
          { key: 'D', label: '16/27' }
        ],
        correctOption: 'C',
        feedbackCorrect: 'Jawaban kamu tepat!',
        feedbackWrongTitle: '[KALIBRASI GAGAL]',
        feedbackWrongText: 'Ingat sifat distribusi pangkat! Pangkat 3 di luar kurung berlaku untuk pembilang (2) dan penyebut (3).\n\nGunakan sifat eksponen: (a/b)ⁿ = aⁿ / bⁿ.',
        explanation: 'Sesuai sifat distribusi pangkat (a/b)ⁿ = aⁿ / bⁿ, maka (2/3)³ = 2³ / 3³ = 8 / 27.'
      },
      {
        id: 5,
        type: 'mc',
        questionText: 'Hasil dari 9 × (1/3)³ adalah …',
        options: [
          { key: 'A', label: '1/9' },
          { key: 'B', label: '1/3' },
          { key: 'C', label: '1' },
          { key: 'D', label: '3' }
        ],
        correctOption: 'B',
        feedbackCorrect: 'Jawaban kamu tepat!',
        feedbackWrongTitle: '[KALIBRASI GAGAL]',
        feedbackWrongText: 'Perhitunganmu meleset. Gunakan sifat eksponen: (a/b)ⁿ = aⁿ / bⁿ, kemudian kalikan dengan bilangan awal.',
        explanation: '(1/3)³ = 1 / 27. Maka 9 × (1/27) = 9/27 = 1/3.'
      },
      {
        id: 6,
        type: 'tf',
        questionText: 'Sistem menganalisis perbandingan: 6⁻⁵ < 3⁵. Apakah pernyataan tersebut BENAR atau SALAH?',
        options: [
          { key: 'Benar', label: 'Benar' },
          { key: 'Salah', label: 'Salah' }
        ],
        correctOption: 'Benar',
        feedbackCorrect: 'Jawaban kamu tepat!',
        feedbackWrongTitle: '[LOGIKA GAGAL!]',
        feedbackWrongText: 'Gunakan sifat eksponen pangkat negatif: a⁻ⁿ = 1 / aⁿ untuk 6⁻⁵.\n\nKemudian, hitunglah nilai dari masing-masing bilangan berpangkat tersebut dan bandingkan hasilnya.',
        explanation: '6⁻⁵ = 1 / 6⁵ = 1 / 7776 (pecahan sangat kecil positif < 1), sedangkan 3⁵ = 243. Jelas bahwa 1/7776 < 243, sehingga pernyataan BENAR.'
      },
      {
        id: 7,
        type: 'essay',
        questionText: 'Dr. Stone mengamati pertumbuhan amoeba di laboratorium. Jika mula-mula terdapat 1 amoeba dan jumlahnya menjadi dua kali lipat setiap 30 menit, berapa jumlah amoeba setelah 3 jam?',
        correctKeywords: ['64'],
        feedbackCorrect: 'Jawaban kamu tepat!',
        feedbackWrongTitle: '[SIMULASI GAGAL]',
        feedbackWrongText: '● Pola "dua kali lipat" berhubungan dengan eksponen basis 2.\n● Hitung banyak siklus pembelahan dalam 3 jam untuk menentukan pangkatnya.\n● Untuk model matematikanya, gunakan definisi dasar eksponen:\naⁿ = a × a × ··· × a sebanyak n kali.',
        explanation: 'Dalam 3 jam (180 menit), pembelahan terjadi tiap 30 menit = 180 / 30 = 6 siklus. Jumlah amoeba = 1 × 2⁶ = 64 amoeba.'
      },
      {
        id: 8,
        type: 'essay',
        questionText: 'Dr. Stone mengamati peluruhan zat radioaktif di laboratorium. Jika jumlah zat radioaktif mula-mula 1 gram dan berkurang menjadi setengah dari jumlah sebelumnya setiap 60 menit, berapa jumlah zat yang tersisa setelah 5 jam?',
        correctKeywords: ['1/32'],
        feedbackCorrect: 'Jawaban kamu tepat!',
        feedbackWrongTitle: '[SIMULASI GAGAL]',
        feedbackWrongText: '● Pola "berkurang menjadi 1/2 dari jumlah sebelumnya" berhubungan dengan eksponen basis pecahan 1/2.\n● Hitung banyak siklus pengurangan zat dalam 5 jam untuk menentukan pangkatnya.\n● Untuk model matematikanya, gunakan sifat eksponen: (a/b)ⁿ = aⁿ / bⁿ.\n● Hitung hasil akhir: a/b × a/b × ··· × a/b sebanyak n kali.',
        explanation: 'Dalam 5 jam, peluruhan tiap 60 menit terjadi 5 siklus. Sisa zat = 1 × (1/2)⁵ = 1 / 32 gram.'
      }
    ];

    this.currentIndex = 0;
    this.userAnswers = {};
    this.loadUserProgress();
  }

  loadUserProgress() {
    const user = userModel.getUser();
    if (user && user.quizAnswers) {
      this.userAnswers = { ...user.quizAnswers };
    }
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  getTotalQuestions() {
    return this.questions.length;
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  setAnswer(questionIndex, selectedAnswer) {
    if (!this.userAnswers[questionIndex]) {
      this.userAnswers[questionIndex] = {};
    }
    this.userAnswers[questionIndex].answer = selectedAnswer;

    // Simpan progres jawaban saat ini ke sesi aktif
    const user = userModel.getUser();
    if (user) {
      user.quizAnswers = this.userAnswers;
      userModel.saveActiveSession();
    }
  }

  setVerification(questionIndex, isCorrect) {
    if (!this.userAnswers[questionIndex]) {
      this.userAnswers[questionIndex] = {};
    }
    this.userAnswers[questionIndex].isCorrect = isCorrect;
    const user = userModel.getUser();
    if (user) {
      user.quizAnswers = this.userAnswers;
      userModel.saveActiveSession();
    }
  }

  getAnswerData(questionIndex) {
    return this.userAnswers[questionIndex] || null;
  }

  getAnswer(questionIndex) {
    const data = this.userAnswers[questionIndex];
    return data ? data.answer : null;
  }

  isVerifiedCorrect(questionIndex) {
    const data = this.userAnswers[questionIndex];
    return data ? !!data.isCorrect : false;
  }

  checkAnswer(questionIndex, inputAnswer) {
    const q = this.questions[questionIndex];
    if (!q) return false;

    if (q.type === 'tf' || q.type === 'mc') {
      return String(inputAnswer).trim().toLowerCase() === String(q.correctOption).trim().toLowerCase();
    } else if (q.type === 'essay') {
      const cleanInput = String(inputAnswer).replace(/\s+/g, '').toLowerCase();
      return q.correctKeywords.some(keyword => {
        const cleanKey = String(keyword).replace(/\s+/g, '').toLowerCase();
        return cleanInput.includes(cleanKey);
      });
    }
    return false;
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }

  calculateResult() {
    // Bobot poin per soal sesuai ketentuan:
    // No 1-4: 11 poin, No 5-6: 13 poin, No 7-8: 15 poin (Total = 100 poin)
    const questionPoints = [11, 11, 11, 11, 13, 13, 15, 15];
    let correctCount = 0;
    let totalScore = 0;

    this.questions.forEach((q, idx) => {
      const ansData = this.userAnswers[idx];
      const ans = ansData ? ansData.answer : null;
      const isCorrect = ans && this.checkAnswer(idx, ans);
      if (isCorrect) {
        correctCount++;
        totalScore += (questionPoints[idx] || 0);
        if (ansData) ansData.isCorrect = true;
      } else {
        if (ansData) ansData.isCorrect = false;
      }
    });

    const total = this.questions.length;
    const score = totalScore;
    const xpEarned = totalScore;

    // Simpan ke UserModel
    userModel.setQuizResult(score, this.userAnswers, xpEarned);

    return {
      total,
      correctCount,
      score,
      xpEarned
    };
  }
}

const quizModel = new QuizModel();
