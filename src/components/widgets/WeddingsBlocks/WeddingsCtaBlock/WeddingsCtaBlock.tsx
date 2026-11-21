import Image from "next/image";
import { weddingsImages } from "@/content/weddings";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import type { WeddingsCtaBlockProps } from "./WeddingsCtaBlock.types";
import { CTA_TITLE_ID } from "../WeddingsCommon/WeddingsCommon.constants";
import styles from "./WeddingsCtaBlock.module.css";

export function WeddingsCtaBlock({ content, contactLabel, eventSubject }: WeddingsCtaBlockProps) {
  return (
    <section className={styles.section} aria-labelledby={CTA_TITLE_ID} data-weddings-section="cta">
      <div className={styles.panel}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 className={styles.heading} id={CTA_TITLE_ID}>
          {content.title}
        </h2>
        <p className={styles.body}>{content.body}</p>
        <EnquiryLink variant="light" subject={eventSubject}>
          {contactLabel}
        </EnquiryLink>
        <p className={styles.handwritten} aria-hidden="true">
          {content.handwritten}
        </p>
      </div>
      <div className={styles.photo}>
        <Image
          src={weddingsImages.weddings}
          alt={content.imageAlt}
          fill
          sizes="(min-width: 640px) 55vw, 100vw"
          className={styles.cover}
        />
      </div>
    </section>
  );
}
