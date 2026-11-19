/**
 * Interaksi UI non-animasi. Memakai event delegation di document (didaftarkan sekali),
 * jadi aman dengan ClientRouter tanpa perlu cleanup per halaman.
 */

const root = document.documentElement;

/* ---------- Toast ---------- */
let toastTimer = 0;
export function showToast(message: string) {
  const region = document.querySelector<HTMLElement>('[data-toast]');
  if (!region) return;
  region.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'toast';
  const dot = document.createElement('span');
  dot.className = 'toast-dot';
  dot.setAttribute('aria-hidden', 'true');
  el.append(dot, document.createTextNode(message));
  region.append(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-visible')));
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    el.classList.remove('is-visible');
    window.setTimeout(() => el.remove(), 400);
  }, 2600);
}

/* ---------- Tema ---------- */
function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* localStorage tidak tersedia */
  }
}

// Ikuti perubahan setelan sistem selama pengguna belum memilih manual
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem('theme');
  } catch {
    /* abaikan */
  }
  if (!saved) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
});

/* ---------- Menu mobile ---------- */
function setMenu(open: boolean) {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!btn || !menu) return;
  btn.setAttribute('aria-expanded', String(open));
  btn.setAttribute('aria-label', (open ? btn.dataset.labelClose : btn.dataset.labelOpen) ?? '');
  header?.classList.toggle('menu-open', open);
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
  } else {
    menu.classList.remove('is-open');
    menu.hidden = true;
  }
}

/* ---------- Salin email ---------- */
async function copyEmail(btn: HTMLElement) {
  const email = btn.dataset.copy ?? '';
  try {
    await navigator.clipboard.writeText(email);
    showToast(btn.dataset.msgOk ?? 'Copied');
  } catch {
    showToast(btn.dataset.msgFail ?? 'Copy failed');
  }
}

/* ---------- Embed click-to-load ---------- */
function loadEmbed(btn: HTMLElement) {
  const wrap = btn.closest<HTMLElement>('[data-embed]');
  if (!wrap) return;
  const iframe = document.createElement('iframe');
  iframe.src = wrap.dataset.src ?? '';
  iframe.title = wrap.dataset.title ?? '';
  iframe.loading = 'lazy';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.className = 'absolute inset-0 h-full w-full border-0';
  wrap.querySelector('[data-embed-stage]')?.append(iframe);
  wrap.classList.add('is-loaded');
  iframe.focus();
}

/* ---------- Delegasi klik ---------- */
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  if (target.closest('[data-theme-toggle]')) return toggleTheme();

  const menuBtn = target.closest('[data-menu-toggle]');
  if (menuBtn) return setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  if (target.closest('[data-menu-link]')) setMenu(false);

  const copyBtn = target.closest<HTMLElement>('[data-copy]');
  if (copyBtn) {
    e.preventDefault();
    void copyEmail(copyBtn);
    return;
  }

  const embedBtn = target.closest<HTMLElement>('[data-embed-load]');
  if (embedBtn) loadEmbed(embedBtn);
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-toggle][aria-expanded="true"]');
  if (btn) {
    setMenu(false);
    btn.focus();
  }
});

/* ---------- Header saat di-scroll ---------- */
let ticking = false;
function updateHeader() {
  ticking = false;
  document.querySelector('[data-header]')?.toggleAttribute('data-scrolled', window.scrollY > 12);
}
window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeader);
    }
  },
  { passive: true },
);

document.addEventListener('astro:page-load', () => {
  updateHeader();
  setMenu(false);
});
document.addEventListener('astro:before-swap', () => setMenu(false));
