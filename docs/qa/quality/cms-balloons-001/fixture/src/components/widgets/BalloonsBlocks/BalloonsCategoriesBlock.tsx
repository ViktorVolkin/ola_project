import type { BalloonsContent } from "@/content/balloons";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import { BalloonsPhoto } from "./BalloonsPhoto";
import type {BalloonsImages} from "@/content/sanity/balloons";
import {BalloonsEditable, type BalloonsEditing} from "./balloonsEditing";
import styles from "./BalloonsCategoriesBlock.module.css";

export function BalloonsCategoriesBlock({
  items,
  label,
  images, editing, localItems,
}: {
  items: BalloonsContent["categories"];
  label: string;
  images: BalloonsImages; editing: BalloonsEditing; localItems: BalloonsContent["categories"];
}) {
  return (
    <section
      className={styles.section}
      aria-labelledby="balloons-categories-title"
      data-balloons-section="categories"
    >
      <h2 id="balloons-categories-title" className={styles.visuallyHidden}>
        <BalloonsEditable attribute={editing("labels.categoriesLabel")}>{label}</BalloonsEditable>
      </h2>
      <Container>
        <ul className={styles.grid}>
          {items.map((item) => (
            <li key={item.id} className={styles.card}>
              <BalloonsPhoto
                kind={item.id}
                image={images[item.id]} annotation={editing(`categories.${item.id}.photo`, true)}
                alt={item.imageAlt}
                sizes="(min-width: 1280px) 124px, 136px"
                className={styles.photo}
              />
              <div className={styles.copy}>
                <div className={styles.text}>
                  <h3 className={styles.title}><BalloonsEditable attribute={editing(`categories.${item.id}.title`)}>{item.title}</BalloonsEditable></h3>
                  <p className={styles.description}><BalloonsEditable attribute={editing(`categories.${item.id}.description`)}>{item.description}</BalloonsEditable></p>
                </div>
                <EnquiryLink
                  variant="text"
                  icon="arrow-up-right"
                  subject={localItems.find(local => local.id === item.id)?.title ?? item.title}
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
