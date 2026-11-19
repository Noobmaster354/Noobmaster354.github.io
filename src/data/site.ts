/**
 * KONFIGURASI SITUS & KONTAK — satu-satunya tempat untuk URL, nomor, dan email.
 * Cari "TODO" lalu isi dengan data asli sebelum push.
 */
export const site = {
  url: 'https://noobmaster354.github.io',
  name: 'Satrio Faza Mubarok',
  nickname: 'Noobmaster',
  initials: 'SF',

  contact: {
    // TODO: ganti dengan email asli yang ingin ditampilkan publik
    email: 'TODO@example.com',
    // TODO: nomor WhatsApp format internasional TANPA "+" dan spasi, contoh: 6281234567890
    whatsapp: 'TODO',
    // TODO: URL profil LinkedIn, contoh: https://www.linkedin.com/in/username
    linkedin: 'TODO',
    // Akun GitHub dari nama repo ini — ganti bila berbeda
    github: 'https://github.com/Noobmaster354',
    // TODO: taruh file CV di public/cv.pdf
    cv: '/cv.pdf',
  },

  // Gambar Open Graph per bahasa (ada di public/)
  ogImage: { id: '/og-id.png', en: '/og-en.png' },
} as const;

export const isTodo = (v: string | undefined | null): boolean =>
  !v || v.trim() === '' || v.trim().toUpperCase().startsWith('TODO');
