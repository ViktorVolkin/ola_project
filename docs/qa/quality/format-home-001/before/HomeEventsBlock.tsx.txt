import Image from "next/image";
import {Container} from "@/components/shared/Container/Container";
import {ActionLink} from "@/components/shared/ActionLink";
import {homeImages} from "@/content/home";
import type {HomeContent} from "./types";
import {fullImageSizes} from "./imageSizes";
import styles from "./HomeEvents.module.css";
import common from "./HomeCommon.module.css";

type HomeEventsBlockProps = {
    content: HomeContent["events"];
    exploreLabel: string;
};

export function HomeEventsBlock({content, exploreLabel}: HomeEventsBlockProps) {
  return (
    <section className={styles.events} aria-labelledby="home-events-title">
      <Container>
      <div className={`${common.editorial} ${styles.eventsCopy}`}>
        <p className={common.eyebrow}>{content.eyebrow}</p>
        <h2 id="home-events-title" className={common.heading}>{content.title}</h2>
        <p className={`${common.body} ${styles.eventsBody}`}>{content.description}</p>
        <ActionLink href="/weddings-events" variant="secondary">{exploreLabel}</ActionLink>
      </div>
      </Container>
      <div className={styles.eventsPhoto}>
        <Image src={homeImages.events} alt={content.alt} fill sizes={fullImageSizes} className={common.cover} />
        <div className={styles.eventsFade} aria-hidden="true" />
      </div>
    </section>
  );
}
