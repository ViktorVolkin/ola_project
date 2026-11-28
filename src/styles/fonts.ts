import {Cormorant_Garamond, Great_Vibes, Manrope} from "next/font/google";

export const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: "variable",
  variable: "--font-manrope",
  display: "swap"
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false
});

export const greatVibes = Great_Vibes({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
  preload: false
});
