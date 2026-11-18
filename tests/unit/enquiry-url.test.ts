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

test.each([
  ["English", "Private Dining"],
  ["Russian", "Свадьбы и события"],
  ["Serbian with Latin diacritics", "Venčanja i događaji"],
])("preserves the exact %s subject", (_language, subject) => {
  const result = new URL(getEnquiryUrl("https://example.invalid/enquiry", subject)!);
  expect(result.searchParams.get("text")).toBe(subject);
});

test("preserves special characters in the subject as decoded text", () => {
  const result = new URL(getEnquiryUrl("https://example.invalid/enquiry", "A&B #1 + 50%?" )!);
  expect(result.searchParams.get("text")).toBe("A&B #1 + 50%?");
});

test("appends to percent-encoded existing text and preserves unrelated query and fragment", () => {
  const original = "https://example.invalid/enquiry?text=Approved%20%26%20ready&tag=one&tag=two#details";
  const result = new URL(getEnquiryUrl(original, "Venčanja i događaji")!);
  expect(result.searchParams.get("text")).toBe("Approved & ready\nVenčanja i događaji");
  expect(result.searchParams.getAll("tag")).toEqual(["one", "two"]);
  expect(result.hash).toBe("#details");
});

test.each([undefined, ""])("returns the destination byte-for-byte for an empty or omitted subject (%s)", (subject) => {
  const original = "https://example.invalid/enquiry?tag=one&tag=two#details";
  expect(getEnquiryUrl(original, subject)).toBe(original);
});
