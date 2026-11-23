import {describe, expect, it, vi} from "vitest";
import {createDataAttribute} from "next-sanity";
import {balloonsEditing} from "@/components/widgets/BalloonsBlocks/balloonsEditing";
import {studioUrl} from "@/content/sanity/preview-policy";

vi.mock("server-only", () => ({}));

describe("Balloons editing compatibility", () => {
  it.each(["en", "ru", "sr"] as const)("matches old SDK serialization in %s", locale => {
    const field = balloonsEditing(locale, true);
    for (const path of ["hero.title", "categories.garlands.description", "photo"]) {
      for (const image of [false, true]) {
        const previous = createDataAttribute({id: "balloonsPage", type: "balloonsPage", projectId: "zhn2ddaj", dataset: "production", baseUrl: studioUrl(), path: image ? path : `${path}.${locale}`}).toString();
        expect(field(path, image)).toBe(previous);
      }
    }
    expect(() => field("", true)).toThrow("`path` is required to create a data attribute");
    expect(balloonsEditing(locale, false)("hero.title")).toBeUndefined();
    expect(balloonsEditing(locale, false)("hero.photo", true)).toBeUndefined();
  });
});
