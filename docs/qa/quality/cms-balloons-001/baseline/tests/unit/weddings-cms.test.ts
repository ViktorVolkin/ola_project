import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {getWeddingsContent} from "@/content/weddings";
import {parseWeddings, parsePreviewWeddings} from "@/content/sanity/weddings";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({draft: false, fetch: vi.fn()}));
vi.mock("next/headers", () => ({draftMode: async () => ({isEnabled: state.draft})}));
vi.mock("@/content/sanity/preview-client", () => ({previewClient: () => ({fetch: state.fetch})}));
import {resolveWeddingsContent} from "@/content/resolver/weddings";
const doc = {_id: "weddingsPage", _type: "weddingsPage"};
beforeEach(() => {state.draft = false; state.fetch.mockReset(); vi.stubGlobal("fetch", vi.fn()); vi.stubEnv("CONTENT_SOURCE", undefined);});
afterEach(() => {vi.unstubAllGlobals(); vi.unstubAllEnvs();});
describe("Weddings CMS owned source", () => {
  it.each(["en", "ru", "sr"] as const)("%s preserves local fields and zero default requests", async locale => {
    expect(await resolveWeddingsContent(locale)).toMatchObject({content: getWeddingsContent(locale), source: "default", preview: null});
    expect(fetch).not.toHaveBeenCalled(); expect(state.fetch).not.toHaveBeenCalled();
  });
  it("merges valid same-locale fields independently and rejects other identities", () => {
    const parsed = parseWeddings({...doc, hero: {title: {en: "Title", ru: "Заголовок"}, body: {en: "<bad>"}}, categories: {private: {title: {en: "Edited"}}}}, "en");
    expect(parsed?.content.hero.title).toBe("Title"); expect(parsed?.content.hero.body).toBe(getWeddingsContent("en").hero.body);
    expect(parsed?.content.categories[1].title).toBe("Edited"); expect(parsed?.content.categories.map(x => x.id)).toEqual(getWeddingsContent("en").categories.map(x => x.id));
    expect(parseWeddings({...doc, _id: "drafts.weddingsPage"}, "en")).toBeNull();
    expect(parseWeddings({...doc, hero: {title: {ru: "Заголовок"}}}, "en")?.content.hero.title).toBe(getWeddingsContent("en").hero.title);
  });
  it("validates images using the shared guard and keeps published fallback", () => {
    const photo = {asset: {_ref: `image-${"a".repeat(40)}-1200x800-jpg`}};
    const published = parseWeddings({...doc, hero: {photo}}, "en");
    expect(published?.images.hero?.src).toContain("cdn.sanity.io");
    const draft = parsePreviewWeddings({...doc, hero: {photo: {asset: {url: "https://evil.test"}}}}, "en", published);
    expect(draft.images.hero).toEqual(published?.images.hero); expect(draft.fallbackPaths).toContain("hero.photo");
  });
  it.each(["default", "sanity"])("draft beats %s and merges published then local", async source => {
    state.draft = true; vi.stubEnv("CONTENT_SOURCE", source);
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({result: {...doc, hero: {body: {ru: "Published"}}}})));
    state.fetch.mockResolvedValue({...doc, _id: "drafts.weddingsPage", hero: {title: {ru: "Draft"}}});
    const result = await resolveWeddingsContent("ru");
    expect(result.content.hero.title).toBe("Draft"); expect(result.content.hero.body).toBe("Published");
    expect(result.content.cta).toEqual(getWeddingsContent("ru").cta);
    expect(state.fetch).toHaveBeenCalledWith(expect.any(String), {}, expect.objectContaining({perspective: "drafts", cache: "no-store", stega: false}));
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain("perspective=published");
    expect(vi.mocked(fetch).mock.calls[0][1]).toEqual(expect.objectContaining({next: {revalidate: 60}}));
  });
  it("uses local content on published failure", async () => {
    vi.stubEnv("CONTENT_SOURCE", "sanity"); vi.mocked(fetch).mockResolvedValue(new Response("", {status: 503}));
    expect(await resolveWeddingsContent("sr")).toMatchObject({content: getWeddingsContent("sr"), source: "sanity"});
  });
});
