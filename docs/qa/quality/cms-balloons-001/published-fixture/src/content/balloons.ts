import type { Locale } from "next-intl";

export const balloonsImages = {
  hero: "/assets/images/home/01_home_hero_florist_balloons_montenegro.jpg",
  sets: "/assets/images/balloons/02_balloons_sets.jpg",
  balloons: "/assets/images/home/02_balloons_gifts.jpg",
  gifts: "/assets/images/balloons/09_balloons_gifts.jpg",
  personalised: "/assets/images/balloons/03_balloons_personalised.jpg",
  blush: "/assets/images/balloons/05_balloons_bouquet.jpg",
  birthday: "/assets/images/balloons/06_balloons_kids.jpg",
  colourful: "/assets/images/balloons/11_balloons_colors.jpg",
  neutral: "/assets/images/balloons/10_balloons_mono.jpg",
  scene: "/assets/images/balloons/04_balloons_deluxe.jpg",
  chocolates: "/assets/images/home/07_chocolates.jpg",
  teddy: "/assets/images/balloons/04_balloons_deluxe.jpg",
  card: "/assets/images/bouquet-detail/10_extra_greeting_card.jpg",
  personalisation: "/assets/images/balloons/03_balloons_personalised.jpg",
  cta: "/assets/images/balloons/07_balloons_event.jpg",
} as const;

export const balloonsCopyStatus = {
  en: "figma-source",
  ru: "translation-draft",
  sr: "translation-draft",
} satisfies Record<Locale, string>;

type CategoryId = "sets" | "balloons" | "gifts" | "personalised";
type FavouriteId = "blush" | "birthday" | "colourful" | "neutral";
type ExtraId = "chocolates" | "teddy" | "card" | "personalisation";

export type BalloonsContent = {
  pageTitle: string;
  hero: {
    title: string;
    titleTablet: string;
    titleDesktop: string;
    body: string;
    imageAlt: string;
  };
  categories: readonly {
    id: CategoryId;
    title: string;
    description: string;
    imageAlt: string;
  }[];
  favourites: {
    eyebrow: string;
    title: string;
    items: readonly { id: FavouriteId; title: string; imageAlt: string }[];
  };
  personalisation: {
    eyebrow: string;
    title: string;
    body: string;
    imageAlt: string;
    extras: readonly { id: ExtraId; title: string; imageAlt: string }[];
  };
  cta: { title: string; body: string; imageAlt: string };
};

// Exact visible English copy from the accepted Figma reference; supplied mock
// photos do not establish actual OLA commissions or product availability.
export const balloonsEnglish: BalloonsContent = {
  pageTitle: "Balloons & Gifts",
  hero: {
    title: "Balloons and gifts for special moments.",
    titleTablet: "Balloons and gifts for\nspecial moments.",
    titleDesktop: "Balloons and\ngifts for special\nmoments.",
    body: "Thoughtful balloons and gifts for the moments worth celebrating.",
    imageAlt:
      "A florist holding flowers beside balloons, with the coast behind her.",
  },
  categories: [
    {
      id: "sets",
      title: "Balloon sets",
      description: "Thoughtful balloon combinations for special moments.",
      imageAlt: "A decorative balloon arrangement.",
    },
    {
      id: "balloons",
      title: "Balloons only",
      description: "Ask about balloons on their own.",
      imageAlt: "Pink and rose-gold balloons.",
    },
    {
      id: "gifts",
      title: "Gifts & extras",
      description: "Small details to complete your gift.",
      imageAlt: "Small gifts displayed together.",
    },
    {
      id: "personalised",
      title: "Personalised balloons",
      description: "Ask about adding a personal message.",
      imageAlt: "A balloon with decorative lettering.",
    },
  ],
  favourites: {
    eyebrow: "POPULAR BALLOON SETS",
    title: "Our favourites",
    items: [
      {
        id: "blush",
        title: "Blush celebration",
        imageAlt: "A celebration arrangement with pink balloons.",
      },
      {
        id: "birthday",
        title: "Birthday celebration",
        imageAlt: "Balloons arranged for a birthday setting.",
      },
      {
        id: "colourful",
        title: "Colourful celebration",
        imageAlt: "A colourful balloon arrangement.",
      },
      {
        id: "neutral",
        title: "Neutral celebration",
        imageAlt: "A balloon arrangement in neutral tones.",
      },
    ],
  },
  personalisation: {
    eyebrow: "ADD SOMETHING SPECIAL",
    title: "Make it more personal.",
    body: "Choose a thoughtful extra to make your gift feel personal.",
    imageAlt: "Balloons and gifts with a plush teddy bear.",
    extras: [
      {
        id: "chocolates",
        title: "Chocolates",
        imageAlt: "A gift box of chocolates.",
      },
      {
        id: "teddy",
        title: "Teddy bears",
        imageAlt: "A plush teddy bear among gifts.",
      },
      {
        id: "card",
        title: "Greeting cards",
        imageAlt: "A greeting card with decorative details.",
      },
      {
        id: "personalisation",
        title: "Personalisation",
        imageAlt: "Decorative lettering on a balloon.",
      },
    ],
  },
  cta: {
    title: "Flowers, balloons and so much more.",
    body: "Thoughtful details, brought together for the moments that matter.",
    imageAlt: "Balloons and flowers arranged for a celebration.",
  },
};

