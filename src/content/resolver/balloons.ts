import "server-only";
import type {Locale} from "next-intl";
import {draftMode} from "next/headers";
import {getBalloonsContent} from "@/content/balloons";
import {fetchBalloons, parsePreviewBalloons, type CmsBalloons} from "@/content/sanity/balloons";
import {previewClient} from "@/content/sanity/preview-client";
import {contentSource} from "./source";

export type BalloonsPreview = {error: "configuration" | "unavailable" | null; fallbackPaths?: string[]};
export type ResolvedBalloons = CmsBalloons & {source: "default" | "sanity" | "preview"; preview: BalloonsPreview | null};
export async function resolveBalloonsContent(locale: Locale): Promise<ResolvedBalloons> {
  const source = (await draftMode()).isEnabled ? "preview" : contentSource(process.env.CONTENT_SOURCE);
  const local: CmsBalloons = {content: getBalloonsContent(locale), images: {}, labels: {}};
  if (source === "default") return {...local, source, preview: null};
  const published = await fetchBalloons(locale);
  if (source === "sanity") return {...(published ?? local), source, preview: null};
  const client = previewClient();
  if (!client) return {...(published ?? local), source, preview: {error: "configuration"}};
  try {
    const value = await client.fetch<unknown>('*[_id == "balloonsPage" && _type == "balloonsPage"][0]', {}, {perspective: "drafts", cache: "no-store", stega: false, signal: AbortSignal.timeout(5000)});
    const data = parsePreviewBalloons(value ?? {_id: "balloonsPage", _type: "balloonsPage"}, locale, published);
    return {content: data.content, images: data.images, labels: data.labels, source, preview: {error: null, fallbackPaths: data.fallbackPaths}};
  } catch {
    return {...(published ?? local), source, preview: {error: "unavailable"}};
  }
}
