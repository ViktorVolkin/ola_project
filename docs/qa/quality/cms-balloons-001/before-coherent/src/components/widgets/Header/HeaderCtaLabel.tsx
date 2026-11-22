"use client";

import {usePathname} from "@/i18n/navigation";

export function isBouquetPreviewPath(pathname: string): boolean {
  return /^\/preview\/bouquet\/?$/.test(pathname);
}

export function HeaderCtaLabel({defaultLabel, previewLabel}: {defaultLabel: string; previewLabel: string}) {
  const pathname = usePathname();
  return <>{isBouquetPreviewPath(pathname) ? previewLabel : defaultLabel}</>;
}
