import {getLocale, getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import {Wordmark} from "@/components/widgets/Wordmark/Wordmark";
import {LanguageSwitcher} from "@/components/widgets/LanguageSwitcher/LanguageSwitcher";
import {EnquiryLink} from "@/components/widgets/EnquiryLink/EnquiryLink";
import {Container} from "@/components/shared/Container/Container";
import styles from "./Footer.module.css";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("Footer");

  return <Container as="footer" variant="wide" className={styles.footer}>
    <div className={styles.rule} />
    <div className={styles.inner}>
      <div className={styles.identity}><Wordmark /><p>{t("description")}</p></div>
      <nav className={styles.explore} aria-label={t("explore")}>
        <Link href="/bouquets">{t("bouquets")}</Link>
        <Link href="/balloons">{t("balloons")}</Link>
        <Link href="/weddings-events">{t("events")}</Link>
      </nav>
      <div className={styles.studio}>
        <nav aria-label={t("studio")}><Link href="/about">{t("about")}</Link><Link href="/contact">{t("contact")}</Link></nav>
        <EnquiryLink variant="text">{t("enquiry")}</EnquiryLink>
        <LanguageSwitcher locale={locale} label={t("language")} align="start" placement="top" />
      </div>
    </div>
  </Container>;
}
