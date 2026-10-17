// ─── Storage Keys ────────────────────────────────────────────────────────────
const KEYS = {
  access:  'devblog_access',
  refresh: 'devblog_refresh',
  user:    'devblog_user',
};

// ─── Auth Token Helpers ───────────────────────────────────────────────────────
const auth = {
  getToken:   ()        => localStorage.getItem(KEYS.access),
  isLoggedIn: ()        => !!auth.getToken(),
  getUser:    ()        => JSON.parse(localStorage.getItem(KEYS.user) || 'null'),

  save(access, refresh) {
    localStorage.setItem(KEYS.access, access);
    localStorage.setItem(KEYS.refresh, refresh);
  },

  saveUser(user) {
    localStorage.setItem(KEYS.user, JSON.stringify(user));
  },

  clear() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },

  async refresh() {
    const token = localStorage.getItem(KEYS.refresh);
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: token }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem(KEYS.access, data.access);
      if (data.refresh) localStorage.setItem(KEYS.refresh, data.refresh);
      return true;
    } catch {
      return false;
    }
  },
};

// ─── API Fetch (auto-attaches JWT, auto-refreshes on 401) ────────────────────
async function apiFetch(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    const ok = await auth.refresh();
    if (ok) {
      headers['Authorization'] = `Bearer ${auth.getToken()}`;
      res = await fetch(url, { ...options, headers });
    } else {
      auth.clear();
      window.location.href = '/login/';
      return null;
    }
  }
  return res;
}

