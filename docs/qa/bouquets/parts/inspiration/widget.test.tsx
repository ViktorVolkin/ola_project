import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {BouquetsInspiration} from "@/components/widgets/BouquetsInspiration/BouquetsInspiration";

const image = {src: "/assets/example.jpg", alt: "Flowers", width: 600, height: 800};
const ids = ["bouquet-inspiration", "soft-romance", "sunset", "natural-airy", "wild-beauty"];
const selectors = ids.map((targetId, index) => ({targetId, label: `Style ${index}`, image}));
const cards = ["soft-romance", "natural-airy", "peachy", "wild-beauty", "sunset", "lavender", "garden", "natural-beauty"]
  .map((id, index) => ({id, title: `Bouquet ${index}`, image, actionLabel: "Enquire"}));

describe("BouquetsInspiration server markup", () => {
  it("renders fragment links, ordered targets and neutral held actions", () => {
    const html = renderToStaticMarkup(<BouquetsInspiration heading="Inspiration" selectors={selectors} cards={cards} cardActionPendingReason="Awaiting a decision" />);
    expect([...html.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map(match => match[1])).toEqual(ids.map(id => `#${id}`));
    expect([...html.matchAll(/<article\s[^>]*id="([^"]+)"[^>]*tabindex="-1"/g)].map(match => match[1])).toEqual(cards.map(card => card.id));
    expect(html).toMatch(/<section id="bouquet-inspiration" tabindex="-1"/);
    expect((html.match(/<button\s/g) || [])).toHaveLength(8);
    expect((html.match(/ disabled=""/g) || [])).toHaveLength(8);
    expect((html.match(/aria-describedby="bouquet-card-action-pending"/g) || [])).toHaveLength(8);
    expect(html).toContain('id="bouquet-card-action-pending"');
    expect(html).toContain("Awaiting a decision");
    expect(html).not.toMatch(/<button[^>]*(?:href|formaction|target)=/);
    expect(html).not.toMatch(/aria-selected|role="tab|<form|<script/);
  });
});
