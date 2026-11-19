/**
 * SEMUA TEKS UI (Indonesia & Inggris) ada di file ini.
 * Data proyek ada di ./projects.ts, data kontak di ./site.ts.
 * Nilai yang diawali "TODO" tidak ditampilkan apa adanya — UI menggantinya
 * dengan catatan "Detail menyusul" sampai kamu mengisinya.
 */

export const languages = { id: 'Indonesia', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'id';

const id = {
  meta: {
    htmlLang: 'id',
    ogLocale: 'id_ID',
    title: 'Satrio Faza Mubarok — Data Analyst',
    description:
      'Portofolio Satrio Faza Mubarok, mahasiswa Sistem Informasi AMIKOM Yogyakarta yang membidik karier Data Analyst. Studi kasus dashboard, analisis data, dan machine learning terapan.',
    projectTitleSuffix: 'Studi Kasus · Satrio Faza Mubarok',
    notFoundTitle: 'Halaman tidak ditemukan',
  },

  a11y: {
    skip: 'Langsung ke konten utama',
    slideNav: 'Navigasi bagian',
    mainNav: 'Navigasi utama',
    openMenu: 'Buka menu',
    closeMenu: 'Tutup menu',
    themeToggle: 'Ganti mode terang/gelap',
    langSwitch: 'Switch to English',
    langSwitchShort: 'EN',
    backToTop: 'Kembali ke atas',
    externalLink: '(membuka tab baru)',
  },

  nav: {
    home: 'Beranda',
    about: 'Tentang',
    projects: 'Proyek',
    experience: 'Pengalaman',
    skills: 'Skill',
    contact: 'Kontak',
  },

  intro: { label: 'memuat portofolio' },

  hero: {
    greeting: 'Halo, saya',
    role: 'Data Analyst',
    tagline:
      'Saya mengubah data mentah menjadi dashboard dan insight yang jelas, agar tim bisa mengambil keputusan dengan lebih yakin.',
    typingPrefix: 'Fokus saya:',
    typingWords: ['dashboard interaktif', 'analisis data eksploratif', 'machine learning terapan', 'storytelling data'],
    ctaProjects: 'Lihat Proyek',
    ctaContact: 'Hubungi Saya',
    scroll: 'Gulir',
    meta: ['Sistem Informasi · AMIKOM', 'Indonesia'],
  },

  about: {
    eyebrow: '01 / Tentang',
    title: 'Data, rapi dan bermakna.',
    paragraphs: [
      'Saya Satrio Faza Mubarok, biasa dipanggil Noobmaster, mahasiswa Sistem Informasi di Universitas AMIKOM Yogyakarta (2023 – sekarang, target lulus 2027).',
      'Saya tertarik pada data science, penerapan machine learning, dan sistem trading otomatis.',
    ],
    facts: [
      { label: 'Pendidikan', value: 'S1 Sistem Informasi, AMIKOM Yogyakarta' },
      { label: 'Target karier', value: 'Data Analyst · perusahaan teknologi' },
      { label: 'Minat', value: 'Data science · ML · Trading otomatis' },
    ],
    statProjects: 'Studi kasus',
    statTools: 'Skill & tools',
    photoAlt: 'Foto Satrio Faza Mubarok',
  },

  projects: {
    eyebrow: '02 / Proyek',
    title: 'Studi kasus pilihan',
    intro: 'Empat proyek yang menunjukkan cara saya bekerja: dari memahami masalah, mengolah data, hingga menyajikan insight.',
    viewCase: 'Lihat studi kasus',
    coverAlt: 'Ilustrasi abstrak untuk proyek',
  },

  experience: {
    eyebrow: '03 / Pengalaman',
    title: 'Pengalaman & kegiatan',
    present: 'Sekarang',
  },

  skills: {
    eyebrow: '04 / Skill',
    title: 'Tools yang saya gunakan',
    intro: 'Dikelompokkan berdasarkan tahap kerja analisis data.',
  },

  contact: {
    eyebrow: '05 / Kontak',
    title: 'Mari berdiskusi.',
    intro: 'Terbuka untuk peluang Data Analyst, kolaborasi proyek, atau sekadar berbagi ide seputar data.',
    email: 'Email',
    copyEmail: 'Salin email',
    copied: 'Email disalin ke clipboard',
    copyFailed: 'Gagal menyalin. Silakan salin manual.',
    whatsapp: 'WhatsApp',
    whatsappMessage: 'Halo Satrio, saya melihat portofolio Anda dan ingin berdiskusi.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    cv: 'Unduh CV',
    unavailable: 'Segera tersedia',
    emailPending: 'Alamat email publik segera tersedia. Untuk sementara, hubungi saya lewat GitHub.',
  },

  caseStudy: {
    back: 'Kembali ke proyek',
    sections: {
      background: 'Latar belakang & masalah',
      data: 'Data',
      method: 'Metode',
      findings: 'Temuan',
      impact: 'Dampak',
      tools: 'Tools',
      links: 'Link',
    },
    meta: { role: 'Peran', period: 'Periode', type: 'Jenis', tools: 'Tools' },
    embedTitle: 'Dashboard interaktif',
    embedLoad: 'Muat dashboard interaktif',
    embedHint: 'Dashboard dimuat dari layanan pihak ketiga hanya setelah kamu menekan tombol.',
    embedEmpty: 'Embed dashboard akan ditambahkan.',
    embedOpen: 'Buka di tab baru',
    pending: 'Detail menyusul',
    prev: 'Proyek sebelumnya',
    next: 'Proyek berikutnya',
  },

  footer: {
    built: 'Dibangun dengan Astro, GSAP & Lenis.',
    rights: 'Satrio Faza Mubarok',
  },

  notFound: {
    code: '404',
    title: 'Halaman tidak ditemukan',
    body: 'Halaman yang kamu cari mungkin sudah dipindah atau tidak pernah ada.',
    cta: 'Kembali ke beranda',
  },
};

type UI = typeof id;

const en: UI = {
  meta: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    title: 'Satrio Faza Mubarok — Data Analyst',
    description:
      'Portfolio of Satrio Faza Mubarok, an Information Systems student at AMIKOM Yogyakarta pursuing a Data Analyst career. Case studies in dashboards, data analysis, and applied machine learning.',
    projectTitleSuffix: 'Case Study · Satrio Faza Mubarok',
    notFoundTitle: 'Page not found',
  },

  a11y: {
    skip: 'Skip to main content',
    slideNav: 'Section navigation',
    mainNav: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    themeToggle: 'Toggle light/dark mode',
    langSwitch: 'Ganti ke Bahasa Indonesia',
    langSwitchShort: 'ID',
    backToTop: 'Back to top',
    externalLink: '(opens in a new tab)',
  },

  nav: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    experience: 'Experience',
    skills: 'Skills',
    contact: 'Contact',
  },

  intro: { label: 'loading portfolio' },

  hero: {
    greeting: "Hi, I'm",
    role: 'Data Analyst',
    tagline: 'I turn raw data into clear dashboards and insights, so teams can make decisions with confidence.',
    typingPrefix: 'I focus on',
    typingWords: ['interactive dashboards', 'exploratory data analysis', 'applied machine learning', 'data storytelling'],
    ctaProjects: 'View Projects',
    ctaContact: 'Get in Touch',
    scroll: 'Scroll',
    meta: ['Information Systems · AMIKOM', 'Indonesia'],
  },

  about: {
    eyebrow: '01 / About',
    title: 'Data, clean and meaningful.',
    paragraphs: [
      "I'm Satrio Faza Mubarok, also known as Noobmaster, an Information Systems student at Universitas AMIKOM Yogyakarta (2023 – present, expected to graduate in 2027).",
      "I'm interested in data science, applied machine learning, and automated trading systems.",
    ],
    facts: [
      { label: 'Education', value: 'B.Sc. Information Systems, AMIKOM Yogyakarta' },
      { label: 'Career goal', value: 'Data Analyst · tech company' },
      { label: 'Interests', value: 'Data science · ML · Automated trading' },
    ],
    statProjects: 'Case studies',
    statTools: 'Skills & tools',
    photoAlt: 'Photo of Satrio Faza Mubarok',
  },

  projects: {
    eyebrow: '02 / Projects',
    title: 'Selected case studies',
    intro: 'Four projects that show how I work: understanding the problem, preparing the data, and presenting the insight.',
    viewCase: 'Read case study',
    coverAlt: 'Abstract illustration for the project',
  },

  experience: {
    eyebrow: '03 / Experience',
    title: 'Experience & activities',
    present: 'Present',
  },

  skills: {
    eyebrow: '04 / Skills',
    title: 'Tools I work with',
    intro: 'Grouped by stage of the data analysis workflow.',
  },

  contact: {
    eyebrow: '05 / Contact',
    title: "Let's talk.",
    intro: "Open to Data Analyst opportunities, project collaborations, or simply exchanging ideas about data.",
    email: 'Email',
    copyEmail: 'Copy email',
    copied: 'Email copied to clipboard',
    copyFailed: 'Could not copy. Please copy it manually.',
    whatsapp: 'WhatsApp',
    whatsappMessage: 'Hi Satrio, I came across your portfolio and would like to connect.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    cv: 'Download CV',
    unavailable: 'Coming soon',
    emailPending: 'A public email address is coming soon. For now, you can reach me on GitHub.',
  },

  caseStudy: {
    back: 'Back to projects',
    sections: {
      background: 'Background & problem',
      data: 'Data',
      method: 'Method',
      findings: 'Findings',
      impact: 'Impact',
      tools: 'Tools',
      links: 'Links',
    },
    meta: { role: 'Role', period: 'Period', type: 'Type', tools: 'Tools' },
    embedTitle: 'Interactive dashboard',
    embedLoad: 'Load interactive dashboard',
    embedHint: 'The dashboard is loaded from a third-party service only after you press the button.',
    embedEmpty: 'Dashboard embed coming soon.',
    embedOpen: 'Open in a new tab',
    pending: 'Details coming soon',
    prev: 'Previous project',
    next: 'Next project',
  },

  footer: {
    built: 'Built with Astro, GSAP & Lenis.',
    rights: 'Satrio Faza Mubarok',
  },

  notFound: {
    code: '404',
    title: 'Page not found',
    body: 'The page you are looking for may have moved or never existed.',
    cta: 'Back to home',
  },
};

