import {Container} from "@/components/shared/Container/Container";
import Image from "next/image";
import {ActionLink} from "@/components/shared/ActionLink";
import {aboutImages} from "@/content/about";
import type {AboutContent} from "./types";
import {wideSizes} from "./imageSizes";
import styles from "./AboutHeroBlock.module.css";

type AboutHeroBlockProps = {
    content: AboutContent["hero"];
    storyLabel: string;
};

export function AboutHeroBlock({content, storyLabel}: AboutHeroBlockProps) {
  return (
    <section className={styles.hero} aria-labelledby="about-hero-title">
      <Container className={styles.content}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h1 id="about-hero-title" className={styles.heroTitle}>
          {content.title}
        </h1>
        <p className={styles.body}>{content.body}</p>
        <ActionLink href="#our-story">{storyLabel}</ActionLink>
      </div>
      </Container>
      <div className={styles.heroPhoto}>
        <Image
          src={aboutImages.hero}
          alt={content.alt}
          fill
          priority
          sizes={wideSizes}
          className={styles.cover}
        />
        <div className={styles.heroFade} aria-hidden="true" />
        <p className={`${styles.handwritten} ${styles.heroHandwritten}`}>
          {content.handwritten}
        </p>
        <Image
          src="/assets/icons/heart.svg"
          alt=""
          aria-hidden="true"
          width={20}
          height={20}
          className={styles.heroHeart}
        />
      </div>
    </section>
  );
}
