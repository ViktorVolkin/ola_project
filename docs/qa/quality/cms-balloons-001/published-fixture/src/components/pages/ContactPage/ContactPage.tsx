import {getLocale, getMessages} from "next-intl/server";
import {ContactHero} from "@/components/widgets/ContactBlocks/ContactHero";
import {ContactGeography} from "@/components/widgets/ContactBlocks/ContactGeography";
import {ContactTopics} from "@/components/widgets/ContactBlocks/ContactTopics";
import {ContactLower} from "@/components/widgets/ContactBlocks/ContactLower";

export default async function ContactPage() {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  const content = messages.Contact;
  return <main id="main-content" data-locale={locale}>
    <ContactHero c={content} /><ContactGeography c={content} /><ContactTopics c={content} /><ContactLower c={content} />
  </main>;
}
