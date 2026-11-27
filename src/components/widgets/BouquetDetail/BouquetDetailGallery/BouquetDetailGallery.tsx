'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import styles from './BouquetDetailGallery.module.css';

type ResponsiveImage = Readonly<{ src: string; srcSet?: string; sizes?: string }>;

export type GalleryImage = Readonly<{
  src: string;
  alt: string;
  width: number;
  height: number;
  thumbnailLabel: string;
  main?: ResponsiveImage;
  thumbnail?: ResponsiveImage;
}>;

type Props = Readonly<{
  images: readonly [GalleryImage, ...GalleryImage[]];
  groupLabel: string;
}>;

const motionQuery = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (callback: () => void) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const reducedMotion = () => window.matchMedia(motionQuery).matches;
const serverMotion = () => true;

export function BouquetDetailGallery({ images, groupLabel }: Props) {
  const swiper = useRef<SwiperInstance | null>(null);
  const [selected, setSelected] = useState(0);
  const reduced = useSyncExternalStore(subscribeMotion, reducedMotion, serverMotion);

  return (
    <section className={styles.gallery} aria-label={groupLabel}>
      <Swiper className={styles.viewport} slidesPerView={1} loop={false} threshold={8} speed={reduced ? 0 : 260} onSwiper={(instance) => { swiper.current = instance; }} onSlideChange={(instance) => setSelected(instance.activeIndex)}>
        {images.map((image, index) => {
          const active = selected === index;
          const delivery = active ? image.main : image.thumbnail;
          return <SwiperSlide key={image.src} aria-hidden={!active}>
            {/* Image delivery is supplied by the server; the gallery remains loader-independent. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.main} src={delivery?.src ?? image.src} srcSet={delivery?.srcSet} sizes={delivery?.sizes} alt={active ? image.alt : ''} width={image.width} height={image.height} draggable={false} />
          </SwiperSlide>;
        })}
      </Swiper>
      <span className={styles.announcement} role="status" aria-live="polite" aria-atomic="true">{images[selected].alt}</span>
      <div className={styles.thumbnails} role="group" aria-label={groupLabel}>
        {images.map((image, index) => (
          <button key={image.src} className={styles.thumbnail} type="button" aria-label={image.thumbnailLabel} aria-pressed={selected === index} onClick={() => swiper.current?.slideTo(index)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.thumbnail?.src ?? image.src} srcSet={image.thumbnail?.srcSet} sizes={image.thumbnail?.sizes} alt="" width={image.width} height={image.height} />
          </button>
        ))}
      </div>
    </section>
  );
}
