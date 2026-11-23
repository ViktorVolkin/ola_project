import {Container} from "@/components/shared/Container/Container";
import Image from "next/image";
import {ActionLink} from "@/components/shared/ActionLink";
import {aboutImages} from "@/content/about";
import type {AboutContent} from "../types";
import type {CmsImage} from "@/content/sanity/home";
import {AboutEditable, type AboutEditing} from "../aboutEditing";
import {wideSizes} from "../imageSizes";
import styles from "./AboutHeroBlock.module.css";

type AboutHeroBlockProps = {
    content: AboutContent["hero"];
    storyLabel: string;
    image?: CmsImage;
    editing: AboutEditing;
};

export function AboutHeroBlock({content, storyLabel, image, editing}: AboutHeroBlockProps) {
  return (
    <section className={styles.hero} aria-labelledby="about-hero-title">
      <Container className={styles.content}>
      <div className={styles.heroCopy}>
        <p data-sanity={editing("hero.eyebrow")} className={styles.eyebrow}>{content.eyebrow}</p>
        <h1 data-sanity={editing("hero.title")} id="about-hero-title" className={styles.heroTitle}>
          {content.title}
        </h1>
        <p data-sanity={editing("hero.body")} className={styles.body}>{content.body}</p>
        <ActionLink href="#our-story"><AboutEditable attribute={editing("labels.ourStory")}>{storyLabel}</AboutEditable></ActionLink>
      </div>
      </Container>
      <div className={styles.heroPhoto}>
        <Image
          data-sanity={editing("hero.photo", true)}
          style={image ? {objectPosition: image.position} : undefined}
          src={image?.src ?? aboutImages.hero}
          alt={content.alt}
          fill
          priority
          sizes={wideSizes}
          className={styles.cover}
        />
        <div className={styles.heroFade} aria-hidden="true" />
        <p data-sanity={editing("hero.handwritten")} className={`${styles.handwritten} ${styles.heroHandwritten}`}>
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
