import {describe, expect, it} from "vitest";
import {homePath, validEnableUrl} from "@/content/sanity/preview-policy";
const origin = "https://preview.example.test";
describe("exact Home + About preview authorization", () => {
  it.each(["/en", "/ru", "/sr", "/en/about", "/ru/about", "/sr/about"])("allows exactly %s", path => {
    expect(homePath(path)).toBe(true);
    expect(validEnableUrl(new URL(`${origin}/api/draft-mode/enable?sanity-preview-secret=synthetic&sanity-preview-pathname=${encodeURIComponent(path)}`))).toBe(true);
  });
  it.each([null,"/de/about","/en/balloons","/en/about/","/en/about/x","//evil.test/en/about","https://evil.test/en/about","/en/about?x=1","/en/about#x","/en/../ru/about","/en/%61bout","/%65n/about","/en%2fabout","/en\\about","/en/about\n","/EN/about","/en/about%3Fx=1"])("rejects noncanonical %s", path => expect(homePath(path)).toBe(false));
});
