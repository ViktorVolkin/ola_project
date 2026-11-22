import {locale as getRootLocale} from "next/root-params";
import {notFound} from "next/navigation";
import {hasLocale} from "next-intl";
import {getRequestConfig} from "next-intl/server";
import {routing} from "./routing";

const messages = {
  en: () => import("./messages/en.json").then((module) => module.default),
  ru: () => import("./messages/ru.json").then((module) => module.default),
  sr: () => import("./messages/sr.json").then((module) => module.default)
};

const homeMessages = {
  en: () => import("./messages/home/en.json").then((module) => module.default),
  ru: () => import("./messages/home/ru.json").then((module) => module.default),
  sr: () => import("./messages/home/sr.json").then((module) => module.default)
};

const aboutMessages = {
  en: () => import("./messages/about/en.json").then((module) => module.default),
  ru: () => import("./messages/about/ru.json").then((module) => module.default),
  sr: () => import("./messages/about/sr.json").then((module) => module.default)
};

const weddingsMessages = {
  en: () => import("./messages/weddings/en.json").then((module) => module.default),
  ru: () => import("./messages/weddings/ru.json").then((module) => module.default),
  sr: () => import("./messages/weddings/sr.json").then((module) => module.default)
};

const balloonsMessages = {
  en: () => import("./messages/balloons/en.json").then(module => module.default),
  ru: () => import("./messages/balloons/ru.json").then(module => module.default),
  sr: () => import("./messages/balloons/sr.json").then(module => module.default)
};

const contactMessages = {
  en: () => import("./messages/contact/en.json").then(module => module.default),
  ru: () => import("./messages/contact/ru.json").then(module => module.default),
  sr: () => import("./messages/contact/sr.json").then(module => module.default)
};

const bouquetsMessages = {
  en: () => import("./messages/bouquets/en.json").then(module => module.default),
  ru: () => import("./messages/bouquets/ru.json").then(module => module.default),
  sr: () => import("./messages/bouquets/sr.json").then(module => module.default)
};

export default getRequestConfig(async ({locale}) => {
  const requestedLocale = locale ?? await getRootLocale();
  if (!hasLocale(routing.locales, requestedLocale)) notFound();
  const [common, home, about, weddings, balloons, contact, bouquets] = await Promise.all([
    messages[requestedLocale](), homeMessages[requestedLocale](), aboutMessages[requestedLocale](), weddingsMessages[requestedLocale](), balloonsMessages[requestedLocale](), contactMessages[requestedLocale](), bouquetsMessages[requestedLocale]()
  ]);

  return {
    locale: requestedLocale,
    messages: {...common, Home: home, About: about, Weddings: weddings, Balloons: balloons, Contact: contact, Bouquets: bouquets}
  };
});
