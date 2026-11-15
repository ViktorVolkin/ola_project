"use client";

import {Link, usePathname} from "@/i18n/navigation";
import styles from "./Header.module.css";

export function DesktopNavigation({items, label}: {items: readonly {href: string; label: string}[]; label: string}) {
  const pathname = usePathname();
  return <nav className={styles.desktopNav} aria-label={label}>{items.map(item =>
    <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>
  )}</nav>;
}
