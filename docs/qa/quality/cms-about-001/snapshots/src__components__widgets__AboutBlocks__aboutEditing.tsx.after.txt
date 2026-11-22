import "server-only";
import type {Locale} from "next-intl";
import {createDataAttribute} from "next-sanity";
import {studioUrl} from "@/content/sanity/preview-policy";
import {aboutContentPath} from "@/content/sanity/about";
export type AboutEditing = (path: string, image?: boolean) => string | undefined;
/** Invoked by the server page; widgets receive only resolved props/metadata. */
export function aboutEditing(locale: Locale, enabled: boolean): AboutEditing {
  return (path, image = false) => enabled ? createDataAttribute({id: "aboutPage", type: "aboutPage", projectId: "zhn2ddaj", dataset: "production", baseUrl: studioUrl(), path: image ? path : `${aboutContentPath(path)}.${locale}`}).toString() : undefined;
}
export function AboutEditable({attribute, children}: {attribute?: string; children: React.ReactNode}) {
  return attribute ? <span data-sanity={attribute}>{children}</span> : <>{children}</>;
}
