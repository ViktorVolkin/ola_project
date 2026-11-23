import {afterEach, describe, expect, it, vi} from "vitest";
import {createDataAttribute} from "next-sanity";
import {aboutContentPath} from "@/content/sanity/about";
import {aboutEditing} from "@/components/widgets/AboutBlocks/aboutEditing";
import {createPageEditing} from "@/content/sanity/editing";
import * as previewPolicy from "@/content/sanity/preview-policy";
import {studioUrl} from "@/content/sanity/preview-policy";
import AboutPage from "@/components/pages/AboutPage/AboutPage";
import {getAboutContent} from "@/content/about";

const scenario = vi.hoisted(() => ({source: "default"}));
vi.mock("next-intl/server", () => ({getLocale: async () => "en", getTranslations: async () => (key: string) => key}));
vi.mock("@/content/resolver/about", () => ({resolveAboutContent: async () => ({content: getAboutContent("en"), images: {}, labels: {}, source: scenario.source, preview: null})}));

vi.mock("server-only", () => ({}));

const textPaths = [
  "hero.eyebrow", "hero.title", "hero.body", "hero.handwritten", "hero.alt",
  "story.eyebrow", "story.title", "story.paragraphs.0", "story.paragraphs.1", "story.signature", "story.imageAlt",
  ...Array.from({length: 4}, (_, i) => `principles.${i}.label`),
  "style.eyebrow", "style.title", "style.body", ...Array.from({length: 3}, (_, i) => `style.imageAlts.${i}`),
  "why.eyebrow", "why.title", "why.body", "why.imageOverlay", "why.imageAlt",
  ...Array.from({length: 4}, (_, i) => [`why.reasons.${i}.title`, `why.reasons.${i}.description`]).flat(),
  "cta.eyebrow", "cta.title", "cta.body", "cta.imageOverlay", "cta.imageAlt",
  "labels.ourStory", "labels.exploreBouquets", "labels.messageUs", "labels.principlesLabel",
];
const imagePaths = ["hero.photo", "story.photo", "style.photo1", "style.photo2", "style.photo3", "why.photo", "cta.photo"];
const previous = (path: string, locale: string, image = false) => createDataAttribute({
  id: "aboutPage", type: "aboutPage", projectId: "zhn2ddaj", dataset: "production", baseUrl: studioUrl(),
  path: image ? path : `${aboutContentPath(path)}.${locale}`,
}).toString();

afterEach(() => vi.unstubAllEnvs());
describe("About page gate (mocked resolved source)", () => {
  it.each([
    ["default", "default", "token", "origin", false],
    ["sanity", "sanity", "token", "origin", false],
    ["default", "preview", "token", "origin", true],
    ["sanity", "preview", "token", "origin", true],
    ["sanity", "preview", "", "origin", false],
    ["sanity", "preview", "token", "", false],
  ])("content source %s / resolved %s", async (contentSource, source, token, origin, enabled) => {
    scenario.source = source;
    vi.stubEnv("CONTENT_SOURCE", contentSource);
    vi.stubEnv("SANITY_API_READ_TOKEN", token);
    vi.stubEnv("SANITY_PREVIEW_ORIGIN", origin);
    const element = await AboutPage();
    const children = element.props.children as Array<{props?: {editing?: (path: string) => string | undefined}}>;
    const editing = children.find(child => child?.props?.editing)?.props?.editing;
    expect(editing).toBeDefined();
    expect(Boolean(editing!("hero.title"))).toBe(enabled);
  });
});

describe("shared Sanity editing compatibility", () => {
  it.each(["en", "ru", "sr"] as const)("serializes all About paths like the previous real SDK implementation: %s", locale => {
    vi.stubEnv("SANITY_STUDIO_URL", "https://studio.example.test/nested/");
    const oldApi = aboutEditing(locale, true);
    const page = createPageEditing({documentId: "aboutPage", documentType: "aboutPage", locale, enabled: true, contentPath: aboutContentPath});
    for (const path of textPaths) { expect(oldApi(path)).toBe(previous(path, locale)); expect(page.text(path)).toBe(previous(path, locale)); }
    for (const path of imagePaths) { expect(oldApi(path, true)).toBe(previous(path, locale, true)); expect(page.image(path)).toBe(previous(path, locale, true)); }
  });
  it("returns undefined without invoking the content transform when disabled", () => {
    const transform = vi.fn(() => { throw Error("must not run"); });
    const url = vi.spyOn(previewPolicy, "studioUrl");
    const page = createPageEditing({documentId: "example", documentType: "example", locale: "en", enabled: false, contentPath: transform});
    expect(page.text("x")).toBeUndefined(); expect(page.image("x")).toBeUndefined(); expect(transform).not.toHaveBeenCalled();
    expect(aboutEditing("en", false)("hero.title")).toBeUndefined();
    expect(url).not.toHaveBeenCalled();
    url.mockRestore();
  });
  it("applies transform only to text and defaults to raw text paths", () => {
    const transform = vi.fn(() => "mapped");
    const config = {documentId: "example", documentType: "example", locale: "ru" as const, enabled: true};
    const page = createPageEditing({...config, contentPath: transform});
    expect(page.image("photo")).toBe(createDataAttribute({id:"example",type:"example",projectId:"zhn2ddaj",dataset:"production",baseUrl:studioUrl(),path:"photo"}).toString());
    expect(transform).not.toHaveBeenCalled();
    expect(page.text("original")).toBe(createDataAttribute({id:"example",type:"example",projectId:"zhn2ddaj",dataset:"production",baseUrl:studioUrl(),path:"mapped.ru"}).toString());
    expect(createPageEditing(config).text("original")).toBe(createDataAttribute({id:"example",type:"example",projectId:"zhn2ddaj",dataset:"production",baseUrl:studioUrl(),path:"original.ru"}).toString());
  });
});
