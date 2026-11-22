import {afterEach, describe, expect, it, vi} from "vitest";
import type {Locale} from "next-intl";
import {draftMode} from "next/headers";
import {getMessages} from "next-intl/server";
import {previewClient} from "@/content/sanity/preview-client";
import type {CmsContact} from "@/content/sanity/contact";
import {parseContact, parsePreviewContact, fetchContact} from "@/content/sanity/contact";
import {resolveContactContent} from "@/content/resolver/contact";
import {contactEditing, type ContactEditing} from "@/components/widgets/ContactBlocks/contactEditing";
import {renderToStaticMarkup} from "react-dom/server";
import {createElement} from "react";
import enMessages from "@/i18n/messages/contact/en.json";
import ruMessages from "@/i18n/messages/contact/ru.json";
import srMessages from "@/i18n/messages/contact/sr.json";
import {imagePresentation} from "@/content/sanity/home";

vi.mock("next/headers", () => ({draftMode: vi.fn().mockResolvedValue({isEnabled: false} as Awaited<ReturnType<typeof draftMode>>)}));
vi.mock("next-intl/server", () => ({getMessages: vi.fn().mockResolvedValue({Contact: enMessages} as Awaited<ReturnType<typeof getMessages>>)}));
vi.mock("@/content/sanity/preview-client", () => ({previewClient: vi.fn()}));

const local = {en: enMessages, ru: ruMessages, sr: srMessages} as Record<Locale, typeof enMessages>;
const doc = {_id: "contactPage", _type: "contactPage"};
const photo = {
  asset: {_ref: `image-${"a".repeat(40)}-1000x800-jpg`},
  crop: {left: 0.1, right: 0.1, top: 0, bottom: 0},
  hotspot: {x: 0.7, y: 0.4, width: 0.1, height: 0.1},
};
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.mocked(draftMode).mockResolvedValue({isEnabled: false} as Awaited<ReturnType<typeof draftMode>>);
  vi.mocked(getMessages).mockResolvedValue({Contact: enMessages} as Awaited<ReturnType<typeof getMessages>>);
  vi.mocked(previewClient).mockReturnValue(null);
});

describe("Contact parser: same-locale fields fall back to current local messages", () => {
  it.each(["en", "ru", "sr"] as const)("empty document keeps complete local %s copy", locale => {
    expect(parseContact(doc, locale, local[locale])?.content).toEqual(local[locale]);
  });
  it.each(["en", "ru", "sr"] as const)("valid %s fields override local copy, missing fields keep local", locale => {
    const edited = {...doc, heroTitle: {[locale]: "Edited hero"}, geoTitle: {en: "EN only"}, geography: {photo}};
    const result = parseContact(edited, locale, local[locale])!;
    expect(result.content.heroTitle).toBe("Edited hero");
    expect(result.content.geoTitle).toBe(locale === "en" ? "EN only" : local[locale].geoTitle);
    expect(result.content.geoBody).toBe(local[locale].geoBody);
    expect(result.images.geography?.src).toContain("cdn.sanity.io");
    expect(result.images.geography?.position).toBe("75% 40%");
  });
  it("rejects unsafe and wrong-identity documents", () => {
    for (const title of ["", " ", 5, "<script>", "x".repeat(10001)])
      expect(parseContact({...doc, heroTitle: {en: title}} as unknown, "en", local.en)?.content.heroTitle).toBe(local.en.heroTitle);
    expect(parseContact({...doc, _id: "drafts.contactPage"}, "en", local.en)).toBeNull();
    expect(parseContact({...doc, _type: "homePage"}, "en", local.en)).toBeNull();
    expect(parseContact(null, "en", local.en)).toBeNull();
    expect(parseContact({...doc, heroTitle: {en: "EN only"}}, "ru", local.ru)?.content.heroTitle).toBe(local.ru.heroTitle);
  });
  it("shares canonical photos across locales and rejects invalid ones", () => {
    const enResult = parseContact({...doc, hero: {photo}}, "en", local.en)!;
    const ruResult = parseContact({...doc, hero: {photo}}, "ru", local.ru)!;
    expect(new URL(enResult.images.hero!.src).searchParams.get("rect")).toBe("100,0,800,800");
    expect(enResult.images.hero?.position).toBe("75% 40%");
    expect(enResult.images).toEqual(ruResult.images);
    expect(enResult.images.editorial).toBeUndefined();
    for (const bad of [
      {...photo, asset: {...photo.asset, url: "https://evil.test/photo.jpg"}},
      {...photo, crop: {...photo.crop, left: 1}},
      {...photo, hotspot: {...photo.hotspot, width: 0}},
      {asset: {url: "https://evil.test/photo.jpg"}},
    ])
      expect(parseContact({...doc, hero: {photo: bad}} as unknown, "en", local.en)?.images.hero).toBeUndefined();
  });
});

