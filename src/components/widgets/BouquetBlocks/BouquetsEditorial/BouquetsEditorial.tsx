import clsx from "clsx";
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./BouquetsEditorial.module.css";

type EditorialImage = { src: string; alt: string; width: number; height: number; position?: string };
type EditorialCopy = { eyebrow: string; title: string; body: string; eyebrowEdit?: string; titleEdit?: string; bodyEdit?: string; imageEdit?: string };

export function BouquetsEditorial({ custom, seasonal }: {
  custom: EditorialCopy & { action: ReactNode; image: EditorialImage; actionEdit?: string };
  seasonal: EditorialCopy & { image: EditorialImage; items: readonly {label: string; labelEdit?: string; image?: EditorialImage; imageEdit?: string}[] };
}) {
  return (
    <>
      <section className={clsx(styles.section, styles.customSection)} aria-labelledby="bouquets-custom-title" data-bouquets-section="custom">
        <div className={styles.customBand}>
          <div className={styles.copy}>
            <p className={styles.eyebrow} data-sanity={custom.eyebrowEdit}>{custom.eyebrow}</p>
            <h2 className={styles.heading} id="bouquets-custom-title" data-sanity={custom.titleEdit}>{custom.title}</h2>
            <p className={styles.body} data-sanity={custom.bodyEdit}>{custom.body}</p>
            <div className={styles.action} data-sanity={custom.actionEdit}>{custom.action}</div>
          </div>
          <div className={styles.customPhoto}>
            <Image src={custom.image.src} width={custom.image.width} height={custom.image.height} alt={custom.image.alt} data-sanity={custom.imageEdit} style={custom.image.position ? {objectPosition: custom.image.position} : undefined} className={styles.customImage} sizes="(min-width: 1100px) 65vw, 100vw" />
          </div>
        </div>
      </section>
      <section className={styles.section} aria-labelledby="bouquets-seasonal-title" data-bouquets-section="seasonal">
        <div className={styles.seasonalBand}>
          <div className={styles.copy}>
            <p className={styles.eyebrow} data-sanity={seasonal.eyebrowEdit}>{seasonal.eyebrow}</p>
            <h2 className={styles.heading} id="bouquets-seasonal-title" data-sanity={seasonal.titleEdit}>{seasonal.title}</h2>
            <p className={styles.body} data-sanity={seasonal.bodyEdit}>{seasonal.body}</p>
          </div>
          <ul className={styles.seasons} aria-label={seasonal.image.alt || undefined}>
            {seasonal.items.map((item, index) => (
              <li className={styles.season} key={index}>
                <div className={styles.crop}>
                  <div className={styles.mask}>
                    <Image src={(item.image ?? seasonal.image).src} width={(item.image ?? seasonal.image).width} height={(item.image ?? seasonal.image).height} alt="" data-sanity={item.imageEdit} style={(item.image ?? seasonal.image).position ? {objectPosition: (item.image ?? seasonal.image).position} : undefined} className={item.image ? styles.seasonPhoto : styles.montage} sizes="100vw" />
                  </div>
                </div>
                <span className={styles.caption} data-sanity={item.labelEdit}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
