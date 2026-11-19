/**
 * Transisi antar halaman (ClientRouter): tirai cyan menutup layar sebelum DOM ditukar,
 * lalu terbuka di halaman baru. Layar akhir yang tertutup berwarna --bg (ikut tema),
 * jadi tidak ada kilatan putih. Snapshot view transition dibuat instan via CSS.
 * Listener dipasang sekali saja (elemen tirai persist antar halaman).
 */
import { gsap } from 'gsap';
import { cover, uncover, pickLayers, resetLayers, isLite, pulse, type LayerName } from './curtain';

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const motionOn = () => root.getAttribute('data-motion') === 'on' && !reduce.matches;

let covered = false;
let current: gsap.core.Timeline | null = null;

const curtainEl = () => document.querySelector<HTMLElement>('[data-page-curtain]');
const names = (): LayerName[] => (isLite() ? ['accent', 'bg'] : ['accent', 'surface', 'bg']);

function close(): Promise<void> {
  const el = curtainEl();
  if (!el) return Promise.resolve();
  const layers = pickLayers(el, names());
  current?.kill();
  gsap.set(el, { visibility: 'visible' });
  covered = true;
  return new Promise((resolve) => {
    current = gsap.timeline({ onComplete: () => resolve() });
    cover(current, el, layers, isLite() ? 0.6 : 0.75, isLite() ? 7 : 5);
  });
}

function open() {
  if (!covered) return;
  covered = false;
  const el = curtainEl();
  if (!el) return;
  const layers = pickLayers(el, names());
  current?.kill();
  current = gsap.timeline({
    delay: 0.05,
    onComplete: () => {
      gsap.set(el, { visibility: 'hidden' });
      resetLayers(layers);
    },
  });
  uncover(current, el, layers, isLite() ? 0.8 : 0.95, isLite() ? 7 : 5);
  pulse(1);
}

declare global {
  interface Window {
    __pageCurtainBound?: boolean;
  }
}

if (!window.__pageCurtainBound) {
  window.__pageCurtainBound = true;

  document.addEventListener('astro:before-preparation', (event) => {
    if (!motionOn()) return;
    const e = event as Event & { loader: () => Promise<void> };
    const load = e.loader;
    e.loader = async () => {
      await Promise.all([close(), load()]);
    };
  });

  document.addEventListener('astro:page-load', open);
}
