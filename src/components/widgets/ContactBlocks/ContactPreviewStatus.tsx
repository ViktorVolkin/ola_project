import type {Locale} from "next-intl";
import Link from "next/link";
import type {ContactPreview} from "@/content/resolver/contact";
import styles from "@/components/widgets/HomeBlocks/HomeCommon/HomePreviewStatus.module.css";
const labels = {
  en: {
    name: "Editorial preview",
    title: "Draft preview — not published",
    exit: "Exit preview",
    fallback: "Incomplete draft: same-language published/local fallback fields",
    configuration: "Preview configuration missing. No draft loaded.",
    unavailable: "Draft unavailable. Showing published/local content; edits are not visible.",
  },
  ru: {
    name: "Редакторский предпросмотр",
    title: "Предпросмотр черновика — не опубликован",
    exit: "Выйти из предпросмотра",
    fallback: "Неполный черновик: поля из опубликованной/локальной версии на том же языке",
    configuration: "Предпросмотр не настроен. Черновик не загружен.",
    unavailable: "Черновик недоступен. Показана опубликованная/локальная версия; правки не видны.",
  },
  sr: {
    name: "Urednički pregled",
    title: "Pregled nacrta — nije objavljeno",
    exit: "Izađi iz pregleda",
    fallback: "Nepotpun nacrt: polja iz objavljene/lokalne verzije na istom jeziku",
    configuration: "Pregled nije podešen. Nacrt nije učitan.",
    unavailable: "Nacrt nije dostupan. Prikazana je objavljena/lokalna verzija; izmene nisu vidljive.",
  },
} as const;
export function ContactPreviewStatus({locale, preview}: {locale: Locale; preview: ContactPreview | null}) {
  const t = labels[locale];
  return (
    <aside className={styles.status} aria-label={t.name} data-contact-preview="true">
      <strong>{t.title}</strong>{" "}
      <a href={`/api/draft-mode/disable?returnTo=/${locale}/contact`}>{t.exit}</a>{" "}
      {(["en", "ru", "sr"] as const).map(lang => (
        <Link key={lang} href={`/${lang}/contact`} hrefLang={lang} prefetch={false}>
          {lang.toUpperCase()}{" "}
        </Link>
      ))}
      {preview?.error ? (
        <p role="alert">{t[preview.error]}</p>
      ) : !!preview?.fallbackPaths?.length && (
        <details>
          <summary>{t.fallback}: {preview.fallbackPaths.length}</summary>
          <ul>
            {preview.fallbackPaths.map(path => <li key={path}>{path}</li>)}
          </ul>
        </details>
      )}
    </aside>
  );
}
