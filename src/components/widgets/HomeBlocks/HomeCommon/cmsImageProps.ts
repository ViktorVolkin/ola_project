
import type {CSSProperties} from "react";
import type {CmsImage} from "@/content/sanity/home";

/**
 * CMS focal data only.
 *
 * Desktop and mobile images are independent.
 * A mobile-only CMS image must not override
 * the legacy desktop image presentation.
 */
export function cmsImageProps(
  image?: CmsImage,
  mobile?: CmsImage,
) {
  if (!image && !mobile) return {};

  return {
    ...(image ? {"data-cms-image": true} : {}),
    ...(mobile ? {"data-cms-mobile-image": true} : {}),
    style: {
      ...(image
        ? {"--cms-position": image.position}
        : {}),
      "--cms-mobile-position":
        mobile?.position ?? image?.position,
    } as CSSProperties,
  };
}
