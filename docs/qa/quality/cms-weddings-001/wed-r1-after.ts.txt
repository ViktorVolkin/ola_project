import {createElement, Fragment, type CSSProperties, type ReactNode} from "react";
import {describe, expect, it, vi} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {getWeddingsContent} from "@/content/weddings";
import {parsePreviewWeddings} from "@/content/sanity/weddings";
vi.mock("server-only", () => ({}));
vi.mock("next/image", () => ({default: ({src, alt, ...props}: {src: string; alt: string; [key: string]: unknown}) => createElement("img", {src, alt, "data-sanity": props["data-sanity"], style: props.style as CSSProperties})}));
vi.mock("@/i18n/navigation", () => ({Link: ({children}: {children: ReactNode}) => createElement("a", {href: "/"}, children)}));
vi.mock("next/link", () => ({default: ({children}: {children: ReactNode}) => createElement("a", {href: "/"}, children)}));
vi.mock("@/components/widgets/EnquiryLink/EnquiryLink", () => ({EnquiryLink: ({children, subject}: {children: ReactNode; subject: string}) => createElement("a", {href: `/?subject=${encodeURIComponent(subject)}`}, children)}));
import {WeddingsHeroBlock} from "@/components/widgets/WeddingsBlocks/WeddingsHeroBlock";
import {WeddingsCategoriesBlock} from "@/components/widgets/WeddingsBlocks/WeddingsCategoriesBlock";
import {WeddingsApproachBlock} from "@/components/widgets/WeddingsBlocks/WeddingsApproachBlock";
import {WeddingsProcessBlock} from "@/components/widgets/WeddingsBlocks/WeddingsProcessBlock";
import {WeddingsInspirationBlock} from "@/components/widgets/WeddingsBlocks/WeddingsInspirationBlock";
import {WeddingsCtaBlock} from "@/components/widgets/WeddingsBlocks/WeddingsCtaBlock";
import {weddingsEditing} from "@/components/widgets/WeddingsBlocks/WeddingsCommon/weddingsEditing";

describe("Weddings synthetic preview render", () => {
  it.each(["en", "ru", "sr"] as const)("%s renders localized exact annotations, photo focus and code-owned subjects", locale => {
    const local = getWeddingsContent(locale);
    const photo = {asset: {_ref: `image-${"a".repeat(40)}-1200x800-jpg`}, crop: {left: .1, right: .1, top: 0, bottom: 0}, hotspot: {x: .7, y: .4, width: .1, height: .1}};
    const data = parsePreviewWeddings({_id: "drafts.weddingsPage", _type: "weddingsPage", hero: {title: {[locale]: "Synthetic title"}, photo}, categories: {weddings: {title: {[locale]: "Synthetic category"}, photo}}}, locale, null);
    const editing = weddingsEditing(locale, true), subject = local.hero.title.replace(/\n/g, " ");
    const html = renderToStaticMarkup(createElement(Fragment, null,
      createElement(WeddingsHeroBlock, {content: data.content.hero, image: data.images.hero, editing, eventSubject: subject, homeLabel: "home", planLabel: "plan", previewStatus: {locale, preview: {error: null}, content: data.content}}),
      createElement(WeddingsCategoriesBlock, {items: data.content.categories, localItems: local.categories, images: data.images, editing, label: "categories"}),
      createElement(WeddingsApproachBlock, {content: data.content.approach, image: data.images.approach, editing, processLabel: "process"}),
      createElement(WeddingsProcessBlock, {content: data.content.process, editing}),
      createElement(WeddingsInspirationBlock, {content: data.content.inspiration, images: data.images, editing, discussLabel: "discuss", eventSubject: subject}),
      createElement(WeddingsCtaBlock, {content: data.content.cta, image: data.images.weddings, editing, contactLabel: "contact", eventSubject: subject})
    ));
    expect(html).toContain("Synthetic title"); expect(html).toContain("Synthetic category");
    for (const path of [`hero.title.${locale}`, `categories.weddings.title.${locale}`, `process.step4.description.${locale}`, `inspiration.gathering.caption.${locale}`, `cta.imageAlt.${locale}`, `labels.contactWhatsapp.${locale}`, "hero.photo", "categories.weddings.photo"]) expect(html).toContain(`path=${path};`);
    expect(html).toContain("object-position:75% 40%");
    expect(html).toContain(`subject=${encodeURIComponent(subject)}`); expect(html).toContain(`subject=${encodeURIComponent(local.categories[0].title)}`); expect(html).not.toContain("subject=Synthetic");
    expect((html.match(/path=categories.weddings.photo;/g) ?? []).length).toBe(2);
  });
  it("does not annotate public output", () => {expect(weddingsEditing("en", false)("hero.title")).toBeUndefined();});
});
