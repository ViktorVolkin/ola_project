import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {beforeEach, expect, test, vi} from "vitest";

const pathname = vi.hoisted(() => ({value: "/preview/bouquet"}));
vi.mock("@/i18n/navigation", () => ({usePathname: () => pathname.value}));

import {HeaderCtaLabel} from "@/components/widgets/Header/HeaderCtaLabel";

beforeEach(() => { pathname.value = "/preview/bouquet"; });

function renderLabel(defaultLabel: string): string {
  return renderToStaticMarkup(createElement(HeaderCtaLabel, {defaultLabel, previewLabel: "Enquire"}));
}

test.each([
  ["English", "Order via WhatsApp"],
  ["Russian", "Заказать в WhatsApp"],
  ["Serbian", "Poručite putem WhatsApp‑a"]
])("renders the approved preview label for %s", (_locale, normalLabel) => {
  expect(renderLabel(normalLabel)).toBe("Enquire");
});

test.each([
  ["/bouquets", "Order via WhatsApp"],
  ["/contact", "Заказать в WhatsApp"],
  ["/preview/bouquet/rose", "Poručite putem WhatsApp‑a"],
  ["/preview/bouquet-extra", "Order via WhatsApp"]
])("preserves the supplied normal label at %s", (route, normalLabel) => {
  pathname.value = route;
  expect(renderLabel(normalLabel)).toBe(normalLabel);
});
