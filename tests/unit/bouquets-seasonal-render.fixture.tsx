import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {bouquetTextKeys, parseBouquets, type BouquetCopy} from "@/content/sanity/bouquets";

const state = vi.hoisted(() => ({locale: "en", images: {} as Record<string, unknown>}));
vi.mock("server-only", () => ({}));
vi.mock("next/image", () => ({default: (props: Record<string, unknown>) => createElement("img", props)}));
vi.mock("next-sanity", () => ({createDataAttribute: ({path}: {path: string}) => ({toString: () => path})}));
vi.mock("next-intl/server", () => ({getLocale: async () => state.locale, getMessages: async () => ({Bouquets: {}})}));
vi.mock("@/content/resolver/bouquets", () => ({resolveBouquetsContent: async () => ({source: "preview", preview: null, images: state.images, content: Object.fromEntries(["spring", "summer", "autumn", "winter"].map(k => [k, `${state.locale}-${k}`]))})}));
vi.mock("@/components/widgets/BouquetsHero/BouquetsHero", () => ({BouquetsHero: () => null}));
vi.mock("@/components/widgets/BouquetsInspiration/BouquetsInspiration", () => ({BouquetsInspiration: () => null}));
vi.mock("@/components/widgets/EnquiryLink/EnquiryLink", () => ({EnquiryLink: () => null}));
vi.mock("@/components/pages/BouquetsPage/BouquetFragmentFocus", () => ({BouquetFragmentFocus: () => null}));
vi.mock("@/components/shared/CmsPreviewStatus", () => ({CmsPreviewStatus: () => null}));
import BouquetsPage from "@/components/pages/BouquetsPage/BouquetsPage";

const keys = ["seasonalSpring", "seasonalSummer", "seasonalAutumn", "seasonalWinter"] as const;
const local = Object.fromEntries(bouquetTextKeys.map(key => [key, key])) as BouquetCopy;
const imageFields = Object.fromEntries(keys.map((key, i) => [key, {asset: {_ref: `image-${String(i + 1).repeat(40)}-1200x900-jpg`}, hotspot: {x: 0.3, y: 0.4, width: 0.2, height: 0.2}}]));
const parsed = parseBouquets({_id: "bouquetsPage", _type: "bouquetsPage", ...imageFields}, "en", local)!;

describe("seasonal page SSR integration", () => {
  it.each(["en", "ru", "sr"])("renders four separately validated %s photos and matching targets", async locale => {
    state.locale = locale; state.images = parsed.images;
    vi.stubEnv("SANITY_API_READ_TOKEN", "test"); vi.stubEnv("SANITY_PREVIEW_ORIGIN", "https://example.com");
    const html = renderToStaticMarkup(await BouquetsPage());
    const season = html.split('data-bouquets-section="seasonal"')[1];
    const imgs = [...season.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
    expect(imgs).toHaveLength(4);
    keys.forEach((key, i) => {expect(imgs[i]).toContain(String(i + 1).repeat(40)); expect(imgs[i]).toContain(`data-sanity="${key}"`); expect(imgs[i]).toMatch(/class="_seasonPhoto_/); expect(imgs[i]).toContain('object-position:'); expect(imgs[i]).not.toContain(' position=');});
    let cursor = 0;
    for (const label of ["spring", "summer", "autumn", "winter"]) {const next = season.indexOf(`${locale}-${label}`, cursor); expect(next).toBeGreaterThanOrEqual(cursor); cursor = next + 1; expect(season).toContain(`data-sanity="${label}.${locale}"`);}
    vi.unstubAllEnvs();
  });
  it("uses one independent photo and three legacy montage crops with separate preview targets", async () => {
    state.locale = "en"; state.images = {seasonal: parsed.images.seasonalSpring, seasonalSummer: parsed.images.seasonalSummer};
    vi.stubEnv("SANITY_API_READ_TOKEN", "test"); vi.stubEnv("SANITY_PREVIEW_ORIGIN", "https://example.com");
    const html = renderToStaticMarkup(await BouquetsPage());
    const imgs = [...html.split('data-bouquets-section="seasonal"')[1].matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
    keys.forEach((key, i) => {expect(imgs[i]).toContain(`data-sanity="${key}"`); expect(imgs[i]).toMatch(i === 1 ? /class="_seasonPhoto_/ : /class="_montage_/); expect(imgs[i]).toContain((i === 1 ? "2" : "1").repeat(40));});
    state.images = {};
    const fallback = renderToStaticMarkup(await BouquetsPage()).split('data-bouquets-section="seasonal"')[1];
    const defaults = [...fallback.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
    expect(defaults).toHaveLength(4);
    defaults.forEach((img, i) => {expect(img).toContain('12_bouquets_seasonal.jpg'); expect(img).toMatch(/class="_montage_/); expect(img).toContain(`data-sanity="${keys[i]}"`);});
    vi.unstubAllEnvs();
  });
});
