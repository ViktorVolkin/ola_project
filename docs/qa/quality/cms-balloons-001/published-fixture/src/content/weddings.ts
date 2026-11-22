import type {Locale} from "next-intl";

export const weddingsImages = {
  hero: "/assets/images/weddings-events/05_weddings_hero.jpg",
  weddings: "/assets/images/weddings-events/01_weddings_bride.jpg",
  private: "/assets/images/weddings-events/02_weddings_private.jpg",
  corporate: "/assets/images/weddings-events/03_weddings_corporate.jpg",
  rentals: "/assets/images/weddings-events/04_weddings_rentals.jpg",
  approach: "/assets/images/weddings-events/12_weddings_floral_centerpiece.jpg",
  ceremony: "/assets/images/weddings-events/11_weddings_ceremony.jpg",
  dinner: "/assets/images/weddings-events/07_weddings_private_dinner.jpg",
  engagement: "/assets/images/weddings-events/08_weddings_engagement.jpg",
  gathering: "/assets/images/weddings-events/09_weddings_corporate_event.jpg"
} as const;

export const weddingsCopyStatus = {
  en: "figma-source", ru: "translation-draft", sr: "translation-draft"
} satisfies Record<Locale, string>;

export type WeddingsContent = {
  hero: {title: string; lead: string; body: string; handwritten: string; imageAlt: string};
  categories: readonly {id: "weddings" | "private" | "corporate" | "rentals"; title: string; description: string; imageAlt: string}[];
  approach: {eyebrow: string; title: string; body: string; imageAlt: string};
  process: {eyebrow: string; title: string; steps: readonly {title: string; description: string}[]};
  inspiration: {eyebrow: string; title: string; items: readonly {id: "ceremony" | "dinner" | "engagement" | "gathering"; caption: string; imageAlt: string}[]};
  cta: {eyebrow: string; title: string; body: string; handwritten: string; imageAlt: string};
};

// Visible English text from the six native Figma sections; image alternatives
// describe the supplied preview photos rather than claiming actual OLA projects.
export const weddingsEnglish: WeddingsContent = {
  hero: {
    title: "Weddings\n& Events",
    lead: "Flowers for life’s biggest moments.",
    body: "Floral ideas for intimate gatherings and grand celebrations, inspired by your style and Montenegro.",
    handwritten: "Unforgettable\nMoments",
    imageAlt: "A celebration table with flowers and glassware."
  },
  categories: [
    {id: "weddings", title: "Weddings", description: "Bridal bouquets, ceremony and venue flowers.", imageAlt: "A bride holding a floral bouquet."},
    {id: "private", title: "Private Events", description: "Floral ideas for birthdays, anniversaries and engagements.", imageAlt: "Flowers and table details for a private celebration."},
    {id: "corporate", title: "Corporate Events", description: "Floral styling ideas for business gatherings.", imageAlt: "Floral details in an event setting."},
    {id: "rentals", title: "Event Rentals", description: "Ask about arches and event styling details.", imageAlt: "Decorative details for an event setting."}
  ],
  approach: {
    eyebrow: "OUR APPROACH", title: "Every event\nis a unique story.",
    body: "Tell us about the atmosphere you imagine. Together, we can explore flowers, colours and details that reflect your style.",
    imageAlt: "A floral centerpiece arranged for a celebration table."
  },
  process: {
    eyebrow: "OUR PROCESS", title: "A thoughtful process, from first conversation to event day.",
    steps: [
      {title: "Consultation", description: "Tell us about your event, style and wishes."},
      {title: "Design proposal", description: "Explore a floral direction, palette and moodboard."},
      {title: "Preparation", description: "Plan the floral details, materials and finishing touches."},
      {title: "Event day", description: "Discuss timing, delivery and on-site arrangements."}
    ]
  },
  inspiration: {
    eyebrow: "EVENT INSPIRATION", title: "Moments to imagine.",
    items: [
      {id: "ceremony", caption: "Wedding ceremony", imageAlt: "A flower-decorated wedding ceremony setting."},
      {id: "dinner", caption: "Private dinner", imageAlt: "A dinner table with flowers and decorative details."},
      {id: "engagement", caption: "Engagement", imageAlt: "Flowers arranged for an intimate celebration."},
      {id: "gathering", caption: "Corporate gathering", imageAlt: "Floral decor in a gathering space."}
    ]
  },
  cta: {
    eyebrow: "LET’S PLAN TOGETHER", title: "Tell us about\nyour event",
    body: "Share your event ideas, date and location to start the conversation.",
    handwritten: "More than just\nflowers", imageAlt: "A bride with a floral bouquet."
  }
};

