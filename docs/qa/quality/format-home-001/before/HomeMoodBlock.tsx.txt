import {Container} from "@/components/shared/Container/Container";
import Image from "next/image";
import {ActionLink} from "@/components/shared/ActionLink";
import {Link} from "@/i18n/navigation";
import {Icon} from "@/components/shared/Icon";
import type {HomeContent} from "./types";
import {homeMoods} from "@/content/home";
import styles from "./HomeMood.module.css";
import common from "./HomeCommon.module.css";

type HomeMoodBlockProps = {
    content: HomeContent["mood"];
    moods: HomeContent["moods"];
    labels: {
        shopBouquets: string;
        viewAllBouquets: string;
        viewBouquet: string;
        moodRailLabel: string;
        moodNames: Record<keyof HomeContent["moods"], string>;
    };
};

export function HomeMoodBlock({content, moods, labels}: HomeMoodBlockProps) {
  return (
    <Container as="section" className={styles.mood} aria-labelledby="home-mood-title">
      <div className={`${common.editorial} ${styles.moodIntro}`}>
        <p className={common.eyebrow}>{content.eyebrow}</p>
        <h2 id="home-mood-title" className={`${common.heading} ${styles.moodTitle}`}>{content.title}</h2>
        <p className={`${common.body} ${styles.moodBody}`}>{content.description}</p>
        <ActionLink href="/bouquets">{labels.shopBouquets}</ActionLink>
        <ActionLink href="/bouquets" variant="text">{labels.viewAllBouquets}</ActionLink>
      </div>
      <div className={styles.moodRail} role="region" aria-label={labels.moodRailLabel} tabIndex={0}>
        {homeMoods.map((mood) => (
          <article key={mood.id} className={styles.moodCard}>
            <div className={styles.moodPhoto}>
              <Image src={mood.image} alt={moods[mood.id].alt} fill sizes="(min-width: 1440px) 302px, (min-width: 1200px) calc((100vw - 232px) / 4), (min-width: 600px) calc((100vw - 112px) / 3), 240px" className={common.cover} />
            </div>
            <h3>{moods[mood.id].title}</h3>
            <Link className={styles.textLink} href={mood.href} aria-label={labels.moodNames[mood.id]}>{labels.viewBouquet}<Icon name="arrow-right" /></Link>
          </article>
        ))}
      </div>
    </Container>
  );
}
