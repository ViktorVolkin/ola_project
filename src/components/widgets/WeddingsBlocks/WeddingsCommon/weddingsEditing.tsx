import "server-only";
import type {Locale} from "next-intl";
import {createPageEditing} from "@/content/sanity/editing";

export type WeddingsEditing = (
  path: string,
  image?: boolean
) => string | undefined;

export function weddingsEditing(
  locale: Locale,
  enabled: boolean
): WeddingsEditing {
  const editing = createPageEditing({
    documentId: "weddingsPage",
    documentType: "weddingsPage",
    locale,
    enabled,
  });

  return (path, image = false) =>
    image ? editing.image(path) : editing.text(path);
}

export function WeddingsEditable({
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
