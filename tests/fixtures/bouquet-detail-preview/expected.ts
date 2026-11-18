// Expected visible labels for the bouquet-detail preview route, per locale.
// EN labels are verified against the native Figma design. RU/SR eyebrow labels
// are drafts for the design phase (business copy not approved); h1 labels are
// the existing approved local detail titles reused for the preview.
export const previewExpected = {
  en: { h1: "Soft Romance", eyebrow: "BOUQUET DETAILS", back: "/en/bouquets" },
  ru: {
    h1: "Нежная романтика",
    eyebrow: "ДЕТАЛИ БУКЕТА",
    back: "/ru/bouquets",
  },
  sr: {
    h1: "Nežna romantika",
    eyebrow: "DETALJI BUKETA",
    back: "/sr/bouquets",
  },
} as const;
