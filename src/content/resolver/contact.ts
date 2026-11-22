import "server-only";
import type {Locale} from "next-intl";
import {draftMode} from "next/headers";
import {getMessages} from "next-intl/server";
import {fetchContact, parsePreviewContact, type CmsContact, type ContactContent} from "@/content/sanity/contact";
import {previewClient} from "@/content/sanity/preview-client";
import {contentSource} from "./source";

export type ContactPreview = {error: "configuration" | "unavailable" | null; fallbackPaths?: string[]};
export type ResolvedContact = CmsContact & {
  source: "default" | "sanity" | "preview";
  preview: ContactPreview | null;
};

/**
 * Contact content source: default zero-CMS fetch, Sanity published with ISR60,
 * or Draft Mode with uncached drafts — draft wins per field, then published, then local messages.
 */
export async function resolveContactContent(locale: Locale): Promise<ResolvedContact> {
  const source = (await draftMode()).isEnabled ? "preview" : contentSource(process.env.CONTENT_SOURCE);
  const messages = await getMessages();
  const local: CmsContact = {
    content: messages.Contact as unknown as ContactContent,
    images: {},
    labels: {},
  };
  if (source === "default") return {...local, source, preview: null};
  const published = await fetchContact(locale);
  if (source === "sanity") return {...(published ?? local), source, preview: null};
  const client = previewClient();
  if (!client) return {...(published ?? local), source, preview: {error: "configuration"}};
  try {
    const value = await client.fetch<unknown>(
      '*[_id == "contactPage" && _type == "contactPage"][0]',
      {},
      {perspective: "drafts", cache: "no-store", stega: false, signal: AbortSignal.timeout(5000)},
    );
    // An absent singleton is an editable local fallback, not a document-selection query.
    const data = parsePreviewContact(
      value ?? {_id: "contactPage", _type: "contactPage"},
      locale,
      messages.Contact as unknown as ContactContent,
      published,
    );
    return {content: data.content, images: data.images, labels: {}, source, preview: {error: null, fallbackPaths: data.fallbackPaths}};
  } catch {
    return {...(published ?? local), source, preview: {error: "unavailable"}};
  }
}
