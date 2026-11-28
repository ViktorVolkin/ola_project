import { getLocale, getTranslations } from "next-intl/server";
import { getBalloonsContent } from "@/content/balloons";
import {resolveBalloonsContent} from "@/content/resolver/balloons";
import {balloonsEditing} from "@/components/widgets/BalloonsBlocks/balloonsEditing";

import { BalloonsHeroBlock } from "@/components/widgets/BalloonsBlocks/BalloonsHeroBlock/BalloonsHeroBlock";
import { BalloonsCategoriesBlock } from "@/components/widgets/BalloonsBlocks/BalloonsCategoriesBlock/BalloonsCategoriesBlock";
import { BalloonsFavouritesBlock } from "@/components/widgets/BalloonsBlocks/BalloonsFavouritesBlock/BalloonsFavouritesBlock";
import { BalloonsPersonalisationBlock } from "@/components/widgets/BalloonsBlocks/BalloonsPersonalisationBlock/BalloonsPersonalisationBlock";
import { BalloonsCtaBlock } from "@/components/widgets/BalloonsBlocks/BalloonsCtaBlock/BalloonsCtaBlock";
import styles from "./BalloonsPage.module.css";

export default async function BalloonsPage() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Balloons"),
  ]);
  const {content, images, labels, source, preview} = await resolveBalloonsContent(locale);
  const local = getBalloonsContent(locale);
  const editing = balloonsEditing(locale, source === "preview" && !!process.env.SANITY_API_READ_TOKEN && !!process.env.SANITY_PREVIEW_ORIGIN);
  return (
    <main id="main-content" className={styles.page} data-locale={locale}>
      <BalloonsHeroBlock
        previewStatus={source === "preview" ? {locale, preview, content} : undefined}
        images={images} editing={editing}
        content={content.hero}
        pageTitle={content.pageTitle}
        homeLabel={labels.home ?? t("home")}
        exploreLabel={labels.exploreSets ?? t("exploreSets")}
      />
      <BalloonsCategoriesBlock
        images={images} editing={editing} localItems={local.categories}
        items={content.categories}
        label={labels.categoriesLabel ?? t("categoriesLabel")}
      />
      <BalloonsFavouritesBlock
        images={images} editing={editing} localItems={local.favourites.items}
        content={content.favourites}
        askLabel={labels.askSets ?? t("askSets")}
        enquireLabel={labels.enquire ?? t("enquire")}
        setsSubject={t("askSets")}
      />
      <BalloonsPersonalisationBlock
        images={images} editing={editing} localExtras={local.personalisation.extras}
        content={content.personalisation}
        enquireLabel={labels.enquire ?? t("enquire")}
      />
      <BalloonsCtaBlock content={content.cta} actionLabel={labels.createGift ?? t("createGift")} subject={t("createGift")} images={images} editing={editing} />
    </main>
  );
}
