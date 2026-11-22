import "server-only";
import type {Locale} from "next-intl";
import {draftMode} from "next/headers";
import {getAboutContent} from "@/content/about";
import {fetchAbout, parsePreviewAbout, type CmsAbout} from "@/content/sanity/about";
import {previewClient} from "@/content/sanity/preview-client";
import {contentSource} from "./source";
export type AboutPreview = {error: "configuration" | "unavailable" | null; fallbackPaths?: string[]};
export type ResolvedAbout = CmsAbout & {source: "default" | "sanity" | "preview"; preview: AboutPreview | null};
export async function resolveAboutContent(locale: Locale): Promise<ResolvedAbout> {
  const source = (await draftMode()).isEnabled ? "preview" : contentSource(process.env.CONTENT_SOURCE);
  const local: CmsAbout = {content: getAboutContent(locale), images: {}, labels: {}};
  if (source === "default") return {...local, source, preview: null};
  const published = await fetchAbout(locale);
  if (source === "sanity") return {...(published ?? local), source, preview: null};
  const client = previewClient();
  if (!client) return {...(published ?? local), source, preview: {error: "configuration"}};
  try {
    const value = await client.fetch<unknown>('*[_id == "aboutPage" && _type == "aboutPage"][0]', {}, {perspective: "drafts", cache: "no-store", stega: false, signal: AbortSignal.timeout(5000)});
    // An absent singleton is an editable local fallback, not a document-selection query.
    const data = parsePreviewAbout(value ?? {_id: "aboutPage", _type: "aboutPage"}, locale, published);
    return {content: data.content, images: data.images, labels: data.labels, source, preview: {error: null, fallbackPaths: data.fallbackPaths}};
  } catch {
    return {...(published ?? local), source, preview: {error: "unavailable"}};
  }
}
