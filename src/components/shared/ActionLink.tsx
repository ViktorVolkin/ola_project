import clsx from "clsx";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Icon } from "./Icon";
import styles from "./ActionLink.module.css";

export type ActionVariant = "primary" | "secondary" | "light" | "text";

export function actionClassName(variant: ActionVariant = "primary", className = "") {
  return clsx(styles.action, styles[variant], className);
}

export function ActionLink({
  href,
  children,
  variant = "primary",
  className,
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  variant?: ActionVariant;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link href={href} className={actionClassName(variant, className)}>
      {children}
      {arrow && <Icon name="arrow-right" />}
    </Link>
  );
}
