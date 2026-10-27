/**
 * ==============================================================================
 * EDUTECH CITY - USER MODEL (models/UserModel.js)
 * ==============================================================================
 * Mengelola state pengguna, autentikasi email/username + password,
 * hak akses khusus Admin (cripci2023@gmail.com / megaoctavia1011),
 * serta rekaman jawaban persisten per akun (Kuis & 3 Level Escape Room Misi Utama).
 * ==============================================================================
 */

class UserModel {
  constructor() {
    this.sessionKey = 'edutech_active_session';
    this.usersDbKey = 'edutech_users_database';
    this.currentUser = this.loadActiveSession();
  }

  // Mengambil database semua akun dari localStorage
  getAllUsers() {
    try {
      const data = localStorage.getItem(this.usersDbKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn('Gagal membaca users database:', e);
      return {};
    }
  }

  // Menyimpan database semua akun ke localStorage
  saveAllUsers(users) {
    try {
      localStorage.setItem(this.usersDbKey, JSON.stringify(users));
    } catch (e) {
      console.warn('Gagal menyimpan users database:', e);
    }
  }

  loadActiveSession() {
    try {
      const activeUser = localStorage.getItem(this.sessionKey);
      if (activeUser) {
        const parsed = JSON.parse(activeUser);
        if (parsed && (parsed.isAdmin || parsed.isSpecialAdmin || (parsed.identifier && parsed.identifier.toLowerCase().includes('cripci')))) {
          parsed.isLoggedIn = true;
          // Khusus akun cripci: jangan diselesaikan otomatis agar bisa dipakai untuk uji coba
          if (parsed.quizCompleted === true && parsed.completedMissionLevels && parsed.completedMissionLevels.length === 3) {
            parsed.quizCompleted = false;
            parsed.completedMissionLevels = [];
            parsed.missionLevelAnswers = {};
            parsed.quizAnswers = {};
            parsed.currentMissionLevel = 1;
            parsed.unlockedMissionLevels = [1, 2, 3];
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Gagal membaca sesi aktif:', e);
    }

    return {
      identifier: '',
      username: '',
      fullName: '',
      role: 'student',
      isAdmin: false,
      isLoggedIn: false,
      quizCompleted: false,
      quizScore: 0,
      quizAnswers: {},
      unlockedMissionLevels: [1],
      completedMissionLevels: [],
      missionLevelAnswers: {},
      currentMissionLevel: 1,
      totalXp: 0,
      cityLevel: 1
    };
  }

  saveActiveSession() {
    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
      // Sinkronkan ke database akun pengguna jika sedang login
      if (this.currentUser.identifier && this.currentUser.isLoggedIn) {
        const users = this.getAllUsers();
        const key = this.currentUser.identifier.toLowerCase().trim();
        users[key] = { ...this.currentUser };
        this.saveAllUsers(users);
      }
    } catch (e) {
      console.warn('Gagal menyimpan sesi aktif:', e);
    }
  }

  /**
   * Pendaftaran akun baru (Email, Nama Lengkap, Password).
   */
  register(email, fullName, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (fullName || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanEmail) {
      return { success: false, message: 'Silakan masukkan email Anda.' };
    }
    if (!cleanName) {
      return { success: false, message: 'Silakan masukkan nama lengkap Anda.' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Silakan masukkan password Anda.' };
    }

    const users = this.getAllUsers();
    const userList = Object.values(users);

    const emailExists = userList.some(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, message: 'Email sudah terdaftar. Silakan login.' };
    }

    const newUser = {
      identifier: cleanEmail,
      email: cleanEmail,
      fullName: cleanName,
      username: cleanName,
      password: cleanPass,
      role: 'student',
      isAdmin: false,
      isSpecialAdmin: false,
      isLoggedIn: false,
      quizCompleted: false,
      quizScore: 0,
      quizAnswers: {},
      unlockedMissionLevels: [1],
      completedMissionLevels: [],
      missionLevelAnswers: {},
      currentMissionLevel: 1,
      totalXp: 0,
      cityLevel: 0
    };

    users[cleanEmail] = newUser;
    this.saveAllUsers(users);

    return {
      success: true,
      message: 'Akun berhasil dibuat. Silakan login.',
      user: newUser
    };
  }

  /**
   * Login dengan Email atau Nama Lengkap dan Password.
   * Akun khusus:
   * Email/Username: cripci2023@gmail.com atau cripci
   * Password: megaoctavia1011 atau cripci
   */
  login(rawIdentifier, rawPassword) {
    const identifier = (rawIdentifier || '').trim();
    const password = (rawPassword || '').trim();

    if (!identifier) {
      return {
        success: false,
        message: 'Silakan masukkan Email atau Nama Lengkap Anda.'
      };
    }

    if (!password) {
      return {
        success: false,
        message: 'Silakan masukkan Password Anda.'
      };
    }

    const key = identifier.toLowerCase();
    const users = this.getAllUsers();

    // 1. Cek Kredensial Khusus Admin (cripci / cripci2023@gmail.com) - Bebas login
    const isCripciAdmin = key === 'cripci2023@gmail.com' || 
                          key === 'cripci' || 
                          key === 'cripci2023' || 
                          key === 'admin' || 
                          key === 'admin cripci' || 
                          key.includes('cripci');

    if (isCripciAdmin) {
      this.currentUser = {
        identifier: 'cripci2023@gmail.com',
        email: 'cripci2023@gmail.com',
        username: 'Admin Cripci',
        fullName: 'Admin Cripci',
        password: password || 'megaoctavia1011',
        role: 'admin',
        isAdmin: true,
        isSpecialAdmin: true,
        isLoggedIn: true,
        quizCompleted: false, // Jangan diselesaikan agar bisa untuk uji coba
        quizScore: 0,
        quizAnswers: {},
        unlockedMissionLevels: [1, 2, 3], // Tetap bisa lanjut melihat seluruh halaman
        completedMissionLevels: [], // Belum selesai untuk uji coba
        missionLevelAnswers: {},
        currentMissionLevel: 1,
        totalXp: 0,
        cityLevel: 3 // Admin level 3 sesuai instruksi
      };

      this.saveActiveSession();
      return {
        success: true,
        user: this.currentUser,
        isAdmin: true
      };
    }

    // 2. Akun Siswa: Cari berdasarkan Email atau Nama Lengkap (case-insensitive)
    const userList = Object.values(users);
    const matchedUser = userList.find(u => {
      const emailMatch = u.email && u.email.toLowerCase() === key;
      const nameMatch = u.fullName && u.fullName.trim().toLowerCase() === key;
      return emailMatch || nameMatch;
    });

    if (!matchedUser) {
      return {
        success: false,
        message: 'Akun belum terdaftar. Silakan buat akun terlebih dahulu.'
      };
    }

    if (matchedUser.password && matchedUser.password !== password) {
      return {
        success: false,
        message: 'Password salah.'
      };
    }

    this.currentUser = {
      ...matchedUser,
      isLoggedIn: true,
      isAdmin: false,
      isSpecialAdmin: false,
      role: 'student'
    };

    this.saveActiveSession();
    return {
      success: true,
      user: this.currentUser,
      isAdmin: false
    };
  }

  logout() {
    this.saveActiveSession(); // Simpan progres sebelum logout
    this.currentUser = {
      identifier: '',
      username: '',
      fullName: '',
      role: 'student',
      isAdmin: false,
      isLoggedIn: false,
      quizCompleted: false,
      quizScore: 0,
      quizAnswers: {},
      unlockedMissionLevels: [1],
      completedMissionLevels: [],
      missionLevelAnswers: {},
      currentMissionLevel: 1,
      totalXp: 0,
      cityLevel: 1
    };
    try {
      localStorage.removeItem(this.sessionKey);
    } catch (e) {
      console.warn('Gagal menghapus sesi aktif:', e);
    }
  }

  getUser() {
    return this.currentUser;
  }

  // Khusus cripci (admin) bisa akses misi utama langsung tanpa kuis
  isMissionUnlocked() {
    if (this.currentUser.isAdmin || this.currentUser.isSpecialAdmin) {
      return true;
    }
    return !!this.currentUser.quizCompleted;
  }

  // Akses level misi utama (Level 1, 2, atau 3)
  canAccessMissionLevel(levelNum) {
    if (this.currentUser.isAdmin || this.currentUser.isSpecialAdmin) {
      return true;
    }
    const unlocked = this.currentUser.unlockedMissionLevels || [1];
    return unlocked.includes(levelNum);
  }

  isMissionLevelCompleted(levelNum) {
    const completed = this.currentUser.completedMissionLevels || [];
    return completed.includes(levelNum);
  }

  // Menyimpan hasil kuis persiapan misi
  setQuizResult(score, answers, xpEarned) {
    this.currentUser.quizCompleted = true;
    this.currentUser.quizScore = score;
    this.currentUser.quizAnswers = answers;
    this.currentUser.totalXp = (this.currentUser.totalXp || 0) + xpEarned;
    this.currentUser.cityLevel = Math.floor(this.currentUser.totalXp / 200) + 1;
    this.saveActiveSession();
  }

  // Menyelesaikan level misi escape room dan membuka level berikutnya
  solveMissionLevel(levelNum, answerData, xpAward = 100) {
    if (!this.currentUser.completedMissionLevels) {
      this.currentUser.completedMissionLevels = [];
    }
    if (!this.currentUser.completedMissionLevels.includes(levelNum)) {
      this.currentUser.completedMissionLevels.push(levelNum);
    }

    if (!this.currentUser.missionLevelAnswers) {
      this.currentUser.missionLevelAnswers = {};
    }
    this.currentUser.missionLevelAnswers[levelNum] = answerData;

    if (!this.currentUser.unlockedMissionLevels) {
      this.currentUser.unlockedMissionLevels = [1];
    }
    // Buka level berikutnya (jika belum level 2)
    if (levelNum < 2 && !this.currentUser.unlockedMissionLevels.includes(levelNum + 1)) {
      this.currentUser.unlockedMissionLevels.push(levelNum + 1);
    }

    this.currentUser.currentMissionLevel = Math.min(2, levelNum + 1);
    this.currentUser.totalXp = (this.currentUser.totalXp || 0) + xpAward;
    this.currentUser.cityLevel = Math.floor(this.currentUser.totalXp / 200) + 1;
    this.saveActiveSession();
  }

  // Khusus Admin cripci: Bypass / Lewati level langsung tanpa menjawab
  adminBypassLevel(levelNum) {
    this.solveMissionLevel(levelNum, { bypassed: true, note: 'Bypass Admin Cripci' }, 100);
  }
}

const userModel = new UserModel();
