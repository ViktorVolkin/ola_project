import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import {site} from "@/content/site";
import styles from "./Wordmark.module.css";

export function Wordmark({caption = false}: {caption?: boolean}) {
  const t = useTranslations("Navigation");
  return <Link href="/" aria-label={site.name} className={styles.wordmark}>
    <span className={caption ? styles.headerName : styles.footerName}>OLA</span>
    {caption && <>{" "}<span className={styles.caption}>{t("brandCaption")}</span></>}
  </Link>;
}
