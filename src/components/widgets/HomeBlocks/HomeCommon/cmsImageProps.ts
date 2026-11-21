import type {CSSProperties} from "react";
import type {CmsImage} from "@/content/sanity/home";

/** Runtime focal data only; all image styling stays in the CSS Module. */
export function cmsImageProps(image?: CmsImage, mobile?: CmsImage) {
  return image ? {
    "data-cms-image": true,
    style: {
      "--cms-position": image.position,
      "--cms-mobile-position": mobile?.position ?? image.position,
    } as CSSProperties,
  } : {};
}
