import Image from "next/image";
import { balloonsImages } from "@/content/balloons";
import type {CmsImage} from "@/content/sanity/home";
import styles from "./BalloonsPhoto.module.css";

type BalloonsPhotoProps = {
  kind: keyof typeof balloonsImages;
  alt: string;
  sizes: string;
  className?: string;
  eager?: boolean;
  image?: CmsImage;
  annotation?: string;
};

/** Keep native source imagery and its clipping geometry in one server-rendered boundary. */
export function BalloonsPhoto({
  kind,
  alt,
  sizes,
  className = "",
  eager = false,
  image,
  annotation,
}: BalloonsPhotoProps) {
  return (
    <div className={`${styles.frame} ${className}`} data-balloon-photo={kind} data-sanity={annotation}>
      <div className={styles.imageFrame}>
        <Image
          src={image?.src ?? balloonsImages[kind]}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          className={styles.image}
          style={image ? {objectPosition: image.position} : undefined}
        />
      </div>
    </div>
  );
}
