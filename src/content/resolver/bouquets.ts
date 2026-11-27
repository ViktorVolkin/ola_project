import "server-only";
import type {Locale} from "next-intl";
import {draftMode} from "next/headers";
import {fetchBouquets, parsePreviewBouquets, type BouquetCopy, type CmsBouquets} from "@/content/sanity/bouquets";
import {previewClient} from "@/content/sanity/preview-client";
import {contentSource} from "./source";

export async function resolveBouquetsContent(locale: Locale, local: BouquetCopy): Promise<CmsBouquets & {source: "default" | "sanity" | "preview"; preview: {error: "configuration" | "unavailable" | null; fallbackPaths?: string[]} | null}> {
  const source = (await draftMode()).isEnabled ? "preview" : contentSource(process.env.CONTENT_SOURCE);
  const fallback: CmsBouquets = {content: local, images: {}};
  if (source === "default") return {...fallback, source, preview: null};
  const published = await fetchBouquets(locale, local);
  if (source === "sanity") return {...(published ?? fallback), source, preview: null};
  const client = previewClient();
  if (!client) return {...(published ?? fallback), source, preview: {error: "configuration"}};
  try {
    const value = await client.fetch<unknown>('*[_id == "bouquetsPage" && _type == "bouquetsPage"][0]', {}, {perspective: "drafts", cache: "no-store", stega: false, signal: AbortSignal.timeout(5000)});
    const result = parsePreviewBouquets(value ?? {_id: "bouquetsPage", _type: "bouquetsPage"}, locale, local, published);
    return {content: result.content, images: result.images, source, preview: {error: null, fallbackPaths: result.fallbackPaths}};
  } catch {
    return {...(published ?? fallback), source, preview: {error: "unavailable"}};
  }
}
