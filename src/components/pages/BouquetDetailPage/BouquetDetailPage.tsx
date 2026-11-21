import Image, { getImageProps } from "next/image";
import { BouquetDetailHero } from "@/components/widgets/BouquetDetailHero/BouquetDetailHero";
import {
  BouquetDetailRelated,
  BouquetDetailCustom,
  type InspirationCard,
  type InformationItem,
} from "@/components/widgets/BouquetDetailSupporting/BouquetDetailSupporting";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import type { GalleryImage } from "@/components/widgets/BouquetDetailGallery/BouquetDetailGallery";
import { labels, content, galleryLabels } from "./mock-data";

type Locale = "en" | "ru" | "sr";
const intro = {
  en: {
    home: "Home",
    bouquets: "Bouquets",
    title: "Soft Romance",
    support: "A soft, romantic bouquet inspiration.",
    body: "Blush and cream tones, delicate textures and an airy silhouette. Use this mood as a starting point for a bouquet made around your occasion.",
    action: "Enquire about this bouquet",
    back: "Back to bouquets",
    reassurance: "We’ll confirm flowers, fullness, extras and your preferred date with you.",
    eyebrow: "BOUQUET DETAILS",
  },
  ru: {
    home: "Главная",
    bouquets: "Букеты",
    title: "Нежная романтика",
    support: "Нежное романтическое вдохновение для букета.",
    body: "Пудровые и кремовые оттенки, нежные фактуры и воздушный силуэт. Используйте это настроение как отправную точку для букета к вашему событию.",
    action: "Узнать об этом букете",
    back: "Вернуться к букетам",
    reassurance: "Мы уточним с вами цветы, пышность, дополнения и желаемую дату.",
    eyebrow: "ДЕТАЛИ БУКЕТА",
  },
  sr: {
    home: "Početna",
    bouquets: "Buketi",
    title: "Nežna romantika",
    support: "Nežna, romantična inspiracija za buket.",
    body: "Rumenkasti i krem tonovi, nežne teksture i prozračna silueta. Neka ovo raspoloženje bude polazna tačka za buket prema vašem povodu.",
    action: "Raspitajte se o ovom buketu",
    back: "Nazad na bukete",
    reassurance: "Potvrdićemo sa vama cveće, punoću, dodatke i željeni datum.",
    eyebrow: "DETALJI BUKETA",
  },
} satisfies Record<
  Locale,
  {
    home: string;
    bouquets: string;
    title: string;
    support: string;
    body: string;
    action: string;
    back: string;
    reassurance: string;
    eyebrow: string;
  }
>;
const prefix = "/assets/images/bouquet-detail/";
// Verified against native Figma node 107:5493/107:5494 (session id-mwjwqdxw-mtg4liy7, plugin 0.6.0):
// exported intrinsic 960x2340 PNG hash 04c255ea..., byte-identical to the checked-in
// assets/decorative/story_botanical_transparent.png (sha256 cebf6a5c..., 1,186,124 bytes).
// Displayed 200x300 desktop / 146.67x220 tablet-mobile, object-fit contain, decorative.
const decorative = (
  <Image
    src="/assets/decorative/story_botanical_transparent.png"
    alt=""
    width={200}
    height={300}
    sizes="(min-width: 1100px) 200px, 147px"
    decoding="async"
  />
);

export default function BouquetDetailPage({ locale }: { locale: Locale }) {
  const c = content[locale],
    w = galleryLabels[locale],
    i = intro[locale];
  const images = [
    "01_bouquet_detail_main.jpg",
    "02_detail_thumb1.jpg",
    "03_detail_thumb2.jpg",
    "04_detail_closeup.jpg",
  ].map((file, n) => {
    const src = prefix + file;
    const alt = `${w[2]} ${n + 1}`;
    const imageProps = { src, alt, width: 800, height: 800 };
    const mainProps = getImageProps({ ...imageProps, sizes: "(min-width: 1440px) 624px, (min-width: 1100px) calc(45.02vw - 24px), (min-width: 768px) 704px, calc(100vw - 40px)" }).props;
    const thumbnailProps = getImageProps({ ...imageProps, alt: "", sizes: "(min-width: 1440px) 144px, (min-width: 1100px) calc(11.25vw - 18px), (min-width: 768px) 164px, calc(25vw - 22px)" }).props;
    return {
      ...imageProps,
      thumbnailLabel: `${w[1]} ${n + 1}`,
      main: { src: mainProps.src, srcSet: mainProps.srcSet, sizes: mainProps.sizes },
      thumbnail: { src: thumbnailProps.src, srcSet: thumbnailProps.srcSet, sizes: thumbnailProps.sizes },
    };
  }) as [GalleryImage, ...GalleryImage[]];
  const fullnessImages = ["05_size_standard.jpg", "06_size_medium.jpg", "07_size_large.jpg"].map(
    (src) => ({ src: prefix + src, alt: "" }),
  );
  const extraImages = [
    "08_extra_balloons.jpg",
    "09_extra_chocolates.jpg",
    "10_extra_greeting_card.jpg",
  ].map((src) => ({ src: prefix + src, alt: "" }));
  const names = ["Peachy Mood", "Natural & Airy", "Blush Inspiration", "Wild Beauty"];
  const cards = [
    "11_similar_peachy.jpg",
    "12_similar_natural.jpg",
    "13_similar_blush.jpg",
    "14_similar_wild.jpg",
  ].map((file, n) => ({
    id: file,
    title: names[n],
    image: { src: prefix + file, alt: names[n] },
    action: (
      <EnquiryLink variant="secondary" subject={names[n]}>
        {c.enquire}
      </EnquiryLink>
    ),
  })) as [InspirationCard, InspirationCard, InspirationCard, InspirationCard];
  const information = c.titles.map((title, n) => ({ title, answer: c.answers[n] })) as [
    InformationItem,
    InformationItem,
    InformationItem,
  ];
  return (
    <main id="main-content">
      <BouquetDetailHero
        {...i}
        action={<EnquiryLink subject={i.title}>{i.action}</EnquiryLink>}
        images={images}
        galleryLabel={w[0]}
        preferences={{ labels: labels[locale], fullnessImages, extraImages }}
        information={information}
        decorative={decorative}
      />
      <BouquetDetailRelated eyebrow={c.eyebrow} heading={c.relatedHeading} cards={cards} />
      <BouquetDetailCustom
        eyebrow={c.customEyebrow}
        heading={locale === "en" ? "Something personal,\nmade with flowers." : c.customHeading}
        description={c.description}
        signature={locale === "en" ? "Flowers made\nwith love" : c.signature}
        image={{ src: "/assets/images/bouquets/11_bouquets_custom.jpg", alt: "" }}
        action={<EnquiryLink subject={c.customAction}>{c.customAction}</EnquiryLink>}
      />
    </main>
  );
}
