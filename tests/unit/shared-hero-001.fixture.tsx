import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "@/components/shared/Hero";
vi.mock("server-only", () => ({}));
vi.mock("next/image", () => ({default: ({alt}: {alt: string}) => createElement("img", {alt})}));
vi.mock("@/i18n/navigation", () => ({Link: ({children, href}: {children: ReactNode; href: string}) => createElement("a", {href}, children)}));
vi.mock("@/components/widgets/EnquiryLink/EnquiryLink", () => ({EnquiryLink: ({children}: {children: ReactNode}) => createElement("a", {href: "/enquiry"}, children)}));
vi.mock("@/components/widgets/BouquetDetailGallery/BouquetDetailGallery", () => ({BouquetDetailGallery: () => createElement("button", null, "gallery control")}));
vi.mock("@/components/widgets/BouquetDetailPreferences/BouquetDetailPreferences", () => ({BouquetDetailPreferences: () => createElement("input", {"aria-label": "preference"})}));
vi.mock("@/components/widgets/BouquetDetailSupporting/BouquetDetailSupporting", () => ({BouquetDetailInformation: () => createElement("p", null, "information")}));
import { BouquetsHero } from "@/components/widgets/BouquetsHero/BouquetsHero";
import { BouquetDetailHero } from "@/components/widgets/BouquetDetailHero/BouquetDetailHero";
import { ContactHero } from "@/components/widgets/ContactBlocks/ContactHero/ContactHero";
import { AboutHeroBlock } from "@/components/widgets/AboutBlocks/AboutHeroBlock/AboutHeroBlock";
import { WeddingsHeroBlock } from "@/components/widgets/WeddingsBlocks/WeddingsHeroBlock/WeddingsHeroBlock";
import heroStyles from "@/components/shared/Hero/Hero.module.css";
import weddingsStyles from "@/components/widgets/WeddingsBlocks/WeddingsHeroBlock/WeddingsHeroBlock.module.css";

describe("shared hero migration", () => {
  it("keeps overlay and split skeleton", () => {
    for (const variant of ["overlay", "split"] as const) {
      const html = renderToStaticMarkup(<Hero variant={variant} titleId="heading" title="Title" image={createElement("img", {alt: "photo"})} handwritten="note" />);
      expect(html).toContain('aria-labelledby="heading"'); expect(html).toContain('<h1 id="heading"'); expect(html).toContain('alt="photo"'); expect(html).toContain('note');
    }

  });
  it("keeps the shared caption class and applies the optional class only to the caption", () => {
    for (const variant of ["overlay", "split"] as const) {
      for (const custom of [undefined, "local-caption"]) {
        const html = renderToStaticMarkup(<Hero variant={variant} titleId="heading" title="Title" image={createElement("img", {alt: "photo"})} handwritten="note" handwrittenClassName={custom} annotations={{handwritten: "edit-caption"}} />);
        const section = html.match(/<section\b[^>]*>/)?.[0] ?? "";
        const caption = html.match(/<p\b[^>]*>note<\/p>/)?.[0] ?? "";
        expect(caption).toContain(heroStyles.handwritten);
        expect(caption).toContain('data-sanity="edit-caption"');
        expect(section).not.toContain("handwrittenClassName");
        expect(section).not.toContain("local-caption");
        if (custom) expect(caption).toContain(custom);
        else expect(caption).not.toContain("local-caption");
      }
    }
  });
  it("uses the Weddings caption class and annotation for EN, RU and SR content", () => {
    for (const note of ["Wedding note", "Свадебная заметка", "Venčanje"]) {
      const html = renderToStaticMarkup(<WeddingsHeroBlock content={{title: "Title", lead: "Lead", body: "Body", handwritten: note, imageAlt: "Photo"}} homeLabel="Home" planLabel="Plan" editing={(key: string) => `edit-${key}`} eventSubject="Wedding" />);
      const caption = html.match(new RegExp(`<p\\b[^>]*>${note}<\\/p>`))?.[0] ?? "";
      expect(caption).toContain(heroStyles.handwritten);
      expect(caption).toContain(weddingsStyles.heroHandwritten);
      expect(caption).toContain('data-sanity="edit-hero.handwritten"');
    }
  });
  it("every named wrapper actually renders the shared primitive", () => {
    const paths = ["HomeBlocks/HomeHeroBlock/HomeHeroBlock", "AboutBlocks/AboutHeroBlock/AboutHeroBlock", "WeddingsBlocks/WeddingsHeroBlock/WeddingsHeroBlock", "BalloonsBlocks/BalloonsHeroBlock/BalloonsHeroBlock", "ContactBlocks/ContactHero/ContactHero", "BouquetsHero/BouquetsHero", "BouquetDetailHero/BouquetDetailHero"];
    for (const path of paths) {const source = readFileSync(`src/components/widgets/${path}.tsx`, "utf8"); expect(source).toMatch(/<Hero\b/); expect(source).toContain("@/components/shared/Hero");}
  });
  it("renders bouquets and detail actions, gallery, preferences and ordering", () => {
    const bouquets = renderToStaticMarkup(<BouquetsHero content={{breadcrumb:"Home / Flowers", title:"Flowers", subtitle:"sub", body:"body", script:"script", actionLabel:"Explore"}} inspirationHref="#inspiration" image={{src:"/photo.jpg", alt:"flowers", width:100, height:100}} />);
    expect(bouquets).toContain('href="#inspiration"'); expect(bouquets).toContain('alt="flowers"'); expect(bouquets).toContain('aria-current="page"');
    const detail = renderToStaticMarkup(<BouquetDetailHero home="Home" bouquets="Flowers" title="Rose" support="support" body="body" back="Back" reassurance="assurance" action={<button>Order</button>} images={[{src:"/rose.jpg", alt:"rose", width:100, height:100, thumbnailLabel:"Rose"}]} galleryLabel="Gallery" preferences={{} as never} information={[] as never} decorative={<span>decoration</span>} />);
    for (const text of ["Rose", "gallery control", "preference", "Order", "Back", "assurance", "information"]) expect(detail).toContain(text);
    expect(detail).toContain("gallery control");
  });
  it("retains about and contact annotations and destinations", () => {
    const editing = (key: string) => `edit-${key}`;
    const about = renderToStaticMarkup(<AboutHeroBlock content={{title:"About", eyebrow:"intro", body:"story", handwritten:"note", alt:"portrait"}} storyLabel="Story" editing={editing} />);
    expect(about).toContain('href="#our-story"'); expect(about).toContain('edit-hero.title'); expect(about).toContain('alt="portrait"');
    const contact = renderToStaticMarkup(<ContactHero content={{home:"Home", page:"Contact", heroTitle:"Contact us", heroBody:"body", heroAction:"Ask", heroScript:"note"}} editing={editing} />);
    expect(contact).toContain('aria-label="Contact"'); expect(contact).toContain('edit-heroTitle'); expect(contact).toContain('href="/enquiry"');
  });
});
