/**
 * User Auth UI
 * Handles login/register overlay, tabs, forms, and header profile display
 */

import { signInWithGitHub, signInWithEmail, signUpWithEmail, signOut, onAuthStateChange } from './auth.js';

/**
 * Initialize auth UI: listen for auth state changes and toggle overlay/profile
 * @param {Object} callbacks - { onLogin(session), onLogout() }
 */
export function initAuthUI(callbacks) {
  setupAuthButtons();
  setupAuthTabs();
  setupLoginForm();
  setupRegisterForm();

  onAuthStateChange((_event, session) => {
    if (session) {
      showLoggedInUI(session);
      callbacks.onLogin?.(session);
    } else {
      showLoggedOutUI();
      callbacks.onLogout?.();
    }
  });
}

// ─── UI State ─────────────────────────────────────
function showLoggedInUI(session) {
  document.getElementById('user-profile')?.classList.remove('hidden');
  document.getElementById('user-profile')?.classList.add('flex');
  document.getElementById('btn-login')?.classList.add('hidden');
  document.getElementById('btn-add-task')?.classList.remove('hidden');
  document.getElementById('btn-add-task')?.classList.add('flex');

  const meta = session.user?.user_metadata || {};
  const nameEl = document.getElementById('user-name');
  const avatarEl = document.getElementById('user-avatar');

  const displayName = meta.full_name || meta.user_name || meta.name || session.user?.email || 'User';

  if (nameEl) {
    nameEl.textContent = displayName;
  }

  if (avatarEl) {
    if (meta.avatar_url) {
      avatarEl.src = meta.avatar_url;
      avatarEl.alt = displayName;
    } else {
      // Generate gradient avatar with initials for email users
      avatarEl.src = generateInitialAvatar(displayName);
      avatarEl.alt = displayName;
    }
  }
}

/**
 * Generate a canvas-based avatar with gradient background and user initial
 */
function generateInitialAvatar(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Pick gradient colors based on name hash
  const gradients = [
    ['#6366f1', '#8b5cf6'],  // indigo → violet
    ['#ec4899', '#f43f5e'],  // pink → rose
    ['#14b8a6', '#06b6d4'],  // teal → cyan
    ['#f59e0b', '#ef4444'],  // amber → red
    ['#8b5cf6', '#ec4899'],  // violet → pink
    ['#10b981', '#3b82f6'],  // emerald → blue
    ['#f97316', '#eab308'],  // orange → yellow
    ['#6366f1', '#06b6d4'],  // indigo → cyan
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = gradients[Math.abs(hash) % gradients.length];

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 128, 128);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;

  // Rounded rect
  ctx.beginPath();
  ctx.roundRect(0, 0, 128, 128, 28);
  ctx.fill();

  // Draw initial letter
  const initial = (name.charAt(0) || '?').toUpperCase();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 56px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, 64, 68);

  return canvas.toDataURL('image/png');
}

function showLoggedOutUI() {
  document.getElementById('user-profile')?.classList.add('hidden');
  document.getElementById('user-profile')?.classList.remove('flex');
  document.getElementById('btn-login')?.classList.remove('hidden');
  document.getElementById('btn-add-task')?.classList.add('hidden');
  document.getElementById('btn-add-task')?.classList.remove('flex');
}

function getAuthPageUrl() {
  return new URL('user.html', window.location.href).href;
}

import { showToast } from '../ui/toast.js';

// ─── Button Bindings ──────────────────────────────
function setupAuthButtons() {
  // Login button → redirect to auth page
  document.getElementById('btn-login')?.addEventListener('click', () => {
    window.location.href = getAuthPageUrl();
  });
  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    try {
      await signOut();
      window.location.href = getAuthPageUrl();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  });
  document.getElementById('btn-overlay-github')?.addEventListener('click', () => signInWithGitHub());
  
  // Edit Profile button
  document.getElementById('btn-edit-profile')?.addEventListener('click', () => {
    showToast('Tính năng cập nhật hồ sơ đang được phát triển', 'info');
  });
}

// ─── Tab Switching ────────────────────────────────
function setupAuthTabs() {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  tabLogin?.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    tabRegister.classList.add('text-white/50');
    tabLogin.classList.remove('text-white/50');
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
  });

  tabRegister?.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    tabLogin.classList.add('text-white/50');
    tabRegister.classList.remove('text-white/50');
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
  });
}

// ─── Login Form ───────────────────────────────────
function setupLoginForm() {
  const form = document.getElementById('form-login');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    errEl.classList.add('hidden');
    try {
      await signInWithEmail(email, pass);
    } catch (err) {
      errEl.textContent = err.message || 'Sai email hoặc mật khẩu.';
      errEl.classList.remove('hidden');
    }
  });
}

// ─── Register Form ────────────────────────────────
function setupRegisterForm() {
  const form = document.getElementById('form-register');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const pass = document.getElementById('register-password').value;
    const pass2 = document.getElementById('register-password-confirm').value;
    const errEl = document.getElementById('register-error');
    const successEl = document.getElementById('register-success');
    errEl.classList.add('hidden');
    successEl.classList.add('hidden');

    if (pass !== pass2) {
      errEl.textContent = 'Mật khẩu nhập lại không khớp.';
      errEl.classList.remove('hidden');
      return;
    }
    if (pass.length < 6) {
      errEl.textContent = 'Mật khẩu phải có ít nhất 6 ký tự.';
      errEl.classList.remove('hidden');
      return;
    }
    try {
      await signUpWithEmail(email, pass);
      successEl.textContent = 'Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.';
      successEl.classList.remove('hidden');
      form.reset();
    } catch (err) {
      errEl.textContent = err.message || 'Đăng ký thất bại.';
      errEl.classList.remove('hidden');
    }
  });
}
