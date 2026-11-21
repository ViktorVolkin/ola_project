import type { HomeContent } from "../types";

export type HomeServicesBlockProps = {
  images?: Partial<import("@/content/sanity/home").CmsImages>;
  content: HomeContent["services"];
  label: string;
};
