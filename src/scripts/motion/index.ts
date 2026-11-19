/**
 * Orkestrator animasi.
 * - Init di `astro:page-load` (juga saat load pertama), bersihkan di `astro:before-swap`.
 * - Semua tween di dalam gsap.context() → ctx.revert() mengembalikan DOM bersih.
 * - prefers-reduced-motion: tanpa Lenis/animasi, konten langsung tampil.
 * - Hanya transform, opacity, clip-path (tirai), dan filter ringan yang dianimasikan.
 * - Transisi slide (tirai cyan) di ./slides, transisi antar halaman di ./page-curtain.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { createLenis, bindAnchors } from './lenis';
import { scrollProgress } from './progress';
import { typing } from './typing';
import { magnetic, spotlight, cursorGlow } from './interactions';
import { intro, hero, reveals, groups, splitHeadings, counters, parallax } from './reveal';
import { slides, plexusLayer } from './slides';
import './page-curtain';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

let ctx: gsap.Context | null = null;
let cleanups: (() => void)[] = [];
let generation = 0;

function init() {
  const gen = ++generation;
  const motionOn = !reduce.matches;
  root.setAttribute('data-motion', motionOn ? 'on' : 'off');
  root.setAttribute('data-motion-ready', '');

  const smooth = motionOn ? createLenis() : null;
  if (smooth) cleanups.push(smooth.destroy);
  cleanups.push(bindAnchors(smooth?.lenis ?? null), scrollProgress());

  if (!motionOn) {
    root.removeAttribute('data-intro');
    return;
  }

  ctx = gsap.context(() => {
    const delay = intro();
    hero(delay);
    // slides() lebih dulu: mendaftarkan tirai tiap section sebelum trigger konten dibuat
    slides();
    plexusLayer();
    reveals();
    groups();
    counters();
    parallax();
    cleanups.push(magnetic(), spotlight(), cursorGlow());
  });
  cleanups.push(typing());

  // Judul di-split setelah font siap (posisi baris akurat, tanpa layout shift)
  const runSplit = splitHeadings(() => gen === generation);
  document.fonts.ready.then(() => {
    if (gen === generation && ctx) ctx.add(runSplit);
  });
}

function destroy() {
  generation++;
  cleanups.forEach((fn) => fn());
  cleanups = [];
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', destroy);
reduce.addEventListener('change', () => {
  destroy();
  init();
});
