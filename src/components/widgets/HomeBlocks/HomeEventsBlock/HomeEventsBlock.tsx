import Image from "next/image";
import { Container } from "@/components/shared/Container/Container";
import { ActionLink } from "@/components/shared/ActionLink";
import { homeImages } from "@/content/home";
import type { HomeEventsBlockProps } from "./HomeEventsBlock.types";
import { fullImageSizes } from "../imageSizes";
import styles from "./HomeEvents.module.css";
import common from "../HomeCommon/HomeCommon.module.css";
import {cmsImageProps} from "../HomeCommon/cmsImageProps";
import { homeHeadingIds } from "../HomeCommon/headingIds";
import {homeEditing, HomeEditable} from "../HomeCommon/homeEditing";

export async function HomeEventsBlock({ content, exploreLabel, images }: HomeEventsBlockProps) {
  const field = await homeEditing();
  return (
    <section data-sanity={field("events.photo", true)} className={styles.events} aria-labelledby={homeHeadingIds.events}>
      <Container>
        <div className={`${common.editorial} ${styles.eventsCopy}`}>
          <p data-sanity={field("events.eyebrow")} className={common.eyebrow}>{content.eyebrow}</p>
          <h2 data-sanity={field("events.title")} id={homeHeadingIds.events} className={common.heading}>
            {content.title}
          </h2>
          <p data-sanity={field("events.description")} className={`${common.body} ${styles.eventsBody}`}>{content.description}</p>
          <ActionLink href="/weddings-events" variant="secondary">
            <HomeEditable path="labels.exploreEvents">{exploreLabel}</HomeEditable>
          </ActionLink>
        </div>
      </Container>
      <div className={styles.eventsPhoto}>
        <Image
          data-sanity={field("events.photo", true)}
          src={images?.events?.src ?? homeImages.events}
          {...cmsImageProps(images?.events)}
          alt={content.alt}
          fill
          sizes={fullImageSizes}
          className={common.cover}
        />
        <div className={styles.eventsFade} aria-hidden="true" />
      </div>
    </section>
  );
}
