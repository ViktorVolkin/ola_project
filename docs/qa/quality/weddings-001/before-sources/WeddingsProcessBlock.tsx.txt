import type {WeddingsContent} from "@/content/weddings";
import {Container} from "@/components/shared/Container/Container";
import styles from "./WeddingsProcessBlock.module.css";

interface WeddingsProcessBlockProps {
  content: WeddingsContent["process"];
}

export function WeddingsProcessBlock({content}: WeddingsProcessBlockProps) {
  return (
    <section id="our-process" aria-labelledby="weddings-process-title" className={styles.section}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h2 id="weddings-process-title" className={styles.heading}>
            {content.title}
          </h2>
          <ol className={styles.steps}>
            {content.steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.badge} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
