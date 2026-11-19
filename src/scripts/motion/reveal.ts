import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const EASE = 'expo.out';

/** Intro singkat (sekali per sesi, ±0.7 dtk). Mengembalikan delay untuk animasi hero. */
export function intro(): number {
  const root = document.documentElement;
  const el = document.querySelector<HTMLElement>('[data-intro]');
  if (!el || root.getAttribute('data-intro') !== 'on') return 0.05;
  const tl = gsap.timeline({
    onComplete: () => {
      root.removeAttribute('data-intro');
      gsap.set(el, { clearProps: 'transform' });
    },
  });
  tl.fromTo(el.querySelector('.intro-mark'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: EASE })
    .to(el.querySelector('.intro-bar'), { scaleX: 1, duration: 0.32, ease: 'power2.inOut' }, 0.05)
    .to(el, { yPercent: -100, duration: 0.42, ease: 'expo.inOut' }, 0.32);
  return 0.5;
}

/** Masuknya hero. Baris utama hanya digeser (tanpa opacity) agar LCP tidak tertunda. */
export function hero(delay: number) {
  const section = document.querySelector<HTMLElement>('.hero');
  if (!section) return;
  const tl = gsap.timeline({ delay });
  tl.from(section.querySelectorAll('.hero-line'), { y: 36, duration: 1.2, ease: EASE, stagger: 0.08 })
    .fromTo(
      section.querySelectorAll('.hero-item'),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.06 },
      0.1,
    );
  const canvas = section.querySelector('canvas');
  if (canvas) tl.from(canvas, { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0);
}

/** Elemen tunggal muncul saat scroll: fade + slide */
export function reveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1, ease: EASE, scrollTrigger: { trigger: el, start: 'top 90%', once: true } },
    );
  });
}

/** Grup (kartu, timeline, daftar): stagger per batch yang masuk layar */
export function groups() {
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = Array.from(group.children) as HTMLElement[];
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 32 });
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: EASE, stagger: 0.09, overwrite: true });
        batch.forEach((item) => {
          const chips = (item as HTMLElement).querySelectorAll('[data-chips] > li');
          if (chips.length)
            gsap.fromTo(chips, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: EASE, stagger: 0.04, delay: 0.25 });
        });
      },
    });
  });
}

/** Judul bagian: reveal per kata di dalam mask per baris (GSAP SplitText) */
export function splitHeadings(isAlive: () => boolean) {
  return () => {
    if (!isAlive()) return;
    document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
      try {
        SplitText.create(el, {
          type: 'lines,words',
          mask: 'lines',
          autoSplit: true,
          aria: 'auto',
          onSplit(self) {
            el.classList.add('is-split');
            return gsap.from(self.words, {
              yPercent: 110,
              duration: 1.1,
              ease: EASE,
              stagger: 0.05,
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            });
          },
        });
      } catch {
        el.classList.add('is-split');
      }
    });
    ScrollTrigger.refresh();
  };
}

/** Counter angka (hanya angka nyata dari data) */
export function counters() {
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    const end = Number(el.dataset.counter) || 0;
    const obj = { v: 0 };
    el.textContent = '0';
    gsap.to(obj, {
      v: end,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v));
      },
      onComplete: () => {
        el.textContent = String(end);
      },
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}

/** Parallax halus berbasis scroll untuk elemen [data-speed] */
export function parallax() {
  gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed ?? '0');
    if (!speed) return;
    const heroEl = el.closest<HTMLElement>('.hero');
    gsap.fromTo(
      el,
      { y: () => (heroEl ? 0 : -speed * window.innerHeight * 0.25) },
      {
        y: () => speed * window.innerHeight * (heroEl ? 0.5 : 0.25),
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl ?? el.parentElement ?? el,
          start: heroEl ? 'top top' : 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}
