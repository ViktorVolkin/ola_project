import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {EditorialCard} from "@/components/shared/EditorialCard/EditorialCard";

describe("EditorialCard", () => {
  it("retains the direct card's native action and photo annotation", () => {
    const html = renderToStaticMarkup(createElement(EditorialCard, {
      className: "card", photoClassName: "photo", photoAnnotation: "photo-edit",
      media: createElement("img", {alt: "flowers"}),
      title: createElement("h3", {"data-sanity": "title-edit"}, "Roses"),
      action: createElement("a", {href: "#flowers"}, "View"),
    }));
    expect(html).toMatch(/<article[^>]*><div[^>]*data-sanity="photo-edit"><img alt="flowers"\/><\/div><h3 data-sanity="title-edit">Roses<\/h3><a href="#flowers">View<\/a><\/article>/);
  });
  it("retains grouped caption, target focus and native disabled action", () => {
    const html = renderToStaticMarkup(createElement(EditorialCard, {
      id: "target", tabIndex: -1, photoClassName: "photo", captionClassName: "caption",
      media: createElement("img", {alt: "bouquet", "data-sanity": "image-edit"}),
      title: createElement("h3", {"data-sanity": "title-edit"}, "Title"),
      action: createElement("button", {disabled: true, type: "button", "aria-describedby": "pending", "data-sanity": "action-edit"}, "Ask"),
    }));
    expect(html).toContain('id="target" tabindex="-1"');
    expect(html).toContain('data-sanity="image-edit"');
    expect(html).toContain('data-sanity="title-edit"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-describedby="pending"');
    expect(html).toContain('data-sanity="action-edit"');
    expect(html).toMatch(/<div class="[^"]*caption[^"]*"><h3/);
  });
});
