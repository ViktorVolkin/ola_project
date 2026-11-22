import type { WeddingsContent } from "@/content/weddings";

export interface WeddingsCtaBlockProps {
  content: WeddingsContent["cta"];
  contactLabel: string;
  eventSubject: string;
}
