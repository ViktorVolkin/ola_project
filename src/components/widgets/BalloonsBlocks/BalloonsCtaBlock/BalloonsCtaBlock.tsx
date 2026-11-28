import type { BalloonsContent } from "@/content/balloons";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import { BalloonsPhoto } from "../BalloonsPhoto/BalloonsPhoto";
import type {BalloonsImages} from "@/content/sanity/balloons";
import {BalloonsEditable, type BalloonsEditing} from "../balloonsEditing";
import styles from "./BalloonsCtaBlock.module.css";

export function BalloonsCtaBlock({
  content,
  actionLabel,
  images, editing, subject,
}: {
  content: BalloonsContent["cta"];
  actionLabel: string;
  images: BalloonsImages; editing: BalloonsEditing; subject: string;
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
            <BalloonsEditable attribute={editing("cta.title")}>{content.title}</BalloonsEditable>
          </h2>
          <p className={styles.body}><BalloonsEditable attribute={editing("cta.body")}>{content.body}</BalloonsEditable></p>
          <EnquiryLink subject={subject}><BalloonsEditable attribute={editing("labels.createGift")}>{actionLabel}</BalloonsEditable></EnquiryLink>
        </div>
      </Container>
      <BalloonsPhoto
        kind="cta"
        image={images.cta} annotation={editing("cta.photo", true)}
        alt={content.imageAlt}
        sizes="100vw"
        className={styles.photo}
      />
      <div className={styles.fade} aria-hidden="true" />
    </section>
  );
}
