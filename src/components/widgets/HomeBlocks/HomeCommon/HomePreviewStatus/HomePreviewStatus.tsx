import type {Locale} from "next-intl";
import Link from "next/link";
import styles from "@/components/shared/CmsPreviewStatus.module.css";
export function HomePreviewStatus({locale, error, fallbackPaths}: {locale: Locale; error?: string | null; fallbackPaths?: string[]}) {
  return <aside className={styles.status} aria-label="Editorial preview">
    <strong>Draft preview — not published</strong>{" "}
    <a href={`/api/draft-mode/disable?returnTo=/${locale}`}>Exit preview</a>{" "}
    {(["en", "ru", "sr"] as const).map(lang => <Link key={lang} href={`/${lang}`} hrefLang={lang} prefetch={false}>{lang.toUpperCase()}{" "}</Link>)}
    {error ? <p role="alert">{error}</p> : !!fallbackPaths?.length && <details><summary>Incomplete draft: {fallbackPaths.length} fields show same-language published/local fallback</summary><ul>{fallbackPaths.map(path => <li key={path}>{path}</li>)}</ul></details>}
  </aside>;
}