// Visible Russian text as explicit draft content; faithful UI translations.
export const weddingsRussian: WeddingsContent = {
  hero: {
    title: "Свадьбы\nи события",
    lead: "Цветы для самых важных моментов жизни.",
    body: "Цветочные идеи для камерных встреч и масштабных торжеств, вдохновлённые вашим стилем и Черногорией.",
    handwritten: "Незабываемые\nмоменты",
    imageAlt: "Стол для праздника с цветами и бокалами."
  },
  categories: [
    {id: "weddings", title: "Свадьбы", description: "Букеты невесты, цветы для церемонии и места проведения.", imageAlt: "Невеста с цветочным букетом."},
    {id: "private", title: "Частные мероприятия", description: "Цветочные идеи для дней рождения, юбилеев и помолвок.", imageAlt: "Цветы и детали стола для частного праздника."},
    {id: "corporate", title: "Корпоративные мероприятия", description: "Идеи цветочного оформления для деловых встреч.", imageAlt: "Цветочные детали в месте проведения мероприятия."},
    {id: "rentals", title: "Аренда для мероприятий", description: "Узнайте об арках и деталях оформления мероприятий.", imageAlt: "Декоративные детали для места проведения мероприятия."}
  ],
  approach: {
    eyebrow: "НАШ ПОДХОД", title: "Каждое событие —\nуникальная история.",
    body: "Расскажите, какую атмосферу вы представляете. Вместе мы можем подобрать цветы, цвета и детали, отражающие ваш стиль.",
    imageAlt: "Цветочная композиция для стола праздника."
  },
  process: {
    eyebrow: "НАШ ПРОЦЕСС", title: "Продуманный процесс — от первой беседы до дня мероприятия.",
    steps: [
      {title: "Консультация", description: "Расскажите нам о своем мероприятии, стиле и пожеланиях."},
      {title: "Дизайн-концепция", description: "Обсудите идеи цветочного оформления, палитру и мудборд."},
      {title: "Подготовка", description: "Спланируйте цветочные детали, материалы и финальные штрихи."},
      {title: "День мероприятия", description: "Обсудите время, доставку и организацию на месте."}
    ]
  },
  inspiration: {
    eyebrow: "ВДОХНОВЕНИЕ ДЛЯ СОБЫТИЙ", title: "Представьте эти моменты.",
    items: [
      {id: "ceremony", caption: "Свадебная церемония", imageAlt: "Место свадебной церемонии, украшенное цветами."},
      {id: "dinner", caption: "Частный ужин", imageAlt: "Стол с ужином и цветочными декоративными деталями."},
      {id: "engagement", caption: "Помолвка", imageAlt: "Цветы для камерного праздника."},
      {id: "gathering", caption: "Корпоративная встреча", imageAlt: "Цветочный декор в пространстве для встреч."}
    ]
  },
  cta: {
    eyebrow: "СПЛАНИРУЕМ ВМЕСТЕ", title: "Расскажите о\nвашем мероприятии",
    body: "Поделитесь идеями своего мероприятия, датой и местом, чтобы начать диалог.",
    handwritten: "Больше, чем\nцветы", imageAlt: "Невеста с цветочным букетом."
  }
};

// Visible Serbian Latin text as explicit draft content; faithful UI translations.
export const weddingsSerbian: WeddingsContent = {
  hero: {
    title: "Venčanja\ni događaji",
    lead: "Cveće za najvažnije trenutke života.",
    body: "Cvetne ideje za intimna okupljanja i velike proslave, inspirisane vašim stilom i Crnom Gorom.",
    handwritten: "Nezaboravni\ntrenuci",
    imageAlt: "Sto za proslavu sa cvećem i čašama."
  },
  categories: [
    {id: "weddings", title: "Venčanja", description: "Bidermajeri i cveće za ceremoniju i prostor proslave.", imageAlt: "Mlada sa cvetnim buketom."},
    {id: "private", title: "Privatni događaji", description: "Cvetne ideje za rođendane, godišnjice i veridbe.", imageAlt: "Cveće i detalji stola za privatnu proslavu."},
    {id: "corporate", title: "Poslovni događaji", description: "Ideje cvetnog uređenja za poslovne skupove.", imageAlt: "Cvetni detalji u okruženju događaja."},
    {id: "rentals", title: "Iznajmljivanje za događaje", description: "Pitajte o lukovima i detaljima uređenja događaja.", imageAlt: "Ukrasni detalji u prostoru za događaj."}
  ],
  approach: {
    eyebrow: "NAŠ PRISTUP", title: "Svaki događaj je\njedinstvena priča.",
    body: "Recite nam kakvu atmosferu zamišljate. Zajedno možemo istražiti cveće, boje i detalje koji odražavaju vaš stil.",
    imageAlt: "Cvetni aranžman na stolu za proslavu."
  },
  process: {
    eyebrow: "NAŠ PROCES", title: "Promišljen proces, od prvog razgovora do dana događaja.",
    steps: [
      {title: "Konsultacija", description: "Recite nam o svom događaju, stilu i željama."},
      {title: "Predlog dizajna", description: "Istražite cvetni pravac, paletu i moodboard."},
      {title: "Priprema", description: "Planirajte cvetne detalje, materijale i završne detalje."},
      {title: "Dan događaja", description: "Razgovarajte o vremenu, isporuci i organizaciji na licu mesta."}
    ]
  },
  inspiration: {
    eyebrow: "IDEJE ZA INSPIRACIJU", title: "Trenuci za maštanje.",
    items: [
      {id: "ceremony", caption: "Svadbena ceremonija", imageAlt: "Mesto svadbene ceremonije ukrašeno cvećem."},
      {id: "dinner", caption: "Privatna večera", imageAlt: "Sto za večeru sa cvećem i ukrasnim detaljima."},
      {id: "engagement", caption: "Veridba", imageAlt: "Cveće za intimnu proslavu."},
      {id: "gathering", caption: "Poslovno okupljanje", imageAlt: "Cvetni dekor u prostoru za okupljanje."}
    ]
  },
  cta: {
    eyebrow: "PLANIRAJMO ZAJEDNO", title: "Recite nam o\nsvom događaju",
    body: "Podelite ideje za svoj događaj, datum i lokaciju da započnemo razgovor.",
    handwritten: "Više od samog\ncveća", imageAlt: "Mlada sa cvetnim buketom."
  }
};

export function getWeddingsContent(locale: Locale): WeddingsContent {
  const contentMap: Record<Locale, WeddingsContent> = {
    en: weddingsEnglish,
    ru: weddingsRussian,
    sr: weddingsSerbian
  };
  return contentMap[locale];
}
