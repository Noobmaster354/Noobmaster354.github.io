/**
 * Transisi "slide" di beranda. Scroll tetap normal (tanpa snap/pin).
 * - Masuk: tirai cyan menyapu section (2–3 lapis, stagger) lalu terbuka → konten muncul bertahap.
 * - Keluar: section mengecil (±0.92), memudar, sedikit blur (scrub, bisa mundur).
 * - Plexus global ber-pulse saat tirai bergerak; fps diturunkan setelah hero.
 * - Indikator slide di kanan mengikuti section aktif.
 * - Mode ringan (sentuh/mobile): 1 lapis tirai, tanpa blur, skala lebih kecil.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cover, uncover, pickLayers, isLite, pulse, plexusMode } from './curtain';

interface SlideState {
  tl?: gsap.core.Timeline;
  revealAt: number;
  queue: ((delay: number) => void)[];
  play: () => void;
}
let states = new WeakMap<HTMLElement, SlideState>();

/**
 * Jalankan `fn` saat konten boleh muncul: setelah tirai section induknya terbuka.
 * Elemen di luar section bertirai langsung dijalankan (delay 0).
 */
export function whenOpen(el: Element, fn: (delay: number) => void) {
  const section = el.closest<HTMLElement>('[data-slide]');
  const st = section ? states.get(section) : undefined;
  if (!st) return fn(0);
  if (st.tl) return fn(Math.max(0, st.revealAt - st.tl.time()));
  st.queue.push(fn);
  // Pengaman: bila trigger tirai tidak pernah tercapai (mis. section di ujung halaman), buka sendiri
  if (st.queue.length === 1) gsap.delayedCall(1.2, st.play);
}

function setupCurtain(section: HTMLElement, lite: boolean) {
  const curtain = section.querySelector<HTMLElement>(':scope > [data-curtain]');
  if (!curtain) return;
  // Mode ringan: 1 pita cyan di atas lapisan dasar (tanpa lapisan surface)
  const layers = pickLayers(curtain, lite ? ['accent', 'bg'] : ['accent', 'surface', 'bg']);
  if (!layers.length) return;

  const st: SlideState = { revealAt: 0, queue: [], play: () => {} };
  st.play = () => {
    if (st.tl) return;
    const coverDur = lite ? 0.6 : 0.7;
    const openDur = lite ? 0.8 : 0.95;
    const band = lite ? 7 : 5;
    const tl = gsap.timeline({ onComplete: () => gsap.set(curtain, { visibility: 'hidden' }) });
    cover(tl, curtain, layers, coverDur, band);
    uncover(tl, curtain, layers, openDur, band, coverDur + 0.05);
    st.tl = tl;
    // Konten mulai muncul saat tirai sudah ±40% terbuka
    st.revealAt = coverDur + 0.05 + openDur * 0.4;
    pulse(lite ? 0.5 : 0.85);
    st.queue.splice(0).forEach((fn) => fn(st.revealAt));
  };
  states.set(section, st);

  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    end: 'max',
    once: true,
    onEnter: st.play,
  });
}

function setupExit(section: HTMLElement, lite: boolean) {
  gsap.fromTo(
    section,
    lite ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1, filter: 'blur(0px)' },
    {
      ...(lite ? { scale: 0.96, opacity: 0.4 } : { scale: 0.92, opacity: 0.35, filter: 'blur(4px)' }),
      ease: 'power2.in',
      transformOrigin: '50% 100%',
      scrollTrigger: {
        trigger: section,
        start: 'bottom 65%',
        end: 'bottom top',
        scrub: 0.6,
      },
    },
  );
}

function setupNav(sections: HTMLElement[]) {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-slide-link]'));
  if (!links.length) return;
  const setActive = (id: string) =>
    links.forEach((a) => {
      if (a.dataset.slideLink === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  sections.forEach((section) => {
    if (!section.id) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => self.isActive && setActive(section.id),
    });
  });
}

/** Opacity & fps plexus global: terang di hero, redup + 30 fps di bagian lain */
export function plexusLayer() {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas.plexus-global');
  if (!canvas) return;
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) {
    gsap.set(canvas, { opacity: 0.35 });
    plexusMode(30);
    return;
  }
  gsap.fromTo(
    canvas,
    { opacity: 1 },
    { opacity: 0.35, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } },
  );
  ScrollTrigger.create({
    trigger: hero,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => plexusMode(self.isActive ? 60 : 30),
    // dibaca saat ScrollTrigger menghitung posisi (tanpa forced layout tambahan)
    onRefresh: (self) => plexusMode(self.isActive ? 60 : 30),
  });
}

export function slides() {
  states = new WeakMap();
  const sections = gsap.utils.toArray<HTMLElement>('[data-slide]');
  if (!sections.length) return;
  const lite = isLite();
  sections.forEach((section, i) => {
    setupCurtain(section, lite);
    if (i < sections.length - 1) setupExit(section, lite);
  });
  setupNav(sections);
}
