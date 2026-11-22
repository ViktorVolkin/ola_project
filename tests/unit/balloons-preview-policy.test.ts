import {describe, expect, it} from "vitest";
import {previewPath, previewNavigationPath, validEnableUrl} from "@/content/sanity/preview-policy";

describe("Balloons exact preview route expansion", () => {
  it.each(["en", "ru", "sr"])("permits %s and preserves prior page routes", locale => {
    const path = `/${locale}/balloons`;
    for (const prior of [`/${locale}`, `/${locale}/about`, `/${locale}/weddings-events`]) expect(previewPath(prior)).toBe(true);
    expect(previewPath(path)).toBe(true);
    expect(previewNavigationPath(path, "https://example.test")).toBe(path);
    expect(previewNavigationPath(`https://example.test${path}`, "https://example.test")).toBe(path);
    expect(validEnableUrl(new URL(`https://example.test/api?sanity-preview-secret=x&sanity-preview-pathname=${encodeURIComponent(path)}`))).toBe(true);
  });
  it.each(["/en/balloons/", "/en/balloons/x", "/en/%62alloons", "/de/balloons", "/en/balloons?x=1", "/en/balloons#x", "//evil.test/en/balloons", "/en/../ru/balloons", "https://evil.test/en/balloons", "/en/balloons\n", "/en/balloons%3Fx=1"])("rejects %s", path => {
    expect(previewNavigationPath(path, "https://example.test")).toBeNull();
    expect(previewPath(path)).toBe(false);
  });
});
