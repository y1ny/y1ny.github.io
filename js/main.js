// Dark mode toggle (desktop + mobile), mobile menu, nav active state.
// Icons are inlined via <svg><use href="assets/icons.svg#..."/></svg>.
// No runtime JS icon library required.

(function () {
  'use strict';

  const html = document.documentElement;
  const sunIcon = document.getElementById('icon-sun');
  const moonIcon = document.getElementById('icon-moon');
  const STORAGE_KEY = '***';

  function isDark() {
    return html.classList.contains('dark');
  }

  function syncTogglesUI() {
    const dark = isDark();
    if (sunIcon) sunIcon.classList.toggle('hidden', dark);
    if (moonIcon) moonIcon.classList.toggle('hidden', !dark);
    const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.setAttribute('aria-label', label);
    });
  }

  function setTheme(mode) {
    const useDark = mode === 'dark';
    html.classList.toggle('dark', useDark);
    try { localStorage.setItem(STORAGE_KEY, useDark ? 'dark' : 'light'); } catch (_) {}
    syncTogglesUI();
  }

  function applyInitialTheme() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  // Theme toggles (both desktop + mobile)
  document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach((btn) => {
    btn.setAttribute('data-theme-toggle', '');
    btn.addEventListener('click', () => {
      setTheme(isDark() ? 'light' : 'dark');
    });
  });

  // Active nav link with aria-current
  const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-link').forEach((link) => {
    const target = (link.getAttribute('data-nav') || '').toLowerCase();
    const isActive = target === path || (path === '' && target === 'index.html');
    if (isActive) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Mobile menu toggle (button + Escape)
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  function setMobileOpen(open) {
    if (!mobileMenu || !mobileBtn) return;
    mobileMenu.classList.toggle('hidden', !open);
    mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    // Swap the icon: menu <-> x via <use> href change.
    const use = mobileBtn.querySelector('svg use');
    if (use) use.setAttribute('href', open ? 'assets/icons.svg#i-x' : 'assets/icons.svg#i-menu');
  }

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      setMobileOpen(mobileMenu.classList.contains('hidden'));
    });
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setMobileOpen(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        setMobileOpen(false);
        mobileBtn.focus();
      }
    });
  }

  applyInitialTheme();
})();
