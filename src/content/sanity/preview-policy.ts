export function studioUrl(): string {
  const configured = process.env.SANITY_STUDIO_URL;
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === 'https:' || (url.protocol === 'http:' && url.hostname === 'localhost')) return url.origin + url.pathname.replace(/\/+$/, "");
    } catch {}
  }
  return "https://www.sanity.io/@obdulf8du/studio/xxpedejjvg9va6r4u8t4llzw";
}
export const studioOrigins = ["https://www.sanity.io", "https://ola-studio-zhn2ddaj.sanity.studio"] as const;
/** Only migrated editorial routes; not a general CMS route wildcard. */
const previewRoutes = [
  "",
  "/about",
  "/balloons",
  "/bouquets",
  "/weddings-events",
  "/contact",
] as const;

export function previewPath(
  value: string | null
): value is string {
  if (!value) return false;

  const match = /^\/(en|ru|sr)(\/.*)?$/.exec(value);
  if (!match) return false;

  return previewRoutes.includes(
    (match[2] ?? "") as typeof previewRoutes[number]
  );
}
/** Compatibility for the existing disable route and Home integrations. */
export const homePath = previewPath;
/** Reject normalization, encoding, credentials, query/hash and foreign-origin bypasses. */
export function previewNavigationPath(value: string, origin: string): string | null {
  try {
    const url = new URL(value, origin);
    return url.origin === origin && previewPath(url.pathname) &&
      (value === url.pathname || value === origin + url.pathname)
      ? url.pathname : null;
  } catch { return null; }
}
export function trustedStudio(origin: string | undefined): boolean {
  return !!origin && ((studioOrigins as readonly string[]).includes(origin) || (process.env.NODE_ENV === "development" && origin === "http://localhost:3333"));
}
/** Reject unknown/duplicate query parameters before the SDK can enable cookies. */
export function validEnableUrl(url: URL): boolean {
  const allowed = new Set(["sanity-preview-secret", "sanity-preview-pathname", "sanity-preview-perspective"]);
  for (const key of url.searchParams.keys()) if (!allowed.has(key) || url.searchParams.getAll(key).length !== 1) return false;
  return !!url.searchParams.get("sanity-preview-secret")?.trim() && homePath(url.searchParams.get("sanity-preview-pathname")) && [null, "drafts"].includes(url.searchParams.get("sanity-preview-perspective"));
}
