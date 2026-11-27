import type { ReactNode } from 'react';
import { Hero } from '@/components/shared/Hero';
import { Link } from '@/i18n/navigation';
import { BouquetDetailGallery, type GalleryImage } from '@/components/widgets/BouquetDetailGallery/BouquetDetailGallery';
import { BouquetDetailPreferences, type PreferencesProps } from '@/components/widgets/BouquetDetailPreferences/BouquetDetailPreferences';
import { BouquetDetailInformation, type InformationItem } from '@/components/widgets/BouquetDetailSupporting/BouquetDetailSupporting';
import styles from './BouquetDetailHero.module.css';

type Props = {
  home: string; bouquets: string; title: string; support: string; body: string;
  back: string; reassurance: string; eyebrow?: string; action: ReactNode;
  images: readonly [GalleryImage, ...GalleryImage[]]; galleryLabel: string;
  preferences: PreferencesProps; information: readonly [InformationItem, InformationItem, InformationItem];
  decorative: ReactNode | null;
};

export function BouquetDetailHero(p: Props) {
  return <Hero variant="split" titleId="bouquet-detail-title" title={p.title} eyebrow={p.eyebrow} subtitle={p.support} description={p.body}
    breadcrumb={<nav aria-label={p.bouquets} className={styles.breadcrumb}><Link href="/">{p.home}</Link><span aria-hidden="true"> / </span><Link href="/bouquets">{p.bouquets}</Link><span aria-hidden="true"> / </span><span aria-current="page">{p.title}</span></nav>}
    image={<><div className={styles.gallery}><BouquetDetailGallery images={p.images} groupLabel={p.galleryLabel}/></div>{p.decorative && <div className={styles.decorative} aria-hidden="true">{p.decorative}</div>}</>}
  >
    <div className={styles.controls}><BouquetDetailPreferences {...p.preferences}/><div className={styles.actions}><div className={styles.actionSlot}>{p.action}</div><Link className={styles.back} href="/bouquets">{p.back}</Link><p>{p.reassurance}</p></div><BouquetDetailInformation items={p.information}/></div>
  </Hero>;
}
