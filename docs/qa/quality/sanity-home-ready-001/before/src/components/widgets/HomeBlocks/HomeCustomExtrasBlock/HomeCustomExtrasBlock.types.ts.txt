import type { HomeContent } from "../types";

export type HomeCustomExtrasBlockProps = {
  content: HomeContent["custom"];
  extrasContent: HomeContent["extras"];
  createLabel: string;
};
