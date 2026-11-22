
import type {Locale} from "next-intl";
import {getHomeContent} from "@/content/home";
import imageUrlBuilder from "@sanity/image-url";
import type {
  SanityImageCrop,
  SanityImageHotspot,
} from "@sanity/image-url/lib/types/types";

const locales = ["en", "ru", "sr"] as const;

type Obj = Record<string, unknown>;

const object = (value: unknown): Obj | null =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value)
    ? (value as Obj)
    : null;

const get = (value: unknown, path: readonly string[]): unknown =>
  path.reduce<unknown>(
    (current, key) => object(current)?.[key],
    value,
  );

type CanonicalImage = {
  asset: {_ref: string};
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
};

/**
 * Accept only a validated Sanity image reference.
 * Do not forward arbitrary asset metadata to the image SDK.
 */
function canonicalImage(value: unknown): CanonicalImage | null {
  const input = object(value);
  if (!input) return null;

  const asset = object(input.asset);

  if (
    !asset ||
    "_ref" in input ||
    "_id" in input ||
    "url" in asset
  ) {
    return null;
  }

  const crop = object(input.crop);
  const hotspot = object(input.hotspot);

  const bounded = (entry: Obj, keys: string[]): boolean =>
    keys.every(
      (key) =>
        typeof entry[key] === "number" &&
        Number.isFinite(entry[key]) &&
        (entry[key] as number) >= 0 &&
        (entry[key] as number) <= 1,
    );

  if (
    input.crop !== undefined &&
    (
      !crop ||
      !bounded(crop, ["top", "bottom", "left", "right"]) ||
      (crop.left as number) + (crop.right as number) >= 1 ||
      (crop.top as number) + (crop.bottom as number) >= 1
    )
  ) {
    return null;
  }

  if (
    input.hotspot !== undefined &&
    (
      !hotspot ||
      !bounded(hotspot, ["x", "y", "width", "height"]) ||
      hotspot.width === 0 ||
      hotspot.height === 0
    )
  ) {
    return null;
  }

  const ref = get(value, ["asset", "_ref"]);

  if (typeof ref !== "string") return null;

  const match =
    /^image-([a-f0-9]{40})-([1-9]\d{0,4})x([1-9]\d{0,4})-(jpg|png|webp)$/.exec(ref);

  if (!match) return null;

  return {
    asset: {_ref: ref},
    ...(crop
      ? {
          crop: {
            top: crop.top as number,
            bottom: crop.bottom as number,
            left: crop.left as number,
            right: crop.right as number,
          },
        }
      : {}),
    ...(hotspot
      ? {
          hotspot: {
            x: hotspot.x as number,
            y: hotspot.y as number,
            width: hotspot.width as number,
            height: hotspot.height as number,
          },
        }
      : {}),
  };
}

/**
 * Build a Sanity CDN URL.
 * Preserve the editor's crop and hotspot settings.
 */
