import "server-only";
import type {Locale} from "next-intl";
import {createDataAttribute} from "next-sanity";
import {studioUrl} from "@/content/sanity/preview-policy";

export type WeddingsEditing = (path: string, image?: boolean) => string | undefined;
export function weddingsEditing(locale: Locale, enabled: boolean): WeddingsEditing {
  return (path, image = false) => enabled ? createDataAttribute({id: "weddingsPage", type: "weddingsPage", projectId: "zhn2ddaj", dataset: "production", baseUrl: studioUrl(), path: image ? path : `${path}.${locale}`}).toString() : undefined;
}
export function WeddingsEditable({attribute, children}: {attribute?: string; children: React.ReactNode}) {
  return attribute ? <span data-sanity={attribute}>{children}</span> : <>{children}</>;
}
