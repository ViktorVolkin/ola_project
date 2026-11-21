"use client";

import {Link, usePathname} from "@/i18n/navigation";
import {motion} from "framer-motion";
import {useMotionPreference} from "@/components/shared/MotionScroll/MotionScrollProvider";
import styles from "./Header.module.css";

export function DesktopNavigation({items, label}: {items: readonly {href: string; label: string}[]; label: string}) {
  const pathname = usePathname();
  const reduced = useMotionPreference();
  const isPreviewBouquets = pathname.startsWith("/preview/bouquet");
  return <nav className={styles.desktopNav} aria-label={label}>{items.map(item =>
    <Link key={item.href} href={item.href} aria-current={pathname === item.href || (isPreviewBouquets && item.href === "/bouquets") ? "page" : undefined}><motion.span whileHover={reduced ? undefined : {y: -2}} whileTap={reduced ? undefined : {scale: 0.98}}>{item.label}</motion.span></Link>
  )}</nav>;
}