function buildImageUrl(
  source: CanonicalImage,
  width: number,
): string | null {
  try {
    const url = imageUrlBuilder({
      projectId: "zhn2ddaj",
      dataset: "production",
    })
      .image(source)
      .width(width)
      .url();

    const rect = new URL(url)
      .searchParams
      .get("rect")
      ?.split(",")
      .map(Number);

    if (rect && (rect[2] < 1 || rect[3] < 1)) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

/**
 * Return a validated image URL or null.
 */
export function imageUrl(
  value: unknown,
  width = 1600,
): string | null {
  const source = canonicalImage(value);

  return source
    ? buildImageUrl(source, width)
    : null;
}

/**
 * Sanity document paths for the shared images.
 * Images are not localized.
 */
export const imagePaths = {
  hero: ["hero", "photo"],
  flowers: ["services", "flowers", "photo"],
  balloons: ["services", "balloons", "photo"],
  weddings: ["services", "weddings", "photo"],
  weddingsMobile: ["services", "weddingsMobile"],
  romantic: ["moods", "romantic", "photo"],
  bright: ["moods", "bright", "photo"],
  natural: ["moods", "natural", "photo"],
  custom: ["custom", "photo"],
  extraBalloons: ["extras", "balloons", "photo"],
  card: ["extras", "card", "photo"],
  chocolates: ["extras", "chocolates", "photo"],
  meet: ["meet", "photo"],
  events: ["events", "photo"],
} as const;

export type CmsImage = {
  src: string;
  position: string;
};

/**
 * Images may be missing in an incomplete Sanity document.
 * Components can fall back to their local images.
 */
export type CmsImages = Partial<
  Record<keyof typeof imagePaths, CmsImage>
>;

/**
 * Calculate the image focus position relative to
 * the actual editor crop.
 */
export function imagePresentation(
  value: unknown,
): CmsImage | null {
  const source = canonicalImage(value);
  if (!source) return null;

  const src = buildImageUrl(source, 1600);
  if (!src) return null;

  const ref = source.asset._ref;
  const size = /-(\d+)x(\d+)-/.exec(ref);

  if (!size) return null;

  const width = Number(size[1]);
  const height = Number(size[2]);

  const rect =
    new URL(src)
      .searchParams
      .get("rect")
      ?.split(",")
      .map(Number) ??
    [0, 0, width, height];

  const hotspot = source.hotspot;

  const clamp = (value: number): number =>
    Math.max(0, Math.min(100, value));

  const x = clamp(
    (
      (Number(hotspot?.x ?? 0.5) * width - rect[0]) /
      rect[2]
    ) * 100,
  );

  const y = clamp(
    (
      (Number(hotspot?.y ?? 0.5) * height - rect[1]) /
      rect[3]
    ) * 100,
  );

  return {
    src,
    position: `${x}% ${y}%`,
  };
}

/**
 * Localized labels that may be overridden in Sanity.
 */
const labelKeys = [
  "shopBouquets",
  "letOlaChoose",
  "servicesLabel",
  "viewAllBouquets",
  "viewBouquet",
  "moodRailLabel",
  "letOlaCreate",
  "aboutOla",
  "exploreEvents",
] as const;

export type CmsLabels = Partial<
  Record<(typeof labelKeys)[number], string>
>;

export type CmsHome = {
  content: ReturnType<typeof getHomeContent>;
  images: CmsImages;
  labels: CmsLabels;
};

/**
 * Parse an optionally incomplete published Sanity document.
 *
 * Rules:
 * - Only the requested locale is read.
 * - Valid Sanity values override local content.
 * - Missing/invalid texts retain their local values.
 * - Missing/invalid images are omitted so components
 *   use their existing local image fallbacks.
 * - No cross-language fallback is performed.
 * - Incorrect document identity is rejected.
 */
export function parseHome(
  value: unknown,
  locale: Locale,
): CmsHome | null {
  const doc = object(value);

  if (
    !doc ||
    doc._id !== "homePage" ||
    doc._type !== "homePage" ||
    !locales.includes(locale as (typeof locales)[number])
  ) {
    return null;
  }

  /**
   * Validate only the selected language.
   */
  const readText = (path: readonly string[]): string | null => {
    const text = get(doc, [...path, locale]);

    if (
      typeof text !== "string" ||
      !text.trim() ||
      text.length > 10000 ||
      /[<>]/.test(text)
    ) {
      return null;
    }

    return text;
  };

  /**
   * Start from complete local content.
   * Override only fields present and valid in Sanity.
   */
  const copy = structuredClone(getHomeContent(locale));

  const walk = (
    node: unknown,
    path: string[] = [],
  ): void => {
    const target = object(node);

    if (!target) return;

    for (const key of Object.keys(target)) {
      if (typeof target[key] === "string") {
        let sourcePath = [...path, key];

        /**
         * Local extras structure differs from Sanity:
         * extras.balloonAlt -> extras.balloons.alt.ru
         */
        if (
          path[0] === "extras" &&
          !["title", "description"].includes(key)
        ) {
          const map: Record<string, [string, string]> = {
            balloons: ["balloons", "title"],
            card: ["card", "title"],
            chocolates: ["chocolates", "title"],
            balloonAlt: ["balloons", "alt"],
            cardAlt: ["card", "alt"],
            chocolateAlt: ["chocolates", "alt"],
          };

          if (map[key]) {
            sourcePath = ["extras", ...map[key]];
          }
        }

        const text = readText(sourcePath);

        if (text !== null) {
          target[key] = text;
        }

        // Otherwise retain the local value.
      } else {
        walk(target[key], [...path, key]);
      }
    }
  };

  walk(copy);

  /**
   * Images can be added independently.
   * Unavailable images retain component-level fallback.
   */
  const images: CmsImages = {};

  for (
    const key of Object.keys(imagePaths) as
      (keyof typeof imagePaths)[]
  ) {
    const image = imagePresentation(
      get(doc, imagePaths[key]),
    );

    if (image) {
      images[key] = image;
    }
  }

  /**
   * Labels can also be added independently.
   * Missing labels use next-intl translations.
   */
  const labels: CmsLabels = {};

  for (const key of labelKeys) {
    const text = readText(["labels", key]);

    if (text !== null) {
      labels[key] = text;
    }
  }

  return {
    content: copy,
    images,
    labels,
  };
}

/**
 * Fetch only published Sanity content.
 *
 * A missing or unavailable document returns null.
 * Individual missing fields no longer reject
 * the whole document.
 */
export async function fetchHome(locale: Locale) {
  const query = encodeURIComponent(
    '*[_id == "homePage" && _type == "homePage"][0]',
  );

  try {
    const response = await fetch(
      `http://127.0.0.1:45643/data/query/production?perspective=published&query=${query}`,
      {
        next: {revalidate: 60},
        signal: AbortSignal.timeout(3000),
      },
    );

    if (!response.ok) {
      throw new Error(`Sanity HTTP ${response.status}`);
    }

    const data: unknown = await response.json();

    const parsed = parseHome(
      object(data)?.result,
      locale,
    );

    if (!parsed) {
      console.warn(
        "Home CMS document unavailable; using local content",
        {locale},
      );
    }

    return parsed;
  } catch (error) {
    console.warn(
      "Home CMS request failed; using local content",
      {locale, error},
    );

    return null;
  }
}
