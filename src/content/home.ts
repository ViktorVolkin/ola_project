import type {Locale} from "next-intl";
import en from "@/i18n/messages/home/en.json";
import ru from "@/i18n/messages/home/ru.json";
import sr from "@/i18n/messages/home/sr.json";

/** Exact supplied image sources, matched to Figma in docs/design/home-asset-map.json. */
export const homeImages = {
  hero: "/assets/images/home/01_home_hero_florist_balloons_montenegro.jpg",
  flowers: "/assets/images/about/08_style_flowers.jpg",
  balloons: "/assets/images/home/02_balloons_gifts.jpg",
  weddings: "/assets/images/home/04_wedding_category.jpg",
  bright: "/assets/images/about/12_final_cta.jpg",
  natural: "/assets/images/home/05_natural_airy_bouquet.jpg",
  custom: "/assets/images/home/03_occasions_flowers_gift.jpg",
  card: "/assets/images/bouquet-detail/10_extra_greeting_card.jpg",
  chocolates: "/assets/images/home/07_chocolates.jpg",
  meet: "/assets/images/about/01_hero.jpg",
  events: "/assets/images/home/08_wedding_events_main.jpg",
} as const;

type EditorialCopy = {eyebrow: string; title: string; description: string};
type HomeCopy = {
  hero: EditorialCopy & {handwritten: string; alt: string};
  services: Record<"flowers" | "balloons" | "weddings", {title: string; description: string; alt: string}>;
  mood: EditorialCopy;
  moods: Record<"romantic" | "bright" | "natural", {title: string; alt: string}>;
  custom: EditorialCopy & {alt: string};
  extras: {title: string; description: string; balloons: string; card: string; chocolates: string; balloonAlt: string; cardAlt: string; chocolateAlt: string};
  meet: EditorialCopy & {handwritten: string; alt: string};
  events: EditorialCopy & {alt: string};
};

/** English is transcribed from current Figma. RU/SR are faithful editorial drafts, not approved translations. */
export const homeCopyStatus = {en: "figma-source", ru: "translation-draft", sr: "translation-draft"} as const;

const copy = {en: en.content, ru: ru.content, sr: sr.content} satisfies Record<Locale, HomeCopy>;

export function getHomeContent(locale: Locale): HomeCopy {
  return copy[locale];
}

export const homeServices = [
  {id: "flowers", image: homeImages.flowers, href: "/bouquets"},
  {id: "balloons", image: homeImages.balloons, href: "/balloons"},
  {id: "weddings", image: homeImages.weddings, href: "/weddings-events"},
] as const;

// Catalogue anchors identify inspiration, not product-detail slugs.
export const homeMoods = [
  {id: "romantic", image: homeImages.flowers, href: "/bouquets#bouquet-soft-romance"},
  {id: "bright", image: homeImages.bright, href: "/bouquets#bouquet-sunset"},
  {id: "natural", image: homeImages.natural, href: "/bouquets#bouquet-natural-airy"},
] as const;
