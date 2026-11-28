import clsx from "clsx";
import { NotFoundRippleIntro } from "../NotFoundRippleIntro";
import styles from "./NotFoundArtwork.module.css";

export function NotFoundArtwork({
  signature,
  className,
}: {
  signature: string;
  className?: string;
}) {
  return (
    <NotFoundRippleIntro className={className}>
      <span data-404-ring="" className={clsx(styles.ring, styles.outer)} />
      <span data-404-ring="" className={clsx(styles.ring, styles.second)} />
      <span data-404-ring="" className={clsx(styles.ring, styles.third)} />
      <span data-404-ring="" className={clsx(styles.ring, styles.inner)} />
      <span data-404-centre="" className={styles.centre} />
      <span data-404-number="" className={styles.number}>
        404
      </span>
      <span data-404-signature="" className={styles.signature}>
        {signature}
      </span>
    </NotFoundRippleIntro>
  );
}
