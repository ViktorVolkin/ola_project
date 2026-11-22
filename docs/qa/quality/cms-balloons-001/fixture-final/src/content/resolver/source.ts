import "server-only";
/** One server-only source switch for migrated pages. Never reflect invalid values. */
export function contentSource(value: string | undefined): "default" | "sanity" {
  if (value === undefined || value === "default") return "default";
  if (value === "sanity") return "sanity";
  console.warn("Invalid CONTENT_SOURCE; using default content");
  return "default";
}
