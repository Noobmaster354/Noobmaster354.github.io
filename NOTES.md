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

Tidak ada paket baru yang ditambahkan pada revisi mana pun.

### Aset buatan sendiri
- Plexus background: salinan `plexus-background-astro` milik pemilik, dengan modifikasi (mode fps, tanpa forced layout).
- Indikator section, cover proyek SVG abstrak, tekstur grain SVG `feTurbulence`, favicon, dan gambar OG: dibuat sendiri, tanpa gambar/logo berhak cipta.
- Logo LinkedIn, Tableau, dan Excel: glyph sederhana buatan sendiri, karena tidak tersedia di Simple Icons.

### Rujukan dokumentasi
- Astro View Transitions & event lifecycle (`astro:page-load`, `astro:before-swap`, `transition:persist`): https://docs.astro.build/en/guides/view-transitions/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP SplitText: https://gsap.com/docs/v3/Plugins/SplitText/
- MDN View Transition API: https://developer.mozilla.org/docs/Web/API/View_Transition_API

## Catatan teknis
- Transisi tirai cyan (antar section & antar halaman) dan efek "keluar" section **dibatalkan** pada revisi final. Antar halaman kini memakai crossfade View Transitions bawaan (0,25 dtk); konten section muncul dengan fade + naik saat discroll.
- Section aktif ditandai di indikator kanan (≥1024px) dan di link navbar: `src/scripts/motion/sections.ts`.
- Plexus global berada di wadah `position: sticky` (`.plexus-layer`), bukan `position: fixed`. Dalam pengukuran Lighthouse mobile, canvas fixed menaikkan TBT sekitar 300 ms. Terang di hero, redup (0,35) dan 30 fps setelahnya.
- Tombol "Unduh CV" hanya dirender bila `public/cv.pdf` ada (dicek saat build).
- `prefers-reduced-motion`: animasi scroll & parallax mati, konten langsung tampil.
- Semua judul section memakai kelas `.section-title` (`clamp(1.75rem, 3vw, 2.5rem)`), selaras dengan nama di hero.
- Keterbacaan di atas plexus: kelas `.scrim` memberi alas `--bg` semi-transparan bertepi pudar di belakang blok teks (hero, judul section, teks Tentang, timeline Pengalaman). Lebarnya tidak melebihi padding container agar tidak memicu scroll horizontal.
- Angka di kartu Tentang dihitung saat build: jumlah proyek di `src/data/projects.ts` dan jumlah item skill unik di `skillGroups` (`src/data/content.ts`). Handle di kartu diambil dari URL GitHub di `src/data/site.ts`.
- Folder `plexus-background-astro/` di root adalah sumber asli plexus. Folder ini tidak di-import dan tidak ikut build (yang dipakai salinan di `src/`).
