import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru", "sr"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false
});

export const languageTags = {en: "en", ru: "ru", sr: "sr-Latn"} as const;
