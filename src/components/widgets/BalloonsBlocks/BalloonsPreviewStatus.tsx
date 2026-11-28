import type {Locale} from "next-intl";
import type {BalloonsPreview} from "@/content/resolver/balloons";
import type {BalloonsContent} from "@/content/balloons";
import {BalloonsEditable, type BalloonsEditing} from "./balloonsEditing";
import { CmsPreviewStatus } from "@/components/shared/CmsPreviewStatus";

export function BalloonsPreviewStatus({locale, preview, content, editing}: {locale: Locale; preview: BalloonsPreview | null; content: BalloonsContent; editing: BalloonsEditing}) {
  const alts = [
    {path: "hero.imageAlt", value: content.hero.imageAlt},
    ...content.categories.map(item => ({path: `categories.${item.id}.imageAlt`, value: item.imageAlt})),
    ...content.favourites.items.map(item => ({path: `favourites.${item.id}.imageAlt`, value: item.imageAlt})),
    {path: "personalisation.imageAlt", value: content.personalisation.imageAlt},
    ...content.personalisation.extras.map(item => ({path: `personalisation.${item.id}.imageAlt`, value: item.imageAlt})),
    {path: "cta.imageAlt", value: content.cta.imageAlt}
  ];
  return (
    <CmsPreviewStatus
      locale={locale}
      route="/balloons"
      preview={preview}
      testId="data-balloons-preview"
    >
      <ul>
        {alts.map(item => (
          <li key={item.path}>
            <BalloonsEditable attribute={editing(item.path)}>
              {item.value}
            </BalloonsEditable>
          </li>
        ))}
      </ul>
    </CmsPreviewStatus>
  );
}
