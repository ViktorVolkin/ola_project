import Image from "next/image";
import {ActionLink} from "@/components/shared/ActionLink";
import {aboutImages} from "@/content/about";
import type {AboutContent} from "./types";
import styles from "./AboutStyleBlock.module.css";

type AboutStyleBlockProps = {
    content: AboutContent["style"];
    exploreLabel: string;
};

export function AboutStyleBlock({content, exploreLabel}: AboutStyleBlockProps) {
  return (
    <section
      className={styles.styleSection}
      aria-labelledby="about-style-title"
    >
      <div className={styles.styleCopy}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="about-style-title" className={styles.heading}>
          {content.title}
        </h2>
        <p className={styles.body}>{content.body}</p>
        <ActionLink href="/bouquets">{exploreLabel}</ActionLink>
      </div>
      <div className={styles.stylePhotos}>
        {aboutImages.style.map((src, index) => (
          <div className={styles.stylePhoto} key={src}>
            <Image
              src={src}
              alt={content.imageAlts[index]}
              fill
              sizes="(min-width: 1440px) 249px, (min-width: 1200px) calc((100vw - 680px) / 3), (min-width: 600px) calc((100vw - 128px) / 3), calc((100vw - 52px) / 2)"
              className={styles.cover}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
