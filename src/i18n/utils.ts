import { defaultLang, languages, ui, type Lang } from '../data/content';
import { isTodo } from '../data/site';

export { isTodo };

export const langs = Object.keys(languages) as Lang[];

/** Bahasa dari URL: "/en/..." → en, selain itu → id */
export function getLang(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return (langs as string[]).includes(first) && first !== defaultLang ? (first as Lang) : defaultLang;
}

export const t = (lang: Lang) => ui[lang];

/** Hapus prefix bahasa: "/en/projects/x/" → "/projects/x/" */
export function stripLang(pathname: string): string {
  const parts = pathname.split('/');
  if ((langs as string[]).includes(parts[1]) && parts[1] !== defaultLang) parts.splice(1, 1);
  const p = parts.join('/') || '/';
  return p.startsWith('/') ? p : `/${p}`;
}

/** Path netral → path untuk bahasa tertentu (dengan trailing slash) */
export function localizePath(path: string, lang: Lang): string {
  const [base, hash] = path.split('#');
  let clean = stripLang(base || '/');
  if (!clean.endsWith('/')) clean += '/';
  const out = lang === defaultLang ? clean : `/${lang}${clean}`;
  return hash ? `${out}#${hash}` : out;
}

/** Halaman setara di bahasa lain */
export const alternatePath = (url: URL, target: Lang) => localizePath(url.pathname, target);

export const otherLang = (lang: Lang): Lang => (lang === 'id' ? 'en' : 'id');

/** Buang item placeholder "TODO" dari daftar */
export const filled = (items: string[] = []) => items.filter((s) => !isTodo(s));
