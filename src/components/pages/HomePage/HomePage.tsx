import {getLocale, getTranslations} from "next-intl/server";
import {resolveHomeContent} from "@/content/resolver/home";
import {HomeHeroBlock} from "@/components/widgets/HomeBlocks/HomeHeroBlock";
import {HomeServicesBlock} from "@/components/widgets/HomeBlocks/HomeServicesBlock";
import {HomeMoodBlock} from "@/components/widgets/HomeBlocks/HomeMoodBlock";
import {HomeCustomExtrasBlock} from "@/components/widgets/HomeBlocks/HomeCustomExtrasBlock";
import {HomeMeetBlock} from "@/components/widgets/HomeBlocks/HomeMeetBlock";
import {HomeEventsBlock} from "@/components/widgets/HomeBlocks/HomeEventsBlock";
import styles from "./HomePage.module.css";


import {HomePreviewStatus} from "@/components/widgets/HomeBlocks/HomeCommon/HomePreviewStatus/HomePreviewStatus";

export default async function HomePage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("Home")]);
  const {content, images, labels, source, preview} = await resolveHomeContent(locale);

  return (
    <main id="main-content" className={styles.page} data-locale={locale}>
      {source === "preview" && <HomePreviewStatus locale={locale} error={preview?.error} fallbackPaths={preview?.fallbackPaths} />}
      <HomeHeroBlock images={images} content={content.hero} shopLabel={labels?.shopBouquets ?? t("shopBouquets")} chooseLabel={labels?.letOlaChoose ?? t("letOlaChoose")} />
      <HomeServicesBlock images={images} content={content.services} label={labels?.servicesLabel ?? t("servicesLabel")} />
      <HomeMoodBlock
        images={images}
        content={content.mood}
        moods={content.moods}
        labels={{
          shopBouquets: labels?.shopBouquets ?? t("shopBouquets"),
          viewAllBouquets: labels?.viewAllBouquets ?? t("viewAllBouquets"),
          viewBouquet: labels?.viewBouquet ?? t("viewBouquet"),
          moodRailLabel: labels?.moodRailLabel ?? t("moodRailLabel"),
          moodNames: {
            romantic: t("viewMoodBouquet", {mood: content.moods.romantic.title}),
            bright: t("viewMoodBouquet", {mood: content.moods.bright.title}),
            natural: t("viewMoodBouquet", {mood: content.moods.natural.title})
          }
        }}
      />
      <HomeCustomExtrasBlock images={images} content={content.custom} extrasContent={content.extras} createLabel={labels?.letOlaCreate ?? t("letOlaCreate")} />
      <HomeMeetBlock images={images} content={content.meet} aboutLabel={labels?.aboutOla ?? t("aboutOla")} />
      <HomeEventsBlock images={images} content={content.events} exploreLabel={labels?.exploreEvents ?? t("exploreEvents")} />

    </main>
  );
}
