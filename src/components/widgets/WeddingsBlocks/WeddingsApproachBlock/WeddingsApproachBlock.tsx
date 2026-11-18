import Image from "next/image";
import { weddingsImages } from "@/content/weddings";
import { Container } from "@/components/shared/Container/Container";
import { actionClassName } from "@/components/shared/ActionLink";
import { Icon } from "@/components/shared/Icon";
import type { WeddingsApproachBlockProps } from "./WeddingsApproachBlock.types";
import { APPROACH_TITLE_ID } from "../WeddingsCommon/WeddingsCommon.constants";
import styles from "./WeddingsApproachBlock.module.css";

export function WeddingsApproachBlock({ content, processLabel }: WeddingsApproachBlockProps) {
  return (
    <section
      className={styles.section}
      aria-labelledby={APPROACH_TITLE_ID}
      data-weddings-section="approach"
    >
      <Container className={styles.row}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h2 className={styles.heading} id={APPROACH_TITLE_ID}>
            {content.title}
          </h2>
          <p className={styles.body}>{content.body}</p>
          <a href="#our-process" className={actionClassName("secondary")}>
            {processLabel}
            <Icon name="arrow-right" />
          </a>
        </div>
        <div className={styles.photo}>
          <Image
            src={weddingsImages.approach}
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
