import {getLocale, getTranslations} from "next-intl/server";

import {Wordmark} from "@/components/widgets/Wordmark/Wordmark";
import {LanguageSwitcher} from "@/components/widgets/LanguageSwitcher/LanguageSwitcher";
import {EnquiryLink} from "@/components/widgets/EnquiryLink/EnquiryLink";
import {MobileNavigation} from "./MobileNavigation";
import {DesktopNavigation} from "./DesktopNavigation";
import {Container} from "@/components/shared/Container/Container";
import styles from "./Header.module.css";
import {HeaderCtaLabel} from "./HeaderCtaLabel";

export async function Header() {
  const locale = await getLocale();
  const t = await getTranslations("Navigation");
  const items = [
    {href: "/bouquets", label: t("bouquets")},
    {href: "/balloons", label: t("balloons")},
    {href: "/weddings-events", label: t("events"), contextLabel: t("eventsShort")},
    {href: "/about", label: t("about")},
    {href: "/contact", label: t("contact")}
  ];

  return <header className={styles.header}>
    <Container variant="wide" className={styles.inner}>
      <div className={styles.brandAndNav}>
        <Wordmark caption />
        <DesktopNavigation items={items} label={t("navigation")} />
      </div>
      <div className={styles.utilities}>
        <span className={styles.location}>{t("location")}</span>
        <div className={styles.desktopLocale}><LanguageSwitcher locale={locale} label={t("language")} /></div>
        <div className={styles.headerEnquiry}><EnquiryLink><HeaderCtaLabel defaultLabel={t("order")} previewLabel="Enquire" /></EnquiryLink></div>
        <MobileNavigation items={items} labels={{open: t("open"), close: t("close"), navigation: t("navigation"), location: t("location")}}
          enquiry={<EnquiryLink><HeaderCtaLabel defaultLabel={t("order")} previewLabel="Enquire" /></EnquiryLink>}
          language={<LanguageSwitcher locale={locale} label={t("language")} align="start" />} />
      </div>
    </Container>
  </header>;
}
