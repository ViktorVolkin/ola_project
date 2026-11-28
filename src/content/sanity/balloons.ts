import type {Locale} from "next-intl";
import {getBalloonsContent, type BalloonsContent} from "@/content/balloons";
import {imagePresentation, type CmsImage} from "./home";

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const at = (value: unknown, path: string): unknown => path.split(".").reduce<unknown>((node, key) => record(node) ? node[key] : undefined, value);
const validText = (value: unknown): value is string => typeof value === "string" && !!value.trim() && value.length <= 10000 && !/[<>]/.test(value);

export const balloonsImagePaths = {
  hero: "hero.photo", sets: "categories.sets.photo", balloons: "categories.balloons.photo", gifts: "categories.gifts.photo", personalised: "categories.personalised.photo",
  blush: "favourites.blush.photo", birthday: "favourites.birthday.photo", colourful: "favourites.colourful.photo", neutral: "favourites.neutral.photo",
  scene: "personalisation.photo", chocolates: "personalisation.chocolates.photo", teddy: "personalisation.teddy.photo", card: "personalisation.card.photo", personalisation: "personalisation.personalisation.photo", cta: "cta.photo"
} as const;
export const balloonsLabelKeys = ["home", "exploreSets", "categoriesLabel", "enquire", "askSets", "createGift"] as const;
export type BalloonsImages = Partial<Record<keyof typeof balloonsImagePaths, CmsImage>>;
export type CmsBalloons = {content: BalloonsContent; images: BalloonsImages; labels: Partial<Record<typeof balloonsLabelKeys[number], string>>};

function parse(value: unknown, locale: Locale, published: CmsBalloons | null, draft: boolean) {
  if (!record(value) || !["en", "ru", "sr"].includes(locale) || value._type !== "balloonsPage" || (draft ? value._id !== "balloonsPage" && value._id !== "drafts.balloonsPage" : value._id !== "balloonsPage")) return null;
  const fallback = published?.content ?? getBalloonsContent(locale);
  const fallbackPaths: string[] = [];
  function text(path: string, existing: string): string {
    const source = `${path}.${locale}`, candidate = at(value, source);
    if (validText(candidate)) return candidate;
    fallbackPaths.push(source);
    return existing;
  }
  const content: BalloonsContent = {
    pageTitle: text("pageTitle", fallback.pageTitle),
    hero: {title: text("hero.title", fallback.hero.title), titleTablet: text("hero.titleTablet", fallback.hero.titleTablet), titleDesktop: text("hero.titleDesktop", fallback.hero.titleDesktop), body: text("hero.body", fallback.hero.body), imageAlt: text("hero.imageAlt", fallback.hero.imageAlt)},
    categories: fallback.categories.map(item => ({...item, title: text(`categories.${item.id}.title`, item.title), description: text(`categories.${item.id}.description`, item.description), imageAlt: text(`categories.${item.id}.imageAlt`, item.imageAlt)})),
    favourites: {eyebrow: text("favourites.eyebrow", fallback.favourites.eyebrow), title: text("favourites.title", fallback.favourites.title), items: fallback.favourites.items.map(item => ({...item, title: text(`favourites.${item.id}.title`, item.title), imageAlt: text(`favourites.${item.id}.imageAlt`, item.imageAlt)}))},
    personalisation: {eyebrow: text("personalisation.eyebrow", fallback.personalisation.eyebrow), title: text("personalisation.title", fallback.personalisation.title), body: text("personalisation.body", fallback.personalisation.body), imageAlt: text("personalisation.imageAlt", fallback.personalisation.imageAlt), extras: fallback.personalisation.extras.map(item => ({...item, title: text(`personalisation.${item.id}.title`, item.title), imageAlt: text(`personalisation.${item.id}.imageAlt`, item.imageAlt)}))},
    cta: {title: text("cta.title", fallback.cta.title), body: text("cta.body", fallback.cta.body), imageAlt: text("cta.imageAlt", fallback.cta.imageAlt)}
  };
  const images: BalloonsImages = {...published?.images};
  for (const [key, path] of Object.entries(balloonsImagePaths)) {
    const image = imagePresentation(at(value, path));
    if (image) Object.assign(images, {[key]: image}); else fallbackPaths.push(path);
  }
  const labels = {...published?.labels};
  for (const key of balloonsLabelKeys) {
    const path = `labels.${key}.${locale}`, candidate = at(value, path);
    if (validText(candidate)) labels[key] = candidate; else fallbackPaths.push(path);
  }
  return {content, images, labels, fallbackPaths};
}
export function parseBalloons(value: unknown, locale: Locale): CmsBalloons | null {
  const result = parse(value, locale, null, false);
  return result ? {content: result.content, images: result.images, labels: result.labels} : null;
}
export function parsePreviewBalloons(value: unknown, locale: Locale, published: CmsBalloons | null) {
  const result = parse(value, locale, published, true);
  if (!result) throw Error("Invalid Balloons preview document");
  return result;
}
export async function fetchBalloons(locale: Locale): Promise<CmsBalloons | null> {
  const query = encodeURIComponent('*[_id == "balloonsPage" && _type == "balloonsPage"][0]');
  try {
    const response = await fetch(`https://zhn2ddaj.api.sanity.io/v2025-02-19/data/query/production?perspective=published&query=${query}`, {next: {revalidate: 60}, signal: AbortSignal.timeout(3000)});
    if (!response.ok) throw Error("Balloons CMS unavailable");
    const data: unknown = await response.json();
    return parseBalloons(record(data) ? data.result : undefined, locale);
  } catch {
    console.warn("Balloons CMS request failed; using local content", {locale});
    return null;
  }
}
