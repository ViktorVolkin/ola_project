import "server-only";
import {createClient} from "next-sanity";

/** Fixed resource identity: no environment/query override can select another project. */
export function previewClient() {
  const token = process.env.SANITY_API_READ_TOKEN;
  const origin = process.env.SANITY_PREVIEW_ORIGIN;
  if (!token || !origin) return null;
  try {
    const url = new URL(origin);
    if (url.origin !== origin || (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && url.hostname === "localhost" && url.protocol === "http:"))) return null;
  } catch { return null; }
  return createClient({projectId: "zhn2ddaj", dataset: "production", apiVersion: "2025-02-19", token, useCdn: false, perspective: "drafts", stega: false});
}
