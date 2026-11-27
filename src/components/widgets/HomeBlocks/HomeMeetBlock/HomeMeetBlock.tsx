import clsx from "clsx";
import { Container } from "@/components/shared/Container/Container";
import Image from "next/image";
import { ActionLink } from "@/components/shared/ActionLink";
import { homeImages } from "@/content/home";
import type { HomeMeetBlockProps } from "./HomeMeetBlock.types";
import styles from "./HomeMeet.module.css";
import common from "../HomeCommon/HomeCommon.module.css";
import {cmsImageProps} from "../HomeCommon/cmsImageProps";
import { homeHeadingIds } from "../HomeCommon/headingIds";
import {homeEditing, HomeEditable} from "../HomeCommon/homeEditing";

export async function HomeMeetBlock({ content, aboutLabel, images }: HomeMeetBlockProps) {
  const field = await homeEditing();
  return (
    <Container as="section" className={styles.meet} aria-labelledby={homeHeadingIds.meet}>
      <div data-sanity={field("meet.photo", true)} className={styles.meetScene}>
        <div className={clsx(common.editorial, styles.meetCopy)}>
          <p data-sanity={field("meet.eyebrow")} className={common.eyebrow}>{content.eyebrow}</p>
          <h2 data-sanity={field("meet.title")} id={homeHeadingIds.meet} className={common.heading}>
            {content.title}
          </h2>
          <p data-sanity={field("meet.description")} className={clsx(common.body, styles.meetBody)}>{content.description}</p>
          <p data-sanity={field("meet.handwritten")} className={clsx(common.handwritten, styles.meetMobileHandwritten)}>
            {content.handwritten}
          </p>
          <ActionLink href="/about" variant="secondary">
            <HomeEditable path="labels.aboutOla">{aboutLabel}</HomeEditable>
          </ActionLink>
        </div>
        <div className={styles.meetPhoto}>
          <Image
            data-sanity={field("meet.photo", true)}
            src={images?.meet?.src ?? homeImages.meet}
            {...cmsImageProps(images?.meet)}
            alt={content.alt}
            fill
            sizes="(min-width: 1440px) 1280px, (min-width: 1200px) calc(100vw - 160px), (min-width: 600px) calc(100vw - 64px), calc(100vw - 40px)"
            className={common.cover}
          />
          <div className={styles.meetFade} aria-hidden="true" />
          <p data-sanity={field("meet.handwritten")} className={clsx(common.handwritten, styles.meetPhotoHandwritten)}>
            {content.handwritten}
          </p>
        </div>
      </div>
    </Container>
  );
}
