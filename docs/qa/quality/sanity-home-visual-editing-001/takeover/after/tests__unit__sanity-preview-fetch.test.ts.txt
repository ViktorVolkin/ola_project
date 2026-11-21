import {beforeEach, expect, it, vi} from "vitest";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({configured: true, fetch: vi.fn()}));
vi.mock("@/content/sanity/preview-client", () => ({previewClient: () => state.configured ? {fetch: state.fetch} : null}));
import {fetchPreviewHome} from "@/content/sanity/preview-fetch";
beforeEach(() => {state.configured = true; state.fetch.mockReset();});
it("fetches drafts only with no-store; partial fields retain locale and identify fallback", async () => {
  state.fetch.mockResolvedValue({_id: "homePage", _type: "homePage", hero: {title: {ru: "Черновик", en: "Not Russian"}}});
  const result = await fetchPreviewHome("ru", null);
  expect(state.fetch).toHaveBeenCalledWith('*[_id == "homePage" && _type == "homePage"][0]', {}, expect.objectContaining({perspective: "drafts", cache: "no-store", stega: false, signal: expect.any(AbortSignal)}));
  expect(result.data?.content.hero.title).toBe("Черновик");
  expect(result.data?.fallbackPaths).toContain("hero.description.ru");
  expect(result.data?.fallbackPaths).not.toContain("hero.title.ru");
});
it("fails closed without a configured reader, without attempting a fetch", async () => {
  state.configured = false;
  expect(await fetchPreviewHome("en", null)).toMatchObject({data: null, error: expect.stringContaining("configuration missing")});
  expect(state.fetch).not.toHaveBeenCalled();
});
it("does not claim invisible invalid-document edits succeeded", async () => {
  state.fetch.mockResolvedValue({_id: "foreign", _type: "homePage"});
  expect(await fetchPreviewHome("sr", null)).toMatchObject({data: null, error: expect.stringContaining("edits are NOT visible")});
});
it("does not return reader credentials or SDK failure details", async () => {
  state.fetch.mockRejectedValue(Error("synthetic-reader-token Authorization request"));
  const result = await fetchPreviewHome("en", null);
  expect(result.data).toBeNull();
  expect(JSON.stringify(result)).not.toMatch(/synthetic-reader-token|Authorization/);
});
