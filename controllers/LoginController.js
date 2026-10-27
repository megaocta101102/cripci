/**
 * ==============================================================================
 * MAT SMA / EXPO CITY - LOGIN CONTROLLER (controllers/LoginController.js)
 * ==============================================================================
 * Mengontrol autentikasi: Login (Email/Nama Lengkap + Password) & Buat Akun,
 * toggle lihat/sembunyikan password dengan icon mata.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elemen Tab Mode
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const authTitle = document.getElementById('authTitle');

  // Elemen Form Login
  const loginForm = document.getElementById('loginForm');
  const identifierInput = document.getElementById('identifierInput');
  const passwordInput = document.getElementById('passwordInput');
  const loginFeedback = document.getElementById('loginFeedback');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeIconOpen = document.getElementById('eyeIconOpen');
  const eyeIconClosed = document.getElementById('eyeIconClosed');

  // Elemen Form Buat Akun
  const registerForm = document.getElementById('registerForm');
  const regEmailInput = document.getElementById('regEmailInput');
  const regNameInput = document.getElementById('regNameInput');
  const regPasswordInput = document.getElementById('regPasswordInput');
  const registerFeedback = document.getElementById('registerFeedback');
  const toggleRegPasswordBtn = document.getElementById('toggleRegPasswordBtn');
  const eyeRegIconOpen = document.getElementById('eyeRegIconOpen');
  const eyeRegIconClosed = document.getElementById('eyeRegIconClosed');

  // Fungsi Switch Tab: 'login' atau 'register'
  function switchAuthMode(mode) {
    if (loginFeedback) {
      loginFeedback.style.display = 'none';
      loginFeedback.textContent = '';
    }
    if (registerFeedback) {
      registerFeedback.style.display = 'none';
      registerFeedback.textContent = '';
    }

    if (mode === 'register') {
      if (tabLoginBtn) tabLoginBtn.classList.remove('active');
      if (tabRegisterBtn) tabRegisterBtn.classList.add('active');
      if (authTitle) authTitle.textContent = 'LOGIN';
      if (loginForm) loginForm.style.display = 'none';
      if (registerForm) registerForm.style.display = 'block';
      if (regEmailInput) regEmailInput.focus();
    } else {
      if (tabRegisterBtn) tabRegisterBtn.classList.remove('active');
      if (tabLoginBtn) tabLoginBtn.classList.add('active');
      if (authTitle) authTitle.textContent = 'LOGIN';
      if (registerForm) registerForm.style.display = 'none';
      if (loginForm) loginForm.style.display = 'block';
      if (identifierInput) identifierInput.focus();
    }
  }

  if (tabLoginBtn) {
    tabLoginBtn.addEventListener('click', () => switchAuthMode('login'));
  }
  if (tabRegisterBtn) {
    tabRegisterBtn.addEventListener('click', () => switchAuthMode('register'));
  }

  // Toggle Password Login
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      if (eyeIconOpen && eyeIconClosed) {
        eyeIconOpen.style.display = isPassword ? 'none' : 'block';
        eyeIconClosed.style.display = isPassword ? 'block' : 'none';
      }
    });
  }

  // Toggle Password Register
  if (toggleRegPasswordBtn && regPasswordInput) {
    toggleRegPasswordBtn.addEventListener('click', () => {
      const isPassword = regPasswordInput.type === 'password';
      regPasswordInput.type = isPassword ? 'text' : 'password';
      if (eyeRegIconOpen && eyeRegIconClosed) {
        eyeRegIconOpen.style.display = isPassword ? 'none' : 'block';
        eyeRegIconClosed.style.display = isPassword ? 'block' : 'none';
      }
    });
  }

  // Handle Form Buat Akun
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = regEmailInput ? regEmailInput.value.trim() : '';
      const fullName = regNameInput ? regNameInput.value.trim() : '';
      const password = regPasswordInput ? regPasswordInput.value.trim() : '';

      if (registerFeedback) {
        registerFeedback.style.display = 'none';
        registerFeedback.textContent = '';
      }

      const regResult = userModel.register(email, fullName, password);

      if (!regResult.success) {
        if (registerFeedback) {
          registerFeedback.style.color = '#B91C1C';
          registerFeedback.style.background = '#FEE2E2';
          registerFeedback.style.border = '1px solid #F87171';
          registerFeedback.style.padding = '0.75rem 1rem';
          registerFeedback.style.borderRadius = '8px';
          registerFeedback.textContent = regResult.message;
          registerFeedback.style.display = 'block';
        }
        return;
      }

      // Berhasil buat akun: beralih ke form Login, isi email/nama lengkap, dan tampilkan pesan sukses
      switchAuthMode('login');
      if (identifierInput) {
        identifierInput.value = email;
      }
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }

      if (loginFeedback) {
        loginFeedback.style.color = '#0369A1';
        loginFeedback.style.background = '#E0F2FE';
        loginFeedback.style.border = '1px solid #38BDF8';
        loginFeedback.style.padding = '0.75rem 1rem';
        loginFeedback.style.borderRadius = '8px';
        loginFeedback.textContent = 'Akun berhasil dibuat. Silakan login.';
        loginFeedback.style.display = 'block';
      }
    });
  }

  // Handle Form Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const identifier = identifierInput ? identifierInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      if (loginFeedback) {
        loginFeedback.style.display = 'none';
        loginFeedback.textContent = '';
      }

      // Validasi Login (Email / Nama Lengkap)
      const authResult = userModel.login(identifier, password);

      if (!authResult.success) {
        if (loginFeedback) {
          loginFeedback.style.color = '#B91C1C';
          loginFeedback.style.background = '#FEE2E2';
          loginFeedback.style.border = '1px solid #F87171';
          loginFeedback.style.padding = '0.75rem 1rem';
          loginFeedback.style.borderRadius = '8px';
          loginFeedback.textContent = authResult.message;
          loginFeedback.style.display = 'block';
        }
        return;
      }

      // Berhasil Login
      if (loginFeedback) {
        loginFeedback.style.color = '#0369A1';
        loginFeedback.style.background = '#E0F2FE';
        loginFeedback.style.border = '1px solid #38BDF8';
        loginFeedback.style.padding = '0.75rem 1rem';
        loginFeedback.style.borderRadius = '8px';
        loginFeedback.textContent = 'Login berhasil. Mengalihkan ke Beranda...';
        loginFeedback.style.display = 'block';
      }

      setTimeout(() => {
        window.location.href = 'menu.html';
      }, 450);
    });
  }
});
