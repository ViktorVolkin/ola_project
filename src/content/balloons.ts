import en from "@/i18n/messages/balloons/en.json";
import ru from "@/i18n/messages/balloons/ru.json";
import sr from "@/i18n/messages/balloons/sr.json";
import type { Locale } from "next-intl";

export const balloonsImages = {
  hero: "/assets/images/home/01_home_hero_florist_balloons_montenegro.jpg",
  sets: "/assets/images/balloons/02_balloons_sets.jpg",
  balloons: "/assets/images/home/02_balloons_gifts.jpg",
  gifts: "/assets/images/balloons/09_balloons_gifts.jpg",
  personalised: "/assets/images/balloons/03_balloons_personalised.jpg",
  blush: "/assets/images/balloons/05_balloons_bouquet.jpg",
  birthday: "/assets/images/balloons/06_balloons_kids.jpg",
  colourful: "/assets/images/balloons/11_balloons_colors.jpg",
  neutral: "/assets/images/balloons/10_balloons_mono.jpg",
  scene: "/assets/images/balloons/04_balloons_deluxe.jpg",
  chocolates: "/assets/images/home/07_chocolates.jpg",
  teddy: "/assets/images/balloons/04_balloons_deluxe.jpg",
  card: "/assets/images/bouquet-detail/10_extra_greeting_card.jpg",
  personalisation: "/assets/images/balloons/03_balloons_personalised.jpg",
  cta: "/assets/images/balloons/07_balloons_event.jpg",
} as const;

export const balloonsCopyStatus = {
  en: "figma-source",
  ru: "translation-draft",
  sr: "translation-draft",
} satisfies Record<Locale, string>;

type CategoryId = "sets" | "balloons" | "gifts" | "personalised";
type FavouriteId = "blush" | "birthday" | "colourful" | "neutral";
type ExtraId = "chocolates" | "teddy" | "card" | "personalisation";

export type BalloonsContent = {
  pageTitle: string;
  hero: {
    title: string;
    titleTablet: string;
    titleDesktop: string;
    body: string;
    imageAlt: string;
  };
  categories: readonly {
    id: CategoryId;
    title: string;
    description: string;
    imageAlt: string;
  }[];
  favourites: {
    eyebrow: string;
    title: string;
    items: readonly { id: FavouriteId; title: string; imageAlt: string }[];
  };
  personalisation: {
    eyebrow: string;
    title: string;
    body: string;
    imageAlt: string;
    extras: readonly { id: ExtraId; title: string; imageAlt: string }[];
  };
  cta: { title: string; body: string; imageAlt: string };
};

const categoryIds = ["sets", "balloons", "gifts", "personalised"] as const;
const favouriteIds = ["blush", "birthday", "colourful", "neutral"] as const;
const extraIds = ["chocolates", "teddy", "card", "personalisation"] as const;
function assemble(c: typeof en.content): BalloonsContent {
  return {...c, categories: c.categories.map((item, i) => ({id: categoryIds[i], ...item})), favourites: {...c.favourites, items: c.favourites.items.map((item, i) => ({id: favouriteIds[i], ...item}))}, personalisation: {...c.personalisation, extras: c.personalisation.extras.map((item, i) => ({id: extraIds[i], ...item}))}};
}
export const balloonsEnglish = assemble(en.content);
export const balloonsRussian = assemble(ru.content);
export const balloonsSerbian = assemble(sr.content);
const content = {en: balloonsEnglish, ru: balloonsRussian, sr: balloonsSerbian};
export function getBalloonsContent(locale: Locale): BalloonsContent { return content[locale]; }
