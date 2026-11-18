import type { HomeContent } from "../types";

export type HomeMoodBlockProps = {
  content: HomeContent["mood"];
  moods: HomeContent["moods"];
  labels: {
    shopBouquets: string;
    viewAllBouquets: string;
    viewBouquet: string;
    moodRailLabel: string;
    moodNames: Record<keyof HomeContent["moods"], string>;
  };
};