export const ui: Record<Lang, UI> = { id, en };

/* ---------------------------------------------------------
   PENGALAMAN
   draft: true  → tidak ditampilkan sampai datanya lengkap
   --------------------------------------------------------- */
type L<T = string> = Record<Lang, T>;

export interface ExperienceItem {
  kind: 'work' | 'program' | 'education' | 'activity';
  title: L;
  org: string;
  period: L;
  current?: boolean;
  points: L<string[]>;
  draft?: boolean;
}

export const experience: ExperienceItem[] = [
  {
    kind: 'program',
    title: { id: 'Peserta Dicoding Coding Camp 2026', en: 'Dicoding Coding Camp 2026 Participant' },
    org: 'Dicoding',
    // TODO: isi periode program, contoh "Feb 2026 – Jul 2026"
    period: { id: 'TODO: periode', en: 'TODO: period' },
    points: {
      id: ['TODO: learning path yang diikuti (mis. Data Science).', 'TODO: capaian atau proyek utama.'],
      en: ['TODO: learning path taken (e.g. Data Science).', 'TODO: key achievement or project.'],
    },
  },
  {
    kind: 'education',
    title: { id: 'S1 Sistem Informasi', en: 'B.Sc. in Information Systems' },
    org: 'Universitas AMIKOM Yogyakarta',
    period: { id: '2023 – 2027 (target)', en: '2023 – 2027 (expected)' },
    points: {
      id: ['TODO (opsional): mata kuliah relevan, organisasi, atau IPK bila ingin ditampilkan.'],
      en: ['TODO (optional): relevant courses, organizations, or GPA if you want to show it.'],
    },
  },
  {
    kind: 'activity',
    title: { id: 'TODO: nama kegiatan lain', en: 'TODO: other activity' },
    org: 'TODO: penyelenggara',
    period: { id: 'TODO', en: 'TODO' },
    points: { id: ['TODO: deskripsi singkat.'], en: ['TODO: short description.'] },
    draft: true, // ubah ke false setelah diisi
  },
];

