import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {getHomeContent} from "@/content/home";
import {parsePreviewHome} from "@/content/sanity/preview-content";

vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({draft: false, preview: vi.fn()}));
vi.mock("next/headers", () => ({draftMode: async () => ({isEnabled: state.draft})}));
vi.mock("@/content/sanity/preview-fetch", () => ({fetchPreviewHome: state.preview}));
import {contentSource, resolveHomeContent} from "@/content/resolver/home";

beforeEach(() => { state.draft = false; state.preview.mockReset(); vi.stubGlobal("fetch", vi.fn()); vi.stubEnv("CONTENT_SOURCE", undefined); });
afterEach(() => {vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks();});

describe("Home content selection", () => {
  it("accepts only exact values and never logs the invalid value", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(contentSource(undefined)).toBe("default");
    expect(contentSource("default")).toBe("default");
    expect(contentSource("sanity")).toBe("sanity");
    for (const value of ["", "Sanity", "sensitive-value"]) expect(contentSource(value)).toBe("default");
    expect(warn).toHaveBeenCalledTimes(3);
    expect(JSON.stringify(warn.mock.calls)).not.toContain("sensitive-value");
  });
  for (const locale of ["en", "ru", "sr"] as const) {
    it(`${locale}: default makes no CMS or preview request`, async () => {
      const result = await resolveHomeContent(locale);
      expect(result).toMatchObject({source: "default", content: getHomeContent(locale), images: {}, labels: {}, preview: null});
      expect(fetch).not.toHaveBeenCalled(); expect(state.preview).not.toHaveBeenCalled();
    });
    it(`${locale}: published partial fields keep same-locale local fallbacks`, async () => {
      vi.stubEnv("CONTENT_SOURCE", "sanity");
      vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({result: {_id: "homePage", _type: "homePage", hero: {title: {[locale]: "Published"}, photo: {asset: {_ref: "invalid"}}}, labels: {shopBouquets: {[locale]: "<invalid>"}}}})));
      const result = await resolveHomeContent(locale);
      expect(result.source).toBe("sanity"); expect(result.content.hero.title).toBe("Published");
      expect(result.content.hero.description).toBe(getHomeContent(locale).hero.description);
      expect(result.images.hero).toBeUndefined(); expect(result.labels.shopBouquets).toBeUndefined();
      expect(state.preview).not.toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("perspective=published"), expect.objectContaining({next: {revalidate: 60}}));
    });
  }
  it("published API failure safely falls back", async () => {
    vi.stubEnv("CONTENT_SOURCE", "sanity"); vi.mocked(fetch).mockRejectedValue(Error("offline")); vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await resolveHomeContent("ru")).toMatchObject({source: "sanity", content: getHomeContent("ru"), preview: null});
  });
  for (const source of ["default", "sanity", "invalid"]) {
    it(`draft overrides ${source}, published then local fallback and diagnostics`, async () => {
      state.draft = true; vi.stubEnv("CONTENT_SOURCE", source);
      vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({result: {_id: "homePage", _type: "homePage", hero: {description: {ru: "Published description"}}}})));
      state.preview.mockImplementation(async (locale, published) => ({data: parsePreviewHome({_id: "drafts.homePage", _type: "homePage", hero: {title: {ru: "Draft title"}}}, locale, published), error: null}));
      const result = await resolveHomeContent("ru");
      expect(result.source).toBe("preview"); expect(result.content.hero.title).toBe("Draft title");
      expect(result.content.hero.description).toBe("Published description"); expect(result.preview?.fallbackPaths).toContain("hero.description.ru");
      expect(state.preview).toHaveBeenCalledOnce();
    });
  }
  it("preview failure retains published and visible error", async () => {
    state.draft = true; vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({result: {_id: "homePage", _type: "homePage", hero: {title: {en: "Published"}}}})));
    state.preview.mockResolvedValue({data: null, error: "Preview unavailable"});
    expect(await resolveHomeContent("en")).toMatchObject({source: "preview", content: {hero: {title: "Published"}}, preview: {error: "Preview unavailable"}});
  });
});
