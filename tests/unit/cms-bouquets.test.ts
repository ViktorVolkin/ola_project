import {describe, expect, it} from "vitest";
import {bouquetTextKeys, parseBouquets, parsePreviewBouquets, type BouquetCopy} from "@/content/sanity/bouquets";

const local = Object.fromEntries(bouquetTextKeys.map(key => [key, `local-${key}`])) as BouquetCopy;
const identity = {_id: "bouquetsPage", _type: "bouquetsPage"};
const photo = {asset: {_ref: `image-${"a".repeat(40)}-1200x900-jpg`}};

describe("bouquets listing CMS", () => {
  it.each(["en", "ru", "sr"] as const)("uses only %s text with same-language fallback", locale => {
    const result = parseBouquets({...identity, heading: {en: "English", ru: "Русский", sr: "Srpski"}, soft: {en: "Only English"}, hero: {title: {[locale]: "injected"}}}, locale, local)!;
    expect(result.content.heading).toBe({en: "English", ru: "Русский", sr: "Srpski"}[locale]);
    expect(result.content.soft).toBe(locale === "en" ? "Only English" : "local-soft");
    expect(result.content).not.toHaveProperty("hero");
  });
  it("rejects identity and draft from published parser and unsafe fields/images", () => {
    expect(parseBouquets({...identity, _id: "drafts.bouquetsPage"}, "en", local)).toBeNull();
    expect(parseBouquets({...identity, _type: "other"}, "en", local)).toBeNull();
    const result = parseBouquets({...identity, heading: {en: "<script>"}, card1: {asset: {url: "https://example.com"}}}, "en", local)!;
    expect(result.content.heading).toBe(local.heading);
    expect(result.images.card1).toBeUndefined();
  });
  it("uses draft then published then local, retaining valid image on invalid draft", () => {
    const published = parseBouquets({...identity, heading: {ru: "published"}, card1: photo}, "ru", local)!;
    const draft = parsePreviewBouquets({...identity, _id: "drafts.bouquetsPage", soft: {ru: "draft"}, card1: {asset: {url: "bad"}}}, "ru", local, published);
    expect(draft.content.heading).toBe("published");
    expect(draft.content.soft).toBe("draft");
    expect(draft.content.bright).toBe(local.bright);
    expect(draft.images.card1).toEqual(published.images.card1);
    expect(draft.fallbackPaths).toContain("card1");
    expect(() => parsePreviewBouquets({...identity, _id: "other"}, "ru", local, published)).toThrow();
  });
});


describe("hero CMS fields", () => {
  it.each(["en", "ru", "sr"] as const)("resolves all hero fields and photo in %s", locale => {
    const keys = ["breadcrumb", "title", "subtitle", "body", "script", "explore"] as const;
    const fields = Object.fromEntries(keys.map(key => [key, {[locale]: `${locale}-${key}`} ]));
    const published = parseBouquets({...identity, ...fields, hero: photo}, locale, local)!;
    for (const key of keys) expect(published.content[key]).toBe(`${locale}-${key}`);
    expect(published.images.hero?.src).toContain("1200x900");
    const draft = parsePreviewBouquets({...identity, _id: "drafts.bouquetsPage", title: {[locale]: "draft"}, hero: {asset: {url: "invalid"}}}, locale, local, published);
    expect(draft.content.title).toBe("draft");
    expect(draft.content.body).toBe(`${locale}-body`);
    expect(draft.images.hero).toEqual(published.images.hero);
    expect(draft.fallbackPaths).toContain("hero");
  });
});