describe("Contact draft preview: draft wins per field, then published, then local", () => {
  it("merges draft over published over local with exact fallback diagnostics", () => {
    const published = parseContact({...doc, geoBody: {ru: "Published"}}, "ru", local.ru)!;
    const result = parsePreviewContact({...doc, _id: "drafts.contactPage", geoTitle: {ru: "Draft"}}, "ru", local.ru, published as CmsContact);
    expect(result.content.geoTitle).toBe("Draft");
    expect(result.content.geoBody).toBe("Published");
    expect(result.content.heroBody).toBe(local.ru.heroBody);
    expect(result.fallbackPaths).toContain("heroTitle.ru");
    expect(result.fallbackPaths).toContain("hero.photo");
    expect(() => parsePreviewContact({_id: "homePage", _type: "homePage"}, "en", local.en, null)).toThrow();
  });
  it("keeps published images when the draft omits them", () => {
    const published = parseContact({...doc, hero: {photo}}, "en", local.en)!;
    const result = parsePreviewContact({...doc, _id: "drafts.contactPage"}, "en", local.en, published as CmsContact);
    expect(result.images.hero?.src).toBe(published.images.hero?.src);
  });
});

describe("Contact fetch: published only, ISR60, outage and missing document", () => {
  it("fetches published contactPage with revalidate 60", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({result: doc}))));
    expect(await fetchContact("en")).not.toBeNull();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("perspective=published"), expect.objectContaining({next: {revalidate: 60}}));
  });
  it("returns null on HTTP failure, network outage and absent document", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("bad", {status: 500})));
    expect(await fetchContact("en")).toBeNull();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(Error("offline")));
    expect(await fetchContact("en")).toBeNull();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({result: null}))));
    expect(await fetchContact("en")).toBeNull();
  });
});

describe("Contact resolver: source selection and draft precedence", () => {
  it("default source makes zero CMS calls", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    process.env.CONTENT_SOURCE = "default";
    const {content} = await resolveContactContent("en");
    expect(content.heroTitle).toBe(local.en.heroTitle);
    expect(fetch).not.toHaveBeenCalled();
    delete process.env.CONTENT_SOURCE;
  });
  it("sanity source uses published document and falls back to local", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({result: null})));
    vi.stubGlobal("fetch", fetch);
    process.env.CONTENT_SOURCE = "sanity";
    const resolved = await resolveContactContent("en");
    expect(resolved.source).toBe("sanity");
    expect(resolved.content.heroTitle).toBe(local.en.heroTitle);
    expect(resolved.preview).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
    delete process.env.CONTENT_SOURCE;
  });
  it("preview source prefers draft over published over local", async () => {
    vi.mocked(draftMode).mockResolvedValue({isEnabled: true} as Awaited<ReturnType<typeof draftMode>>);
    const client = {fetch: vi.fn().mockResolvedValue({_id: "drafts.contactPage", _type: "contactPage", heroTitle: {en: "Draft title"}})} as unknown as NonNullable<ReturnType<typeof previewClient>>;
    vi.mocked(previewClient).mockReturnValue(client);
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({result: {...doc, heroTitle: {en: "Published title"}}})));
    vi.stubGlobal("fetch", fetch);
    process.env.CONTENT_SOURCE = "sanity";
    const resolved = await resolveContactContent("en");
    expect(resolved.source).toBe("preview");
    expect(resolved.content.heroTitle).toBe("Draft title");
    expect(resolved.preview?.error).toBeNull();
    expect(resolved.content.geoBody).toBe(local.en.geoBody);
    delete process.env.CONTENT_SOURCE;
  });
});

describe("Contact editing annotations", () => {
  it("returns exact contactPage paths when preview enabled, undefined otherwise", () => {
    const enabled: ContactEditing = contactEditing("en", true);
    const disabled: ContactEditing = contactEditing("en", false);
    expect(disabled("heroTitle")).toBeUndefined();
    expect(enabled("heroTitle")).toContain("path=heroTitle.en;");
    expect(enabled("hero.photo", true)).toContain("path=hero.photo;");
    expect(enabled("hero.photo", true)).toContain("id=contactPage");
    expect(enabled("hero.photo", true)).toContain("type=contactPage");
  });
});

describe("Contact render: annotations map to widgets, actions stay code-owned", () => {
  const editing = contactEditing("en", true);
  const silent = contactEditing("en", false);
  const content = local.en;
  const heroImage = imagePresentation({asset: {_ref: `image-${"b".repeat(40)}-1000x800-jpg`}, crop: {left: 0.1, right: 0.1, top: 0, bottom: 0}, hotspot: {x: 0.7, y: 0.4, width: 0.1, height: 0.1}});
  it("annotates hero text and photo with draft editing", () => {
    const html = renderToStaticMarkup(
      createElement("div", null,
        createElement("h1", {"data-sanity": editing("heroTitle")}, content.heroTitle),
        createElement("img", {"data-sanity": editing("hero.photo", true), src: heroImage?.src ?? "/x.jpg", style: heroImage ? {objectPosition: heroImage.position} : undefined}),
      ),
    );
    expect(html).toContain("path=heroTitle.en;");
    expect(html).toContain(`src="${heroImage?.src}"`);
    expect(html).toContain("object-position:75% 40%");
  });
  it("public output carries no annotations", () => {
    const html = renderToStaticMarkup(createElement("h1", {"data-sanity": silent("heroTitle")}, content.heroTitle));
    expect(html).not.toContain("data-sanity");
  });
  it("widget props stay typed and keep local content when no CMS image", () => {
    const html = renderToStaticMarkup(createElement("h1", {"data-sanity": editing("geoTitle")}, content.geoTitle));
    expect(html).toContain(content.geoTitle);
    expect(html).toContain("path=geoTitle.en;");
  });
});
