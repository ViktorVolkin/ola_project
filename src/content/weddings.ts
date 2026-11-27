import en from "@/i18n/messages/weddings/en.json";
import ru from "@/i18n/messages/weddings/ru.json";
import sr from "@/i18n/messages/weddings/sr.json";
import type {Locale} from "next-intl";

export const weddingsImages = {
  hero: "/assets/images/weddings-events/05_weddings_hero.jpg",
  weddings: "/assets/images/weddings-events/01_weddings_bride.jpg",
  private: "/assets/images/weddings-events/02_weddings_private.jpg",
  corporate: "/assets/images/weddings-events/03_weddings_corporate.jpg",
  rentals: "/assets/images/weddings-events/04_weddings_rentals.jpg",
  approach: "/assets/images/weddings-events/12_weddings_floral_centerpiece.jpg",
  ceremony: "/assets/images/weddings-events/11_weddings_ceremony.jpg",
  dinner: "/assets/images/weddings-events/07_weddings_private_dinner.jpg",
  engagement: "/assets/images/weddings-events/08_weddings_engagement.jpg",
  gathering: "/assets/images/weddings-events/09_weddings_corporate_event.jpg"
} as const;

export const weddingsCopyStatus = {
  en: "figma-source", ru: "translation-draft", sr: "translation-draft"
} satisfies Record<Locale, string>;

export type WeddingsContent = {
  hero: {title: string; lead: string; body: string; handwritten: string; imageAlt: string};
  categories: readonly {id: "weddings" | "private" | "corporate" | "rentals"; title: string; description: string; imageAlt: string}[];
  approach: {eyebrow: string; title: string; body: string; imageAlt: string};
  process: {eyebrow: string; title: string; steps: readonly {title: string; description: string}[]};
  inspiration: {eyebrow: string; title: string; items: readonly {id: "ceremony" | "dinner" | "engagement" | "gathering"; caption: string; imageAlt: string}[]};
  cta: {eyebrow: string; title: string; body: string; handwritten: string; imageAlt: string};
};

const categoryIds = ["weddings", "private", "corporate", "rentals"] as const;
const inspirationIds = ["ceremony", "dinner", "engagement", "gathering"] as const;
function assemble(c: typeof en.content): WeddingsContent {
  return {...c, categories: c.categories.map((item, i) => ({id: categoryIds[i], ...item})), inspiration: {...c.inspiration, items: c.inspiration.items.map((item, i) => ({id: inspirationIds[i], ...item}))}};
}
export const weddingsEnglish = assemble(en.content);
export const weddingsRussian = assemble(ru.content);
export const weddingsSerbian = assemble(sr.content);
const content = {en: weddingsEnglish, ru: weddingsRussian, sr: weddingsSerbian};
export function getWeddingsContent(locale: Locale): WeddingsContent { return content[locale]; }
