import en from "@/i18n/messages/en.json";
import ru from "@/i18n/messages/ru.json";
import sr from "@/i18n/messages/sr.json";
import type {Locale} from "next-intl";
import Link from "next/link";
import styles from "@/components/shared/CmsPreviewStatus.module.css";
export function HomePreviewStatus({locale, error, fallbackPaths}: {locale: Locale; error?: string | null; fallbackPaths?: string[]}) {
  const t = {en: en.HomePreview, ru: ru.HomePreview, sr: sr.HomePreview}[locale];
  return <aside className={styles.status} aria-label={t.name}>
    <strong>{t.title}</strong>{" "}
    <a href={`/api/draft-mode/disable?returnTo=/${locale}`}>{t.exit}</a>{" "}
    {(["en", "ru", "sr"] as const).map(lang => <Link key={lang} href={`/${lang}`} hrefLang={lang} prefetch={false}>{lang.toUpperCase()}{" "}</Link>)}
    {error ? <p role="alert">{error}</p> : !!fallbackPaths?.length && <details><summary>{t.fallbackPrefix} {fallbackPaths.length} {t.fallbackSuffix}</summary><ul>{fallbackPaths.map(path => <li key={path}>{path}</li>)}</ul></details>}
  </aside>;
}
