import {getLocale, getTranslations} from "next-intl/server";
import {getHomeContent} from "@/content/home";
import {HomeHeroBlock} from "@/components/widgets/HomeBlocks/HomeHeroBlock";
import {HomeServicesBlock} from "@/components/widgets/HomeBlocks/HomeServicesBlock";
import {HomeMoodBlock} from "@/components/widgets/HomeBlocks/HomeMoodBlock";
import {HomeCustomExtrasBlock} from "@/components/widgets/HomeBlocks/HomeCustomExtrasBlock";
import {HomeMeetBlock} from "@/components/widgets/HomeBlocks/HomeMeetBlock";
import {HomeEventsBlock} from "@/components/widgets/HomeBlocks/HomeEventsBlock";
import styles from "./HomePage.module.css";

export default async function HomePage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("Home")]);
  const content = getHomeContent(locale);

  return (
    <main id="main-content" className={styles.page} data-locale={locale}>
      <HomeHeroBlock content={content.hero} shopLabel={t("shopBouquets")} chooseLabel={t("letOlaChoose")} />
      <HomeServicesBlock content={content.services} label={t("servicesLabel")} />
      <HomeMoodBlock
        content={content.mood}
        moods={content.moods}
        labels={{
          shopBouquets: t("shopBouquets"),
          viewAllBouquets: t("viewAllBouquets"),
          viewBouquet: t("viewBouquet"),
          moodRailLabel: t("moodRailLabel"),
          moodNames: {
            romantic: t("viewMoodBouquet", {mood: content.moods.romantic.title}),
            bright: t("viewMoodBouquet", {mood: content.moods.bright.title}),
            natural: t("viewMoodBouquet", {mood: content.moods.natural.title})
          }
        }}
      />
      <HomeCustomExtrasBlock content={content.custom} extrasContent={content.extras} createLabel={t("letOlaCreate")} />
      <HomeMeetBlock content={content.meet} aboutLabel={t("aboutOla")} />
      <HomeEventsBlock content={content.events} exploreLabel={t("exploreEvents")} />
    </main>
  );
}
