import {expect, test} from "vitest";
import {getEnquiryUrl} from "@/components/widgets/EnquiryLink/enquiry-url";

test("missing contact never becomes a manufactured enquiry URL", () => {
  expect(getEnquiryUrl(null, "Weddings")).toBeNull();
});

test("generic enquiries preserve the supplied URL unchanged", () => {
  const url = "https://example.invalid/enquiry?text=Approved%20message";
  expect(getEnquiryUrl(url)).toBe(url);
});

test("category subject preserves its exact label without modifying the configured URL", () => {
  const original = "https://example.invalid/enquiry?text=Approved%20message&source=preview";
  const result = new URL(getEnquiryUrl(original, "Свадьбы и события")!);
  expect(result.searchParams.get("text")).toBe("Approved message\nСвадьбы и события");
  expect(result.searchParams.get("source")).toBe("preview");
  expect(new URL(original).searchParams.get("text")).toBe("Approved message");
});

test("a subject-only enquiry does not invent a message template", () => {
  const result = new URL(getEnquiryUrl("https://example.invalid/enquiry", "Event Rentals")!);
  expect(result.searchParams.get("text")).toBe("Event Rentals");
});
