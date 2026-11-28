import "server-only";
import type {Locale} from "next-intl";
import {createDataAttribute} from "next-sanity";
import {studioUrl} from "@/content/sanity/preview-policy";

type PageEditingConfig = {
  documentId: string;
  documentType: string;
  locale: Locale;
  enabled: boolean;
  contentPath?: (path: string) => string;
};

export function createPageEditing({documentId, documentType, locale, enabled, contentPath}: PageEditingConfig) {
  const attribute = (path: string) => enabled ? createDataAttribute({
    id: documentId,
    type: documentType,
    projectId: "zhn2ddaj",
    dataset: "production",
    baseUrl: studioUrl(),
    path,
  }).toString() : undefined;
  return {
    text: (path: string) => enabled ? attribute(`${contentPath ? contentPath(path) : path}.${locale}`) : undefined,
    image: (path: string) => attribute(path),
  };
}
