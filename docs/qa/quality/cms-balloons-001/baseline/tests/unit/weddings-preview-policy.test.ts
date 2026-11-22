import {describe, expect, it} from "vitest";
import {previewPath, previewNavigationPath, validEnableUrl} from "@/content/sanity/preview-policy";

describe("Weddings exact preview route expansion", () => {
  it.each(["en", "ru", "sr"])("accepts %s without widening other routes", locale => {
    const path = `/${locale}/weddings-events`;
    expect(previewPath(path)).toBe(true);
    expect(previewNavigationPath(path, "https://example.test")).toBe(path);
    expect(validEnableUrl(new URL(`https://example.test/api?sanity-preview-secret=x&sanity-preview-pathname=${encodeURIComponent(path)}`))).toBe(true);
  });
  it.each(["/en/weddings-events/", "/en/weddings-events/x", "/en/%77eddings-events", "/de/weddings-events", "/en/weddings-events?x=1", "/en/weddings-events#x", "//evil.test/en/weddings-events", "/en/../ru/weddings-events", "https://evil.test/en/weddings-events"])("rejects %s", path => {
    expect(previewNavigationPath(path, "https://example.test")).toBeNull();
  });
});
