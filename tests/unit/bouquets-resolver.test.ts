import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {bouquetTextKeys, type BouquetCopy} from "@/content/sanity/bouquets";

vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({draft: false, configured: true, fetch: vi.fn()}));
vi.mock("next/headers", () => ({draftMode: async () => ({isEnabled: state.draft})}));
vi.mock("@/content/sanity/preview-client", () => ({previewClient: () => state.configured ? {fetch: state.fetch} : null}));
import {resolveBouquetsContent} from "@/content/resolver/bouquets";

const identity = {_id: "bouquetsPage", _type: "bouquetsPage"};
const photo = {asset: {_ref: `image-${"a".repeat(40)}-1200x900-jpg`}};
const localFor = (locale: string) => Object.fromEntries(bouquetTextKeys.map(key => [key, `${locale}-local-${key}`])) as BouquetCopy;
const publishedResponse = (result: unknown) => new Response(JSON.stringify({result}));

beforeEach(() => {
  state.draft = false;
  state.configured = true;
  state.fetch.mockReset();
  vi.stubGlobal("fetch", vi.fn());
  vi.stubEnv("CONTENT_SOURCE", undefined);
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("Bouquets resolver source boundary", () => {
  it.each(["en", "ru", "sr"] as const)("%s default makes no CMS requests", async locale => {
    const local = localFor(locale);
    expect(await resolveBouquetsContent(locale, local)).toEqual({source: "default", content: local, images: {}, preview: null});
    expect(fetch).not.toHaveBeenCalled();
    expect(state.fetch).not.toHaveBeenCalled();
  });

  it.each(["en", "ru", "sr"] as const)("%s public uses published perspective and ISR60", async locale => {
    vi.stubEnv("CONTENT_SOURCE", "sanity");
    vi.mocked(fetch).mockResolvedValue(publishedResponse({...identity, heading: {[locale]: `published-${locale}`}, hero: {title: "injected"}}));
    const result = await resolveBouquetsContent(locale, localFor(locale));
    expect(result).toMatchObject({source: "sanity", content: {heading: `published-${locale}`, soft: `${locale}-local-soft`}, preview: null});
    expect(result.content).not.toHaveProperty("hero");
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, options] = vi.mocked(fetch).mock.calls[0];
    const query = new URL(String(url));
    expect(query.searchParams.get("perspective")).toBe("published");
    expect(query.searchParams.get("query")).toContain('"bouquetsPage"');
    expect(options).toEqual(expect.objectContaining({next: {revalidate: 60}, signal: expect.any(AbortSignal)}));
    expect(state.fetch).not.toHaveBeenCalled();
  });

  for (const source of ["default", "sanity"]) {
    it.each(["en", "ru", "sr"] as const)(`%s draft overrides ${source} and falls back published then same-language local`, async locale => {
      vi.stubEnv("CONTENT_SOURCE", source);
      state.draft = true;
      vi.mocked(fetch).mockResolvedValue(publishedResponse({...identity, heading: {[locale]: `published-${locale}`}, card1: photo, hero: {title: "published hero"}}));
      state.fetch.mockResolvedValue({...identity, _id: "drafts.bouquetsPage", soft: {[locale]: `draft-${locale}`}, heading: {en: locale === "en" ? "" : "wrong language"}, card1: {asset: {url: "invalid"}}, hero: {title: "draft hero"}});
      const local = localFor(locale);
      const result = await resolveBouquetsContent(locale, local);
      expect(result).toMatchObject({source: "preview", content: {heading: `published-${locale}`, soft: `draft-${locale}`, bright: local.bright}, preview: {error: null}});
      expect(result.images.card1).toBeDefined();
      expect(result.preview?.fallbackPaths).toContain(`heading.${locale}`);
      expect(result.preview?.fallbackPaths).toContain("card1");
      expect(result.content).not.toHaveProperty("hero");
      expect(state.fetch).toHaveBeenCalledWith(expect.stringContaining('"bouquetsPage"'), {}, expect.objectContaining({perspective: "drafts", cache: "no-store", stega: false, signal: expect.any(AbortSignal)}));
    });
  }

  it.each([null, {_id: "drafts.bouquetsPage", _type: "bouquetsPage", heading: {en: "private"}}, {_id: "other", _type: "bouquetsPage"}, {_id: "bouquetsPage", _type: "wrong"}, "invalid"])("public ignores absent or invalid singleton %j", async document => {
    vi.stubEnv("CONTENT_SOURCE", "sanity");
    vi.mocked(fetch).mockResolvedValue(publishedResponse(document));
    const local = localFor("en");
    expect(await resolveBouquetsContent("en", local)).toEqual({source: "sanity", content: local, images: {}, preview: null});
    expect(state.fetch).not.toHaveBeenCalled();
  });

  it.each(["network", "http", "json"])("public fetch %s failure safely falls back", async failure => {
    vi.stubEnv("CONTENT_SOURCE", "sanity");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    if (failure === "network") vi.mocked(fetch).mockRejectedValue(new Error("network secret"));
    else if (failure === "http") vi.mocked(fetch).mockResolvedValue(new Response("error", {status: 500}));
    else vi.mocked(fetch).mockResolvedValue(new Response("invalid json"));
    const local = localFor("sr");
    expect(await resolveBouquetsContent("sr", local)).toEqual({source: "sanity", content: local, images: {}, preview: null});
  });

  it("missing draft and published singleton returns local with fallback paths", async () => {
    state.draft = true;
    vi.mocked(fetch).mockResolvedValue(publishedResponse(null));
    state.fetch.mockResolvedValue(null);
    const local = localFor("ru");
    const result = await resolveBouquetsContent("ru", local);
    expect(result).toMatchObject({source: "preview", content: local, images: {}, preview: {error: null}});
    expect(result.preview?.fallbackPaths).toContain("heading.ru");
  });

  it.each(["configuration", "unavailable", "invalid identity"])("preview %s falls back safely to published", async failure => {
    state.draft = true;
    vi.mocked(fetch).mockResolvedValue(publishedResponse({...identity, heading: {ru: "published"}}));
    state.configured = failure !== "configuration";
    if (failure === "unavailable") state.fetch.mockRejectedValue(Error("private token"));
    if (failure === "invalid identity") state.fetch.mockResolvedValue({...identity, _id: "other", heading: {ru: "unsafe"}});
    const result = await resolveBouquetsContent("ru", localFor("ru"));
    expect(result).toMatchObject({source: "preview", content: {heading: "published", soft: "ru-local-soft"}, preview: {error: failure === "configuration" ? "configuration" : "unavailable"}});
    expect(JSON.stringify(result)).not.toContain("private token");
    if (failure === "configuration") expect(state.fetch).not.toHaveBeenCalled();
  });
});


it.each(["en", "ru", "sr"] as const)("%s hero uses published then draft and retains published photo", async locale => {
  state.draft = true;
  const keys = ["breadcrumb", "title", "subtitle", "body", "script", "explore"] as const;
  const fields = Object.fromEntries(keys.map(key => [key, {[locale]: `published-${key}`} ]));
  vi.mocked(fetch).mockResolvedValue(publishedResponse({...identity, ...fields, hero: photo}));
  state.fetch.mockResolvedValue({...identity, _id: "drafts.bouquetsPage", title: {[locale]: "draft-title"}, hero: {asset: {url: "bad"}}});
  const result = await resolveBouquetsContent(locale, localFor(locale));
  expect(result.content.title).toBe("draft-title");
  for (const key of keys.filter(key => key !== "title")) expect(result.content[key]).toBe(`published-${key}`);
  expect(result.images.hero?.src).toContain("1200x900");
  expect(result.preview?.fallbackPaths).toContain("hero");
});


it("seasonal slots independently prefer valid draft, then published, then montage", async () => {
  state.draft = true;
  const img = (c: string) => ({asset: {_ref: `image-${c.repeat(40)}-1200x900-jpg`}});
  vi.mocked(fetch).mockResolvedValue(publishedResponse({...identity, seasonal: img("a"), seasonalSpring: img("b"), seasonalSummer: img("c"), seasonalAutumn: img("d")}));
  state.fetch.mockResolvedValue({...identity, _id: "drafts.bouquetsPage", seasonalSpring: img("e"), seasonalSummer: {asset: {url: "bad"}}, seasonalWinter: img("f")});
  const result = await resolveBouquetsContent("en", localFor("en"));
  for (const [key, c] of [["seasonal", "a"], ["seasonalSpring", "e"], ["seasonalSummer", "c"], ["seasonalAutumn", "d"], ["seasonalWinter", "f"]] as const) expect(result.images[key]?.src).toContain(c.repeat(40));
  expect(result.preview?.fallbackPaths).toEqual(expect.arrayContaining(["seasonalSummer", "seasonalAutumn", "seasonal"]));
});
