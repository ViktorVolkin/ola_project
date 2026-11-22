import "server-only";
import type {Locale} from "next-intl";
import {createDataAttribute} from "next-sanity";
import {studioUrl} from "@/content/sanity/preview-policy";
import {contactContentPath} from "@/content/sanity/contact";

export type ContactEditing = (path: string, image?: boolean) => string | undefined;
/** Invoked by the server page; widgets receive only resolved props/metadata. */
export function contactEditing(locale: Locale, enabled: boolean): ContactEditing {
  return (path, image = false) =>
    enabled
      ? createDataAttribute({
          id: "contactPage",
          type: "contactPage",
          projectId: "zhn2ddaj",
          dataset: "production",
          baseUrl: studioUrl(),
          path: image ? path : `${contactContentPath(path)}.${locale}`,
        }).toString()
      : undefined;
}
export function ContactEditable({attribute, children}: {attribute?: string; children: React.ReactNode}) {
  return attribute ? <span data-sanity={attribute}>{children}</span> : <>{children}</>;
}
