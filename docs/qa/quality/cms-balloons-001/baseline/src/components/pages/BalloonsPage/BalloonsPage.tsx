import { getLocale, getTranslations } from "next-intl/server";
import { getBalloonsContent } from "@/content/balloons";
import { BalloonsHeroBlock } from "@/components/widgets/BalloonsBlocks/BalloonsHeroBlock";
import { BalloonsCategoriesBlock } from "@/components/widgets/BalloonsBlocks/BalloonsCategoriesBlock";
import { BalloonsFavouritesBlock } from "@/components/widgets/BalloonsBlocks/BalloonsFavouritesBlock";
import { BalloonsPersonalisationBlock } from "@/components/widgets/BalloonsBlocks/BalloonsPersonalisationBlock";
import { BalloonsCtaBlock } from "@/components/widgets/BalloonsBlocks/BalloonsCtaBlock";
import styles from "./BalloonsPage.module.css";

export default async function BalloonsPage() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Balloons"),
  ]);
  const content = getBalloonsContent(locale);
  return (
    <main id="main-content" className={styles.page} data-locale={locale}>
      <BalloonsHeroBlock
        content={content.hero}
        pageTitle={content.pageTitle}
        homeLabel={t("home")}
        exploreLabel={t("exploreSets")}
      />
      <BalloonsCategoriesBlock
        items={content.categories}
        label={t("categoriesLabel")}
      />
      <BalloonsFavouritesBlock
        content={content.favourites}
        askLabel={t("askSets")}
        enquireLabel={t("enquire")}
        setsSubject={t("askSets")}
      />
      <BalloonsPersonalisationBlock
        content={content.personalisation}
        enquireLabel={t("enquire")}
      />
      <BalloonsCtaBlock content={content.cta} actionLabel={t("createGift")} />
    </main>
  );
}
