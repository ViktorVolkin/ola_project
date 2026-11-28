"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMotionPreference } from "@/components/shared/MotionScroll/MotionScrollProvider";
import styles from "./ContactFaq.module.css";

export function ContactFaq({
  items,
  attributes,
}: {
  items: { question: string; answer: string }[];
  attributes?: { question?: string; answer?: string }[];
}) {
  const id = useId();
  const reduced = useMotionPreference();
  const [open, setOpen] = useState<number[]>([0]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || !items.length) return;

    let next: number;

    switch (event.key) {
      case "ArrowDown":
        next = (index + 1) % items.length;
        break;
      case "ArrowUp":
        next = (index - 1 + items.length) % items.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = items.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    buttons.current[next]?.focus();
  }

  return (
    <div>
      {items.map((item, i) => {
        const expanded = open.includes(i);
        const panelId = `${id}-answer-${i}`;
        const buttonId = `${id}-question-${i}`;
        const attribute = attributes?.[i];

        return (
          <div className={styles.item} key={i}>
            <h3 className={styles.title}>
              <button
                id={buttonId}
                ref={(node) => {
                  buttons.current[i] = node;
                }}
                className={styles.trigger}
                type="button"
                data-sanity={attribute?.question}
                aria-expanded={expanded}
                aria-controls={panelId}
                onKeyDown={(event) => navigate(event, i)}
                onClick={() =>
                  setOpen((current) =>
                    current.includes(i) ? current.filter((value) => value !== i) : [...current, i],
                  )
                }
              >
                <span>{item.question}</span>

                <svg
                  className={styles.sign}
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d={expanded ? "M3 8h10" : "M3 8h10M8 3v10"} />
                </svg>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key={panelId}
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  data-sanity={attribute?.answer}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : {
                          height: {
                            duration: 0.32,
                            ease: [0.22, 1, 0.36, 1],
                          },
                          opacity: {
                            duration: 0.2,
                          },
                        }
                  }
                  className={styles.answerWrapper}
                >
                  <div className={styles.answer}>{item.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
