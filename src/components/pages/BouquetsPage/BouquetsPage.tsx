import { getLocale, getMessages } from "next-intl/server";
import { bouquetCards, bouquetImages, bouquetSelectors } from "@/content/bouquets";
import { BouquetsHero } from "@/components/widgets/BouquetsHero/BouquetsHero";
import { BouquetsInspiration } from "@/components/widgets/BouquetsInspiration/BouquetsInspiration";
import { BouquetsEditorial } from "@/components/widgets/BouquetsEditorial/BouquetsEditorial";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import { BouquetFragmentFocus } from "./BouquetFragmentFocus";
import {resolveBouquetsContent} from "@/content/resolver/bouquets";
import {createPageEditing} from "@/content/sanity/editing";
import {type BouquetImageKey} from "@/content/sanity/bouquets";
import {CmsPreviewStatus} from "@/components/shared/CmsPreviewStatus";

export default async function BouquetsPage() {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  const c = messages.Bouquets;
  const {content, images, source, preview} = await resolveBouquetsContent(locale, c);
  const editing = createPageEditing({documentId: "bouquetsPage", documentType: "bouquetsPage", locale, enabled: source === "preview" && !!process.env.SANITY_API_READ_TOKEN && !!process.env.SANITY_PREVIEW_ORIGIN});
  const selectorKeys = ["all", "soft", "bright", "natural", "statement"] as const;
  const cardKeys = ["cardSoft", "cardNatural", "cardPeachy", "cardWild", "cardSunset", "cardLavender", "cardGarden", "cardBeauty"] as const;
  const seasons = [["spring", "seasonalSpring"], ["summer", "seasonalSummer"], ["autumn", "seasonalAutumn"], ["winter", "seasonalWinter"]] as const;
  const image = (key: BouquetImageKey, fallback: typeof bouquetImages.custom) => images[key] ? {...fallback, ...images[key]} : fallback;
  return (
    <main id="main-content" data-locale={locale}>
      <BouquetFragmentFocus
        targetIds={["bouquet-inspiration", ...bouquetCards.map((card) => card.id)]}
      />
      <BouquetsHero
        content={{
          breadcrumb: content.breadcrumb,
          title: content.title,
          subtitle: content.subtitle,
          body: content.body,
          script: content.script,
          actionLabel: content.explore,
        }}
        inspirationHref="#bouquet-inspiration"
        image={image("hero", bouquetImages.hero)}
        editing={{breadcrumb: editing.text("breadcrumb"), title: editing.text("title"), subtitle: editing.text("subtitle"), description: editing.text("body"), handwritten: editing.text("script"), action: editing.text("explore"), image: editing.image("hero")}}
      />
      {source === "preview" && <CmsPreviewStatus locale={locale} route="/bouquets" preview={preview} testId="data-bouquets-preview" />}
      <BouquetsInspiration
        heading={content.heading} headingEdit={editing.text("heading")} pendingEdit={editing.text("pending")}
        selectors={bouquetSelectors.map((item, index) => ({
          ...item,
          image: image(`selector${index + 1}` as BouquetImageKey, item.image), imageEdit: editing.image(`selector${index + 1}`),
          label: content[selectorKeys[index]], labelEdit: editing.text(selectorKeys[index]),
        }))}
        cards={bouquetCards.map((item, index) => ({
          ...item,
          image: image(`card${index + 1}` as BouquetImageKey, item.image), imageEdit: editing.image(`card${index + 1}`),
          title: content[cardKeys[index]], titleEdit: editing.text(cardKeys[index]),
          actionLabel: content.enquire, actionEdit: editing.text("enquire"),
        }))}
        cardActionPendingReason={content.pending}
      />
      <BouquetsEditorial
        custom={{
          eyebrow: content.customEyebrow, eyebrowEdit: editing.text("customEyebrow"),
          title: content.customTitle, titleEdit: editing.text("customTitle"),
          body: content.customBody, bodyEdit: editing.text("customBody"),
          action: <EnquiryLink>{content.customAction}</EnquiryLink>, actionEdit: editing.text("customAction"),
          image: image("custom", bouquetImages.custom), imageEdit: editing.image("custom"),
        }}
        seasonal={{
          eyebrow: content.seasonalEyebrow, eyebrowEdit: editing.text("seasonalEyebrow"),
          title: content.seasonalTitle, titleEdit: editing.text("seasonalTitle"),
          body: content.seasonalBody, bodyEdit: editing.text("seasonalBody"),
          image: image("seasonal", bouquetImages.seasonal),
          items: seasons.map(([labelKey, imageKey]) => ({label: content[labelKey], labelEdit: editing.text(labelKey), image: images[imageKey] ? image(imageKey, bouquetImages.seasonal) : undefined, imageEdit: editing.image(imageKey)})),
        }}
      />
    </main>
  );
}
