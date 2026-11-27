import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => createElement("img", props),
}));
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) =>
    createElement("a", { href }, children),
}));
import { BouquetsHero } from "@/components/widgets/BouquetBlocks/BouquetsHero/BouquetsHero";
describe("Bouquets hero CMS markup (mocked image and navigation)", () => {
  it.each(["en", "ru", "sr"])(
    "renders %s values and field annotations on actual elements",
    (locale) => {
      const value = (key: string) => `${locale}-${key}`;
      const html = renderToStaticMarkup(
        <BouquetsHero
          content={{
            breadcrumb: `${value("home")} / ${value("page")}`,
            title: value("title"),
            subtitle: value("subtitle"),
            body: value("body"),
            script: value("script"),
            actionLabel: value("explore"),
          }}
          inspirationHref="#bouquet-inspiration"
          image={{ src: "/photo.jpg", alt: "", width: 1200, height: 900, position: "30% 40%" }}
          editing={{
            breadcrumb: `breadcrumb.${locale}`,
            title: `title.${locale}`,
            subtitle: `subtitle.${locale}`,
            description: `body.${locale}`,
            handwritten: `script.${locale}`,
            action: `explore.${locale}`,
            image: "hero",
          }}
        />,
      );
      for (const key of ["breadcrumb", "title", "subtitle", "body", "script", "explore"])
        expect(html).toContain(`data-sanity="${key}.${locale}"`);
      for (const key of ["title", "subtitle", "body", "script", "explore"])
        expect(html).toContain(value(key));
      expect(html).toContain('data-sanity="hero"');
      expect(html).toContain("object-position:30% 40%");
      expect(html).toContain('href="#bouquet-inspiration"');
      expect(html).toContain('id="bouquets-title"');
      expect(html).not.toContain(" position=");
    },
  );
});
