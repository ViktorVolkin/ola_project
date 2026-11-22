import type { HomeContent } from "../types";

export type HomeMeetBlockProps = {
  images?: Partial<import("@/content/sanity/home").CmsImages>;
  content: HomeContent["meet"];
  aboutLabel: string;
};
