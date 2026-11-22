import type { BalloonsContent } from "@/content/balloons";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import { BalloonsPhoto } from "./BalloonsPhoto";
import styles from "./BalloonsCategoriesBlock.module.css";

export function BalloonsCategoriesBlock({
  items,
  label,
}: {
  items: BalloonsContent["categories"];
  label: string;
}) {
  return (
    <section
      className={styles.section}
      aria-labelledby="balloons-categories-title"
      data-balloons-section="categories"
    >
      <h2 id="balloons-categories-title" className={styles.visuallyHidden}>
        {label}
      </h2>
      <Container>
        <ul className={styles.grid}>
          {items.map((item) => (
            <li key={item.id} className={styles.card}>
              <BalloonsPhoto
                kind={item.id}
                alt={item.imageAlt}
                sizes="(min-width: 1280px) 124px, 136px"
                className={styles.photo}
              />
              <div className={styles.copy}>
                <div className={styles.text}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.description}>{item.description}</p>
                </div>
                <EnquiryLink
                  variant="text"
                  icon="arrow-up-right"
                  subject={item.title}
                  className={styles.circle}
                >
                  <span className={styles.visuallyHidden}>{item.title}</span>
                </EnquiryLink>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
