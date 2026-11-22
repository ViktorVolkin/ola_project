import type { BalloonsContent } from "@/content/balloons";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import { BalloonsPhoto } from "./BalloonsPhoto";
import styles from "./BalloonsFavouritesBlock.module.css";

export function BalloonsFavouritesBlock({
  content,
  askLabel,
  enquireLabel,
  setsSubject,
}: {
  content: BalloonsContent["favourites"];
  askLabel: string;
  enquireLabel: string;
  setsSubject: string;
}) {
  return (
    <section
      id="our-favourites"
      className={styles.section}
      aria-labelledby="balloons-favourites-title"
      data-balloons-section="favourites"
    >
      <Container className={styles.inner}>
        <div className={styles.headingRow}>
          <div className={styles.titleStack}>
            <p className={styles.eyebrow}>{content.eyebrow}</p>
            <h2 id="balloons-favourites-title" className={styles.heading}>
              {content.title}
            </h2>
          </div>
          <EnquiryLink
            variant="text"
            className={styles.ask}
            subject={setsSubject}
          >
            {askLabel}
          </EnquiryLink>
        </div>
        <ul className={styles.grid}>
          {content.items.map((item) => (
            <li key={item.id} className={styles.card}>
              <BalloonsPhoto
                kind={item.id}
                alt={item.imageAlt}
                sizes="(min-width: 1280px) 302px, 50vw"
                className={styles.photo}
              />
              <div className={styles.caption}>
                <h3 className={styles.title}>{item.title}</h3>
                <EnquiryLink
                  variant="text"
                  className={styles.enquire}
                  subject={item.title}
                >
                  {enquireLabel}
                  <span className={styles.visuallyHidden}> — {item.title}</span>
                </EnquiryLink>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
