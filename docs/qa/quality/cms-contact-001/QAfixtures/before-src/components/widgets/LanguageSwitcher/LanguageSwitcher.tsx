"use client";

import type {Locale} from "next-intl";
import {Link, usePathname} from "@/i18n/navigation";
import {languageTags} from "@/i18n/routing";
import {Icon} from "@/components/shared/Icon";
import {useDisclosure} from "@/components/shared/useDisclosure";
import styles from "./LanguageSwitcher.module.css";

const languages = {en: "English", sr: "Srpski", ru: "Русский"} as const;

export function LanguageSwitcher({locale, label, align = "end", placement = "bottom"}: {
  locale: Locale;
  label: string;
  align?: "start" | "end";
  placement?: "top" | "bottom";
}) {
  const {open, setOpen, rootRef, triggerRef, panelId, onKeyDown, ready} = useDisclosure();
  const pathname = usePathname();
  // The open list is client-only, so query/hash can be preserved without making the page dynamic.
  const suffix = open ? window.location.search + window.location.hash : "";

  return (
    <div ref={rootRef} onKeyDown={onKeyDown} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }} className={styles.root} data-language-open={open}>
      <button ref={triggerRef} type="button" disabled={!ready} className={styles.trigger} aria-label={`${label}: ${locale.toUpperCase()} — ${languages[locale]}`} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        {locale.toUpperCase()}<Icon name="chevron-down" />
      </button>
      {open && <ul id={panelId} className={`${styles.list} ${styles[align]} ${styles[placement]}`}>
        {(Object.keys(languages) as Locale[]).map((target) => <li key={target}>
          <Link href={`${pathname}${suffix}`} locale={target} hrefLang={languageTags[target]} lang={languageTags[target]} aria-current={locale === target ? "page" : undefined} onClick={() => setOpen(false)}>
            {languages[target]}{locale === target && <Icon name="check" />}
          </Link>
        </li>)}
      </ul>}
    </div>
  );
}
