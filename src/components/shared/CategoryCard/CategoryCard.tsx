import type {ReactNode} from "react";
import clsx from "clsx";
import styles from "./CategoryCard.module.css";

type CategoryCardProps = {
  photo: ReactNode;
  title: ReactNode;
  description: ReactNode;
  action: ReactNode;
  className: string;
  copyClassName: string;
  textClassName?: string;
};

/** Callers own photo delivery, heading annotations and native action semantics. */
export function CategoryCard({photo, title, description, action, className, copyClassName, textClassName}: CategoryCardProps) {
  return (
    <li className={clsx(styles.card, className)}>
      {photo}
      <div className={clsx(styles.copy, copyClassName)}>
        <div className={textClassName}>{title}{description}</div>
        {action}
      </div>
    </li>
  );
}
