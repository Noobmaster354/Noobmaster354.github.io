# Catatan Proyek

## Credits

Semua dependensi dipasang lewat npm dan disimpan lokal (tanpa CDN atau hotlink saat runtime).
Versi dan lisensi dibaca dari `node_modules/<paket>/package.json`.

| Paket | Versi | Lisensi | Dipakai untuk |
|---|---|---|---|
| astro | 7.4.13 | MIT | Framework situs statis, i18n, View Transitions (`ClientRouter`) |
| tailwindcss / @tailwindcss/vite | 4.3.5 | MIT | Utility CSS |
| gsap | 3.15.1 | GSAP Standard "no charge" license (https://gsap.com/standard-license) | Animasi, ScrollTrigger, SplitText |
| lenis | 1.3.27 | MIT | Smooth scroll |
| @astrojs/sitemap | 3.7.6 | MIT | sitemap-index.xml (id/en) |
| @lucide/astro | 1.76.0 | ISC | Ikon UI (SVG inline saat build) |
| simple-icons (dev) | 16.38.0 | CC0-1.0 | Logo tools di bagian Skill |
| @fontsource-variable/geist | 5.3.0 | OFL-1.1 | Font sans (self-host) |
| @fontsource-variable/jetbrains-mono | 5.3.0 | OFL-1.1 | Font mono (self-host) |

Revisi transisi tirai cyan **tidak menambah paket baru**. Efeknya dibangun dari GSAP yang sudah ada.

### Aset buatan sendiri
- Plexus background: salinan `plexus-background-astro` milik pemilik, dengan modifikasi (pulse, mode fps, tanpa forced layout).
- Tirai/wipe, indikator slide, cover proyek SVG abstrak, tekstur grain SVG `feTurbulence`, favicon, dan gambar OG: dibuat sendiri, tanpa gambar/logo berhak cipta.
- Logo LinkedIn, Tableau, dan Excel: glyph sederhana buatan sendiri, karena tidak tersedia di Simple Icons.

### Rujukan dokumentasi
- Astro View Transitions & event lifecycle (`astro:before-preparation` + `event.loader`, `astro:page-load`, `astro:before-swap`, `transition:persist`): https://docs.astro.build/en/guides/view-transitions/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP SplitText: https://gsap.com/docs/v3/Plugins/SplitText/
- MDN `clip-path`: https://developer.mozilla.org/docs/Web/CSS/clip-path
- MDN View Transition API: https://developer.mozilla.org/docs/Web/API/View_Transition_API

## Catatan teknis transisi
- Tirai section ada di `src/components/SlideCurtain.astro` + `src/scripts/motion/slides.ts`. Tirai antar halaman ada di `src/components/PageCurtain.astro` + `src/scripts/motion/page-curtain.ts`. Helper bersama ada di `src/scripts/motion/curtain.ts`.
- Lapisan tirai digerakkan oleh satu progres dengan offset jarak tetap, jadi yang terlihat adalah pita cyan dan abu tipis, bukan balok warna.
- Plexus global berada di wadah `position: sticky` (`.plexus-layer`), bukan `position: fixed`. Dalam pengukuran Lighthouse mobile, canvas fixed menaikkan TBT sekitar 300 ms.
- `prefers-reduced-motion`: tirai, wipe, dan parallax mati. Antar halaman memakai crossfade 0,2 dtk.
