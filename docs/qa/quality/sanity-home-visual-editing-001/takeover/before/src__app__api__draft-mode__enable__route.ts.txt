import {defineEnableDraftMode} from "next-sanity/draft-mode";
import {validatePreviewUrl} from "@sanity/preview-url-secret";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {previewClient} from "@/content/sanity/preview-client";
import {trustedStudio, validEnableUrl} from "@/content/sanity/preview-policy";

export const dynamic = "force-dynamic";
const refuse = (status: number) => new Response("Preview unavailable", {status, headers: {"Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer"}});
export async function GET(request: Request) {
  const client = previewClient();
  if (!client) return refuse(503);
  const url = new URL(request.url);
  if (url.origin !== process.env.SANITY_PREVIEW_ORIGIN || !validEnableUrl(url)) return refuse(400);
  try {
    // Extra origin restriction supplements, never replaces, the official secret check.
    const validated = await validatePreviewUrl(client, request.url);
    if (!validated.isValid || !trustedStudio(validated.studioOrigin)) return refuse(401);
    return await defineEnableDraftMode({client}).GET(request);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    // Never log SDK errors: request objects can contain Authorization or preview secrets.
    return refuse(401);
  }
}
