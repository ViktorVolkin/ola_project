import {createElement} from "react";
import {expect, test} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {ActionButton} from "@/components/shared/ActionButton";
import {actionClassName} from "@/components/shared/ActionLink";

test("defaults to a non-submitting native button and renders children", () => {
  const html = renderToStaticMarkup(createElement(ActionButton, null, "Unavailable enquiry"));
  expect(html).toContain('<button type="button"');
  expect(html).toContain(">Unavailable enquiry</button>");
});

test("supports explicit type, variants, className, disabled, aria and data attributes", () => {
  const props = {
    type: "submit" as const, variant: "secondary" as const, className: "custom", disabled: true,
    "aria-describedby": "help", "data-enquiry-subject": "Weddings"
  };
  const html = renderToStaticMarkup(createElement(ActionButton, props, "Send"));
  expect(html).toContain('<button type="submit"');
  expect(html).toContain(`class="${actionClassName("secondary", "custom")}"`);
  expect(html).toContain(" disabled");
  expect(html).toContain('aria-describedby="help"');
  expect(html).toContain('data-enquiry-subject="Weddings"');
  expect(html).toContain(">Send</button>");
});
