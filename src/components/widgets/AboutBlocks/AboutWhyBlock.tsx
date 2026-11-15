import {Container} from "@/components/shared/Container/Container";
import Image from "next/image";
import {aboutImages} from "@/content/about";
import type {AboutContent} from "./types";
import styles from "./AboutWhyBlock.module.css";

type AboutWhyBlockProps = {
    content: AboutContent["why"];
};

export function AboutWhyBlock({content}: AboutWhyBlockProps) {
  return (
    <section className={styles.why} aria-labelledby="about-why-title">
      <Container className={styles.layout}>
      <div className={styles.whyPhoto}>
        <Image
          src={aboutImages.why}
          alt={content.imageAlt}
          fill
          sizes="(min-width: 1200px) 42vw, (min-width: 600px) calc(100vw - 64px), calc(100vw - 40px)"
          className={styles.cover}
        />
        <div className={styles.whyFade} aria-hidden="true" />
        <p className={`${styles.handwritten} ${styles.whyHandwritten}`}>
          {content.imageOverlay}
        </p>
        <Image
          src="/assets/icons/heart.svg"
          alt=""
          aria-hidden="true"
          width={20}
          height={20}
          className={styles.whyHeart}
        />
      </div>
      <div className={styles.whyCopy}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="about-why-title" className={styles.heading}>
          {content.title}
        </h2>
        <p className={styles.body}>{content.body}</p>
        <ul className={styles.reasons}>
          {content.reasons.map((item) => (
            <li key={item.title}>
              <span className={styles.reasonIcon}>
                <Image
                  src={`/assets/icons/${item.icon}`}
                  alt=""
                  aria-hidden="true"
                  width={32}
                  height={32}
                />
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Container>
    </section>
  );
}
