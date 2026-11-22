import type {Locale} from "next-intl";
import {getMessages} from "next-intl/server";
import type en from "@/i18n/messages/contact/en.json";
import {imagePresentation, type CmsImage} from "./home";

type Obj = Record<string, unknown>;
const object = (value: unknown): Obj | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Obj)
    : null;
const at = (value: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((node, key) => object(node)?.[key], value);
const text = (value: unknown): value is string =>
  typeof value === "string" && !!value.trim() && value.length <= 10000 && !/[<>]/.test(value);

/** Contact copy is flat: every message key is a top-level localized Sanity field. */
export function contactContentPath(path: string): string {
  return path;
}

/** Photo slots are not localized; editor crop/hotspot is shared canonical state. */
export const contactImagePaths = {
  hero: "hero.photo",
  geography: "geography.photo",
  editorial: "editorial.photo",
  question: "question.photo",
  custom: "custom.photo",
  events: "events.photo",
} as const;
/** No separate CMS label layer for Contact: all visible copy lives in the content object. */
export const contactLabelKeys = [] as const;

export type ContactContent = typeof en;
export type ContactImages = Partial<Record<keyof typeof contactImagePaths, CmsImage>>;
export type CmsContact = {
  content: ContactContent;
  images: ContactImages;
  labels: Record<string, never>;
};

function parse(
  value: unknown,
  locale: Locale,
  local: ContactContent,
  draft: boolean,
) {
  const doc = object(value);
  if (
    !doc ||
    !["en", "ru", "sr"].includes(locale) ||
    doc._type !== "contactPage" ||
    !(draft
      ? ["contactPage", "drafts.contactPage"].includes(String(doc._id))
      : doc._id === "contactPage")
  )
    return null;
  const content = structuredClone(local);
  const fallbackPaths: string[] = [];
  function walk(node: Obj, prefix = "") {
    for (const key of Object.keys(node)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof node[key] === "string") {
        const source = `${path}.${locale}`;
        const candidate = at(doc, source);
        if (text(candidate)) node[key] = candidate;
        else fallbackPaths.push(source);
      } else if (object(node[key])) walk(node[key] as Obj, path);
    }
  }
  walk(content as unknown as Obj);
  const images: ContactImages = {};
  for (const [key, path] of Object.entries(contactImagePaths)) {
    const image = imagePresentation(at(doc, path));
    if (image) images[key as keyof ContactImages] = image;
    else fallbackPaths.push(path);
  }
  return {content, images, labels: {}, fallbackPaths};
}

export function parseContact(
  value: unknown,
  locale: Locale,
  local: ContactContent,
): CmsContact | null {
  const result = parse(value, locale, local, false);
  return result ? {content: result.content, images: result.images, labels: {}} : null;
}

export function parsePreviewContact(
  value: unknown,
  locale: Locale,
  local: ContactContent,
  published: CmsContact | null,
) {
  const result = parse(value, locale, local, true);
  if (!result) throw Error("Invalid Contact preview document");
  return {
    content: result.content,
    images: {...(published?.images ?? {}), ...result.images},
    labels: {},
    fallbackPaths: result.fallbackPaths,
  };
}

export async function fetchContact(locale: Locale): Promise<CmsContact | null> {
  const query = encodeURIComponent('*[_id == "contactPage" && _type == "contactPage"][0]');
  try {
    const response = await fetch(
      `https://zhn2ddaj.api.sanity.io/v2025-02-19/data/query/production?perspective=published&query=${query}`,
      {next: {revalidate: 60}, signal: AbortSignal.timeout(3000)},
    );
    if (!response.ok) throw Error("Contact CMS unavailable");
    const messages = await getMessages();
    return parseContact(
      object(await response.json())?.result,
      locale,
      messages.Contact as unknown as ContactContent,
    );
  } catch {
    console.warn("Contact CMS request failed; using local content", {locale});
    return null;
  }
}
