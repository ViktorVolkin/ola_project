
import type {Locale} from "next-intl";
import type {ContactPreview} from "@/content/resolver/contact";
import {CmsPreviewStatus} from "@/components/shared/CmsPreviewStatus";

export function ContactPreviewStatus({
  locale,
  preview,
}: {
  locale: Locale;
  preview: ContactPreview | null;
}) {
  return (
    <CmsPreviewStatus
      locale={locale}
      route="/contact"
      preview={preview}
      testId="data-contact-preview"
    />
  );
}
