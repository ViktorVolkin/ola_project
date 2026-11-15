"use client";

import {useEffect, useState, useSyncExternalStore, type ReactNode} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {Link, usePathname} from "@/i18n/navigation";
import {Icon} from "@/components/shared/Icon";
import styles from "./Header.module.css";

const subscribe = () => () => {};
const getReady = () => true;
const getServerReady = () => false;

export function MobileNavigation({items, labels, enquiry, language}: {
  items: {href: string; label: string; contextLabel?: string}[];
  labels: {open: string; close: string; navigation: string; location: string};
  enquiry: ReactNode;
  language: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ready = useSyncExternalStore(subscribe, getReady, getServerReady);
  const pathname = usePathname();
  const context = pathname === "/about" || pathname === "/weddings-events" ? items.find((item) => item.href === pathname) : undefined;

  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia("(min-width: 1200px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => { if (event.matches) setOpen(false); };
    query.addEventListener("change", closeAtDesktop);
    return () => query.removeEventListener("change", closeAtDesktop);
  }, [open, setOpen]);

  return <div className={styles.mobile}>
    {context && <span className={styles.contextLabel} aria-current="page">{context.contextLabel ?? context.label}</span>}
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild><button className={styles.menuButton} type="button" disabled={!ready} aria-label={open ? labels.close : labels.open}>
        <Icon name={open ? "close" : "menu"} width="24" height="24" />
      </button></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} data-navigation-overlay />
        <Dialog.Content className={styles.panel} aria-describedby={undefined} onEscapeKeyDown={(event) => {
          // Radix listens in capture phase; let the focused child consume Escape first.
          if (event.target instanceof Element && event.target.closest('[data-language-open="true"]')) event.preventDefault();
        }}>
          <Dialog.Title className={styles.visuallyHidden}>{labels.navigation}</Dialog.Title>
          <Dialog.Close className={styles.panelClose} aria-label={labels.close} type="button">
            <Icon name="close" width="24" height="24" />
          </Dialog.Close>
          <nav aria-label={labels.navigation}>{items.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>
          <div className={styles.panelEnquiry}>{enquiry}</div>
          <p>{labels.location}</p>
          {language}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>;
}
