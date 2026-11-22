import {cookies, draftMode} from "next/headers";
import {NextResponse} from "next/server";
import {homePath} from "@/content/sanity/preview-policy";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("returnTo") ?? "/en";
  if (!homePath(path)) return new Response("Invalid destination", {status: 400});
  (await draftMode()).disable();
  const store = await cookies();
  // Follow the SDK companion marker: Next's cookie store is keyed by name, so
  // writing both partitions in one response would silently overwrite one.
  const partitioned = store.get("sanity-preview-partitioned")?.value === "1";
  for (const name of ["__prerender_bypass", "sanity-preview-perspective", "sanity-preview-partitioned"]) {
    store.set(name, "", {httpOnly: true, path: "/", secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", partitioned, maxAge: 0});
  }
  const response = NextResponse.redirect(new URL(path, url.origin), 303);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
