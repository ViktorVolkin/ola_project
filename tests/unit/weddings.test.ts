import {existsSync} from "node:fs";
import {join} from "node:path";
import {expect, test} from "vitest";
import {getWeddingsContent, weddingsEnglish, weddingsCopyStatus, weddingsImages} from "@/content/weddings";
import commonSr from "@/i18n/messages/sr.json";
import weddingsSr from "@/i18n/messages/weddings/sr.json";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (typeof value === "object" && value !== null) return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, shape(entry)]));
  expect(typeof value).toBe("string");
  expect(String(value).trim()).not.toBe("");
  return "string";
}

for (const locale of ["en", "ru", "sr"] as const) {
  test(`${locale}: Weddings preserves sections, stable topics, draft status and complete copy`, () => {
    const content = getWeddingsContent(locale);
    expect(shape(content)).toEqual(shape(weddingsEnglish));
    expect(content.categories.map(item => item.id)).toEqual(["weddings", "private", "corporate", "rentals"]);
    expect(content.inspiration.items.map(item => item.id)).toEqual(["ceremony", "dinner", "engagement", "gathering"]);
    expect(content.process.steps).toHaveLength(4);
    expect(weddingsCopyStatus[locale]).toBe(locale === "en" ? "figma-source" : "translation-draft");
    if (locale === "sr") expect(JSON.stringify(content)).not.toMatch(/\p{Script=Cyrillic}/u);
    if (locale === "ru") {
      // Image alternatives must not retain untranslated English fragments.
      const alts = [content.hero.imageAlt, content.approach.imageAlt, content.cta.imageAlt, ...content.categories.map(item => item.imageAlt), ...content.inspiration.items.map(item => item.imageAlt)];
      for (const alt of alts) expect(alt.replace(/OLA|WhatsApp/g, "")).not.toMatch(/[A-Za-z]{3,}/);
    }
  });
}

test("Serbian WhatsApp suffix cannot become a one-letter orphan on controls", () => {
  for (const label of [commonSr.Navigation.order, commonSr.Footer.enquiry, weddingsSr.contactWhatsapp]) {
    expect(label).toContain("WhatsApp\u2011a");
    expect(label).not.toContain("WhatsApp-a");
  }
});

test("Weddings uses existing supplied images rather than design-export paths", () => {
  for (const src of Object.values(weddingsImages)) {
    expect(src).toMatch(/^\/assets\/images\/weddings-events\//);
    expect(existsSync(join(process.cwd(), "public", src))).toBe(true);
  }
});
