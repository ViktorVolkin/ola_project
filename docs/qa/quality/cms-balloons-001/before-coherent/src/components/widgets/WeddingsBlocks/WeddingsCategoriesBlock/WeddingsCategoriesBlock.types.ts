import type { WeddingsContent } from "@/content/weddings";

export interface WeddingsCategoriesBlockProps {
  items: WeddingsContent["categories"];
  label: string;
}
