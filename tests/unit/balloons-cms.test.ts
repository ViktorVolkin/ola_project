import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {getBalloonsContent} from "@/content/balloons";
import {parseBalloons, parsePreviewBalloons} from "@/content/sanity/balloons";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({draft: false, fetch: vi.fn()}));
vi.mock("next/headers", () => ({draftMode: async () => ({isEnabled: state.draft})}));
vi.mock("@/content/sanity/preview-client", () => ({previewClient: () => ({fetch: state.fetch})}));
import {resolveBalloonsContent} from "@/content/resolver/balloons";
const doc = {_id: "balloonsPage", _type: "balloonsPage"};
beforeEach(() => {state.draft = false; state.fetch.mockReset(); vi.stubGlobal("fetch", vi.fn()); vi.stubEnv("CONTENT_SOURCE", undefined);});
afterEach(() => {vi.unstubAllGlobals(); vi.unstubAllEnvs();});
describe("Balloons source", () => {
  it.each(["en", "ru", "sr"] as const)("%s defaults to local without requests", async locale => {
    expect(await resolveBalloonsContent(locale)).toMatchObject({content: getBalloonsContent(locale), source: "default", preview: null});
    expect(fetch).not.toHaveBeenCalled(); expect(state.fetch).not.toHaveBeenCalled();
  });
  it("accepts only valid identity and independently resolves the requested locale", () => {
    const result = parseBalloons({...doc, hero: {title: {ru: "Заголовок"}, body: {en: "<bad>"}}, categories: {sets: {title: {en: "Edited"}}}}, "en");
    expect(result?.content.hero).toEqual(getBalloonsContent("en").hero);
    expect(result?.content.categories[0].title).toBe("Edited");
    expect(parseBalloons({...doc, _id: "drafts.balloonsPage"}, "en")).toBeNull();
    expect(parseBalloons({...doc, _type: "homePage"}, "en")).toBeNull();
    expect(() => parsePreviewBalloons({...doc, _id: "other"}, "en", null)).toThrow();
  });
  it("uses shared crop validation and published image on invalid draft", () => {
    const photo = {asset: {_ref: `image-${"a".repeat(40)}-1200x800-jpg`}, crop: {left: 0.1, right: 0.1, top: 0, bottom: 0}, hotspot: {x: 0.7, y: 0.4, width: 0.2, height: 0.2}};
    const published = parseBalloons({...doc, hero: {photo}}, "en");
    expect(published?.images.hero?.src).toContain("cdn.sanity.io");
    expect(published?.images.hero?.position).toBe("75% 40%");
    const draft = parsePreviewBalloons({...doc, hero: {photo: {asset: {url: "https://evil.test"}}}}, "en", published);
    expect(draft.images.hero).toEqual(published?.images.hero); expect(draft.fallbackPaths).toContain("hero.photo");
    expect(parseBalloons({...doc, hero: {photo: {...photo, crop: {left: 0.7, right: 0.5, top: 0, bottom: 0}}}}, "en")?.images.hero).toBeUndefined();
  });
  it.each(["default", "sanity"])("draft overrides %s and merges published and local", async source => {
    state.draft = true; vi.stubEnv("CONTENT_SOURCE", source);
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({result: {...doc, hero: {body: {ru: "Published"}}}})));
    state.fetch.mockResolvedValue({...doc, _id: "drafts.balloonsPage", hero: {title: {ru: "Draft"}}});
    const result = await resolveBalloonsContent("ru");
    expect(result.content.hero.title).toBe("Draft"); expect(result.content.hero.body).toBe("Published");
    expect(result.content.cta).toEqual(getBalloonsContent("ru").cta);
    expect(state.fetch).toHaveBeenCalledWith(expect.any(String), {}, expect.objectContaining({perspective: "drafts", cache: "no-store", stega: false}));
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain("perspective=published");
    expect(vi.mocked(fetch).mock.calls[0][1]).toEqual(expect.objectContaining({next: {revalidate: 60}}));
  });
  it("falls back to local on an outage", async () => {
    vi.stubEnv("CONTENT_SOURCE", "sanity"); vi.mocked(fetch).mockResolvedValue(new Response("", {status: 503}));
    expect(await resolveBalloonsContent("sr")).toMatchObject({content: getBalloonsContent("sr"), source: "sanity"});
  });
});