// ─── UI Utilities ─────────────────────────────────────────────────────────────
function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast ${type} show`;
  setTimeout(() => { el.className = 'toast'; }, 3000);
}

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function hideEl(el) {
  if (el) el.style.display = 'none';
}

function setBtn(btn, text, disabled = false) {
  btn.textContent = text;
  btn.disabled = disabled;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function getInitials(name) {
  return name ? name.slice(0, 2).toUpperCase() : '?';
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function initNav() {
  const user     = auth.getUser();
  const guestEl  = document.getElementById('auth-links-guest');
  const userEl   = document.getElementById('auth-links-user');
  const nameEl   = document.getElementById('nav-username');
  const logoutBtn = document.getElementById('logout-btn');

  if (auth.isLoggedIn() && user) {
    hideEl(guestEl);
    if (userEl)  userEl.style.display = 'flex';
    if (nameEl)  nameEl.textContent = `@${user.username}`;
  } else {
    if (guestEl) guestEl.style.display = 'flex';
    hideEl(userEl);
  }

  logoutBtn?.addEventListener('click', () => {
    auth.clear();
    showToast('Logged out', 'success');
    setTimeout(() => { window.location.href = '/'; }, 800);
  });
}

// ─── Current User ─────────────────────────────────────────────────────────────
async function fetchCurrentUser() {
  if (!auth.isLoggedIn() || auth.getUser()) return;
  const res = await apiFetch('/api/auth/me/');
  if (res?.ok) {
    auth.saveUser(await res.json());
  }
}

// ─── Home Page — Post List ────────────────────────────────────────────────────
function buildPostCard(post) {
  const card = document.createElement('div');
  card.className = 'post-card';
  card.innerHTML = `
    <div class="post-card-tag">✦ Post</div>
    <div class="post-card-title">${post.title}</div>
    <div class="post-card-excerpt">${post.excerpt || post.content.slice(0, 120) + '...'}</div>
    <div class="post-card-footer">
      <div class="post-card-author">
        <div class="mini-avatar">${getInitials(post.author.username)}</div>
        <span>${post.author.username}</span>
      </div>
      <span class="post-card-date">${formatDate(post.created_at)}</span>
    </div>
  `;
  card.addEventListener('click', () => { window.location.href = `/post/${post.slug}/`; });
  return card;
}

async function loadPosts() {
  const grid      = document.getElementById('posts-grid');
  const errorEl   = document.getElementById('posts-error');
  const noPostsEl = document.getElementById('no-posts');
  const countEl   = document.getElementById('post-count');

  if (!grid) return;

  const user = auth.getUser();
  if (auth.isLoggedIn() && user) {
    hideEl(document.getElementById('hero-cta-guest'));
    const heroUser = document.getElementById('hero-cta-user');
    if (heroUser) heroUser.style.display = 'flex';
  }

  try {
    const res = await fetch('/api/posts/');
    if (!res.ok) throw new Error();
    const posts = await res.json();

    grid.innerHTML = '';

    if (posts.length === 0) {
      if (noPostsEl) noPostsEl.style.display = 'block';
      return;
    }

    if (countEl) countEl.textContent = `${posts.length} post${posts.length !== 1 ? 's' : ''}`;
    posts.forEach(post => grid.appendChild(buildPostCard(post)));

  } catch {
    grid.innerHTML = '';
    showError(errorEl, 'Could not load posts. Make sure the server is running.');
  }
}

// ─── Post Detail Page ─────────────────────────────────────────────────────────
async function loadPostDetail() {
  const article  = document.getElementById('post-article');
  const skeleton = document.getElementById('post-loading');
  const errorEl  = document.getElementById('post-error');

  if (!article || typeof POST_SLUG === 'undefined') return;

  try {
    const res = await fetch(`/api/posts/${POST_SLUG}/`);
    if (!res.ok) throw new Error();
    const post = await res.json();

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('page-title',      `${post.title} — DevBlog`);
    set('post-title',      post.title);
    set('post-author',     post.author.username);
    set('post-date',       formatDate(post.created_at));
    set('post-content',    post.content);
    set('author-initials', getInitials(post.author.username));

    const tagsEl = document.getElementById('post-tags');
    if (tagsEl) tagsEl.innerHTML = `<span class="tag-pill">✦ Post</span>`;

    hideEl(skeleton);
    article.style.display = 'block';

  } catch {
    hideEl(skeleton);
    if (errorEl) errorEl.style.display = 'block';
  }
}

// ─── Password Toggle ──────────────────────────────────────────────────────────
function initPasswordToggle(toggleId, inputId) {
  document.getElementById(toggleId)?.addEventListener('click', () => {
    const input = document.getElementById(inputId);
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  });
}

// ─── Password Strength Meter ──────────────────────────────────────────────────
function initPasswordStrength(inputId, barId) {
  const input = document.getElementById(inputId);
  const bar   = document.getElementById(barId);
  if (!input || !bar) return;

  const WIDTHS = ['0%', '25%', '50%', '75%', '100%'];
  const COLORS = ['#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];

  input.addEventListener('input', () => {
    const v = input.value;
    const score = [v.length >= 6, /[A-Z]/.test(v), /[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)]
      .filter(Boolean).length;
    bar.style.setProperty('--strength',       WIDTHS[score]);
    bar.style.setProperty('--strength-color', COLORS[score]);
  });
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  initPasswordToggle('toggle-pw', 'password');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn     = document.getElementById('login-btn');
    const errorEl = document.getElementById('login-error');

    setBtn(btn, 'Signing in...', true);
    hideEl(errorEl);

    try {
      const res  = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: document.getElementById('username').value.trim(),
          password: document.getElementById('password').value,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        auth.save(data.access, data.refresh);
        showToast('Logged in! Redirecting...', 'success');
        setTimeout(() => { window.location.href = '/'; }, 900);
      } else {
        const msg = data.detail || Object.values(data).flat().join(' ');
        showError(errorEl, msg || 'Invalid credentials.');
        setBtn(btn, 'Sign In');
      }
    } catch {
      showError(errorEl, 'Network error. Please try again.');
      setBtn(btn, 'Sign In');
    }
  });
}

// ─── Signup Form ──────────────────────────────────────────────────────────────
function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  initPasswordToggle('toggle-pw', 'password');
  initPasswordStrength('password', 'pw-strength');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn       = document.getElementById('signup-btn');
    const errorEl   = document.getElementById('signup-error');
    const successEl = document.getElementById('signup-success');

    setBtn(btn, 'Creating account...', true);
    hideEl(errorEl);
    hideEl(successEl);

    try {
      const res  = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: document.getElementById('username').value.trim(),
          email:    document.getElementById('email').value.trim(),
          password: document.getElementById('password').value,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        auth.save(data.tokens.access, data.tokens.refresh);
        auth.saveUser(data.user);
        if (successEl) {
          successEl.textContent = `Welcome, ${data.user.username}! Redirecting...`;
          successEl.style.display = 'block';
        }
        showToast('Account created! 🎉', 'success');
        setTimeout(() => { window.location.href = '/'; }, 1200);
      } else {
        const msg = Object.entries(data)
          .map(([k, v]) => `${k}: ${[].concat(v).join(', ')}`)
          .join(' | ');
        showError(errorEl, msg || 'Registration failed.');
        setBtn(btn, 'Create Account');
      }
    } catch {
      showError(errorEl, 'Network error. Please try again.');
      setBtn(btn, 'Create Account');
    }
  });
}

// ─── App Entry Point ──────────────────────────────────────────────────────────
async function init() {
  await fetchCurrentUser();
  initNav();
  loadPosts();
  loadPostDetail();
  initLoginForm();
  initSignupForm();
}

document.addEventListener('DOMContentLoaded', init);
