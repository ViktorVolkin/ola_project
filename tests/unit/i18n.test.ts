import {hasLocale} from "next-intl";
import {describe, expect, test} from "vitest";
import {getPathname} from "@/i18n/navigation";
import {languageTags, routing} from "@/i18n/routing";
import en from "@/i18n/messages/en.json";
import ru from "@/i18n/messages/ru.json";
import sr from "@/i18n/messages/sr.json";
import homeEn from "@/i18n/messages/home/en.json";
import homeRu from "@/i18n/messages/home/ru.json";
import homeSr from "@/i18n/messages/home/sr.json";
import aboutEn from "@/i18n/messages/about/en.json";
import aboutRu from "@/i18n/messages/about/ru.json";
import aboutSr from "@/i18n/messages/about/sr.json";
import weddingsEn from "@/i18n/messages/weddings/en.json";
import weddingsRu from "@/i18n/messages/weddings/ru.json";
import weddingsSr from "@/i18n/messages/weddings/sr.json";
import balloonsEn from "@/i18n/messages/balloons/en.json";
import balloonsRu from "@/i18n/messages/balloons/ru.json";
import balloonsSr from "@/i18n/messages/balloons/sr.json";

describe("locale contract", () => {
  test("only EN, RU and SR are supported; URL is the source of locale", () => {
    expect(routing.locales).toEqual(["en", "ru", "sr"]);
    expect(routing.defaultLocale).toBe("en");
    expect(routing.localePrefix).toBe("always");
    expect(routing.localeDetection).toBe(false);
    expect(routing.localeCookie).toBe(false);
    expect(hasLocale(routing.locales, "fr")).toBe(false);
    expect(hasLocale(routing.locales, "en-US")).toBe(false);
    expect(languageTags.sr).toBe("sr-Latn");
  });

  test.each(routing.locales)("%s links preserve the shared product slug without a trailing slash", (locale) => {
    expect(getPathname({locale, href: "/bouquets/rose"})).toBe(`/${locale}/bouquets/rose`);
    expect(getPathname({locale, href: "/"})).toBe(`/${locale}`);
  });

  test("all dictionaries have the same non-empty message structure", () => {
    function shape(value: Record<string, unknown>): Record<string, unknown> {
      return Object.fromEntries(Object.entries(value).map(([key, entry]) => {
        if (typeof entry === "string") {
          expect(entry.trim().length).toBeGreaterThan(0);
          return [key, "string"];
        }
        expect(entry).toBeTypeOf("object");
        return [key, shape(entry as Record<string, unknown>)];
      }));
    }
    for (const bundle of [{en, ru, sr}, {en: homeEn, ru: homeRu, sr: homeSr}, {en: aboutEn, ru: aboutRu, sr: aboutSr}, {en: weddingsEn, ru: weddingsRu, sr: weddingsSr}, {en: balloonsEn, ru: balloonsRu, sr: balloonsSr}]) {
      expect(shape(bundle.ru)).toEqual(shape(bundle.en));
      expect(shape(bundle.sr)).toEqual(shape(bundle.en));
      expect(JSON.stringify(bundle.sr)).not.toMatch(/\p{Script=Cyrillic}/u);
    }
  });
});
