"use client";

import {useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent} from "react";

const subscribe = () => () => {};

export function useDisclosure() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return {open, setOpen, rootRef, triggerRef, panelId, onKeyDown, ready};
}
