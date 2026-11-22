import Image from "next/image";
import { WeddingsEditable, type WeddingsEditing } from "../WeddingsCommon/weddingsEditing";
import type { WeddingsImages } from "@/content/sanity/weddings";

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
  images,
  editing,
}: WeddingsInspirationBlockProps & {images: WeddingsImages; editing: WeddingsEditing}) {
  return (
    <section
      className={styles.section}
      aria-labelledby={INSPIRATION_TITLE_ID}
      data-weddings-section="inspiration"
    >
      <Container className={styles.inner}>
        <p data-sanity={editing("inspiration.eyebrow")} className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 data-sanity={editing("inspiration.title")} className={styles.heading} id={INSPIRATION_TITLE_ID}>
          {content.title}
        </h2>
        <div className={styles.grid}>
          {content.items.map((item) => (
            <figure key={item.id}>
              <div className={styles.photo}>
                <Image
                  data-sanity={editing(`inspiration.${item.id}.photo`, true)}
                  style={images[item.id] ? {objectPosition: images[item.id]?.position} : undefined}
                  src={images[item.id]?.src ?? weddingsImages[item.id]}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className={styles.cover}
                />
              </div>
              <figcaption data-sanity={editing(`inspiration.${item.id}.caption`)} className={styles.caption}>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
        <EnquiryLink variant="secondary" subject={eventSubject}>
          <WeddingsEditable attribute={editing("labels.discussEvent")}>{discussLabel}</WeddingsEditable>
        </EnquiryLink>
      </Container>
    </section>
  );
}
