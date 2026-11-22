import type {Locale} from "next-intl";
import Link from "next/link";
import type {BalloonsPreview} from "@/content/resolver/balloons";
import type {BalloonsContent} from "@/content/balloons";
import {BalloonsEditable, type BalloonsEditing} from "./balloonsEditing";
import styles from "@/components/widgets/HomeBlocks/HomeCommon/HomePreviewStatus.module.css";

const labels = {
  en: {name: "Editorial preview", title: "Draft preview — not published", exit: "Exit preview", fallback: "Incomplete draft: same-language published/local fallback fields", configuration: "Preview configuration missing. No draft loaded.", unavailable: "Draft unavailable. Showing published/local content; edits are not visible.", alts: "Image descriptions"},
  ru: {name: "Редакторский предпросмотр", title: "Предпросмотр черновика — не опубликован", exit: "Выйти из предпросмотра", fallback: "Неполный черновик: поля из опубликованной/локальной версии на том же языке", configuration: "Предпросмотр не настроен. Черновик не загружен.", unavailable: "Черновик недоступен. Показана опубликованная/локальная версия; правки не видны.", alts: "Описания изображений"},
  sr: {name: "Urednički pregled", title: "Pregled nacrta — nije objavljeno", exit: "Izađi iz pregleda", fallback: "Nepotpun nacrt: polja iz objavljene/lokalne verzije na istom jeziku", configuration: "Pregled nije podešen. Nacrt nije učitan.", unavailable: "Nacrt nije dostupan. Prikazana je objavljena/lokalna verzija; izmene nisu vidljive.", alts: "Opisi slika"}
} as const;
export function BalloonsPreviewStatus({locale, preview, content, editing}: {locale: Locale; preview: BalloonsPreview | null; content: BalloonsContent; editing: BalloonsEditing}) {
  const t = labels[locale];
  const alts = [
    {path: "hero.imageAlt", value: content.hero.imageAlt},
    ...content.categories.map(item => ({path: `categories.${item.id}.imageAlt`, value: item.imageAlt})),
    ...content.favourites.items.map(item => ({path: `favourites.${item.id}.imageAlt`, value: item.imageAlt})),
    {path: "personalisation.imageAlt", value: content.personalisation.imageAlt},
    ...content.personalisation.extras.map(item => ({path: `personalisation.${item.id}.imageAlt`, value: item.imageAlt})),
    {path: "cta.imageAlt", value: content.cta.imageAlt}
  ];
  return <aside className={styles.status} aria-label={t.name} data-balloons-preview="true">
    <strong>{t.title}</strong>{" "}<a href={`/api/draft-mode/disable?returnTo=/${locale}/balloons`}>{t.exit}</a>{" "}
    {(["en", "ru", "sr"] as const).map(lang => <Link key={lang} href={`/${lang}/balloons`} hrefLang={lang} prefetch={false}>{lang.toUpperCase()}{" "}</Link>)}
    {preview?.error ? <p role="alert">{t[preview.error]}</p> : !!preview?.fallbackPaths?.length && <details><summary>{t.fallback}: {preview.fallbackPaths.length}</summary><ul>{preview.fallbackPaths.map(path => <li key={path}>{path}</li>)}</ul></details>}
    <details><summary>{t.alts}</summary><ul>{alts.map(item => <li key={item.path}><BalloonsEditable attribute={editing(item.path)}>{item.value}</BalloonsEditable></li>)}</ul></details>
  </aside>;
}
