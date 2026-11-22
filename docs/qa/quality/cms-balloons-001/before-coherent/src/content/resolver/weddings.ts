import "server-only";
import type {Locale} from "next-intl";
import {draftMode} from "next/headers";
import {getWeddingsContent} from "@/content/weddings";
import {fetchWeddings, parsePreviewWeddings, type CmsWeddings} from "@/content/sanity/weddings";
import {previewClient} from "@/content/sanity/preview-client";
import {contentSource} from "./source";

export type WeddingsPreview = {error: "configuration" | "unavailable" | null; fallbackPaths?: string[]};
export type ResolvedWeddings = CmsWeddings & {source: "default" | "sanity" | "preview"; preview: WeddingsPreview | null};
export async function resolveWeddingsContent(locale: Locale): Promise<ResolvedWeddings> {
  const source = (await draftMode()).isEnabled ? "preview" : contentSource(process.env.CONTENT_SOURCE);
  const local: CmsWeddings = {content: getWeddingsContent(locale), images: {}, labels: {}};
  if (source === "default") return {...local, source, preview: null};
  const published = await fetchWeddings(locale);
  if (source === "sanity") return {...(published ?? local), source, preview: null};
  const client = previewClient();
  if (!client) return {...(published ?? local), source, preview: {error: "configuration"}};
  try {
    const value = await client.fetch<unknown>('*[_id == "weddingsPage" && _type == "weddingsPage"][0]', {}, {perspective: "drafts", cache: "no-store", stega: false, signal: AbortSignal.timeout(5000)});
    const data = parsePreviewWeddings(value ?? {_id: "weddingsPage", _type: "weddingsPage"}, locale, published);
    return {content: data.content, images: data.images, labels: data.labels, source, preview: {error: null, fallbackPaths: data.fallbackPaths}};
  } catch {
    return {...(published ?? local), source, preview: {error: "unavailable"}};
  }
}
