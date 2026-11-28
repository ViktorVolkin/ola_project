import type {HTMLAttributes, ReactNode} from "react";
import clsx from "clsx";
import styles from "./EditorialCard.module.css";

type EditorialCardProps = Omit<HTMLAttributes<HTMLElement>, "title" | "children"> & {
  media: ReactNode;
  title: ReactNode;
  action: ReactNode;
  photoClassName: string;
  photoAnnotation?: string;
  captionClassName?: string;
};

/** The caller owns image delivery, heading, action and any editing annotations. */
export function EditorialCard({media, title, action, photoClassName, photoAnnotation, captionClassName, className, ...props}: EditorialCardProps) {
  const caption = <>{title}{action}</>;
  return (
    <article {...props} className={clsx(styles.card, className)}>
      <div className={clsx(styles.photo, photoClassName)} data-sanity={photoAnnotation}>{media}</div>
      {captionClassName ? <div className={clsx(styles.caption, captionClassName)}>{caption}</div> : caption}
    </article>
  );
}
