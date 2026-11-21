import type { HomeContent } from "../types";

export type HomeEventsBlockProps = {
  images?: Partial<import("@/content/sanity/home").CmsImages>;
  content: HomeContent["events"];
  exploreLabel: string;
};