/* ---------------------------------------------------------
   SKILL
   verified: false → TODO, pastikan kamu benar-benar menguasainya
   (hapus yang tidak sesuai). icon = slug Simple Icons atau ikon lokal.
   --------------------------------------------------------- */
export interface SkillGroup {
  name: L;
  items: { label: string; icon?: string; verified: boolean }[];
}

export const skillGroups: SkillGroup[] = [
  {
    name: { id: 'Visualisasi & BI', en: 'Visualization & BI' },
    items: [
      { label: 'Looker Studio', icon: 'looker', verified: true },
      { label: 'Tableau', icon: 'tableau', verified: true },
      { label: 'Google Sheets', icon: 'googlesheets', verified: false }, // TODO: verifikasi
      { label: 'Microsoft Excel', icon: 'excel', verified: false }, // TODO: verifikasi
    ],
  },
  {
    name: { id: 'Pemrograman & Data', en: 'Programming & Data' },
    items: [
      { label: 'Python', icon: 'python', verified: false }, // TODO: verifikasi
      { label: 'Pandas', icon: 'pandas', verified: false }, // TODO: verifikasi
      { label: 'NumPy', icon: 'numpy', verified: false }, // TODO: verifikasi
      { label: 'SQL', icon: 'mysql', verified: false }, // TODO: verifikasi
      { label: 'Jupyter / Colab', icon: 'jupyter', verified: false }, // TODO: verifikasi
    ],
  },
  {
    name: { id: 'Machine Learning', en: 'Machine Learning' },
    items: [
      { label: 'Scikit-learn', icon: 'scikitlearn', verified: false }, // TODO: verifikasi
      { label: 'TensorFlow', icon: 'tensorflow', verified: false }, // TODO: verifikasi
    ],
  },
  {
    name: { id: 'Metode', en: 'Methods' },
    items: [
      { label: 'Exploratory Data Analysis', verified: true },
      { label: 'Data Cleaning', verified: false }, // TODO: verifikasi
      { label: 'KPI & Dashboard Design', verified: true },
      { label: 'Classification', verified: true },
      { label: 'Data Storytelling', verified: false }, // TODO: verifikasi
    ],
  },
];

export const allSkills = skillGroups.flatMap((g) => g.items);
