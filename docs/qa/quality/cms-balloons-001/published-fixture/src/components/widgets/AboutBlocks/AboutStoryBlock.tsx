import Image from "next/image";
import {aboutImages} from "@/content/about";
import type {AboutContent} from "./types";
import type {CmsImage} from "@/content/sanity/home";
import type {AboutEditing} from "./aboutEditing";
import styles from "./AboutStoryBlock.module.css";

type AboutStoryBlockProps = {
    content: AboutContent["story"];
    image?: CmsImage;
    editing: AboutEditing;
};

export function AboutStoryBlock({content, image, editing}: AboutStoryBlockProps) {
  return (
    <section
      id="our-story"
      className={styles.story}
      aria-labelledby="about-story-title"
    >
      <div className={styles.storyPhoto}>
        <Image
          data-sanity={editing("story.photo", true)}
          style={image ? {objectPosition: image.position} : undefined}
          src={image?.src ?? aboutImages.story}
          alt={content.imageAlt}
          fill
          sizes="(min-width: 1200px) 42vw, (min-width: 600px) calc((100vw - 88px) / 2), calc(100vw - 40px)"
          className={styles.cover}
        />
      </div>
      <div className={styles.storyCopy}>
        <div className={styles.storyText}>
          <p data-sanity={editing("story.eyebrow")} className={styles.eyebrow}>{content.eyebrow}</p>
          <h2 data-sanity={editing("story.title")} id="about-story-title" className={styles.heading}>
            {content.title}
          </h2>
          <div className={`${styles.body} ${styles.paragraphs}`}>
            {content.paragraphs.map((paragraph, index) => (
              <p data-sanity={editing(`story.paragraphs.${index}`)} key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className={styles.signatureRow}>
          <p data-sanity={editing("story.signature")} className={`${styles.handwritten} ${styles.signature}`}>
            {content.signature}
          </p>
          <Image
            src={aboutImages.botanical}
            alt={content.botanicalAlt}
            width={108}
            height={264}
            className={styles.botanical}
          />
        </div>
      </div>
    </section>
  );
}
