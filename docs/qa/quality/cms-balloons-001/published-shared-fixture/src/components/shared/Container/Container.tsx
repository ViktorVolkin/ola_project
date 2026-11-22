import type {HTMLAttributes} from "react";
import styles from "./Container.module.css";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "header" | "footer" | "nav";
  variant?: "default" | "wide";
};

/** Default caps the content track; wide preserves the wider shared chrome. */
export function Container({as: Tag = "div", variant = "default", className = "", ...props}: ContainerProps) {
  return <Tag {...props} className={`${styles.container} ${styles[variant]} ${className}`} />;
}
