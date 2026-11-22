import type {Locale} from "next-intl";
import {getWeddingsContent, type WeddingsContent} from "@/content/weddings";
import {imagePresentation, type CmsImage} from "./home";

const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const at = (value: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((node, key) => record(node) ? node[key] : undefined, value);
const validText = (value: unknown): value is string =>
  typeof value === "string" && !!value.trim() && value.length <= 10000 && !/[<>]/.test(value);

// Fixed slots match existing visual order; the shared bride photo is intentionally reused by CTA.
export const weddingsImagePaths = {
  hero: "hero.photo", weddings: "categories.weddings.photo", private: "categories.private.photo",
  corporate: "categories.corporate.photo", rentals: "categories.rentals.photo", approach: "approach.photo",
  ceremony: "inspiration.ceremony.photo", dinner: "inspiration.dinner.photo",
  engagement: "inspiration.engagement.photo", gathering: "inspiration.gathering.photo"
} as const;
export const weddingsLabelKeys = ["home", "planEvent", "ourProcess", "discussEvent", "contactWhatsapp", "categoriesLabel"] as const;
export type WeddingsImages = Partial<Record<keyof typeof weddingsImagePaths, CmsImage>>;
export type CmsWeddings = {content: WeddingsContent; images: WeddingsImages; labels: Partial<Record<typeof weddingsLabelKeys[number], string>>};

function parse(value: unknown, locale: Locale, published: CmsWeddings | null, draft: boolean) {
  if (!record(value) || !["en", "ru", "sr"].includes(locale) || value._type !== "weddingsPage" ||
      (draft ? value._id !== "weddingsPage" && value._id !== "drafts.weddingsPage" : value._id !== "weddingsPage")) return null;
  const fallback = published?.content ?? getWeddingsContent(locale);
  const fallbackPaths: string[] = [];
  function text(path: string, existing: string): string {
    const source = `${path}.${locale}`, candidate = at(value, source);
    if (validText(candidate)) return candidate;
    fallbackPaths.push(source);
    return existing;
  }
  const content: WeddingsContent = {
    hero: {title: text("hero.title", fallback.hero.title), lead: text("hero.lead", fallback.hero.lead), body: text("hero.body", fallback.hero.body), handwritten: text("hero.handwritten", fallback.hero.handwritten), imageAlt: text("hero.imageAlt", fallback.hero.imageAlt)},
    categories: fallback.categories.map(item => ({...item, title: text(`categories.${item.id}.title`, item.title), description: text(`categories.${item.id}.description`, item.description), imageAlt: text(`categories.${item.id}.imageAlt`, item.imageAlt)})),
    approach: {eyebrow: text("approach.eyebrow", fallback.approach.eyebrow), title: text("approach.title", fallback.approach.title), body: text("approach.body", fallback.approach.body), imageAlt: text("approach.imageAlt", fallback.approach.imageAlt)},
    process: {eyebrow: text("process.eyebrow", fallback.process.eyebrow), title: text("process.title", fallback.process.title), steps: fallback.process.steps.map((item, index) => ({title: text(`process.step${index + 1}.title`, item.title), description: text(`process.step${index + 1}.description`, item.description)}))},
    inspiration: {eyebrow: text("inspiration.eyebrow", fallback.inspiration.eyebrow), title: text("inspiration.title", fallback.inspiration.title), items: fallback.inspiration.items.map(item => ({...item, caption: text(`inspiration.${item.id}.caption`, item.caption), imageAlt: text(`inspiration.${item.id}.imageAlt`, item.imageAlt)}))},
    cta: {eyebrow: text("cta.eyebrow", fallback.cta.eyebrow), title: text("cta.title", fallback.cta.title), body: text("cta.body", fallback.cta.body), handwritten: text("cta.handwritten", fallback.cta.handwritten), imageAlt: text("cta.imageAlt", fallback.cta.imageAlt)}
  };
  const images: WeddingsImages = {...published?.images};
  for (const [key, path] of Object.entries(weddingsImagePaths)) {
    const image = imagePresentation(at(value, path));
    if (image) Object.assign(images, {[key]: image});
    else fallbackPaths.push(path);
  }
  const labels = {...published?.labels};
  for (const key of weddingsLabelKeys) {
    const path = `labels.${key}.${locale}`, candidate = at(value, path);
    if (validText(candidate)) labels[key] = candidate; else fallbackPaths.push(path);
  }
  return {content, images, labels, fallbackPaths};
}
export function parseWeddings(value: unknown, locale: Locale): CmsWeddings | null {
  const result = parse(value, locale, null, false);
  return result ? {content: result.content, images: result.images, labels: result.labels} : null;
}
export function parsePreviewWeddings(value: unknown, locale: Locale, published: CmsWeddings | null) {
  const result = parse(value, locale, published, true);
  if (!result) throw Error("Invalid Weddings preview document");
  return result;
}
export async function fetchWeddings(locale: Locale): Promise<CmsWeddings | null> {
  const query = encodeURIComponent('*[_id == "weddingsPage" && _type == "weddingsPage"][0]');
  try {
    const response = await fetch(`http://127.0.0.1:45643/data/query/production?perspective=published&query=${query}`, {next: {revalidate: 60}, signal: AbortSignal.timeout(3000)});
    if (!response.ok) throw Error("Weddings CMS unavailable");
    const data: unknown = await response.json();
    return parseWeddings(record(data) ? data.result : undefined, locale);
  } catch {
    console.warn("Weddings CMS request failed; using local content", {locale});
    return null;
  }
}
