"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./NotFoundArtwork/NotFoundArtwork.module.css";

type NotFoundRippleIntroProps = { children: ReactNode; className?: string };

/** Opt-in lifecycle only: artwork/text remain server-rendered and static without JS. */
export function NotFoundRippleIntro({
  children,
  className = "",
}: NotFoundRippleIntroProps) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = stage.current;
    if (!element || typeof window.matchMedia !== "function") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || typeof preference.addEventListener !== "function")
      return;

    const stop = () => {
      element.dataset.motion = "static";
    };
    element.dataset.motion = "intro";
    
    const timer = window.setTimeout(stop, 10500);
    const onPreferenceChange = () => {
      if (preference.matches) {
        window.clearTimeout(timer);
        stop();
      }
      // Returning to no-preference must not replay an interrupted intro.
    };
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      window.clearTimeout(timer);
      preference.removeEventListener("change", onPreferenceChange);
      stop();
    };
  }, []);

  return (
    <div
      ref={stage}
      className={`${styles.stage} ${className}`}
      data-404-artwork=""
      data-motion="static"
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
