import "server-only";
import type {Locale} from "next-intl";
import {createPageEditing} from "@/content/sanity/editing";
import {aboutContentPath} from "@/content/sanity/about";
export type AboutEditing = (path: string, image?: boolean) => string | undefined;
/** Invoked by the server page; widgets receive only resolved props/metadata. */
export function aboutEditing(locale: Locale, enabled: boolean): AboutEditing {
  const editing = createPageEditing({documentId: "aboutPage", documentType: "aboutPage", locale, enabled, contentPath: aboutContentPath});
  return (path, image = false) => image ? editing.image(path) : editing.text(path);
}
export function AboutEditable({attribute, children}: {attribute?: string; children: React.ReactNode}) {
  return attribute ? <span data-sanity={attribute}>{children}</span> : <>{children}</>;
}
