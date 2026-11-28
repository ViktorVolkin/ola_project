"use client";

import {createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode} from "react";
import {MotionConfig} from "framer-motion";
import Lenis from "lenis";

const query = "(prefers-reduced-motion: reduce)";
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const snapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => true;
const ScrollContext = createContext<(suspended: boolean) => void>(() => {});

export function useMotionPreference() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

export function useSuspendSmoothScroll(suspended: boolean) {
  const setSuspended = useContext(ScrollContext);
  useEffect(() => {
    setSuspended(suspended);
    return () => setSuspended(false);
  }, [setSuspended, suspended]);
}

export function MotionScrollProvider({children}: {children: ReactNode}) {
  const reduced = useMotionPreference();
  const [suspended, setSuspended] = useState(false);
  useEffect(() => {
    if (reduced || suspended) return;
    const lenis = new Lenis({autoRaf: true, syncTouch: false, stopInertiaOnNavigate: true});
    // Stop resets Lenis to the actual native position and cancels its animation;
    // immediately restart so the browser owns this navigation, not future wheels.
    const handoff = () => {
      if (lenis.isScrolling === "smooth") {
        lenis.stop();
        lenis.start();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["Tab", "Home", "End", "PageUp", "PageDown", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) handoff();
    };
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href*="#"]')) handoff();
    };
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("focusin", handoff, true);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("focusin", handoff, true);
      window.removeEventListener("click", onClick, true);
      lenis.destroy();
    };
  }, [reduced, suspended]);

  return <ScrollContext.Provider value={setSuspended}><MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig></ScrollContext.Provider>;
}
