import { getLocale, getMessages } from "next-intl/server";
import { bouquetCards, bouquetImages, bouquetSelectors } from "@/content/bouquets";
import { BouquetsHero } from "@/components/widgets/BouquetsHero/BouquetsHero";
import { BouquetsInspiration } from "@/components/widgets/BouquetsInspiration/BouquetsInspiration";
import { BouquetsEditorial } from "@/components/widgets/BouquetsEditorial/BouquetsEditorial";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import { BouquetFragmentFocus } from "./BouquetFragmentFocus";

export default async function BouquetsPage() {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  const c = messages.Bouquets;
  const selectorLabels = [c.all, c.soft, c.bright, c.natural, c.statement];
  const cardTitles = [
    c.cardSoft,
    c.cardNatural,
    c.cardPeachy,
    c.cardWild,
    c.cardSunset,
    c.cardLavender,
    c.cardGarden,
    c.cardBeauty,
  ];
  return (
    <main id="main-content" data-locale={locale}>
      <BouquetFragmentFocus
        targetIds={["bouquet-inspiration", ...bouquetCards.map((card) => card.id)]}
      />
      <BouquetsHero
        content={{
          breadcrumb: c.breadcrumb,
          title: c.title,
          subtitle: c.subtitle,
          body: c.body,
          script: c.script,
          actionLabel: c.explore,
        }}
        inspirationHref="#bouquet-inspiration"
        image={bouquetImages.hero}
      />
      <BouquetsInspiration
        heading={c.heading}
        selectors={bouquetSelectors.map((item, index) => ({
          ...item,
          label: selectorLabels[index],
        }))}
        cards={bouquetCards.map((item, index) => ({
          ...item,
          title: cardTitles[index],
          actionLabel: c.enquire,
        }))}
        cardActionPendingReason={c.pending}
      />
      <BouquetsEditorial
        custom={{
          eyebrow: c.customEyebrow,
          title: c.customTitle,
          body: c.customBody,
          action: <EnquiryLink>{c.customAction}</EnquiryLink>,
          image: bouquetImages.custom,
        }}
        seasonal={{
          eyebrow: c.seasonalEyebrow,
          title: c.seasonalTitle,
          body: c.seasonalBody,
          labels: [c.spring, c.summer, c.autumn, c.winter],
          image: bouquetImages.seasonal,
        }}
      />
    </main>
  );
}
