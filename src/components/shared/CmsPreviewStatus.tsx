
import type {ReactNode} from "react";
import type {Locale} from "next-intl";
import Link from "next/link";
import styles from "./CmsPreviewStatus.module.css";

const labels = {
  en: {
    name: "Editorial preview",
    title: "Draft preview — not published",
    exit: "Exit preview",
    fallback: "Incomplete draft: same-language published/local fallback fields",
    configuration: "Preview configuration missing. No draft loaded.",
    unavailable: "Draft unavailable. Showing published/local content; edits are not visible.",
    alts: "Image descriptions",
  },
  ru: {
    name: "Редакторский предпросмотр",
    title: "Предпросмотр черновика — не опубликован",
    exit: "Выйти из предпросмотра",
    fallback: "Неполный черновик: поля из опубликованной/локальной версии на том же языке",
    configuration: "Предпросмотр не настроен. Черновик не загружен.",
    unavailable: "Черновик недоступен. Показана опубликованная/локальная версия; правки не видны.",
    alts: "Описания изображений",
  },
  sr: {
    name: "Urednički pregled",
    title: "Pregled nacrta — nije objavljeno",
    exit: "Izađi iz pregleda",
    fallback: "Nepotpun nacrt: polja iz objavljene/lokalne verzije na istom jeziku",
    configuration: "Pregled nije podešen. Nacrt nije učitan.",
    unavailable: "Nacrt nije dostupan. Prikazana je objavljena/lokalna verzija; izmene nisu vidljive.",
    alts: "Opisi slika",
  },
} as const;

type PreviewError = "configuration" | "unavailable";

type PreviewData = {
  error?: PreviewError | null;
  fallbackPaths?: readonly string[] | null;
} | null;

type CmsPreviewStatusProps = {
  locale: Locale;
  route: "/about" | "/balloons" | "/contact" | "/weddings-events";
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
