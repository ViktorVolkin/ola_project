
import type {Locale} from "next-intl";
import type {AboutPreview} from "@/content/resolver/about";
import {CmsPreviewStatus} from "@/components/shared/CmsPreviewStatus";

export function AboutPreviewStatus({
  locale,
  preview,
}: {
  locale: Locale;
  preview: AboutPreview | null;
}) {
  return (
    <CmsPreviewStatus
      locale={locale}
      route="/about"
      preview={preview}
      testId="data-about-preview"
    />
  );
}
