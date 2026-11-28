import type {Locale} from "next-intl";
import type {WeddingsPreview} from "@/content/resolver/weddings";
import type {WeddingsContent} from "@/content/weddings";
import {WeddingsEditable, type WeddingsEditing} from "./weddingsEditing";
import { CmsPreviewStatus } from "@/components/shared/CmsPreviewStatus";

export function WeddingsPreviewStatus({locale, preview, content, editing}: {locale: Locale; preview: WeddingsPreview | null; content: WeddingsContent; editing: WeddingsEditing}) {
  const alts = [
    {path: "hero.imageAlt", value: content.hero.imageAlt},
    ...content.categories.map(item => ({path: `categories.${item.id}.imageAlt`, value: item.imageAlt})),
    {path: "approach.imageAlt", value: content.approach.imageAlt},
    ...content.inspiration.items.map(item => ({path: `inspiration.${item.id}.imageAlt`, value: item.imageAlt})),
    {path: "cta.imageAlt", value: content.cta.imageAlt}
  ];
  return (
    <CmsPreviewStatus
      locale={locale}
      route="/weddings-events"
      preview={preview}
      testId="data-weddings-preview"
    >
      <ul>
        {alts.map(item => (
          <li key={item.path}>
            <WeddingsEditable attribute={editing(item.path)}>
              {item.value}
            </WeddingsEditable>
          </li>
        ))}
      </ul>
    </CmsPreviewStatus>
  );
}
