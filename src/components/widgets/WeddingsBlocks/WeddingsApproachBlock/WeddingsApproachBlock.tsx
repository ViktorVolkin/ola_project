import Image from "next/image";
import { WeddingsEditable, type WeddingsEditing } from "../WeddingsCommon/weddingsEditing";
import type { CmsImage } from "@/content/sanity/home";

import { weddingsImages } from "@/content/weddings";
import { Container } from "@/components/shared/Container/Container";
import { actionClassName } from "@/components/shared/ActionLink";
import { Icon } from "@/components/shared/Icon";
import type { WeddingsApproachBlockProps } from "./WeddingsApproachBlock.types";
import { APPROACH_TITLE_ID } from "../WeddingsCommon/WeddingsCommon.constants";
import styles from "./WeddingsApproachBlock.module.css";

export function WeddingsApproachBlock({ content, processLabel, image, editing }: WeddingsApproachBlockProps & {image?: CmsImage; editing: WeddingsEditing}) {
  return (
    <section
      className={styles.section}
      aria-labelledby={APPROACH_TITLE_ID}
      data-weddings-section="approach"
    >
      <Container className={styles.row}>
        <div className={styles.copy}>
          <p data-sanity={editing("approach.eyebrow")} className={styles.eyebrow}>{content.eyebrow}</p>
          <h2 data-sanity={editing("approach.title")} className={styles.heading} id={APPROACH_TITLE_ID}>
            {content.title}
          </h2>
          <p data-sanity={editing("approach.body")} className={styles.body}>{content.body}</p>
          <a href="#our-process" className={actionClassName("secondary")}>
            <WeddingsEditable attribute={editing("labels.ourProcess")}>{processLabel}</WeddingsEditable>
            <Icon name="arrow-right" />
          </a>
        </div>
        <div className={styles.photo}>
          <Image
            data-sanity={editing("approach.photo", true)}
            style={image ? {objectPosition: image.position} : undefined}
            src={image?.src ?? weddingsImages.approach}
            alt={content.imageAlt}
            fill
            sizes="(min-width: 1100px) 60vw, 100vw"
            className={styles.cover}
          />
        </div>
      </Container>
    </section>
  );
}
