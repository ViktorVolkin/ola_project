import "server-only";
import {draftMode} from "next/headers";
import {getLocale} from "next-intl/server";
import {createDataAttribute} from "next-sanity";
import {studioUrl} from "@/content/sanity/preview-policy";
/** Metadata is separate from canonical text/image inputs; public DOM gets no attributes. */
export async function homeEditing() {
  const enabled = (await draftMode()).isEnabled && !!process.env.SANITY_API_READ_TOKEN && !!process.env.SANITY_PREVIEW_ORIGIN;
  const locale = await getLocale();
  return (path: string, image = false) => enabled ? createDataAttribute({id: "homePage", type: "homePage", projectId: "zhn2ddaj", dataset: "production", baseUrl: studioUrl(), path: image ? path : `${path}.${locale}`}).toString() : undefined;
}
export async function HomeEditable({path, children}: {path: string; children: React.ReactNode}) {
  const field = await homeEditing();
  const attribute = field(path);
  return attribute ? <span data-sanity={attribute}>{children}</span> : <>{children}</>;
}
