import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import {
  balloonsCopyStatus,
  balloonsEnglish,
  balloonsImages,
  getBalloonsContent,
} from "@/content/balloons";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, shape(entry)]),
    );
  }
  expect(typeof value).toBe("string");
  expect(String(value).trim()).not.toBe("");
  return "string";
}

for (const locale of ["en", "ru", "sr"] as const) {
  test(`${locale}: Balloons keeps complete copy, stable topics and explicit draft status`, () => {
    const content = getBalloonsContent(locale);
    expect(shape(content)).toEqual(shape(balloonsEnglish));
    expect(content.categories.map((item) => item.id)).toEqual([
      "sets",
      "balloons",
      "gifts",
      "personalised",
    ]);
    expect(content.favourites.items.map((item) => item.id)).toEqual([
      "blush",
      "birthday",
      "colourful",
      "neutral",
    ]);
    expect(content.personalisation.extras.map((item) => item.id)).toEqual([
      "chocolates",
      "teddy",
      "card",
      "personalisation",
    ]);
    expect(balloonsCopyStatus[locale]).toBe(
      locale === "en" ? "figma-source" : "translation-draft",
    );
    for (const title of [content.hero.titleTablet, content.hero.titleDesktop]) {
      expect(title.replace(/\n/g, " ")).toBe(content.hero.title);
    }
    if (locale === "sr")
      expect(JSON.stringify(content)).not.toMatch(/\p{Script=Cyrillic}/u);
    if (locale === "ru") {
      const alts = [
        content.hero.imageAlt,
        content.personalisation.imageAlt,
        content.cta.imageAlt,
        ...content.categories.map((item) => item.imageAlt),
        ...content.favourites.items.map((item) => item.imageAlt),
        ...content.personalisation.extras.map((item) => item.imageAlt),
      ];
      for (const alt of alts)
        expect(alt.replace(/OLA/g, "")).not.toMatch(/[A-Za-z]{3,}/);
    }
  });
}

test("English Balloons copy agrees with the parent-reviewed Figma intake", () => {
  const intake = JSON.parse(
    readFileSync(
      join(process.cwd(), "docs/design/balloons-intake.json"),
      "utf8",
    ),
  );
  expect(balloonsEnglish.hero.title).toBe(intake.hero.mobile.title);
  expect(balloonsEnglish.hero.titleTablet).toBe(intake.hero.tablet.title);
  expect(balloonsEnglish.hero.titleDesktop).toBe(intake.hero.desktop.title);
  expect(balloonsEnglish.hero.body).toBe(intake.hero.body);
  expect(balloonsEnglish.categories.map((item) => item.title)).toEqual(
    intake.categories.labels,
  );
  expect(balloonsEnglish.categories.map((item) => item.description)).toEqual(
    intake.categories.descriptions,
  );
  expect(balloonsEnglish.favourites.items.map((item) => item.title)).toEqual(
    intake.favourites.labels,
  );
  expect(
    balloonsEnglish.personalisation.extras.map((item) => item.title),
  ).toEqual(intake.personalisation.extras);
  expect(balloonsEnglish.cta.title).toBe(intake.cta.heading);
  expect(balloonsEnglish.cta.body).toBe(intake.cta.body);
});

test("Balloons uses all fifteen placements from thirteen existing supplied photos", () => {
  expect(Object.values(balloonsImages)).toHaveLength(15);
  expect(new Set(Object.values(balloonsImages)).size).toBe(13);
  for (const src of Object.values(balloonsImages)) {
    expect(src).toMatch(/^\/assets\/images\//);
    expect(existsSync(join(process.cwd(), "public", src))).toBe(true);
  }
});
