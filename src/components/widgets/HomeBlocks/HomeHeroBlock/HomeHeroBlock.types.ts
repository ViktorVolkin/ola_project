import type { HomeContent } from "../types";

export type HomeHeroBlockProps = {
  images?: Partial<import("@/content/sanity/home").CmsImages>;
  content: HomeContent["hero"];
  shopLabel: string;
  chooseLabel: string;
};
