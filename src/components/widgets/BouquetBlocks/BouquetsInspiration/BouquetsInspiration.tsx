import clsx from "clsx";
import Image from "next/image";
import {Container} from "@/components/shared/Container/Container";
import {Icon} from "@/components/shared/Icon";
import styles from "./BouquetsInspiration.module.css";

type ImageData = {src: string; alt: string; width: number; height: number; position?: string};

type BouquetsInspirationProps = {
  heading: string;
  selectors: readonly {label: string; targetId: string; image: ImageData; labelEdit?: string; imageEdit?: string}[];
  cards: readonly {id: string; title: string; image: ImageData; actionLabel: string; titleEdit?: string; imageEdit?: string; actionEdit?: string}[];
  cardActionPendingReason: string;
  headingEdit?: string;
  pendingEdit?: string;
};

export function BouquetsInspiration({heading, selectors, cards, cardActionPendingReason, headingEdit, pendingEdit}: BouquetsInspirationProps) {
  return (
    <section id="bouquet-inspiration" tabIndex={-1} className={styles.section} aria-labelledby="bouquet-inspiration-heading">
      <Container>
        <div className={styles.selectors}>
          {selectors.map((selector, index) => (
            <a key={selector.targetId} className={clsx(styles.selector, index === 0 ? styles.all : "")} href={`#${selector.targetId}`} aria-label={selector.label}>
              <Image src={selector.image.src} width={selector.image.width} height={selector.image.height} alt={selector.image.alt} data-sanity={selector.imageEdit} style={selector.image.position ? {objectPosition: selector.image.position} : undefined} className={styles.thumbnail} sizes="(max-width: 600px) 48px, 64px" />
              <span data-sanity={selector.labelEdit}>{selector.label}</span>
            </a>
          ))}
        </div>
        <div className={styles.inspiration}>
          <h2 id="bouquet-inspiration-heading" className={styles.heading} data-sanity={headingEdit}>{heading}</h2>
          <p id="bouquet-card-action-pending" className={styles.reason} data-sanity={pendingEdit}>{cardActionPendingReason}</p>
          <div className={styles.grid}>
            {cards.map(card => (
              <article key={card.id} id={card.id} tabIndex={-1} className={styles.card}>
                <div className={styles.photo}>
                  <Image src={card.image.src} width={card.image.width} height={card.image.height} alt={card.image.alt} data-sanity={card.imageEdit} style={card.image.position ? {objectPosition: card.image.position} : undefined} className={styles.cover} sizes="(min-width: 1200px) 25vw, 50vw" />
                </div>
                <div className={styles.caption}>
                  <h3 className={styles.title} data-sanity={card.titleEdit}>{card.title}</h3>
                  <button className={styles.action} type="button" disabled aria-describedby="bouquet-card-action-pending" data-sanity={card.actionEdit}>
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
