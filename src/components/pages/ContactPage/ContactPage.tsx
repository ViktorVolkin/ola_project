import {getLocale} from "next-intl/server";
import {resolveContactContent} from "@/content/resolver/contact";
import {contactEditing} from "@/components/widgets/ContactBlocks/contactEditing";
import {ContactPreviewStatus} from "@/components/widgets/ContactBlocks/ContactPreviewStatus";
import {ContactHero} from "@/components/widgets/ContactBlocks/ContactHero/ContactHero";
import {ContactGeography} from "@/components/widgets/ContactBlocks/ContactGeography/ContactGeography";
import {ContactTopics} from "@/components/widgets/ContactBlocks/ContactTopics/ContactTopics";
import {ContactLower} from "@/components/widgets/ContactBlocks/ContactLower/ContactLower";

export default async function ContactPage() {
  const locale = await getLocale();
  const {content, images, source, preview} = await resolveContactContent(locale);
  const editing = contactEditing(locale, source === "preview" && !!process.env.SANITY_API_READ_TOKEN && !!process.env.SANITY_PREVIEW_ORIGIN);
  return (
    <main id="main-content" data-locale={locale}>
      {source === "preview" && <ContactPreviewStatus locale={locale} preview={preview} />}
      <ContactHero content={content} image={images.hero} editing={editing} />
      <ContactGeography content={content} image={images.geography} editing={editing} />
      <ContactTopics content={content} images={images} editing={editing} />
      <ContactLower content={content} image={images.editorial} editing={editing} />
    </main>
  );
}
