import {Container} from "@/components/shared/Container/Container";
import Image from "next/image";
import {EnquiryLink} from "@/components/widgets/EnquiryLink/EnquiryLink";
import {aboutImages} from "@/content/about";
import type {AboutContent} from "../types";
import type {CmsImage} from "@/content/sanity/home";
import {AboutEditable, type AboutEditing} from "../aboutEditing";
import {wideSizes} from "../imageSizes";
import styles from "./AboutCtaBlock.module.css";

type AboutCtaBlockProps = {
    content: AboutContent["cta"];
    messageLabel: string;
    image?: CmsImage;
    editing: AboutEditing;
};

export function AboutCtaBlock({content, messageLabel, image, editing}: AboutCtaBlockProps) {
  return (
    <section className={styles.cta} aria-labelledby="about-cta-title">
      <div className={styles.ctaPhoto}>
        <Image
          data-sanity={editing("cta.photo", true)}
          style={image ? {objectPosition: image.position} : undefined}
          src={image?.src ?? aboutImages.cta}
          alt={content.imageAlt}
          fill
          sizes={wideSizes}
          className={styles.cover}
        />
        <div className={styles.ctaFade} aria-hidden="true" />
        <p data-sanity={editing("cta.imageOverlay")} className={`${styles.handwritten} ${styles.ctaHandwritten}`}>
          {content.imageOverlay}
        </p>
        <Image
          src="/assets/icons/heart.svg"
          alt=""
          aria-hidden="true"
          width={64}
          height={64}
          className={styles.ctaHeart}
        />
      </div>
      <Container className={styles.content}>
      <div className={styles.ctaCopy}>
        <p data-sanity={editing("cta.eyebrow")} className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 data-sanity={editing("cta.title")} id="about-cta-title" className={styles.heading}>
          {content.title}
        </h2>
        <p data-sanity={editing("cta.body")} className={styles.body}>{content.body}</p>
        <EnquiryLink variant="light"><AboutEditable attribute={editing("labels.messageUs")}>{messageLabel}</AboutEditable></EnquiryLink>
      </div>
    </Container>
    </section>
  );
}