// Editorial translation drafts, not owner-approved publication copy.
export const balloonsRussian: BalloonsContent = {
  pageTitle: "Шары и подарки",
  hero: {
    title: "Шары и подарки для особенных моментов.",
    titleTablet: "Шары и подарки для особенных моментов.",
    titleDesktop: "Шары и подарки для особенных моментов.",
    body: "Воздушные шары и подарки для моментов, которые хочется отметить.",
    imageAlt: "Флорист с цветами рядом с воздушными шарами на фоне побережья.",
  },
  categories: [
    {
      id: "sets",
      title: "Наборы шаров",
      description: "Подобранные сочетания шаров для особенных моментов.",
      imageAlt: "Декоративная композиция из воздушных шаров.",
    },
    {
      id: "balloons",
      title: "Только шары",
      description: "Узнайте о воздушных шарах отдельно от наборов.",
      imageAlt: "Розовые и розово-золотые воздушные шары.",
    },
    {
      id: "gifts",
      title: "Подарки и дополнения",
      description: "Небольшие детали, которые дополнят ваш подарок.",
      imageAlt: "Небольшие подарки, собранные вместе.",
    },
    {
      id: "personalised",
      title: "Шары с надписями",
      description: "Узнайте о возможности добавить личную надпись.",
      imageAlt: "Воздушный шар с декоративной надписью.",
    },
  ],
  favourites: {
    eyebrow: "ПОПУЛЯРНЫЕ НАБОРЫ ШАРОВ",
    title: "Наши фавориты",
    items: [
      {
        id: "blush",
        title: "Праздник в розовых тонах",
        imageAlt: "Праздничная композиция с розовыми воздушными шарами.",
      },
      {
        id: "birthday",
        title: "День рождения",
        imageAlt: "Воздушные шары для празднования дня рождения.",
      },
      {
        id: "colourful",
        title: "Яркий праздник",
        imageAlt: "Разноцветная композиция из воздушных шаров.",
      },
      {
        id: "neutral",
        title: "Праздник в нейтральных тонах",
        imageAlt: "Композиция из воздушных шаров нейтральных оттенков.",
      },
    ],
  },
  personalisation: {
    eyebrow: "ДОБАВЬТЕ ЧТО-ТО ОСОБЕННОЕ",
    title: "Добавьте личный штрих.",
    body: "Выберите особенное дополнение, которое сделает подарок более личным.",
    imageAlt: "Воздушные шары и подарки с плюшевым мишкой.",
    extras: [
      {
        id: "chocolates",
        title: "Шоколад",
        imageAlt: "Подарочная коробка шоколадных конфет.",
      },
      {
        id: "teddy",
        title: "Плюшевые мишки",
        imageAlt: "Плюшевый мишка среди подарков.",
      },
      {
        id: "card",
        title: "Открытки",
        imageAlt: "Поздравительная открытка с декоративными деталями.",
      },
      {
        id: "personalisation",
        title: "Персонализация",
        imageAlt: "Декоративная надпись на воздушном шаре.",
      },
    ],
  },
  cta: {
    title: "Цветы, шары и многое другое.",
    body: "Продуманные детали для моментов, которые действительно важны.",
    imageAlt: "Воздушные шары и цветы для праздника.",
  },
};

