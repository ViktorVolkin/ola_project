import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container/Container";
import { actionClassName } from "@/components/shared/ActionLink";
import { Icon } from "@/components/shared/Icon";
import styles from "./BouquetsHero.module.css";

export type BouquetsHeroProps = {
  content: {
    breadcrumb: string;
    title: string;
    subtitle: string;
    body: string;
    script: string;
    actionLabel: string;
  };
  inspirationHref: string;
  image: { src: string; alt: string; width: number; height: number };
};

export function BouquetsHero({ content, inspirationHref, image }: BouquetsHeroProps) {
  // The supplied breadcrumb is a combined "home / current page" string.
  const separator = content.breadcrumb.indexOf("/");
  const home = separator < 0 ? "" : content.breadcrumb.slice(0, separator).trim();
  const current = separator < 0 ? content.breadcrumb : content.breadcrumb.slice(separator + 1).trim();

  return (
    <section className={styles.section} aria-labelledby="bouquets-title" data-bouquets-section="hero">
      <Container className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.breadcrumb}>
            {home && <><Link href="/">{home}</Link><span aria-hidden="true"> / </span></>}
            <span aria-current="page">{current}</span>
          </p>
          <h1 id="bouquets-title" className={styles.title}>{content.title}</h1>
          <p className={styles.subtitle}>{content.subtitle}</p>
          <p className={styles.body}>{content.body}</p>
          <a href={inspirationHref} className={actionClassName("primary")}>
            {content.actionLabel}<Icon name="arrow-right" />
          </a>
          <p className={styles.script}>{content.script}</p>
        </div>
      </Container>
      <div className={styles.scene}>
        <Image {...image} alt={image.alt} className={styles.photo} sizes="(min-width: 1100px) 53vw, 100vw" fetchPriority="high" />
        <div className={styles.fade} aria-hidden="true" />
      </div>
    </section>
  );
}
