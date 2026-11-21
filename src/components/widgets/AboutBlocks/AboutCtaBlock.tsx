import {Container} from "@/components/shared/Container/Container";
import Image from "next/image";
import {EnquiryLink} from "@/components/widgets/EnquiryLink/EnquiryLink";
import {aboutImages} from "@/content/about";
import type {AboutContent} from "./types";
import {wideSizes} from "./imageSizes";
import styles from "./AboutCtaBlock.module.css";

type AboutCtaBlockProps = {
    content: AboutContent["cta"];
    messageLabel: string;
};

export function AboutCtaBlock({content, messageLabel}: AboutCtaBlockProps) {
  return (
    <section className={styles.cta} aria-labelledby="about-cta-title">
      <div className={styles.ctaPhoto}>
        <Image
          src={aboutImages.cta}
          alt={content.imageAlt}
          fill
          sizes={wideSizes}
          className={styles.cover}
        />
        <div className={styles.ctaFade} aria-hidden="true" />
        <p className={`${styles.handwritten} ${styles.ctaHandwritten}`}>
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
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="about-cta-title" className={styles.heading}>
          {content.title}
        </h2>
        <p className={styles.body}>{content.body}</p>
        <EnquiryLink variant="light">{messageLabel}</EnquiryLink>
      </div>
    </Container>
    </section>
  );
}
