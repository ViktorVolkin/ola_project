import {createElement, type ReactNode} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {getAboutContent} from "@/content/about";
import {getWeddingsContent} from "@/content/weddings";
import {getBalloonsContent} from "@/content/balloons";
import {detailMessages} from "@/components/pages/BouquetDetailPage/mock-data";
import before from "../fixtures/i18n-copy-001/remaining-before.json";
import en from "@/i18n/messages/en.json";
import ru from "@/i18n/messages/ru.json";
import sr from "@/i18n/messages/sr.json";
vi.mock("next/link", () => ({default: ({children}: {children: ReactNode}) => createElement("a", null, children)}));
import {CmsPreviewStatus} from "@/components/shared/CmsPreviewStatus";
import {HomePreviewStatus} from "@/components/widgets/HomeBlocks/HomeCommon/HomePreviewStatus/HomePreviewStatus";

const common = {en, ru, sr};
describe("remaining copy migration", () => {
  it.each(["en", "ru", "sr"] as const)("preserves %s getter structures, detail and preview", locale => {
    expect(getAboutContent(locale)).toEqual(before.pages.about[locale]);
    expect(getWeddingsContent(locale)).toEqual(before.pages.weddings[locale]);
    expect(getBalloonsContent(locale)).toEqual(before.pages.balloons[locale]);
    for (const key of ["intro", "labels", "content", "galleryLabels"] as const) expect(detailMessages[locale][key]).toEqual(before.bouquet[key][locale]);
    expect(common[locale].CmsPreview).toEqual(before.preview[locale]);
    const html = renderToStaticMarkup(createElement(CmsPreviewStatus, {locale, route: "/about", preview: {error: "configuration"}, testId: "data-test"}));
    expect(html).toContain(before.preview[locale].configuration);
    const home = renderToStaticMarkup(createElement(HomePreviewStatus, {locale, fallbackPaths: ["hero.title"]}));
    expect(home).toContain("Incomplete draft: 1 fields show same-language published/local fallback");
  });
  it("keeps message keys and placeholders aligned", () => {
    const shape = (v: unknown): unknown => Array.isArray(v) ? v.map(shape) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x)])) : typeof v;
    expect(shape(detailMessages.ru)).toEqual(shape(detailMessages.en));
    expect(shape(detailMessages.sr)).toEqual(shape(detailMessages.en));
  });
});
