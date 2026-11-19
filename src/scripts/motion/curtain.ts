/**
 * Helper tirai wipe bersama (section & antar halaman).
 * Lapisan di DOM (bawah → atas): accent → surface → bg, plus .curtain-edge (garis cyan menyala).
 *
 * Semua lapisan digerakkan oleh satu progres dengan offset jarak tetap (BAND % lebar),
 * sehingga yang terlihat di tepi tirai adalah pita cyan & abu tipis berlebar konstan,
 * bukan balok warna besar. Hanya clip-path, transform & opacity yang dianimasikan.
 */
import { gsap } from 'gsap';

export type LayerName = 'accent' | 'surface' | 'bg';

const liteMq = matchMedia('(hover: none), (pointer: coarse), (max-width: 767px)');
/** Mode ringan otomatis: layar sentuh / mobile */
export const isLite = () => liteMq.matches;

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/** Lapisan yang dipakai, urutan bawah → atas (accent paling bawah) */
export function pickLayers(root: HTMLElement, names: LayerName[]) {
  return names
    .map((n) => root.querySelector<HTMLElement>(`.curtain-layer[data-layer="${n}"]`))
    .filter((el): el is HTMLElement => !!el);
}

function edgeOf(root: HTMLElement) {
  return root.querySelector<HTMLElement>('.curtain-edge');
}

/**
 * Tirai menyapu masuk dari kiri sampai menutup penuh.
 * Lapisan bawah (accent) memimpin, lapisan di atasnya menyusul BAND% di belakang.
 */
export function cover(tl: gsap.core.Timeline, root: HTMLElement, layers: HTMLElement[], duration: number, band: number, at: gsap.Position = 0) {
  const n = layers.length;
  const span = 100 + band * (n - 1);
  const edge = edgeOf(root);
  const st = { p: 0 };
  tl.fromTo(
    st,
    { p: 0 },
    {
      p: 1,
      duration,
      ease: 'expo.inOut',
      immediateRender: false,
      onStart: () => edge && gsap.set(edge, { opacity: 1 }),
      onUpdate: () => {
        const lead = st.p * span;
        layers.forEach((l, i) => (l.style.clipPath = `inset(0% ${clamp(100 - (lead - band * i))}% 0% 0%)`));
        if (edge) gsap.set(edge, { x: (clamp(lead) / 100) * root.clientWidth });
      },
      onComplete: () => edge && gsap.set(edge, { opacity: 0 }),
    },
    at,
  );
  return tl;
}

/**
 * Tirai terbuka ke kanan. Lapisan teratas (bg) mundur lebih dulu, accent paling akhir,
 * jadi konten muncul tepat di belakang pita cyan + garis menyala.
 */
export function uncover(tl: gsap.core.Timeline, root: HTMLElement, layers: HTMLElement[], duration: number, band: number, at: gsap.Position = 0) {
  const n = layers.length;
  const span = 100 + band * (n - 1);
  const edge = edgeOf(root);
  const st = { p: 0 };
  tl.fromTo(
    st,
    { p: 0 },
    {
      p: 1,
      duration,
      ease: 'expo.inOut',
      immediateRender: false,
      onStart: () => edge && gsap.set(edge, { opacity: 1 }),
      onUpdate: () => {
        const lead = st.p * span;
        layers.forEach((l, i) => (l.style.clipPath = `inset(0% 0% 0% ${clamp(lead - band * (n - 1 - i))}%)`));
        // garis menempel di tepi kiri lapisan accent (paling belakang)
        if (edge) gsap.set(edge, { x: (clamp(lead - band * (n - 1)) / 100) * root.clientWidth });
      },
      onComplete: () => edge && gsap.set(edge, { opacity: 0 }),
    },
    at,
  );
  return tl;
}

/** Kembalikan lapisan ke keadaan tersembunyi (CSS default) */
export function resetLayers(layers: HTMLElement[]) {
  layers.forEach((l) => (l.style.clipPath = ''));
}

/** Plexus global ikut bereaksi sesaat */
export function pulse(strength: number) {
  window.dispatchEvent(new CustomEvent('plexus:pulse', { detail: { strength } }));
}

export function plexusMode(fps: number) {
  window.dispatchEvent(new CustomEvent('plexus:mode', { detail: { fps } }));
}
