import {describe, expect, it} from "vitest";
import {getHomeContent} from "@/content/home";
import before from "../fixtures/i18n-copy-001/home-before.json";
import en from "@/i18n/messages/home/en.json";
import ru from "@/i18n/messages/home/ru.json";
import sr from "@/i18n/messages/home/sr.json";

describe("Home local copy migration", () => {
  it.each(["en", "ru", "sr"] as const)("preserves %s content and uses the page dictionary", locale => {
    const dictionaries = {en, ru, sr};
    expect(getHomeContent(locale)).toEqual(before[locale]);
    expect(getHomeContent(locale)).toBe(dictionaries[locale].content);
  });
});
