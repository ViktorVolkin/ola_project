import type {Locale} from "next-intl";
import {getHomeContent} from "@/content/home";
import {imagePaths, imagePresentation, type CmsImages, type CmsLabels, type parseHome} from "./home";

type RecordValue = Record<string, unknown>;
const record = (v: unknown): RecordValue | null => v !== null && typeof v === "object" && !Array.isArray(v) ? v as RecordValue : null;
const at = (v: unknown, path: string[]) => path.reduce<unknown>((node, key) => record(node)?.[key], v);
const validText = (v: unknown): v is string => typeof v === "string" && !!v.trim() && v.length <= 10000 && !/[<>]/.test(v);
const extrasPaths: Record<string, string> = {balloons: "balloons.title", card: "card.title", chocolates: "chocolates.title", balloonAlt: "balloons.alt", cardAlt: "card.alt", chocolateAlt: "chocolates.alt"};
export function homeContentPath(path: string): string {
  const [section, field] = path.split(".");
  return section === "extras" && extrasPaths[field] ? `extras.${extrasPaths[field]}` : path;
}
/** Preview-only, same-locale fallback. Published validation is deliberately untouched. */
export function parsePreviewHome(value: unknown, locale: Locale, published: ReturnType<typeof parseHome>) {
  const doc = record(value);
  if (!doc || !["homePage", "drafts.homePage"].includes(String(doc._id)) || doc._type !== "homePage" || !["en", "ru", "sr"].includes(locale)) throw Error("Invalid preview document");
  const content = structuredClone(published?.content ?? getHomeContent(locale));
  const fallbackPaths: string[] = [];
  function walk(node: RecordValue, prefix = "") {
    for (const key of Object.keys(node)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof node[key] === "string") {
        const sourcePath = `${homeContentPath(path)}.${locale}`;
        const text = at(doc, sourcePath.split("."));
        if (validText(text)) node[key] = text; else fallbackPaths.push(sourcePath);
      } else walk(node[key] as RecordValue, path);
    }
  }
  walk(content);
  const images: Partial<CmsImages> = {...published?.images};
  for (const [key, path] of Object.entries(imagePaths)) {
    const image = imagePresentation(at(doc, [...path]));
    if (image) images[key as keyof CmsImages] = image; else fallbackPaths.push(path.join("."));
  }
  const labels: Partial<CmsLabels> = {...published?.labels};
  const labelKeys = ["shopBouquets", "letOlaChoose", "servicesLabel", "viewAllBouquets", "viewBouquet", "moodRailLabel", "letOlaCreate", "aboutOla", "exploreEvents"] as const;
  for (const key of labelKeys) {
    const text = at(doc, ["labels", key, locale]);
    if (validText(text)) labels[key] = text; else fallbackPaths.push(`labels.${key}.${locale}`);
  }
  return {content, images, labels, fallbackPaths};
}
