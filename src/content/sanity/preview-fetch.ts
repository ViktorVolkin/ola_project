import en from "@/i18n/messages/en.json";
import "server-only";
import type {Locale} from "next-intl";
import {previewClient} from "./preview-client";
import {parsePreviewHome} from "./preview-content";
import type {parseHome} from "./home";
export async function fetchPreviewHome(locale: Locale, published: ReturnType<typeof parseHome>) {
  const client = previewClient();
  if (!client) return {data: null, error: en.HomePreview.configuration};
  try {
    const value = await client.fetch<unknown>('*[_id == "homePage" && _type == "homePage"][0]', {}, {perspective: "drafts", cache: "no-store", stega: false, signal: AbortSignal.timeout(5000)});
    return {data: parsePreviewHome(value, locale, published), error: null};
  } catch {
    return {data: null, error: en.HomePreview.unavailable};
  }
}
