/**
 * Perilaku per section di beranda (tanpa transisi tirai):
 * - Indikator kanan & link navbar menandai section yang sedang aktif.
 * - Plexus global: terang di hero, redup + 30 fps di bagian lain.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const liteMq = matchMedia('(hover: none), (pointer: coarse), (max-width: 767px)');
/** Mode ringan otomatis: layar sentuh / mobile */
export const isLite = () => liteMq.matches;

export function plexusMode(fps: number) {
  window.dispatchEvent(new CustomEvent('plexus:mode', { detail: { fps } }));
}

/** Tandai section aktif di indikator kanan dan di navbar */
export function sectionNav() {
  const sections = gsap.utils.toArray<HTMLElement>('[data-slide]');
  const dots = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-slide-link]'));
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
  if (!sections.length || (!dots.length && !navLinks.length)) return;

  const mark = (a: HTMLAnchorElement, on: boolean) =>
    on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
  const setActive = (id: string) => {
    dots.forEach((a) => mark(a, a.dataset.slideLink === id));
    navLinks.forEach((a) => mark(a, a.dataset.navLink === id));
  };

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
