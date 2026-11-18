import Image from "next/image";
import { weddingsImages } from "@/content/weddings";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import type { WeddingsInspirationBlockProps } from "./WeddingsInspirationBlock.types";
import { INSPIRATION_TITLE_ID } from "../WeddingsCommon/WeddingsCommon.constants";
import styles from "./WeddingsInspirationBlock.module.css";

export function WeddingsInspirationBlock({
  content,
  discussLabel,
  eventSubject,
}: WeddingsInspirationBlockProps) {
  return (
    <section
      className={styles.section}
      aria-labelledby={INSPIRATION_TITLE_ID}
      data-weddings-section="inspiration"
    >
      <Container className={styles.inner}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 className={styles.heading} id={INSPIRATION_TITLE_ID}>
          {content.title}
        </h2>
        <div className={styles.grid}>
          {content.items.map((item) => (
            <figure key={item.id}>
              <div className={styles.photo}>
                <Image
                  src={weddingsImages[item.id]}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className={styles.cover}
                />
              </div>
              <figcaption className={styles.caption}>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
        <EnquiryLink variant="secondary" subject={eventSubject}>
          {discussLabel}
        </EnquiryLink>
      </Container>
    </section>
  );
}
