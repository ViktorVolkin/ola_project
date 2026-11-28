import "server-only";
import {draftMode} from "next/headers";
import {getLocale} from "next-intl/server";
import {createPageEditing} from "@/content/sanity/editing";

export async function homeEditing() {
  const enabled =
    (await draftMode()).isEnabled &&
    !!process.env.SANITY_API_READ_TOKEN &&
    !!process.env.SANITY_PREVIEW_ORIGIN;

  const locale = await getLocale();

  const editing = createPageEditing({
    documentId: "homePage",
    documentType: "homePage",
    locale,
    enabled,
  });

  return (path: string, image = false) =>
    image ? editing.image(path) : editing.text(path);
}

export async function HomeEditable({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const field = await homeEditing();
  const attribute = field(path);

  return attribute
    ? <span data-sanity={attribute}>{children}</span>
    : <>{children}</>;
}