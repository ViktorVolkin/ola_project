import type {Locale} from "next-intl";
import {getAboutContent} from "@/content/about";
import {imagePresentation, type CmsImage} from "./home";

type Obj = Record<string, unknown>;
const object = (value: unknown): Obj | null => value !== null && typeof value === "object" ? value as Obj : null;
const at = (value: unknown, path: string): unknown => path.split(".").reduce<unknown>((node, key) => object(node)?.[key], value);
const text = (value: unknown): value is string => typeof value === "string" && !!value.trim() && value.length <= 10000 && !/[<>]/.test(value);
/** Fixed object slots preserve the supplied editorial order; icons are not CMS content. */
export function aboutContentPath(path: string): string {
  return path.replace(/^story\.paragraphs\.(\d)$/, (_, i) => `story.paragraph${Number(i) + 1}`)
    .replace(/^principles\.(\d)\.label$/, (_, i) => `principles.item${Number(i) + 1}.label`)
    .replace(/^style\.imageAlts\.(\d)$/, (_, i) => `style.alt${Number(i) + 1}`)
    .replace(/^why\.reasons\.(\d)\./, (_, i) => `why.reason${Number(i) + 1}.`);
}
export const aboutImagePaths = {hero: "hero.photo", story: "story.photo", style0: "style.photo1", style1: "style.photo2", style2: "style.photo3", why: "why.photo", cta: "cta.photo"} as const;
export const aboutLabelKeys = ["ourStory", "exploreBouquets", "messageUs", "principlesLabel"] as const;
export type AboutImages = Partial<Record<keyof typeof aboutImagePaths, CmsImage>>;
export type CmsAbout = {content: ReturnType<typeof getAboutContent>; images: AboutImages; labels: Partial<Record<typeof aboutLabelKeys[number], string>>};
function parse(value: unknown, locale: Locale, published: CmsAbout | null, draft: boolean) {
  const doc = object(value);
  if (!doc || !["en", "ru", "sr"].includes(locale) || doc._type !== "aboutPage" || !(draft ? ["aboutPage", "drafts.aboutPage"].includes(String(doc._id)) : doc._id === "aboutPage")) return null;
  const content = structuredClone(published?.content ?? getAboutContent(locale));
  const fallbackPaths: string[] = [];
  function walk(node: Obj, prefix = "") {
    for (const key of Object.keys(node)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (key === "icon" || key === "botanicalAlt") continue;
      if (typeof node[key] === "string") {
        const source = `${aboutContentPath(path)}.${locale}`;
        const candidate = at(doc, source);
        if (text(candidate)) node[key] = candidate;
        else fallbackPaths.push(source);
      } else if (object(node[key])) walk(node[key] as Obj, path);
    }
  }
  walk(content as unknown as Obj);
  const images: AboutImages = {...published?.images};
  for (const [key, path] of Object.entries(aboutImagePaths)) {
    const image = imagePresentation(at(doc, path));
    if (image) images[key as keyof AboutImages] = image;
    else fallbackPaths.push(path);
  }
  const labels = {...published?.labels};
  for (const key of aboutLabelKeys) {
    const path = `labels.${key}.${locale}`, candidate = at(doc, path);
    if (text(candidate)) labels[key] = candidate; else fallbackPaths.push(path);
  }
  return {content, images, labels, fallbackPaths};
}
export function parseAbout(value: unknown, locale: Locale): CmsAbout | null {
  const result = parse(value, locale, null, false);
  return result ? {content: result.content, images: result.images, labels: result.labels} : null;
}
export function parsePreviewAbout(value: unknown, locale: Locale, published: CmsAbout | null) {
  const result = parse(value, locale, published, true);
  if (!result) throw Error("Invalid About preview document");
  return result;
}
export async function fetchAbout(locale: Locale): Promise<CmsAbout | null> {
  const query = encodeURIComponent('*[_id == "aboutPage" && _type == "aboutPage"][0]');
  try {
    const response = await fetch(`https://zhn2ddaj.api.sanity.io/v2025-02-19/data/query/production?perspective=published&query=${query}`, {next: {revalidate: 60}, signal: AbortSignal.timeout(3000)});
    if (!response.ok) throw Error("About CMS unavailable");
    return parseAbout(object(await response.json())?.result, locale);
  } catch {
    console.warn("About CMS request failed; using local content", {locale});
    return null;
  }
}
