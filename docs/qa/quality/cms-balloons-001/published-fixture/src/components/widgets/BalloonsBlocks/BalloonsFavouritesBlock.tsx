import type { BalloonsContent } from "@/content/balloons";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import { BalloonsPhoto } from "./BalloonsPhoto";
import type {BalloonsImages} from "@/content/sanity/balloons";
import {BalloonsEditable, type BalloonsEditing} from "./balloonsEditing";
import styles from "./BalloonsFavouritesBlock.module.css";

export function BalloonsFavouritesBlock({
  content,
  askLabel,
  enquireLabel,
  setsSubject,
  images, editing, localItems,
}: {
  content: BalloonsContent["favourites"];
  askLabel: string;
  enquireLabel: string;
  setsSubject: string;
  images: BalloonsImages; editing: BalloonsEditing; localItems: BalloonsContent["favourites"]["items"];
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
            <p className={styles.eyebrow}><BalloonsEditable attribute={editing("favourites.eyebrow")}>{content.eyebrow}</BalloonsEditable></p>
            <h2 id="balloons-favourites-title" className={styles.heading}>
              <BalloonsEditable attribute={editing("favourites.title")}>{content.title}</BalloonsEditable>
            </h2>
          </div>
          <EnquiryLink
            variant="text"
            className={styles.ask}
            subject={setsSubject}
          >
            <BalloonsEditable attribute={editing("labels.askSets")}>{askLabel}</BalloonsEditable>
          </EnquiryLink>
        </div>
        <ul className={styles.grid}>
          {content.items.map((item) => (
            <li key={item.id} className={styles.card}>
              <BalloonsPhoto
                kind={item.id}
                image={images[item.id]} annotation={editing(`favourites.${item.id}.photo`, true)}
                alt={item.imageAlt}
                sizes="(min-width: 1280px) 302px, 50vw"
                className={styles.photo}
              />
              <div className={styles.caption}>
                <h3 className={styles.title}><BalloonsEditable attribute={editing(`favourites.${item.id}.title`)}>{item.title}</BalloonsEditable></h3>
                <EnquiryLink
                  variant="text"
                  className={styles.enquire}
                  subject={localItems.find(local => local.id === item.id)?.title ?? item.title}
                >
                  <BalloonsEditable attribute={editing("labels.enquire")}>{enquireLabel}</BalloonsEditable>
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
