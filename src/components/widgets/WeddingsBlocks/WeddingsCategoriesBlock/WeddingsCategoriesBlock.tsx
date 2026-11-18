import Image from "next/image";
import { weddingsImages } from "@/content/weddings";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import type { WeddingsCategoriesBlockProps } from "./WeddingsCategoriesBlock.types";
import { CATEGORIES_TITLE_ID } from "../WeddingsCommon/WeddingsCommon.constants";
import styles from "./WeddingsCategoriesBlock.module.css";

export function WeddingsCategoriesBlock({ items, label }: WeddingsCategoriesBlockProps) {
  return (
    <section
      className={styles.categories}
      aria-labelledby={CATEGORIES_TITLE_ID}
      data-weddings-section="categories"
    >
      <h2 id={CATEGORIES_TITLE_ID} className={styles.hidden}>
        {label}
      </h2>
      <Container>
        <ul className={styles.grid}>
          {items.map((item) => (
            <li className={styles.card} key={item.id}>
              <div className={styles.photo}>
                <Image
                  src={weddingsImages[item.id]}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 124px, 136px"
                  className={styles.cover}
                />
              </div>
              <div className={styles.copy}>
                <div>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.description}>{item.description}</p>
                </div>
                <EnquiryLink
                  variant="text"
                  className={styles.circle}
                  icon="arrow-up-right"
                  subject={item.title}
                >
                  <span className={styles.hidden}>{item.title}</span>
                </EnquiryLink>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
