import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./BouquetsEditorial.module.css";

type EditorialImage = { src: string; alt: string; width: number; height: number };
type EditorialCopy = { eyebrow: string; title: string; body: string };

export function BouquetsEditorial({ custom, seasonal }: {
  custom: EditorialCopy & { action: ReactNode; image: EditorialImage };
  seasonal: EditorialCopy & { labels: readonly string[]; image: EditorialImage };
}) {
  return (
    <>
      <section className={`${styles.section} ${styles.customSection}`} aria-labelledby="bouquets-custom-title" data-bouquets-section="custom">
        <div className={styles.customBand}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{custom.eyebrow}</p>
            <h2 className={styles.heading} id="bouquets-custom-title">{custom.title}</h2>
            <p className={styles.body}>{custom.body}</p>
            <div className={styles.action}>{custom.action}</div>
          </div>
          <div className={styles.customPhoto}>
            <Image {...custom.image} alt={custom.image.alt} className={styles.customImage} sizes="(min-width: 1100px) 65vw, 100vw" />
          </div>
        </div>
      </section>
      <section className={styles.section} aria-labelledby="bouquets-seasonal-title" data-bouquets-section="seasonal">
        <div className={styles.seasonalBand}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{seasonal.eyebrow}</p>
            <h2 className={styles.heading} id="bouquets-seasonal-title">{seasonal.title}</h2>
            <p className={styles.body}>{seasonal.body}</p>
          </div>
          <ul className={styles.seasons} aria-label={seasonal.image.alt || undefined}>
            {seasonal.labels.map((label, index) => (
              <li className={styles.season} key={`${index}-${label}`}>
                <div className={styles.crop}>
                  <div className={styles.mask}>
                    <Image {...seasonal.image} alt="" className={styles.montage} sizes="100vw" />
                  </div>
                </div>
                <span className={styles.caption}>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
