"use client";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./ContactFaq.module.css";

export function ContactFaq({ items }: { items: { question: string; answer: string }[] }) {
  const id = useId();
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
        return (
          <div className={styles.item} key={i}>
            <h3 className={styles.title}>
              <button
                ref={(node) => {
                  buttons.current[i] = node;
                }}
                className={styles.trigger}
                type="button"
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
            <div id={panelId} hidden={!expanded} className={styles.answer}>
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
