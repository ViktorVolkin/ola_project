"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useMotionPreference } from "@/components/shared/MotionScroll/MotionScrollProvider";
import styles from "./Header.module.css";

function NavigationItem({
  href,
  label,
  current,
  reduced,
}: {
  href: string;
  label: string;
  current: boolean;
  reduced: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        initial={false}
        animate={{ y: hovered && !reduced ? -2 : 0 }}
        whileTap={reduced ? undefined : { scale: 0.98 }}
        transition={{
          y: {
            type: "tween",
            duration: 0.3,
            delay: hovered ? 0 : 0.12,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
      >
        {label}
      </motion.span>
    </Link>
  );
}

export function DesktopNavigation({
  items,
  label,
}: {
  items: readonly { href: string; label: string }[];
  label: string;
}) {
  const pathname = usePathname();
  const reduced = useMotionPreference();
  const isPreviewBouquets = pathname.startsWith("/preview/bouquet");

  return (
    <nav className={styles.desktopNav} aria-label={label}>
      {items.map((item) => (
        <NavigationItem
          key={item.href}
          href={item.href}
          label={item.label}
          reduced={reduced}
          current={pathname === item.href || (isPreviewBouquets && item.href === "/bouquets")}
        />
      ))}
    </nav>
  );
}
