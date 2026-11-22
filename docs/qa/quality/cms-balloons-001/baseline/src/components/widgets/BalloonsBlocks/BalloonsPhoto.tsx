import Image from "next/image";
import { balloonsImages } from "@/content/balloons";
import styles from "./BalloonsPhoto.module.css";

type BalloonsPhotoProps = {
  kind: keyof typeof balloonsImages;
  alt: string;
  sizes: string;
  className?: string;
  eager?: boolean;
};

/** Keep native source imagery and its clipping geometry in one server-rendered boundary. */
export function BalloonsPhoto({
  kind,
  alt,
  sizes,
  className = "",
  eager = false,
}: BalloonsPhotoProps) {
  return (
    <div className={`${styles.frame} ${className}`} data-balloon-photo={kind}>
      <div className={styles.imageFrame}>
        <Image
          src={balloonsImages[kind]}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          className={styles.image}
        />
      </div>
    </div>
  );
}
