import {getLocale, getTranslations} from "next-intl/server";
import {getAboutContent} from "@/content/about";
import {AboutHeroBlock} from "@/components/widgets/AboutBlocks/AboutHeroBlock";
import {AboutStoryBlock} from "@/components/widgets/AboutBlocks/AboutStoryBlock";
import {AboutPrinciplesBlock} from "@/components/widgets/AboutBlocks/AboutPrinciplesBlock";
import {AboutStyleBlock} from "@/components/widgets/AboutBlocks/AboutStyleBlock";
import {AboutWhyBlock} from "@/components/widgets/AboutBlocks/AboutWhyBlock";
import {AboutCtaBlock} from "@/components/widgets/AboutBlocks/AboutCtaBlock";
import styles from "./AboutPage.module.css";

export default async function AboutPage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("About")]);
  const content = getAboutContent(locale);

  return (
    <main id="main-content" className={styles.page} data-locale={locale}>
      <AboutHeroBlock content={content.hero} storyLabel={t("ourStory")} />
      <AboutStoryBlock content={content.story} />
      <AboutPrinciplesBlock items={content.principles} label={t("principlesLabel")} />
      <AboutStyleBlock content={content.style} exploreLabel={t("exploreBouquets")} />
      <AboutWhyBlock content={content.why} />
      <AboutCtaBlock content={content.cta} messageLabel={t("messageUs")} />
    </main>
  );
}
