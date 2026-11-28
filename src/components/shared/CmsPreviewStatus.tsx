import en from "@/i18n/messages/en.json";
import ru from "@/i18n/messages/ru.json";
import sr from "@/i18n/messages/sr.json";

import type {ReactNode} from "react";
import type {Locale} from "next-intl";
import Link from "next/link";
import styles from "./CmsPreviewStatus.module.css";

const labels = {en: en.CmsPreview, ru: ru.CmsPreview, sr: sr.CmsPreview};

type PreviewError = "configuration" | "unavailable";

type PreviewData = {
  error?: PreviewError | null;
  fallbackPaths?: readonly string[] | null;
} | null;

type CmsPreviewStatusProps = {
  locale: Locale;
  route: "/about" | "/balloons" | "/bouquets" | "/contact" | "/weddings-events";
  preview: PreviewData;
  testId: string;
  children?: ReactNode;
};

export function CmsPreviewStatus({
  locale,
  route,
  preview,
  testId,
  children,
}: CmsPreviewStatusProps) {
  const t = labels[locale];
  const currentPath = `/${locale}${route}`;

  return (
    <aside
      className={styles.status}
      aria-label={t.name}
      data-cms-preview="true"
      {...{[testId]: "true"}}
    >
      <strong>{t.title}</strong>{" "}
      <a
        href={`/api/draft-mode/disable?returnTo=${encodeURIComponent(currentPath)}`}
      >
        {t.exit}
      </a>{" "}

      {(["en", "ru", "sr"] as const).map(lang => (
        <Link
          key={lang}
          href={`/${lang}${route}`}
          hrefLang={lang}
          prefetch={false}
        >
          {lang.toUpperCase()}{" "}
        </Link>
      ))}

      {preview?.error ? (
        <p role="alert">{t[preview.error]}</p>
      ) : !!preview?.fallbackPaths?.length && (
        <details>
          <summary>
            {t.fallback}: {preview.fallbackPaths.length}
          </summary>
          <ul>
            {preview.fallbackPaths.map(path => (
              <li key={path}>{path}</li>
            ))}
          </ul>
        </details>
      )}

      {children && (
        <details>
          <summary>{t.alts}</summary>
          {children}
        </details>
      )}
    </aside>
  );
}
