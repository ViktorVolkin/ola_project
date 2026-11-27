import clsx from "clsx";
import {Container} from "@/components/shared/Container/Container";
import Image from "next/image";
import {aboutImages} from "@/content/about";
import type {AboutContent} from "../types";
import type {CmsImage} from "@/content/sanity/home";
import type {AboutEditing} from "../aboutEditing";
import styles from "./AboutWhyBlock.module.css";

type AboutWhyBlockProps = {
    content: AboutContent["why"];
    image?: CmsImage;
    editing: AboutEditing;
};

export function AboutWhyBlock({content, image, editing}: AboutWhyBlockProps) {
  return (
    <section className={styles.why} aria-labelledby="about-why-title">
      <Container className={styles.layout}>
      <div className={styles.whyPhoto}>
        <Image
          data-sanity={editing("why.photo", true)}
          style={image ? {objectPosition: image.position} : undefined}
          src={image?.src ?? aboutImages.why}
          alt={content.imageAlt}
          fill
          sizes="(min-width: 1200px) 42vw, (min-width: 600px) calc(100vw - 64px), calc(100vw - 40px)"
          className={styles.cover}
        />
        <div className={styles.whyFade} aria-hidden="true" />
        <p data-sanity={editing("why.imageOverlay")} className={clsx(styles.handwritten, styles.whyHandwritten)}>
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
        <p data-sanity={editing("why.eyebrow")} className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 data-sanity={editing("why.title")} id="about-why-title" className={styles.heading}>
          {content.title}
        </h2>
        <p data-sanity={editing("why.body")} className={styles.body}>{content.body}</p>
        <ul className={styles.reasons}>
          {content.reasons.map((item, index) => (
            <li key={index}>
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
                <strong data-sanity={editing(`why.reasons.${index}.title`)}>{item.title}</strong>
                <small data-sanity={editing(`why.reasons.${index}.description`)}>{item.description}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Container>
    </section>
  );
}
