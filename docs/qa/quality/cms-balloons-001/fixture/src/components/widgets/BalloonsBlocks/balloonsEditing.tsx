import "server-only";
import type {Locale} from "next-intl";
import {createDataAttribute} from "next-sanity";
import {studioUrl} from "@/content/sanity/preview-policy";

export type BalloonsEditing = (path: string, image?: boolean) => string | undefined;
export function balloonsEditing(locale: Locale, enabled: boolean): BalloonsEditing {
  return (path, image = false) => enabled ? createDataAttribute({id: "balloonsPage", type: "balloonsPage", projectId: "zhn2ddaj", dataset: "production", baseUrl: studioUrl(), path: image ? path : `${path}.${locale}`}).toString() : undefined;
}
export function BalloonsEditable({attribute, children}: {attribute?: string; children: React.ReactNode}) {
  return attribute ? <span data-sanity={attribute}>{children}</span> : <>{children}</>;
}
