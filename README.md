# Portofolio Satrio Faza Mubarok

Situs portofolio Data Analyst, dua bahasa (Indonesia & Inggris), berisi profil, studi kasus proyek, pengalaman, skill, dan kontak.

**Live:** https://noobmaster354.github.io

## Stack

- [Astro](https://astro.build) 7: situs statis, i18n, View Transitions
- [Tailwind CSS](https://tailwindcss.com) 4
- [GSAP](https://gsap.com) (ScrollTrigger, SplitText) untuk animasi
- [Lenis](https://lenis.darkroom.engineering) untuk smooth scroll

Versi, lisensi, dan sumber aset lengkap ada di [NOTES.md](NOTES.md).

## Menjalankan di komputer sendiri

Butuh **Node.js ≥ 22.23.4**.

| Perintah | Fungsi |
| :-- | :-- |
| `npm install` | Pasang dependensi |
| `npm run dev` | Server pengembangan di http://localhost:4321 |
| `npm run build` | Build produksi ke `./dist/` |
| `npm run preview` | Lihat hasil build sebelum deploy |

Server dev juga bisa dijalankan di latar belakang dengan `npx astro dev --background`. Hentikan dengan `npx astro dev stop`.

## Struktur

```text
src/
├── data/
│   ├── site.ts        ← kontak (email, WhatsApp, LinkedIn, GitHub, CV) & URL situs
│   ├── projects.ts    ← data studi kasus proyek (ID & EN)
│   └── content.ts     ← semua teks UI, pengalaman, dan skill (ID & EN)
├── sections/          ← bagian beranda: Hero, About, Projects, Experience, Skills, Contact
├── components/        ← komponen UI (Navbar, Footer, kartu proyek, dll.)
├── views/             ← tampilan beranda & halaman detail proyek
├── pages/             ← rute: ID tanpa prefix, EN di /en/
├── layouts/           ← layout dasar (SEO, tema, plexus)
├── scripts/           ← animasi & interaksi
└── styles/global.css  ← design tokens & gaya global
public/                ← favicon, gambar OG, robots.txt, (cv.pdf)
.github/workflows/deploy.yml ← deploy otomatis ke GitHub Pages
```

## Cara update data

> **Aturan TODO:** nilai yang diawali `TODO` tidak ditampilkan apa adanya.
> UI menyembunyikannya atau menggantinya dengan "Segera tersedia" / "Detail menyusul".
> Cukup ganti teks `TODO` dengan data asli; tidak perlu mengubah komponen.

### Email, WhatsApp, LinkedIn, GitHub, dan CV

Semua ada di [`src/data/site.ts`](src/data/site.ts), bagian `contact`:

```ts
contact: {
  email: 'nama@domain.com',                          // sebelumnya 'TODO@example.com'
  whatsapp: '6281234567890',                         // sebelumnya 'TODO'
  linkedin: 'https://www.linkedin.com/in/username',  // sebelumnya 'TODO'
  github: 'https://github.com/Noobmaster354',
  cv: '/cv.pdf',
},
```

- **email:** setelah diisi, kartu Kontak menampilkan tombol **Email** dan **Salin email**, menggantikan teks "Segera tersedia".
- **whatsapp:** format internasional **tanpa** `+`, spasi, atau tanda hubung (`0812…` menjadi `62812…`). Link `wa.me` dibuat otomatis. Pesan pembukanya bisa diubah di `contact.whatsappMessage` di [`src/data/content.ts`](src/data/content.ts) (versi ID & EN).
- **linkedin:** URL profil lengkap.
- **github:** URL profil. Dipakai juga untuk handle `@…` di kartu Tentang dan tombol GitHub di footer.
- **CV:** taruh file di `public/cv.pdf`. Tombol **Unduh CV** baru muncul bila file itu ada saat build (mencegah link 404).

Kanal yang masih `TODO` tampil sebagai kartu bergaris putus-putus bertanda "Segera tersedia".

### Proyek (studi kasus)

Semua proyek ada di [`src/data/projects.ts`](src/data/projects.ts), dalam array `projects`. Setiap teks punya versi `id` dan `en`.

| Field | Isi |
| :-- | :-- |
| `slug` | Bagian URL: `/projects/<slug>/` dan `/en/projects/<slug>/`. Huruf kecil + tanda hubung, harus unik. |
| `cover` | Ilustrasi sampul: `'network'`, `'leaf'`, `'bars'`, atau `'flow'` |
| `year` | Tahun/periode, mis. `'2026'` |
| `title`, `type`, `role`, `summary` | Judul, jenis proyek, peran kamu, ringkasan satu kalimat (dipakai juga sebagai meta description) |
| `background`, `data`, `method`, `findings`, `impact` | Array paragraf/poin untuk tiap bagian studi kasus |
| `tools` | Daftar tools, mis. `['Python', 'Pandas']` |
| `links` | Link publik (dashboard, repo, notebook) |
| `embed` | Dashboard yang bisa disematkan: `provider` `'tableau'`, `'looker'`, atau `null` (tanpa embed) |

Poin yang diawali `TODO` di dalam array otomatis disembunyikan. Bila satu bagian kosong semua, tampil "Detail menyusul". Field `type`, `role`, dan `year` yang masih mengandung `TODO` juga tampil sebagai "Detail menyusul".

Contoh `links` dan `embed` yang sudah diisi:

```ts
links: [
  { label: { id: 'Repositori GitHub', en: 'GitHub repository' }, href: 'https://github.com/Noobmaster354/nama-repo' },
  { label: { id: 'Dashboard Tableau', en: 'Tableau dashboard' }, href: 'https://public.tableau.com/views/…' },
],
embed: {
  provider: 'tableau',
  url: 'https://public.tableau.com/views/NamaWorkbook/NamaSheet?:showVizHome=no&:embed=true',
  ratio: '16 / 10',
},
```

Format URL embed:
- **Tableau Public:** `…/views/…?:showVizHome=no&:embed=true`
- **Looker Studio:** `https://lookerstudio.google.com/embed/reporting/…`

Dashboard dimuat dari pihak ketiga hanya setelah pengunjung menekan tombol, supaya halaman tetap ringan. Selama `url` masih `TODO`, tampil keterangan "Embed dashboard akan ditambahkan".

**Menambah proyek:** salin satu objek proyek, ganti `slug`, lalu isi datanya. Hal-hal berikut ikut otomatis:
- halaman detail ID & EN;
- kartu di beranda dan nomor urutnya;
- navigasi proyek sebelumnya/berikutnya;
- sitemap;
- angka "Studi kasus" di kartu Tentang.

Satu hal yang perlu diubah manual: kalimat **"Empat proyek…"** di `projects.intro` pada [`src/data/content.ts`](src/data/content.ts) (ID & EN).

**Menghapus proyek:** hapus objeknya dari array, lalu sesuaikan kalimat "Empat proyek…" yang sama.

### Teks lain

Semua di [`src/data/content.ts`](src/data/content.ts):
- **Teks UI** (objek `id` dan `en`): judul bagian, paragraf Tentang, tombol, meta title/description.
- **Pengalaman** (`experience`): item dengan `draft: true` tidak ditampilkan. Ubah ke `false` setelah datanya lengkap.
- **Skill** (`skillGroups`): angka "Skill & tools" di kartu Tentang dihitung otomatis dari jumlah item unik. `verified: false` adalah penanda untuk dicek ulang dan tidak memengaruhi tampilan.

Gambar pratinjau saat link dibagikan (Open Graph) ada di `public/og-id.png` dan `public/og-en.png` (1200 × 630).

## Deploy

Setiap push ke branch `main` menjalankan [GitHub Actions](.github/workflows/deploy.yml) (`withastro/action`, Node 22). Workflow itu mem-build situs lalu men-deploy-nya ke GitHub Pages. Pastikan di **Settings → Pages → Source** dipilih **GitHub Actions**.

Sebelum push:
1. `npm run build` harus lolos.
2. Cari sisa `TODO` di `src/data/` dan pastikan yang tersisa memang sengaja.

## Lisensi & kredit

Daftar paket, lisensi, dan sumber aset ada di [NOTES.md](NOTES.md).
