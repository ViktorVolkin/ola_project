import Image from "next/image";
import { WeddingsEditable, type WeddingsEditing } from "../WeddingsCommon/weddingsEditing";
import type { CmsImage } from "@/content/sanity/home";

import { weddingsImages } from "@/content/weddings";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import type { WeddingsCtaBlockProps } from "./WeddingsCtaBlock.types";
import { CTA_TITLE_ID } from "../WeddingsCommon/WeddingsCommon.constants";
import styles from "./WeddingsCtaBlock.module.css";

export function WeddingsCtaBlock({ content, contactLabel, eventSubject, image, editing }: WeddingsCtaBlockProps & {image?: CmsImage; editing: WeddingsEditing}) {
  return (
    <section className={styles.section} aria-labelledby={CTA_TITLE_ID} data-weddings-section="cta">
      <div className={styles.panel}>
        <p data-sanity={editing("cta.eyebrow")} className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 data-sanity={editing("cta.title")} className={styles.heading} id={CTA_TITLE_ID}>
          {content.title}
        </h2>
        <p data-sanity={editing("cta.body")} className={styles.body}>{content.body}</p>
        <EnquiryLink variant="light" subject={eventSubject}>
          <WeddingsEditable attribute={editing("labels.contactWhatsapp")}>{contactLabel}</WeddingsEditable>
        </EnquiryLink>
        <p data-sanity={editing("cta.handwritten")} className={styles.handwritten} aria-hidden="true">
          {content.handwritten}
        </p>
      </div>
      <div className={styles.photo}>
        <Image
          data-sanity={editing("categories.weddings.photo", true)}
          style={image ? {objectPosition: image.position} : undefined}
          src={image?.src ?? weddingsImages.weddings}
          alt={content.imageAlt}
          fill
          sizes="(min-width: 640px) 55vw, 100vw"
          className={styles.cover}
        />
      </div>
    </section>
  );
}
