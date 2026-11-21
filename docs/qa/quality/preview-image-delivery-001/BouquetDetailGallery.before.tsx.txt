'use client';

import { useState } from 'react';
import styles from './BouquetDetailGallery.module.css';

export type GalleryImage = Readonly<{
  src: string;
  alt: string;
  width: number;
  height: number;
  thumbnailLabel: string;
}>;

type Props = Readonly<{
  images: readonly [GalleryImage, ...GalleryImage[]];
  groupLabel: string;
}>;

export function BouquetDetailGallery({ images, groupLabel }: Props) {
  const [selected, setSelected] = useState(0);
  const current = images[selected];

  return (
    <section className={styles.gallery} aria-label={groupLabel}>
      {/* Native images keep the presentation component independent of a route or image loader. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.main} src={current.src} alt={current.alt} width={current.width} height={current.height} />
      <div className={styles.thumbnails} role="group" aria-label={groupLabel}>
        {images.map((image, index) => (
          <button key={image.src} className={styles.thumbnail} type="button" aria-label={image.thumbnailLabel} aria-pressed={selected === index} onClick={() => setSelected(index)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt="" width={image.width} height={image.height} />
          </button>
        ))}
      </div>
    </section>
  );
}
