import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./BouquetDetailSupporting.module.css";

export type InformationItem = { title: string; answer: string };
export function BouquetDetailInformation({
  items,
}: {
  items: readonly [InformationItem, InformationItem, InformationItem];
}) {
  return (
    <div className={styles.information}>
      {items.map((item, index) => (
        <details key={item.title} open={index === 0}>
          <summary>
            {item.title}
            <span aria-hidden="true" className={styles.chevron} />
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export type InspirationCard = {
  id: string;
  title: string;
  image: { src: string; alt: string };
  action: ReactNode;
};
export function BouquetDetailRelated({
  eyebrow,
  heading,
  cards,
}: {
  eyebrow: string;
  heading: string;
  cards: readonly [InspirationCard, InspirationCard, InspirationCard, InspirationCard];
}) {
  return (
    <section className={styles.section} aria-label={heading}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2>{heading}</h2>
        </div>
        <div className={styles.grid}>
          {cards.map((card) => (
            <article className={styles.card} key={card.id}>
              <div className={styles.cardPhoto}>
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  sizes="(max-width: 1099px) 50vw, 25vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.caption}>
                <h3>{card.title}</h3>
                <div className={styles.action}>{card.action}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BouquetDetailCustom({
  eyebrow,
  heading,
  description,
  signature,
  image,
  action,
}: {
  eyebrow: string;
  heading: string;
  description: string;
  signature: string;
  image: { src: string; alt: string };
  action: ReactNode;
}) {
  return (
    <section className={`${styles.section} ${styles.custom}`} aria-label={heading}>
      <div className={`${styles.inner} ${styles.customRow}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2>{heading}</h2>
          <p className={styles.description}>{description}</p>
          <div className={styles.customAction}>{action}</div>
          <p className={styles.signature}>{signature}</p>
        </div>
        <div className={styles.customPhoto}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1099px) 100vw, 50vw"
            className={styles.customImage}
          />
        </div>
      </div>
    </section>
  );
}
