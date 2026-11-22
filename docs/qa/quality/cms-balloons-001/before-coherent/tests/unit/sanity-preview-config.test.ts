import {afterEach, expect, it, vi} from "vitest";
vi.mock("server-only", () => ({}));
import {previewClient} from "@/content/sanity/preview-client";
import {studioOrigins, studioUrl} from "@/content/sanity/preview-policy";
import {createEditUrl} from "@sanity/client/csm";

const dashboard = "https://www.sanity.io/@obdulf8du/studio/xxpedejjvg9va6r4u8t4llzw";
const dedicated = "https://ola-studio-zhn2ddaj.sanity.studio";

it.each([
  [dashboard, dashboard],
  [`${dashboard}/`, dashboard],
  [undefined, dashboard],
  [`${dedicated}/`, dedicated],
])("uses the complete Studio base in real SDK edit intents (%s)", (configured, expected) => {
  vi.stubEnv("SANITY_STUDIO_URL", configured);
  const baseUrl = studioUrl();
  const intent = createEditUrl({baseUrl, id: "homePage", type: "homePage", path: []});
  expect(intent).toContain(`${expected}/intent/edit/`);
  expect(baseUrl).toBe(expected);
  expect(new URL(intent).searchParams.get("baseUrl")).toBe(expected);
});

it.each(["not a URL", "javascript:alert(1)", "http://www.sanity.io/studio"])("falls back for unsupported Studio URL %s", configured => {
  vi.stubEnv("SANITY_STUDIO_URL", configured);
  expect(studioUrl()).toBe(dashboard);
});

it("discards credentials, query and hash without changing origin trust", () => {
  vi.stubEnv("SANITY_STUDIO_URL", "https://user:password@www.sanity.io/studio/?query=value#fragment");
  expect(studioUrl()).toBe("https://www.sanity.io/studio");
  expect(studioOrigins).toEqual(["https://www.sanity.io", dedicated]);
});
afterEach(() => vi.unstubAllEnvs());
it.each([undefined, "", "https://preview.example.test/en", "https://preview.example.test/", "http://preview.example.test", "javascript:alert(1)"])("requires exact secure preview origin %s", origin => {vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("SANITY_API_READ_TOKEN", "synthetic-read-only"); vi.stubEnv("SANITY_PREVIEW_ORIGIN", origin); expect(previewClient()).toBeNull();});
it("requires a separate read token", () => {vi.stubEnv("SANITY_PREVIEW_ORIGIN", "https://preview.example.test"); vi.stubEnv("SANITY_API_READ_TOKEN", ""); expect(previewClient()).toBeNull();});
it("locks preview to expected resource with no CDN/stega and no browser token", () => {vi.stubEnv("SANITY_PREVIEW_ORIGIN", "https://preview.example.test"); vi.stubEnv("SANITY_API_READ_TOKEN", "synthetic-read-only"); vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "wrong-project"); vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "wrong-dataset"); const config = previewClient()!.config(); expect(config).toMatchObject({projectId: "zhn2ddaj", dataset: "production", useCdn: false, perspective: "drafts", token: "synthetic-read-only"}); expect(config.stega.enabled).toBe(false);});
