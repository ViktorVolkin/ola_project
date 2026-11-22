import "server-only";
import type {Locale} from "next-intl";
import {draftMode} from "next/headers";
import {getHomeContent} from "@/content/home";
import {fetchHome, type CmsHome} from "@/content/sanity/home";
import {fetchPreviewHome} from "@/content/sanity/preview-fetch";

export type HomeSource = "default" | "sanity" | "preview";
export type ResolvedHome = CmsHome & {
  source: HomeSource;
  preview: {error: string | null; fallbackPaths?: string[]} | null;
};

import {contentSource} from "./source";
export {contentSource} from "./source";

export async function resolveHomeContent(locale: Locale): Promise<ResolvedHome> {
  const isPreview = (await draftMode()).isEnabled;
  const source = isPreview ? "preview" : contentSource(process.env.CONTENT_SOURCE);
  const local: CmsHome = {content: getHomeContent(locale), images: {}, labels: {}};
  if (source === "default") return {...local, source, preview: null};
  const published = await fetchHome(locale);
  if (source === "sanity") return {...(published ?? local), source, preview: null};
  const preview = await fetchPreviewHome(locale, published);
  return {
    ...(preview.data ?? published ?? local),
    source,
    preview: {error: preview.error, fallbackPaths: preview.data?.fallbackPaths},
  };
}
