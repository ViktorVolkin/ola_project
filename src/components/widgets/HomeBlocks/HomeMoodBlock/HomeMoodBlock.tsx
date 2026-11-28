import clsx from "clsx";
import { Container } from "@/components/shared/Container/Container";
import Image from "next/image";
import { ActionLink } from "@/components/shared/ActionLink";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/shared/Icon";
import { EditorialCard } from "@/components/shared/EditorialCard/EditorialCard";
import type { HomeMoodBlockProps } from "./HomeMoodBlock.types";
import { homeMoods } from "@/content/home";
import styles from "./HomeMood.module.css";
import common from "../HomeCommon/HomeCommon.module.css";
import {cmsImageProps} from "../HomeCommon/cmsImageProps";
import { homeHeadingIds } from "../HomeCommon/headingIds";
import {homeEditing, HomeEditable} from "../HomeCommon/homeEditing";

export async function HomeMoodBlock({ content, moods, labels, images }: HomeMoodBlockProps) {
  const field = await homeEditing();
  return (
    <Container as="section" className={styles.mood} aria-labelledby={homeHeadingIds.mood}>
      <div className={clsx(common.editorial, styles.moodIntro)}>
        <p data-sanity={field("mood.eyebrow")} className={common.eyebrow}>{content.eyebrow}</p>
        <h2 data-sanity={field("mood.title")} id={homeHeadingIds.mood} className={clsx(common.heading, styles.moodTitle)}>
          {content.title}
        </h2>
        <p data-sanity={field("mood.description")} className={clsx(common.body, styles.moodBody)}>{content.description}</p>
        <ActionLink href="/bouquets"><HomeEditable path="labels.shopBouquets">{labels.shopBouquets}</HomeEditable></ActionLink>
        <ActionLink href="/bouquets" variant="text">
          <HomeEditable path="labels.viewAllBouquets">{labels.viewAllBouquets}</HomeEditable>
        </ActionLink>
      </div>
      <div className={styles.moodRail} role="region" aria-label={labels.moodRailLabel} tabIndex={0}>
        {homeMoods.map((mood) => (
          <EditorialCard key={mood.id} className={styles.moodCard}
            photoClassName={styles.moodPhoto}
            photoAnnotation={field(`moods.${mood.id}.photo`, true)}
            media={
              <Image
              src={images?.[mood.id]?.src ?? mood.image}
                {...cmsImageProps(images?.[mood.id])}
                alt={moods[mood.id].alt}
                fill
                sizes="(min-width: 1440px) 302px, (min-width: 1200px) calc((100vw - 232px) / 4), (min-width: 600px) calc((100vw - 112px) / 3), 240px"
                className={common.cover}
              />
            }
            title={<h3 data-sanity={field(`moods.${mood.id}.title`)}>{moods[mood.id].title}</h3>}
            action={
            <Link
              className={styles.textLink}
              href={mood.href}
              aria-label={labels.moodNames[mood.id]}
            >
              <HomeEditable path="labels.viewBouquet">{labels.viewBouquet}</HomeEditable>
              <Icon name="arrow-right" />
            </Link>
            }
          />
        ))}
      </div>
    </Container>
  );
}