export const balloonsSerbian: BalloonsContent = {
  pageTitle: "Baloni i pokloni",
  hero: {
    title: "Baloni i pokloni za posebne trenutke.",
    titleTablet: "Baloni i pokloni za posebne trenutke.",
    titleDesktop: "Baloni i pokloni za posebne trenutke.",
    body: "Pažljivo odabrani baloni i pokloni za trenutke vredne slavlja.",
    imageAlt: "Cvećarka sa cvećem pored balona, sa obalom u pozadini.",
  },
  categories: [
    {
      id: "sets",
      title: "Setovi balona",
      description: "Pažljivo odabrane kombinacije balona za posebne trenutke.",
      imageAlt: "Dekorativna kompozicija od balona.",
    },
    {
      id: "balloons",
      title: "Samo baloni",
      description: "Raspitajte se o balonima odvojeno od setova.",
      imageAlt: "Ružičasti baloni i baloni boje ružičastog zlata.",
    },
    {
      id: "gifts",
      title: "Pokloni i dodaci",
      description: "Mali detalji koji upotpunjuju vaš poklon.",
      imageAlt: "Mali pokloni prikazani zajedno.",
    },
    {
      id: "personalised",
      title: "Personalizovani baloni",
      description: "Raspitajte se o dodavanju lične poruke.",
      imageAlt: "Balon sa ukrasnim natpisom.",
    },
  ],
  favourites: {
    eyebrow: "POPULARNI SETOVI BALONA",
    title: "Naši favoriti",
    items: [
      {
        id: "blush",
        title: "Proslava u ružičastim tonovima",
        imageAlt: "Svečani aranžman sa ružičastim balonima.",
      },
      {
        id: "birthday",
        title: "Rođendanska proslava",
        imageAlt: "Baloni za rođendansku proslavu.",
      },
      {
        id: "colourful",
        title: "Šarena proslava",
        imageAlt: "Aranžman sa raznobojnim balonima.",
      },
      {
        id: "neutral",
        title: "Proslava u neutralnim tonovima",
        imageAlt: "Aranžman sa balonima neutralnih boja.",
      },
    ],
  },
  personalisation: {
    eyebrow: "DODAJTE NEŠTO POSEBNO",
    title: "Učinite poklon ličnijim.",
    body: "Odaberite poseban dodatak koji će vašem poklonu dati lični pečat.",
    imageAlt: "Baloni i pokloni sa plišanim medvedićem.",
    extras: [
      {
        id: "chocolates",
        title: "Čokolade",
        imageAlt: "Poklon-kutija čokoladnih pralina.",
      },
      {
        id: "teddy",
        title: "Plišani medvedići",
        imageAlt: "Plišani medvedić među poklonima.",
      },
      {
        id: "card",
        title: "Čestitke",
        imageAlt: "Čestitka sa ukrasnim detaljima.",
      },
      {
        id: "personalisation",
        title: "Personalizacija",
        imageAlt: "Ukrasni natpis na balonu.",
      },
    ],
  },
  cta: {
    title: "Cveće, baloni i još mnogo toga.",
    body: "Pažljivo uklopljeni detalji za trenutke koji su vam važni.",
    imageAlt: "Baloni i cveće aranžirani za proslavu.",
  },
};

const content = {
  en: balloonsEnglish,
  ru: balloonsRussian,
  sr: balloonsSerbian,
} satisfies Record<Locale, BalloonsContent>;

export function getBalloonsContent(locale: Locale): BalloonsContent {
  return content[locale];
}
