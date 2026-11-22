import {describe, expect, it, vi, afterEach} from "vitest";
import {getHomeContent} from "@/content/home";
import {fetchHome, imageUrl, imagePresentation, parseHome} from "@/content/sanity/home";

// Synthetic fixture: never fetched from, uploaded to, or published in Sanity.
function fixture() {
  const localize = (value: unknown): unknown => typeof value === "string" ? {en: value, ru: value, sr: value} : Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, localize(v)]));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- deliberately mutable synthetic document
  const doc = localize(getHomeContent("en")) as Record<string, any>;
  const photo = () => ({asset: {_ref: `image-${"a".repeat(40)}-1200x800-jpg`}});
  doc._id = "homePage"; doc._type = "homePage";
  for (const key of ["hero", "custom", "meet", "events"]) doc[key].photo = photo();
  for (const key of ["flowers", "balloons", "weddings"]) doc.services[key].photo = photo();
  doc.services.weddingsMobile = photo();
  for (const key of ["romantic", "bright", "natural"]) doc.moods[key].photo = photo();
  const extras = doc.extras;
  doc.extras = {title: extras.title, description: extras.description,
    balloons: {title: extras.balloons, alt: extras.balloonAlt, photo: photo()},
    card: {title: extras.card, alt: extras.cardAlt, photo: photo()},
    chocolates: {title: extras.chocolates, alt: extras.chocolateAlt, photo: photo()}};
  doc.labels = Object.fromEntries(["shopBouquets", "letOlaChoose", "servicesLabel", "viewAllBouquets", "viewBouquet", "moodRailLabel", "letOlaCreate", "aboutOla", "exploreEvents"].map(key => [key, {en: key, ru: key, sr: key}]));
  return doc;
}
afterEach(() => vi.unstubAllGlobals());
describe("homepage CMS validation", () => {
  it("accepts a complete published document for every locale", () => {
    const doc = fixture();
    for (const locale of ["en", "ru", "sr"] as const) expect(parseHome(doc, locale)?.content.hero.title).toBe(getHomeContent("en").hero.title);
  });
  it("rejects invalid document identity and locale but falls back per invalid field", () => {
    const doc = fixture(); doc._id = "drafts.homePage"; expect(parseHome(doc, "en")).toBeNull();
    doc._id = "homePage"; doc._type = "other"; expect(parseHome(doc, "en")).toBeNull();
    doc._type = "homePage";
    // @ts-expect-error Deliberately exercise the runtime unsupported-locale guard.
    expect(parseHome(doc, "fr")).toBeNull();
    doc.hero.title.en = "Valid English"; doc.hero.title.sr = "Valid Serbian";
    doc.hero.description.ru = "Соседнее поле";
    for (const invalid of ["", "<script>"]) {
      doc.hero.title.ru = invalid;
      const ru = parseHome(doc, "ru");
      expect(ru?.content.hero.title).toBe(getHomeContent("ru").hero.title);
      expect(ru?.content.hero.title).not.toBe(doc.hero.title.en);
      expect(ru?.content.hero.title).not.toBe(doc.hero.title.sr);
      expect(ru?.content.hero.description).toBe("Соседнее поле");
      expect(parseHome(doc, "en")?.content.hero.title).toBe("Valid English");
      expect(parseHome(doc, "sr")?.content.hero.title).toBe("Valid Serbian");
    }
    doc.hero.photo.asset._ref = "https://evil.test/a.jpg";
    const result = parseHome(doc, "en");
    expect(result?.images.hero).toBeUndefined();
    expect(result?.images.flowers).toBeDefined();
    expect(result?.content.hero.title).toBe("Valid English");
    expect(imageUrl(doc.hero.photo)).toBeNull();
    expect(imagePresentation(doc.hero.photo)).toBeNull();
    expect(imageUrl({asset: {_ref: "image-bad"}})).toBeNull();
  });
  it("uses the official builder for editor crop and hotspot and rejects invalid bounds", () => {
    const asset = {asset: {_ref: `image-${"a".repeat(40)}-1200x800-jpg`}};
    const plain = imageUrl(asset, 600);
    const cropped = imageUrl({...asset, crop: {left: 0.1, right: 0.1, top: 0, bottom: 0}, hotspot: {x: 0.7, y: 0.5, width: 0.2, height: 0.5}}, 600);
    expect(cropped).not.toBe(plain);
    expect(cropped).toMatch(/^https:\/\/cdn\.sanity\.io\/images\/zhn2ddaj\/production\//);
    expect(cropped).toContain("rect=");
    const left = imagePresentation({...asset, hotspot: {x: 0.2, y: 0.5, width: 0.1, height: 0.2}});
    const right = imagePresentation({...asset, hotspot: {x: 0.8, y: 0.5, width: 0.1, height: 0.2}});
    expect(left).not.toEqual(right);
    expect(left).not.toBeNull();
    expect(right).not.toBeNull();
    expect(imageUrl({...asset, crop: {left: 0.7, right: 0.4, top: 0, bottom: 0}})).toBeNull();
    expect(imageUrl({...asset, hotspot: {x: 1.2, y: 0.5, width: 0.2, height: 0.2}})).toBeNull();
  });
  it("does not pre-crop to a guessed responsive frame ratio", () => {
    const asset = {asset: {_ref: `image-${"a".repeat(40)}-1200x800-jpg`}, crop: {left: 0.1, right: 0.05, top: 0.05, bottom: 0.1}, hotspot: {x: 0.7, y: 0.5, width: 0.2, height: 0.2}};
    const url = new URL(imageUrl(asset)!);
    expect(url.searchParams.has("h")).toBe(false);
    expect(url.searchParams.get("rect")).toBe("120,40,1020,680");
  });
  it("normalizes focus to rounded crop and rejects unsupported or degenerate media", () => {
    const asset = {asset: {_ref: `image-${"a".repeat(40)}-1200x800-jpg`}};
    expect(imagePresentation({...asset, crop: {left: 0.25, right: 0, top: 0, bottom: 0.25}, hotspot: {x: 0.625, y: 0.375, width: 0.1, height: 0.1}})?.position).toBe("50% 50%");
    expect(imagePresentation({...asset, crop: {left: 0.9, right: 0, top: 0, bottom: 0}})?.position).toBe("0% 50%");
    expect(imageUrl({...asset, crop: {left: 0.99999, right: 0, top: 0, bottom: 0}})).toBeNull();
    expect(imageUrl({asset: {_ref: `image-${"a".repeat(40)}-1200x800-svg`}})).toBeNull();
    const doc = fixture(); doc.hero.photo.asset._ref = `image-${"a".repeat(40)}-1200x800-avif`;
    const result = parseHome(doc, "en");
    expect(result?.images.hero).toBeUndefined();
    expect(result?.images.flowers).toBeDefined();
    expect(result?.content.hero.title).toBe(doc.hero.title.en);
    expect(imagePresentation(doc.hero.photo)).toBeNull();
  });
  it("keeps focus visible with one bounded cover crop across extreme frames", () => {
    const asset = {asset: {_ref: `image-${"a".repeat(40)}-1200x800-jpg`}};
    for (const x of [0.11, 0.25, 0.5, 0.8, 0.94]) for (const y of [0.06, 0.3, 0.7, 0.89]) {
      const image = imagePresentation({...asset, crop: {left: 0.1, right: 0.05, top: 0.05, bottom: 0.1}, hotspot: {x, y, width: 0.01, height: 0.01}})!;
      const [px, py] = image.position.split(" ").map(n => parseFloat(n) / 100);
      for (const [w, h] of [[320, 320], [924, 300], [1440, 600], [152, 116], [240, 224], [1, 1000], [1000, 1]]) {
        const scale = Math.max(w / 1020, h / 680);
        const left = (w - 1020 * scale) * px, top = (h - 680 * scale) * py;
        const fx = (x * 1200 - 120) * scale + left, fy = (y * 800 - 40) * scale + top;
        expect(fx).toBeGreaterThanOrEqual(-1e-8); expect(fx).toBeLessThanOrEqual(w + 1e-8);
        expect(fy).toBeGreaterThanOrEqual(-1e-8); expect(fy).toBeLessThanOrEqual(h + 1e-8);
        expect(left).toBeLessThanOrEqual(0); expect(left + 1020 * scale).toBeGreaterThanOrEqual(w - 1e-8);
        expect(top).toBeLessThanOrEqual(0); expect(top + 680 * scale).toBeGreaterThanOrEqual(h - 1e-8);
      }
    }
  });
  const safeRef = `image-${"a".repeat(40)}-1200x800-png`;
  const otherRef = `image-${"b".repeat(40)}-1200x800-png`;
  const svgRef = `image-${"b".repeat(40)}-1200x800-svg`;
  const hugeRef = `image-${"b".repeat(40)}-900000x900000-jpg`;
  const assetUrl = (suffix: string) => `https://cdn.sanity.io/images/zhn2ddaj/production/${"b".repeat(40)}-${suffix}`;
  it.each([
    ["asset.url SVG override", {asset: {_ref: safeRef, url: assetUrl("1200x800.svg")}}],
    ["asset.url alternate supported image", {asset: {_ref: safeRef, url: assetUrl("1200x800.png")}}],
    ["asset.url oversized image", {asset: {_ref: safeRef, url: assetUrl("900000x900000.jpg")}}],
    ["asset.url nonstring ambiguity", {asset: {_ref: safeRef, url: null}}],
    ["top-level _ref alternate", {asset: {_ref: safeRef}, _ref: otherRef}],
    ["top-level _ref SVG", {asset: {_ref: safeRef}, _ref: svgRef}],
    ["top-level _ref oversized", {asset: {_ref: safeRef}, _ref: hugeRef}],
    ["top-level _ref identical ambiguity", {asset: {_ref: safeRef}, _ref: safeRef}],
    ["top-level _id alternate", {asset: {_ref: safeRef}, _id: otherRef}],
    ["top-level _id SVG", {asset: {_ref: safeRef}, _id: svgRef}],
    ["top-level _id oversized", {asset: {_ref: safeRef}, _id: hugeRef}],
    ["top-level _id null ambiguity", {asset: {_ref: safeRef}, _id: null}],
    ["nested reference unsupported format", {asset: {_ref: svgRef}}],
    ["nested reference oversized metadata", {asset: {_ref: hugeRef}}],
  ])("rejects unsafe photo only, preserving valid fields in parse and fetch: %s", async (label, photo) => {
    const doc = fixture();
    doc.hero.photo = photo;
    doc.hero.title = {en: "English valid", ru: "Русский текст", sr: "Srpski tekst"};
    for (const locale of ["en", "ru", "sr"] as const) {
      const result = parseHome(doc, locale);
      expect(result, label).not.toBeNull();
      expect(result?.images.hero, label).toBeUndefined();
      expect(result?.images.flowers, label).toBeDefined();
      expect(result?.content.hero.title, label).toBe(doc.hero.title[locale]);
    }
    expect(imageUrl(photo), label).toBeNull();
    expect(imagePresentation(photo), label).toBeNull();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ok: true, json: async () => ({result: doc})}));
    for (const locale of ["en", "ru", "sr"] as const) {
      const result = await fetchHome(locale);
      expect(result, label).not.toBeNull();
      expect(result?.images.hero, label).toBeUndefined();
      expect(result?.images.flowers, label).toBeDefined();
      expect(result?.content.hero.title, label).toBe(doc.hero.title[locale]);
    }
  });
  it("accepts ordinary image metadata without changing crop, focus or localized content", () => {
    const doc = fixture();
    const clean = {asset: {_ref: safeRef}, crop: {left: 0.1, right: 0.05, top: 0.05, bottom: 0.1}, hotspot: {x: 0.7, y: 0.5, width: 0.2, height: 0.2}};
    doc.hero.photo = {...clean, _type: "image", _key: "hero-photo", alt: {en: "editor note"}, asset: {...clean.asset, _type: "reference", _weak: false}, crop: {...clean.crop, _type: "sanity.imageCrop"}, hotspot: {...clean.hotspot, _type: "sanity.imageHotspot"}};
    expect(imagePresentation(doc.hero.photo)).toEqual(imagePresentation(clean));
    for (const locale of ["en", "ru", "sr"] as const) expect(parseHome(doc, locale)?.images.hero).toEqual(imagePresentation(clean));
  });
  it("falls back when the public request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await fetchHome("ru")).toBeNull();
  });
});
