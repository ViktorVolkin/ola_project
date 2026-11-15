import type { BalloonsContent } from "@/content/balloons";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import { BalloonsPhoto } from "./BalloonsPhoto";
import styles from "./BalloonsCtaBlock.module.css";

export function BalloonsCtaBlock({
  content,
  actionLabel,
}: {
  content: BalloonsContent["cta"];
  actionLabel: string;
}) {
  return (
    <section
      className={styles.section}
      aria-labelledby="balloons-cta-title"
      data-balloons-section="cta"
    >
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <h2 className={styles.heading} id="balloons-cta-title">
            {content.title}
          </h2>
          <p className={styles.body}>{content.body}</p>
          <EnquiryLink subject={actionLabel}>{actionLabel}</EnquiryLink>
        </div>
      </Container>
      <BalloonsPhoto
        kind="cta"
        alt={content.imageAlt}
        sizes="100vw"
        className={styles.photo}
      />
      <div className={styles.fade} aria-hidden="true" />
    </section>
  );
}
