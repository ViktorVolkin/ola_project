// Technical fragments identify inspiration sections, not products or detail routes.
export type BouquetImage = {src: string; alt: string; width: number; height: number};
const image = (name: string, width: number, height: number): BouquetImage => ({src: `/assets/images/bouquets/${name}.jpg`, alt: "", width, height});
// Card and selector photographs repeat their adjacent visible labels; editorial images are decorative.
export const bouquetImages = {
  hero: image("01_bouquets_hero", 2400, 1958),
  all: image("02_bouquets_all", 1400, 1808),
  soft: image("03_soft_romantic", 1200, 1690),
  natural: image("04_natural_airy", 1200, 1690),
  peachy: image("05_bright_joyful", 1200, 1690),
  wild: image("06_statement", 1200, 1634),
  sunset: image("07_sunset", 1200, 1523),
  lavender: image("08_lavender_haze", 1200, 1523),
  garden: image("09_garden_style", 1200, 1523),
  beauty: image("10_natural_beauty", 1200, 1472),
  custom: image("11_bouquets_custom", 2000, 1534),
  seasonal: image("12_bouquets_seasonal", 1800, 1335),
} as const;

export const bouquetCards = [
  {id: "bouquet-soft-romance", image: bouquetImages.soft},
  {id: "bouquet-natural-airy", image: bouquetImages.natural},
  {id: "bouquet-peachy-mood", image: bouquetImages.peachy},
  {id: "bouquet-wild-beauty", image: bouquetImages.wild},
  {id: "bouquet-sunset", image: bouquetImages.sunset},
  {id: "bouquet-lavender-haze", image: bouquetImages.lavender},
  {id: "bouquet-garden-style", image: bouquetImages.garden},
  {id: "bouquet-natural-beauty", image: bouquetImages.beauty},
] as const;

export const bouquetSelectors = [
  {targetId: "bouquet-inspiration", image: bouquetImages.all},
  {targetId: "bouquet-soft-romance", image: bouquetImages.soft},
  {targetId: "bouquet-sunset", image: bouquetImages.peachy},
  {targetId: "bouquet-natural-airy", image: bouquetImages.natural},
  {targetId: "bouquet-wild-beauty", image: bouquetImages.wild},
] as const;
