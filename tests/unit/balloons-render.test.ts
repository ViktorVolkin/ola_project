import {createElement, Fragment, type CSSProperties, type ReactNode} from "react";
import {describe, expect, it, vi} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {getBalloonsContent} from "@/content/balloons";
import {parsePreviewBalloons} from "@/content/sanity/balloons";
vi.mock("server-only", () => ({}));
vi.mock("next/image", () => ({default: ({src, alt, ...props}: {src: string; alt: string; [key: string]: unknown}) => createElement("img", {src, alt, style: props.style as CSSProperties})}));
vi.mock("@/i18n/navigation", () => ({Link: ({children}: {children: ReactNode}) => createElement("a", {href: "/"}, children)}));
vi.mock("next/link", () => ({default: ({children}: {children: ReactNode}) => createElement("a", {href: "/"}, children)}));
vi.mock("@/components/widgets/EnquiryLink/EnquiryLink", () => ({EnquiryLink: ({children, subject}: {children: ReactNode; subject: string}) => createElement("a", {href: `/?subject=${encodeURIComponent(subject)}`}, children)}));
import {BalloonsHeroBlock} from "@/components/widgets/BalloonsBlocks/BalloonsHeroBlock/BalloonsHeroBlock";
import {BalloonsCategoriesBlock} from "@/components/widgets/BalloonsBlocks/BalloonsCategoriesBlock/BalloonsCategoriesBlock";
import {BalloonsFavouritesBlock} from "@/components/widgets/BalloonsBlocks/BalloonsFavouritesBlock/BalloonsFavouritesBlock";
import {BalloonsPersonalisationBlock} from "@/components/widgets/BalloonsBlocks/BalloonsPersonalisationBlock/BalloonsPersonalisationBlock";
import {BalloonsCtaBlock} from "@/components/widgets/BalloonsBlocks/BalloonsCtaBlock/BalloonsCtaBlock";
import {BalloonsPreviewStatus} from "@/components/widgets/BalloonsBlocks/BalloonsPreviewStatus";
import {balloonsEditing} from "@/components/widgets/BalloonsBlocks/balloonsEditing";

describe("Balloons synthetic server render", () => {
  it.each(["en", "ru", "sr"] as const)("%s maps annotations and keeps subjects code-owned", locale => {
    const local = getBalloonsContent(locale);
    const photo = {asset: {_ref: `image-${"a".repeat(40)}-1200x800-jpg`}, crop: {left: .1, right: .1, top: 0, bottom: 0}, hotspot: {x: .7, y: .4, width: .1, height: .1}};
    const data = parsePreviewBalloons({_id: "drafts.balloonsPage", _type: "balloonsPage", hero: {title: {[locale]: "Synthetic title"}, photo}, categories: {sets: {title: {[locale]: "Synthetic category"}}}}, locale, null);
    const editing = balloonsEditing(locale, true);
    const html = renderToStaticMarkup(createElement(Fragment, null,
      createElement(BalloonsPreviewStatus, {locale, preview: {error: null}, content: data.content, editing}),
      createElement(BalloonsHeroBlock, {content: data.content.hero, pageTitle: data.content.pageTitle, homeLabel: "home", exploreLabel: "explore", images: data.images, editing}),
      createElement(BalloonsCategoriesBlock, {items: data.content.categories, localItems: local.categories, images: data.images, editing, label: "categories"}),
      createElement(BalloonsFavouritesBlock, {content: data.content.favourites, localItems: local.favourites.items, images: data.images, editing, askLabel: "ask", enquireLabel: "enquire", setsSubject: "ask"}),
      createElement(BalloonsPersonalisationBlock, {content: data.content.personalisation, localExtras: local.personalisation.extras, images: data.images, editing, enquireLabel: "enquire"}),
      createElement(BalloonsCtaBlock, {content: data.content.cta, images: data.images, editing, actionLabel: "create", subject: "create"})
    ));
    expect(html).toContain("Synthetic title"); expect(html).toContain("Synthetic category");
    for (const path of [`hero.title.${locale}`, `categories.sets.title.${locale}`, `favourites.neutral.imageAlt.${locale}`, `personalisation.teddy.title.${locale}`, `cta.imageAlt.${locale}`, `labels.createGift.${locale}`, "hero.photo", "personalisation.photo"]) expect(html).toContain(`path=${path};`);
    for (const path of data.fallbackPaths) expect(html).toContain(`path=${path};`);
    expect(html).toContain("object-position:75% 40%");
    expect(html).toContain(`subject=${encodeURIComponent(local.categories[0].title)}`); expect(html).not.toContain("subject=Synthetic");
  });
  it("omits public annotations", () => {expect(balloonsEditing("en", false)("hero.title")).toBeUndefined();});
});
