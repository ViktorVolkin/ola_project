
"use client";

import {useEffect, useRef} from "react";
import {usePathname, useRouter} from "next/navigation";
import {enableVisualEditing} from "@sanity/visual-editing";
import type {VisualEditingOptions} from "@sanity/visual-editing";
import {previewPath, previewNavigationPath, trustedStudio} from "@/content/sanity/preview-policy";

type Navigate = Parameters<
  NonNullable<VisualEditingOptions["history"]>["subscribe"]
>[0];

export function HomeVisualEditing() {
  const router = useRouter();
  const pathname = usePathname();
  const navigate = useRef<Navigate | undefined>(undefined);

  useEffect(() => {
    if (!previewPath(pathname)) return;

    const guard = (event: MessageEvent) => {
      if (!trustedStudio(event.origin)) {
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("message", guard, true);

    const media = window.matchMedia("(max-width: 599px)");

    const update = () => {
      document
        .querySelectorAll<HTMLElement>("[data-sanity-mobile]")
        .forEach((node) => {
          const value = media.matches
            ? node.dataset.sanityMobile
            : node.dataset.sanityDesktop;

          if (value) node.dataset.sanity = value;
        });
    };

    update();
    media.addEventListener("change", update);

    const observer = new MutationObserver(update);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const disable = enableVisualEditing({
      history: {
        subscribe(listener) {
          navigate.current = listener;
          listener({type: "push", url: location.href});

          return () => {
            navigate.current = undefined;
          };
        },

        update(event) {
          const path = previewNavigationPath(event.url, location.origin);
          if (!path) return;
          // Use the explicit validated destination, never an unbounded back().
          if (event.type === "replace" || event.type === "pop") {
            router.replace(path);
          } else {
            router.push(path);
          }
        },
      },

      refresh() {
        router.refresh();

        return new Promise<void>((resolve) =>
          setTimeout(resolve, 1000),
        );
      },
    });

    return () => {
      disable();
      window.removeEventListener("message", guard, true);
      media.removeEventListener("change", update);
      observer.disconnect();
    };
  }, [router, pathname]);

  useEffect(() => {
    navigate.current?.({
      type: "push",
      url: location.href,
    });
  }, [pathname]);

  return null;
}
