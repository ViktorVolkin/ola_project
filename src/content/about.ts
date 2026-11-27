import en from "@/i18n/messages/about/en.json";
import ru from "@/i18n/messages/about/ru.json";
import sr from "@/i18n/messages/about/sr.json";
import type {Locale} from "next-intl";

export const aboutImages = {
  hero: "/assets/images/about/01_hero.jpg",
  story: "/assets/images/about/02_our_story.jpg",
  style: ["/assets/images/about/08_style_flowers.jpg", "/assets/images/about/09_style_packaging.jpg", "/assets/images/about/10_style_lightness.jpg"],
  why: "/assets/images/about/11_why_choose_ola.jpg",
  cta: "/assets/images/about/12_final_cta.jpg",
  botanical: "/assets/decorative/story_botanical_transparent.png"
} as const;

export const aboutCopyStatus = {en: "figma-source", ru: "translation-draft", sr: "translation-draft"} as const;

type AboutContent = {
  hero: {eyebrow: string; title: string; body: string; handwritten: string; alt: string};
  story: {eyebrow: string; title: string; paragraphs: readonly [string, string]; signature: string; imageAlt: string; botanicalAlt: string};
  principles: readonly {label: string; icon: string}[];
  style: {eyebrow: string; title: string; body: string; imageAlts: readonly [string, string, string]};
  why: {eyebrow: string; title: string; body: string; imageOverlay: string; imageAlt: string; reasons: readonly {title: string; description: string; icon: string}[]};
  cta: {eyebrow: string; title: string; body: string; imageOverlay: string; imageAlt: string};
};

const copy = {en: en.content, ru: ru.content, sr: sr.content};
const principleIcons = ["seasonal_flower.svg", "selected_flowers.svg", "pencil.svg", "heart.svg"] as const;
const reasonIcons = ["seasonal_flower.svg", "pencil.svg", "leaf.svg", "heart.svg"] as const;
export function getAboutContent(locale: Locale): AboutContent {
  const c = copy[locale];
  return {...c, story: {...c.story, botanicalAlt: "", paragraphs: c.story.paragraphs as [string, string]}, style: {...c.style, imageAlts: c.style.imageAlts as [string, string, string]}, principles: c.principles.map((item, i) => ({...item, icon: principleIcons[i]})), why: {...c.why, reasons: c.why.reasons.map((item, i) => ({...item, icon: reasonIcons[i]}))}};
}
