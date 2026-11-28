
import "server-only";
import type {Locale} from "next-intl";
import {createPageEditing} from "@/content/sanity/editing";
import {contactContentPath} from "@/content/sanity/contact";

export type ContactEditing = (
  path: string,
  image?: boolean
) => string | undefined;

export function contactEditing(
  locale: Locale,
  enabled: boolean
): ContactEditing {
  const editing = createPageEditing({
    documentId: "contactPage",
    documentType: "contactPage",
    locale,
    enabled,
    contentPath: contactContentPath,
  });

  return (path, image = false) =>
    image ? editing.image(path) : editing.text(path);
}

export function ContactEditable({
  attribute,
  children,
}: {
  attribute?: string;
  children: React.ReactNode;
}) {
  return attribute
    ? <span data-sanity={attribute}>{children}</span>
    : <>{children}</>;
}
