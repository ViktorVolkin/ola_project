import {getLocale, getTranslations} from "next-intl/server";
import {getWeddingsContent} from "@/content/weddings";
import {WeddingsHeroBlock} from "@/components/widgets/WeddingsBlocks/WeddingsHeroBlock";
import {WeddingsCategoriesBlock} from "@/components/widgets/WeddingsBlocks/WeddingsCategoriesBlock";
import {WeddingsApproachBlock} from "@/components/widgets/WeddingsBlocks/WeddingsApproachBlock";
import {WeddingsProcessBlock} from "@/components/widgets/WeddingsBlocks/WeddingsProcessBlock";
import {WeddingsInspirationBlock} from "@/components/widgets/WeddingsBlocks/WeddingsInspirationBlock";
import {WeddingsCtaBlock} from "@/components/widgets/WeddingsBlocks/WeddingsCtaBlock";
import styles from "./WeddingsPage.module.css";

export default async function WeddingsPage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("Weddings")]);
  const content = getWeddingsContent(locale);
  const subject = content.hero.title.replace(/\n/g, " ");
  return (
    <main id="main-content" className={styles.page} data-locale={locale}>
      <WeddingsHeroBlock content={content.hero} homeLabel={t("home")} planLabel={t("planEvent")} />
      <WeddingsCategoriesBlock items={content.categories} label={t("categoriesLabel")} />
      <WeddingsApproachBlock content={content.approach} processLabel={t("ourProcess")} />
      <WeddingsProcessBlock content={content.process} />
      <WeddingsInspirationBlock
        content={content.inspiration}
        discussLabel={t("discussEvent")}
        eventSubject={subject}
      />
      <WeddingsCtaBlock
        content={content.cta}
        contactLabel={t("contactWhatsapp")}
        eventSubject={subject}
      />
    </main>
  );
}
