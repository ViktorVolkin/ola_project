import type {Locale} from "next-intl";
import {imagePresentation, type CmsImage} from "./home";

// Only these listing fields are read, even if a document contains other data.
export const bouquetTextKeys = ["breadcrumb", "title", "subtitle", "body", "script", "explore", "heading", "all", "soft", "bright", "natural", "statement", "cardSoft", "cardNatural", "cardPeachy", "cardWild", "cardSunset", "cardLavender", "cardGarden", "cardBeauty", "enquire", "pending", "customEyebrow", "customTitle", "customBody", "customAction", "seasonalEyebrow", "seasonalTitle", "seasonalBody", "spring", "summer", "autumn", "winter"] as const;
export const bouquetImageKeys = ["hero", "selector1", "selector2", "selector3", "selector4", "selector5", "card1", "card2", "card3", "card4", "card5", "card6", "card7", "card8", "custom", "seasonal", "seasonalSpring", "seasonalSummer", "seasonalAutumn", "seasonalWinter"] as const;
export type BouquetTextKey = typeof bouquetTextKeys[number];
export type BouquetImageKey = typeof bouquetImageKeys[number];
export type BouquetCopy = Record<BouquetTextKey, string>;
export type CmsBouquets = {content: BouquetCopy; images: Partial<Record<BouquetImageKey, CmsImage>>};
const object = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);
function parse(value: unknown, locale: Locale, local: BouquetCopy, published: CmsBouquets | null, draft: boolean) {
  if (!object(value) || value._type !== "bouquetsPage" || !["en", "ru", "sr"].includes(locale) || (draft ? !["bouquetsPage", "drafts.bouquetsPage"].includes(String(value._id)) : value._id !== "bouquetsPage")) return null;
  const content = {...(published?.content ?? local)};
  const images = {...published?.images};
  const fallbackPaths: string[] = [];
  for (const key of bouquetTextKeys) {
    const field = value[key];
    const text = object(field) ? field[locale] : undefined;
    if (typeof text === "string" && text.trim() && text.length <= 10000 && !/[<>]/.test(text)) content[key] = text;
    else fallbackPaths.push(`${key}.${locale}`);
  }
  for (const key of bouquetImageKeys) {
    const image = imagePresentation(value[key]);
    if (image) images[key] = image;
    else fallbackPaths.push(key);
  }
  return {content, images, fallbackPaths};
}
export function parseBouquets(value: unknown, locale: Locale, local: BouquetCopy): CmsBouquets | null {
  const result = parse(value, locale, local, null, false);
  return result && {content: result.content, images: result.images};
}
export function parsePreviewBouquets(value: unknown, locale: Locale, local: BouquetCopy, published: CmsBouquets | null) {
  const result = parse(value, locale, local, published, true);
  if (!result) throw Error("Invalid Bouquets preview document");
  return result;
}
export async function fetchBouquets(locale: Locale, local: BouquetCopy): Promise<CmsBouquets | null> {
  const query = encodeURIComponent('*[_id == "bouquetsPage" && _type == "bouquetsPage"][0]');
  try {
    const response = await fetch(`https://zhn2ddaj.api.sanity.io/v2025-02-19/data/query/production?perspective=published&query=${query}`, {next: {revalidate: 60}, signal: AbortSignal.timeout(3000)});
    if (!response.ok) throw Error("Bouquets CMS unavailable");
    const data: unknown = await response.json();
    return parseBouquets(object(data) ? data.result : undefined, locale, local);
  } catch {
    console.warn("Bouquets CMS request failed; using local content", {locale});
    return null;
  }
}
