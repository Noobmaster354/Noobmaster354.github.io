/**
 * DATA STUDI KASUS (4 proyek), dwibahasa.
 * Aturan: jangan menulis angka/hasil/link yang belum pasti — gunakan "TODO".
 * Item yang diawali "TODO" otomatis disembunyikan / diganti "Detail menyusul" di UI.
 *
 * embed.url  → URL embed Tableau Public (…/views/…?:showVizHome=no&:embed=true)
 *              atau Looker Studio (https://lookerstudio.google.com/embed/reporting/…)
 * links      → link publik (dashboard, repo GitHub, notebook, laporan)
 */
import type { Lang } from './content';

type L<T = string> = Record<Lang, T>;

export type Cover = 'network' | 'leaf' | 'bars' | 'flow';

export interface Project {
  slug: string;
  cover: Cover;
  year: string;
  title: L;
  type: L;
  role: L;
  summary: L;
  background: L<string[]>;
  data: L<string[]>;
  method: L<string[]>;
  findings: L<string[]>;
  impact: L<string[]>;
  tools: string[];
  links: { label: L; href: string }[];
  embed: { provider: 'tableau' | 'looker' | null; url: string; ratio?: string };
}

export const projects: Project[] = [
  {
    slug: 'talent-career-readiness',
    cover: 'network',
    year: '2026',
    title: { id: 'Talent and Career Readiness', en: 'Talent and Career Readiness' },
    type: { id: 'Dashboard · Proyek kelompok', en: 'Dashboard · Group project' },
    role: {
      id: 'Anggota tim Divisi Data Analyst — TODO: peran spesifik',
      en: 'Data Analyst Division team member — TODO: specific role',
    },
    summary: {
      id: 'Dashboard Looker Studio tentang kesiapan talenta dan karier, proyek akhir kelompok Divisi Data Analyst saat magang di PT Vinix Seven Aurum.',
      en: 'A Looker Studio dashboard on talent and career readiness, the Data Analyst Division group final project during my internship at PT Vinix Seven Aurum.',
    },
    background: {
      id: [
        'Proyek akhir program magang di PT Vinix Seven Aurum yang dikerjakan secara berkelompok oleh Divisi Data Analyst, dengan tema kesiapan talenta dan karier.',
        'TODO: jelaskan pertanyaan bisnis yang ingin dijawab dan siapa pengguna dashboard.',
      ],
      en: [
        'The final project of the PT Vinix Seven Aurum internship program, built as a group by the Data Analyst Division around talent and career readiness.',
        'TODO: describe the business question and who uses the dashboard.',
      ],
    },
    data: {
      id: ['TODO: sumber data, jumlah baris/kolom, periode data, dan proses persiapannya.'],
      en: ['TODO: data source, number of rows/columns, time range, and preparation steps.'],
    },
    method: {
      id: ['Penyusunan dashboard dan visualisasi di Looker Studio.', 'TODO: langkah pembersihan dan transformasi data.', 'TODO: pembagian tugas dalam kelompok.'],
      en: ['Building the dashboard and visualizations in Looker Studio.', 'TODO: data cleaning and transformation steps.', 'TODO: how tasks were split within the group.'],
    },
    findings: {
      id: ['TODO: temuan utama 1.', 'TODO: temuan utama 2.'],
      en: ['TODO: key finding 1.', 'TODO: key finding 2.'],
    },
    impact: {
      id: ['TODO: bagaimana dashboard dipakai atau keputusan apa yang dibantu.'],
      en: ['TODO: how the dashboard is used or which decisions it supports.'],
    },
    tools: ['Looker Studio'], // TODO: tambahkan tools lain (mis. Google Sheets, SQL)
    links: [
      // TODO: { label: { id: 'Dashboard Looker Studio', en: 'Looker Studio dashboard' }, href: 'https://lookerstudio.google.com/...' },
    ],
    embed: { provider: 'looker', url: 'TODO', ratio: '16 / 10' },
  },
  {
    slug: 'witani-ai',
    cover: 'leaf',
    year: 'TODO',
    title: { id: 'Witani AI', en: 'Witani AI' },
    type: { id: 'Machine learning · Klasifikasi', en: 'Machine learning · Classification' },
    role: { id: 'TODO: peran kamu', en: 'TODO: your role' },
    summary: {
      id: 'Deteksi penyakit tanaman melalui eksplorasi data (EDA) dan model klasifikasi.',
      en: 'Plant disease detection through exploratory data analysis (EDA) and a classification model.',
    },
    background: {
      id: [
        'Witani AI bertujuan mendeteksi penyakit tanaman secara otomatis.',
        'TODO: jelaskan masalah di lapangan dan siapa yang diuntungkan.',
      ],
      en: [
        'Witani AI aims to detect plant diseases automatically.',
        'TODO: describe the real-world problem and who benefits.',
      ],
    },
    data: {
      id: ['TODO: sumber dataset, jumlah data/kelas, dan pembagian train/test.'],
      en: ['TODO: dataset source, number of samples/classes, and train/test split.'],
    },
    method: {
      id: ['Exploratory Data Analysis (EDA) untuk memahami sebaran data.', 'Pelatihan model klasifikasi penyakit tanaman.', 'TODO: arsitektur/algoritme model dan teknik evaluasi.'],
      en: ['Exploratory Data Analysis (EDA) to understand the data distribution.', 'Training a plant disease classification model.', 'TODO: model architecture/algorithm and evaluation technique.'],
    },
    findings: {
      id: ['TODO: hasil EDA yang menarik.', 'TODO: performa model (metrik asli).'],
      en: ['TODO: notable EDA insight.', 'TODO: model performance (real metrics).'],
    },
    impact: {
      id: ['TODO: potensi penerapan atau hasil uji coba.'],
      en: ['TODO: potential use or pilot results.'],
    },
    tools: [], // TODO: mis. Python, Pandas, TensorFlow
    links: [],
    embed: { provider: null, url: '' },
  },
  {
    slug: 'ringkasan-penjualan',
    cover: 'bars',
    year: 'TODO',
    title: { id: 'Ringkasan Penjualan', en: 'Sales Summary' },
    type: { id: 'Dashboard Tableau', en: 'Tableau dashboard' },
    role: { id: 'Proyek individu — TODO: konfirmasi', en: 'Individual project — TODO: confirm' },
    summary: {
      id: 'Dashboard Tableau berisi KPI penjualan, tren omzet bulanan, dan heatmap kategori.',
      en: 'A Tableau dashboard with sales KPIs, monthly revenue trends, and a category heatmap.',
    },
    background: {
      id: [
        'Dashboard ringkasan untuk memantau performa penjualan dalam satu layar.',
        'TODO: konteks bisnis atau tujuan pembuatan dashboard.',
      ],
      en: [
        'A one-screen summary dashboard for monitoring sales performance.',
        'TODO: business context or purpose of the dashboard.',
      ],
    },
    data: {
      id: ['TODO: sumber dataset dan periode data.'],
      en: ['TODO: dataset source and time range.'],
    },
    method: {
      id: ['Kartu KPI untuk metrik utama penjualan.', 'Grafik tren omzet bulanan.', 'Heatmap untuk membandingkan kategori.'],
      en: ['KPI cards for the key sales metrics.', 'Monthly revenue trend chart.', 'Heatmap to compare categories.'],
    },
    findings: {
      id: ['TODO: temuan dari tren omzet.', 'TODO: kategori yang menonjol pada heatmap.'],
      en: ['TODO: insight from the revenue trend.', 'TODO: standout categories in the heatmap.'],
    },
    impact: {
      id: ['TODO: manfaat dashboard bagi pengguna.'],
      en: ['TODO: how the dashboard helps its users.'],
    },
    tools: ['Tableau'],
    links: [
      // TODO: { label: { id: 'Tableau Public', en: 'Tableau Public' }, href: 'https://public.tableau.com/app/profile/...' },
    ],
    embed: { provider: 'tableau', url: 'TODO', ratio: '16 / 10' },
  },
  {
    slug: 'bikeflow-dashboard',
    cover: 'flow',
    year: 'TODO',
    title: { id: 'Dashboard Bikeflow', en: 'Bikeflow Dashboard' },
    type: { id: 'Dashboard · Dicoding', en: 'Dashboard · Dicoding' },
    role: { id: 'Proyek individu — TODO: konfirmasi', en: 'Individual project — TODO: confirm' },
    summary: {
      id: 'Dashboard analisis data Bikeflow yang dibuat sebagai proyek di Dicoding.',
      en: 'A Bikeflow data analysis dashboard built as a Dicoding project.',
    },
    background: {
      id: ['Proyek analisis data dan dashboard dalam program belajar Dicoding.', 'TODO: pertanyaan bisnis yang dijawab.'],
      en: ['A data analysis and dashboard project from a Dicoding learning program.', 'TODO: business questions answered.'],
    },
    data: {
      id: ['TODO: dataset yang digunakan dan periode data.'],
      en: ['TODO: dataset used and its time range.'],
    },
    method: {
      id: ['TODO: langkah wrangling, EDA, dan visualisasi.'],
      en: ['TODO: wrangling, EDA, and visualization steps.'],
    },
    findings: {
      id: ['TODO: temuan utama.'],
      en: ['TODO: key findings.'],
    },
    impact: {
      id: ['TODO: kesimpulan atau rekomendasi.'],
      en: ['TODO: conclusion or recommendations.'],
    },
    tools: [], // TODO: mis. Python, Pandas, Streamlit
    links: [
      // TODO: { label: { id: 'Repositori GitHub', en: 'GitHub repository' }, href: 'https://github.com/Noobmaster354/...' },
    ],
    embed: { provider: null, url: '' },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
