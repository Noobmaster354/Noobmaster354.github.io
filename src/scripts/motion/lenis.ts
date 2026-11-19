import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Smooth scroll Lenis yang disinkronkan dengan ticker GSAP & ScrollTrigger */
export function createLenis() {
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    autoRaf: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy() {
      gsap.ticker.remove(tick);
      lenis.destroy();
    },
  };
}

/**
 * Link anchor di halaman yang sama (#about, skip link, CTA) → scroll halus + pindahkan fokus.
 * Dipasang di fase capture supaya ClientRouter tidak ikut menangani.
 */
export function bindAnchors(lenis: Lenis | null) {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    const offset = target.id === 'main' || target.id === 'top' ? 0 : -72;
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.2 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: 'auto' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}
