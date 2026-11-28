
import {describe, expect, it} from "vitest";
import {cmsImageProps} from "@/components/widgets/HomeBlocks/HomeCommon/cmsImageProps";

const desktop = {
  src: "https://example.test/desktop.jpg",
  position: "30% 40%",
};

const mobile = {
  src: "https://example.test/mobile.jpg",
  position: "10% 25%",
};

describe("Home CMS image presentation", () => {
  it("preserves local styling when CMS images are absent", () => {
    expect(cmsImageProps()).toEqual({});
  });

  it("uses desktop position on both viewports when mobile is absent", () => {
    expect(cmsImageProps(desktop)).toEqual({
      "data-cms-image": true,
      style: {
        "--cms-position": "30% 40%",
        "--cms-mobile-position": "30% 40%",
      },
    });
  });

  it("supports mobile-only CMS images without changing desktop styling", () => {
    expect(cmsImageProps(undefined, mobile)).toEqual({
      "data-cms-mobile-image": true,
      style: {
        "--cms-mobile-position": "10% 25%",
      },
    });
  });

  it("preserves independent desktop and mobile positions", () => {
    expect(cmsImageProps(desktop, mobile)).toEqual({
      "data-cms-image": true,
      "data-cms-mobile-image": true,
      style: {
        "--cms-position": "30% 40%",
        "--cms-mobile-position": "10% 25%",
      },
    });
  });
});
