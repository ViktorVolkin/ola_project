import Image from "next/image";
import {Container} from "@/components/shared/Container/Container";
import {Icon} from "@/components/shared/Icon";
import styles from "./BouquetsInspiration.module.css";

type ImageData = {src: string; alt: string; width: number; height: number};

type BouquetsInspirationProps = {
  heading: string;
  selectors: readonly {label: string; targetId: string; image: ImageData}[];
  cards: readonly {id: string; title: string; image: ImageData; actionLabel: string}[];
  cardActionPendingReason: string;
};

export function BouquetsInspiration({heading, selectors, cards, cardActionPendingReason}: BouquetsInspirationProps) {
  return (
    <section id="bouquet-inspiration" tabIndex={-1} className={styles.section} aria-labelledby="bouquet-inspiration-heading">
      <Container>
        <div className={styles.selectors}>
          {selectors.map((selector, index) => (
            <a key={selector.targetId} className={`${styles.selector} ${index === 0 ? styles.all : ""}`} href={`#${selector.targetId}`} aria-label={selector.label}>
              <Image {...selector.image} alt={selector.image.alt} className={styles.thumbnail} sizes="(max-width: 600px) 48px, 64px" />
              <span>{selector.label}</span>
            </a>
          ))}
        </div>
        <div className={styles.inspiration}>
          <h2 id="bouquet-inspiration-heading" className={styles.heading}>{heading}</h2>
          <p id="bouquet-card-action-pending" className={styles.reason}>{cardActionPendingReason}</p>
          <div className={styles.grid}>
            {cards.map(card => (
              <article key={card.id} id={card.id} tabIndex={-1} className={styles.card}>
                <div className={styles.photo}>
                  <Image {...card.image} alt={card.image.alt} className={styles.cover} sizes="(min-width: 1200px) 25vw, 50vw" />
                </div>
                <div className={styles.caption}>
                  <h3 className={styles.title}>{card.title}</h3>
                  <button className={styles.action} type="button" disabled aria-describedby="bouquet-card-action-pending">
                    {card.actionLabel}<Icon name="arrow-right" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
