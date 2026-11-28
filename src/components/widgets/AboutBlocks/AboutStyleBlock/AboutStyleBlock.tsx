import Image from "next/image";
import { ActionLink } from "@/components/shared/ActionLink";
import { aboutImages } from "@/content/about";
import type { AboutContent } from "../types";
import type { AboutImages } from "@/content/sanity/about";
import { AboutEditable, type AboutEditing } from "../aboutEditing";
import styles from "./AboutStyleBlock.module.css";

type AboutStyleBlockProps = {
  content: AboutContent["style"];
  exploreLabel: string;
  images: AboutImages;
  editing: AboutEditing;
};

export function AboutStyleBlock({ content, exploreLabel, images, editing }: AboutStyleBlockProps) {
  return (
    <section className={styles.styleSection} aria-labelledby="about-style-title">
      <div className={styles.styleCopy}>
        <p data-sanity={editing("style.eyebrow")} className={styles.eyebrow}>
          {content.eyebrow}
        </p>
        <h2 data-sanity={editing("style.title")} id="about-style-title" className={styles.heading}>
          {content.title}
        </h2>
        <p data-sanity={editing("style.body")} className={styles.body}>
          {content.body}
        </p>
        <ActionLink href="/bouquets">
          <AboutEditable attribute={editing("labels.exploreBouquets")}>
            {exploreLabel}
          </AboutEditable>
        </ActionLink>
      </div>
      <div className={styles.stylePhotos}>
        {aboutImages.style.map((src, index) => (
          <div className={styles.stylePhoto} key={src}>
            <Image
              data-sanity={editing(`style.photo${index + 1}`, true)}
              style={
                images[`style${index}` as "style0" | "style1" | "style2"]
                  ? {
                      objectPosition:
                        images[`style${index}` as "style0" | "style1" | "style2"]?.position,
                    }
                  : undefined
              }
              src={images[`style${index}` as "style0" | "style1" | "style2"]?.src ?? src}
              alt={content.imageAlts[index]}
              fill
              sizes={
                index === 2
                  ? "(min-width: 1440px) 249px, (min-width: 1200px) calc((100vw - 680px) / 3), (min-width: 1120px) calc((100vw - 128px) / 3), (min-width: 640px) 100vw, calc(100vw - 40px)"
                  : "(min-width: 1440px) 249px, (min-width: 1200px) calc((100vw - 680px) / 3), (min-width: 1120px) calc((100vw - 128px) / 3), (min-width: 640px) calc((100vw - 128px) / 3), calc((100vw - 52px) / 2)"
              }
              className={styles.cover}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
