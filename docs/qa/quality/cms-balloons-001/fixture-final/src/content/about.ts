import type {Locale} from "next-intl";

export const aboutImages = {
  hero: "/assets/images/about/01_hero.jpg",
  story: "/assets/images/about/02_our_story.jpg",
  style: ["/assets/images/about/08_style_flowers.jpg", "/assets/images/about/09_style_packaging.jpg", "/assets/images/about/10_style_lightness.jpg"],
  why: "/assets/images/about/11_why_choose_ola.jpg",
  cta: "/assets/images/about/12_final_cta.jpg",
  botanical: "/assets/decorative/story_botanical_transparent.png"
} as const;

export const aboutCopyStatus = {en: "figma-source", ru: "translation-draft", sr: "translation-draft"} as const;

type AboutContent = {
  hero: {eyebrow: string; title: string; body: string; handwritten: string; alt: string};
  story: {eyebrow: string; title: string; paragraphs: readonly [string, string]; signature: string; imageAlt: string; botanicalAlt: string};
  principles: readonly {label: string; icon: string}[];
  style: {eyebrow: string; title: string; body: string; imageAlts: readonly [string, string, string]};
  why: {eyebrow: string; title: string; body: string; imageOverlay: string; imageAlt: string; reasons: readonly {title: string; description: string; icon: string}[]};
  cta: {eyebrow: string; title: string; body: string; imageOverlay: string; imageAlt: string};
};

