
import {draftMode} from "next/headers";
import {NextResponse} from "next/server";
import {homePath} from "@/content/sanity/preview-policy";

export const dynamic = "force-dynamic";

const PREVIEW_COOKIES = [
  "__prerender_bypass",
  "sanity-preview-perspective",
  "sanity-preview-partitioned",
] as const;

function clearPreviewCookies(response: NextResponse) {
  const production = process.env.NODE_ENV === "production";

  const common = [
    "Path=/",
    "HttpOnly",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ];

  for (const name of PREVIEW_COOKIES) {
    // Delete the unpartitioned cookie.
    response.headers.append(
      "Set-Cookie",
      [
        `${name}=`,
        ...common,
        production ? "Secure" : "",
        production ? "SameSite=None" : "SameSite=Lax",
      ].filter(Boolean).join("; "),
    );

    // Delete the CHIPS cookie in the current top-level partition.
    // Partitioned cookies require Secure.
    if (production) {
      response.headers.append(
        "Set-Cookie",
        [
          `${name}=`,
          ...common,
          "Secure",
          "SameSite=None",
          "Partitioned",
        ].join("; "),
      );
    }
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("returnTo") ?? "/en";

  if (!homePath(path)) {
    return new Response("Invalid destination", {
      status: 400,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  }

  // Keep Next.js responsible for disabling Draft Mode.
  (await draftMode()).disable();

  const response = NextResponse.redirect(
    new URL(path, url.origin),
    303,
  );

  clearPreviewCookies(response);

  response.headers.set("Cache-Control", "private, no-store");

  return response;
}
