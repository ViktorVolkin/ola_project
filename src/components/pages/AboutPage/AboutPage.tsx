import { getLocale, getTranslations } from "next-intl/server";
import { resolveAboutContent } from "@/content/resolver/about";
import { aboutEditing } from "@/components/widgets/AboutBlocks/aboutEditing";
import { AboutPreviewStatus } from "@/components/widgets/AboutBlocks/AboutPreviewStatus";
import { AboutHeroBlock } from "@/components/widgets/AboutBlocks/AboutHeroBlock/AboutHeroBlock";
import { AboutStoryBlock } from "@/components/widgets/AboutBlocks/AboutStoryBlock/AboutStoryBlock";
import { AboutPrinciplesBlock } from "@/components/widgets/AboutBlocks/AboutPrinciplesBlock/AboutPrinciplesBlock";
import { AboutStyleBlock } from "@/components/widgets/AboutBlocks/AboutStyleBlock/AboutStyleBlock";
import { AboutWhyBlock } from "@/components/widgets/AboutBlocks/AboutWhyBlock/AboutWhyBlock";
import { AboutCtaBlock } from "@/components/widgets/AboutBlocks/AboutCtaBlock/AboutCtaBlock";
import clsx from "clsx";
import styles from "./AboutPage.module.css";

export default async function AboutPage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("About")]);
  const { content, images, labels, source, preview } = await resolveAboutContent(locale);
  const editing = aboutEditing(
    locale,
    source === "preview" &&
      !!process.env.SANITY_API_READ_TOKEN &&
      !!process.env.SANITY_PREVIEW_ORIGIN,
  );

  return (
    <main id="main-content" className={clsx(styles.page)} data-locale={locale}>
      {source === "preview" && <AboutPreviewStatus locale={locale} preview={preview} />}
      <AboutHeroBlock
        content={content.hero}
        image={images.hero}
        editing={editing}
        storyLabel={labels.ourStory ?? t("ourStory")}
      />
      <AboutStoryBlock content={content.story} image={images.story} editing={editing} />
      <AboutPrinciplesBlock
        items={content.principles}
        editing={editing}
        label={labels.principlesLabel ?? t("principlesLabel")}
      />
      <AboutStyleBlock
        content={content.style}
        images={images}
        editing={editing}
        exploreLabel={labels.exploreBouquets ?? t("exploreBouquets")}
      />
      <AboutWhyBlock content={content.why} image={images.why} editing={editing} />
      <AboutCtaBlock
        content={content.cta}
        image={images.cta}
        editing={editing}
        messageLabel={labels.messageUs ?? t("messageUs")}
      />
    </main>
  );
}