const content = {
  en: {
    hero: {eyebrow: "ABOUT OLA", title: "Flowers with meaning.", body: "Considered floral design for the people and moments you hold close.", handwritten: "More than just\nflowers", alt: "A floral scene with a bouquet and soft natural light."},
    story: {eyebrow: "OUR STORY", title: "Inspired by people, places and moments.", paragraphs: ["We create floral arrangements with a natural, modern point of view. Each design begins with considered choices of colour, texture and shape.", "From the first stem to the final wrap, each composition is shaped around its palette, silhouette and the feeling of the occasion."], signature: "Montenegro\nin every\nbouquet", imageAlt: "A natural floral arrangement in a light-filled setting.", botanicalAlt: ""},
    principles: [{label:"Seasonal\nflowers",icon:"seasonal_flower.svg"},{label:"Thoughtful\nfloral details",icon:"selected_flowers.svg"},{label:"Individual\ndesign",icon:"pencil.svg"},{label:"Personal\napproach",icon:"heart.svg"}],
    style: {eyebrow:"OUR STYLE",title:"Natural. Modern.\nWith heart.",body:"Expressive flowers, considered palettes and thoughtful details shape the OLA aesthetic.",imageAlts:["Expressive seasonal flowers in the OLA style.","Thoughtful floral wrapping and packaging details.","Light, airy flowers arranged with a natural feel."]},
    why: {eyebrow:"WHY CHOOSE OLA",title:"Thoughtful details make\nthe difference.",body:"Colour, form and texture come together in arrangements designed to feel considered and personal.",imageOverlay:"Flowers for\nbeautiful\nplaces",imageAlt:"A coastal town, water and mountains framed by flowers.",reasons:[{title:"Considered colour",description:"Balanced tones leave room for expression.",icon:"seasonal_flower.svg"},{title:"Distinctive composition",description:"Form, texture and detail shape a whole.",icon:"pencil.svg"},{title:"Considered finishing",description:"Small choices complete the composition.",icon:"leaf.svg"},{title:"Personal starting point",description:"A personal start for the feeling you want.",icon:"heart.svg"}]},
    cta:{eyebrow:"LET’S CREATE TOGETHER",title:"Tell us about\nyour idea.",body:"Share a little about the moment, mood or details you have in mind.",imageOverlay:"Special moments\nstart here",imageAlt:"A collection of flowers for a special moment."}
  },
  ru: {
    hero: {eyebrow:"ОБ OLA",title:"Цветы со смыслом.",body:"Продуманный цветочный дизайн для дорогих вам людей и важных моментов.",handwritten:"Больше, чем\nпросто цветы",alt:"Цветочная композиция с букетом в мягком естественном свете."},
    story: {eyebrow:"НАША ИСТОРИЯ",title:"Нас вдохновляют люди, места и моменты.",paragraphs:["Мы создаём цветочные композиции с естественным современным характером. Каждый дизайн начинается с продуманного выбора цвета, фактуры и формы.","От первого стебля до завершающей упаковки композиция складывается из палитры, силуэта и настроения события."],signature:"Черногория\nв каждом\nбукете",imageAlt:"Естественная цветочная композиция в светлом пространстве.",botanicalAlt:""},
    principles:[{label:"Сезонные цветы",icon:"seasonal_flower.svg"},{label:"Внимание к деталям",icon:"selected_flowers.svg"},{label:"Индивидуальный дизайн",icon:"pencil.svg"},{label:"Личный подход",icon:"heart.svg"}],
    style:{eyebrow:"НАШ СТИЛЬ",title:"Естественно. Современно. С душой.",body:"Выразительные цветы, продуманные палитры и детали формируют эстетику OLA.",imageAlts:["Выразительные сезонные цветы в стиле OLA.","Продуманная упаковка и цветочные детали.","Лёгкие воздушные цветы в естественном оформлении."]},
    why:{eyebrow:"ПОЧЕМУ OLA",title:"Внимание к деталям меняет всё.",body:"Цвет, форма и фактура соединяются в композициях, созданных с вниманием и личным подходом.",imageOverlay:"Цветы для\nособенных\nмест",imageAlt:"Цветочная композиция для особенного места.",reasons:[{title:"Продуманный цвет",description:"Сбалансированные оттенки оставляют место самовыражению.",icon:"seasonal_flower.svg"},{title:"Выразительная композиция",description:"Форма, фактура и детали создают целостный образ.",icon:"pencil.svg"},{title:"Завершённость деталей",description:"Небольшие решения дополняют композицию.",icon:"leaf.svg"},{title:"Личный отправной пункт",description:"Начинаем с ваших пожеланий и настроения.",icon:"heart.svg"}]},
    cta:{eyebrow:"СОЗДАДИМ ВМЕСТЕ",title:"Расскажите о своей идее.",body:"Поделитесь моментом, настроением или деталями, которые вы задумали.",imageOverlay:"Особенные моменты\nначинаются здесь",imageAlt:"Цветы для особенного момента."}
  },
  sr: {
    hero:{eyebrow:"O OLA STUDIJU",title:"Cveće sa značenjem.",body:"Promišljen cvetni dizajn za ljude i trenutke koji su vam važni.",handwritten:"Više od samog\ncveća",alt:"Cvetna scena sa buketom i mekim prirodnim svetlom."},
    story:{eyebrow:"NAŠA PRIČA",title:"Inspiraciju nalazimo u ljudima, mestima i trenucima.",paragraphs:["Kreiramo cvetne aranžmane prirodnog i savremenog izraza. Svaki dizajn počinje pažljivim izborom boje, teksture i oblika.","Od prve stabljike do završnog pakovanja, kompoziciju oblikuju paleta, silueta i osećaj koji trenutak nosi."],signature:"Crna Gora\nu svakom\nbuketu",imageAlt:"Prirodan cvetni aranžman u svetlom prostoru.",botanicalAlt:""},
    principles:[{label:"Sezonsko cveće",icon:"seasonal_flower.svg"},{label:"Pažljivo odabrani detalji",icon:"selected_flowers.svg"},{label:"Individualni dizajn",icon:"pencil.svg"},{label:"Lični pristup",icon:"heart.svg"}],
    style:{eyebrow:"NAŠ STIL",title:"Prirodno. Savremeno. S ljubavlju.",body:"Izražajno cveće, promišljene palete i pažljivi detalji oblikuju estetiku OLA studija.",imageAlts:["Izražajno sezonsko cveće u stilu OLA studija.","Pažljivo cvetno pakovanje i detalji.","Lagano i prozračno cveće prirodnog izgleda."]},
    why:{eyebrow:"ZAŠTO OLA",title:"Pažljivi detalji čine razliku.",body:"Boja, forma i tekstura spajaju se u aranžmanima koji deluju promišljeno i lično.",imageOverlay:"Cveće za\nposebna\nmesta",imageAlt:"Cvetni aranžman za posebno mesto.",reasons:[{title:"Promišljena boja",description:"Usklađeni tonovi ostavljaju prostor za izraz.",icon:"seasonal_flower.svg"},{title:"Osmišljena kompozicija",description:"Forma, tekstura i detalji čine celinu.",icon:"pencil.svg"},{title:"Pažljiva završna obrada",description:"Mali izbori zaokružuju kompoziciju.",icon:"leaf.svg"},{title:"Lični početak",description:"Počinjemo od osećaja koji želite da prenesete.",icon:"heart.svg"}]},
    cta:{eyebrow:"KREIRAJMO ZAJEDNO",title:"Recite nam svoju ideju.",body:"Podelite trenutak, raspoloženje ili detalje koje imate na umu.",imageOverlay:"Posebni trenuci\npočinju ovde",imageAlt:"Cveće za poseban trenutak."}
  }
} satisfies Record<Locale, AboutContent>;

export function getAboutContent(locale: Locale): AboutContent { return content[locale]; }
