import "server-only";
import type {Locale} from "next-intl";
import {createPageEditing} from "@/content/sanity/editing";

export type BalloonsEditing = (path: string, image?: boolean) => string | undefined;
export function balloonsEditing(locale: Locale, enabled: boolean): BalloonsEditing {
  const editing = createPageEditing({documentId: "balloonsPage", documentType: "balloonsPage", locale, enabled});
  return (path, image = false) => image ? editing.image(path) : editing.text(path);
}
export function BalloonsEditable({attribute, children}: {attribute?: string; children: React.ReactNode}) {
  return attribute ? <span data-sanity={attribute}>{children}</span> : <>{children}</>;
}
