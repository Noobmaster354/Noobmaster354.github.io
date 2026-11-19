import { gsap } from 'gsap';

const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

type Off = () => void;
function on<K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions): Off {
  el.addEventListener(type, fn as EventListener, opts);
  return () => el.removeEventListener(type, fn as EventListener, opts);
}

/** Tombol magnetic: tombol & isinya sedikit tertarik ke arah kursor */
export function magnetic(): Off {
  if (!finePointer()) return () => {};
  const offs: Off[] = [];
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const inner = el.querySelector<HTMLElement>('[data-magnetic-inner]');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const ixTo = inner && gsap.quickTo(inner, 'x', { duration: 0.5, ease: 'power3.out' });
    const iyTo = inner && gsap.quickTo(inner, 'y', { duration: 0.5, ease: 'power3.out' });
    offs.push(
      on(el, 'pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * 0.28);
        yTo(dy * 0.38);
        ixTo?.(dx * 0.12);
        iyTo?.(dy * 0.16);
      }),
      on(el, 'pointerleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
        if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
      }),
    );
  });
  return () => offs.forEach((f) => f());
}

/** Spotlight/glow di kartu yang mengikuti kursor (elemen .spotlight digeser lewat transform) */
export function spotlight(): Off {
  if (!finePointer()) return () => {};
  const offs: Off[] = [];
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((card) => {
    const spot = card.querySelector<HTMLElement>('.spotlight');
    if (!spot) return;
    const xTo = gsap.quickTo(spot, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(spot, 'y', { duration: 0.45, ease: 'power3.out' });
    let rect = card.getBoundingClientRect();
    offs.push(
      on(card, 'pointerenter', (e) => {
        rect = card.getBoundingClientRect();
        gsap.set(spot, { x: e.clientX - rect.left, y: e.clientY - rect.top });
      }),
      on(card, 'pointermove', (e) => {
        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);
      }),
    );
  });
  return () => offs.forEach((f) => f());
}

/** Cursor glow tipis mengikuti kursor (desktop saja) */
export function cursorGlow(): Off {
  const glow = document.querySelector<HTMLElement>('.cursor-glow');
  const root = document.documentElement;
  if (!glow || !finePointer()) {
    root.classList.remove('has-cursor');
    return () => {};
  }
  const xTo = gsap.quickTo(glow, 'x', { duration: 0.8, ease: 'power3.out' });
  const yTo = gsap.quickTo(glow, 'y', { duration: 0.8, ease: 'power3.out' });
  let first = true;
  const offMove = on(window, 'pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (first) {
      gsap.set(glow, { x: e.clientX, y: e.clientY });
      first = false;
    }
    root.classList.add('has-cursor');
    xTo(e.clientX);
    yTo(e.clientY);
  }, { passive: true });
  const onOut = (e: PointerEvent) => {
    if (!e.relatedTarget) root.classList.remove('has-cursor');
  };
  document.addEventListener('pointerout', onOut);
  return () => {
    offMove();
    document.removeEventListener('pointerout', onOut);
  };
}
