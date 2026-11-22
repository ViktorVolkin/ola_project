import type { WeddingsEditing } from "../WeddingsCommon/weddingsEditing";
import { Container } from "@/components/shared/Container/Container";
import type { WeddingsProcessBlockProps } from "./WeddingsProcessBlock.types";
import { PROCESS_TITLE_ID } from "../WeddingsCommon/WeddingsCommon.constants";
import styles from "./WeddingsProcessBlock.module.css";

export function WeddingsProcessBlock({ content, editing }: WeddingsProcessBlockProps & {editing: WeddingsEditing}) {
  return (
    <section id="our-process" aria-labelledby={PROCESS_TITLE_ID} className={styles.section}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <p data-sanity={editing("process.eyebrow")} className={styles.eyebrow}>{content.eyebrow}</p>
          <h2 data-sanity={editing("process.title")} id={PROCESS_TITLE_ID} className={styles.heading}>
            {content.title}
          </h2>
          <ol className={styles.steps}>
            {content.steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.badge} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.stepContent}>
                  <h3 data-sanity={editing(`process.step${index + 1}.title`)} className={styles.stepTitle}>{step.title}</h3>
                  <p data-sanity={editing(`process.step${index + 1}.description`)} className={styles.stepDescription}>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
