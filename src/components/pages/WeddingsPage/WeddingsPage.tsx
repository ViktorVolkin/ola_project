import {getLocale, getTranslations} from "next-intl/server";
import {getWeddingsContent} from "@/content/weddings";
import {resolveWeddingsContent} from "@/content/resolver/weddings";
import {weddingsEditing} from "@/components/widgets/WeddingsBlocks/WeddingsCommon/weddingsEditing";
import {WeddingsHeroBlock} from "@/components/widgets/WeddingsBlocks/WeddingsHeroBlock";
import {WeddingsCategoriesBlock} from "@/components/widgets/WeddingsBlocks/WeddingsCategoriesBlock";
import {WeddingsApproachBlock} from "@/components/widgets/WeddingsBlocks/WeddingsApproachBlock";
import {WeddingsProcessBlock} from "@/components/widgets/WeddingsBlocks/WeddingsProcessBlock";
import {WeddingsInspirationBlock} from "@/components/widgets/WeddingsBlocks/WeddingsInspirationBlock";
import {WeddingsCtaBlock} from "@/components/widgets/WeddingsBlocks/WeddingsCtaBlock";
import styles from "./WeddingsPage.module.css";

export default async function WeddingsPage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("Weddings")]);
  const {content, images, labels, source, preview} = await resolveWeddingsContent(locale);
  const local = getWeddingsContent(locale);
  const subject = local.hero.title.replace(/\n/g, " ");
  const editing = weddingsEditing(locale, source === "preview" && !!process.env.SANITY_API_READ_TOKEN && !!process.env.SANITY_PREVIEW_ORIGIN);
  return (
    <main id="main-content" className={styles.page} data-locale={locale}>
      <WeddingsHeroBlock content={content.hero} previewStatus={source === "preview" ? {locale, preview, content} : undefined} image={images.hero} editing={editing} eventSubject={subject} homeLabel={labels.home ?? t("home")} planLabel={labels.planEvent ?? t("planEvent")} />
      <WeddingsCategoriesBlock items={content.categories} localItems={local.categories} images={images} editing={editing} label={labels.categoriesLabel ?? t("categoriesLabel")} />
      <WeddingsApproachBlock content={content.approach} image={images.approach} editing={editing} processLabel={labels.ourProcess ?? t("ourProcess")} />
      <WeddingsProcessBlock content={content.process} editing={editing} />
      <WeddingsInspirationBlock
        content={content.inspiration}
        images={images}
        editing={editing}
        discussLabel={labels.discussEvent ?? t("discussEvent")}
        eventSubject={subject}
      />
      <WeddingsCtaBlock
        content={content.cta}
        image={images.weddings}
        editing={editing}
        contactLabel={labels.contactWhatsapp ?? t("contactWhatsapp")}
        eventSubject={subject}
      />
    </main>
  );
}
