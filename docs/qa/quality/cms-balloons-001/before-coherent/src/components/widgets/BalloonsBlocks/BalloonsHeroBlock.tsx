import type { BalloonsContent } from "@/content/balloons";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container/Container";
import { actionClassName } from "@/components/shared/ActionLink";
import { Icon } from "@/components/shared/Icon";
import { BalloonsPhoto } from "./BalloonsPhoto";
import styles from "./BalloonsHeroBlock.module.css";

export function BalloonsHeroBlock({
  content,
  pageTitle,
  homeLabel,
  exploreLabel,
}: {
  content: BalloonsContent["hero"];
  pageTitle: string;
  homeLabel: string;
  exploreLabel: string;
}) {
  return (
    <section
      className={styles.section}
      aria-labelledby="balloons-title"
      data-balloons-section="hero"
    >
      <Container className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.breadcrumb}>
            <Link href="/">{homeLabel}</Link>
            <span aria-hidden="true"> / </span>
            <span>{pageTitle}</span>
          </p>
          <h1 id="balloons-title" className={styles.title}>
            <span className={styles.mobileTitle}>{content.title}</span>
            <span className={styles.tabletTitle}>{content.titleTablet}</span>
            <span className={styles.desktopTitle}>{content.titleDesktop}</span>
          </h1>
          <p className={styles.body}>{content.body}</p>
        </div>
        <a href="#our-favourites" className={actionClassName("primary")}>
          {exploreLabel}
          <Icon name="arrow-right" />
        </a>
      </Container>
      <div className={styles.scene}>
        <BalloonsPhoto
          kind="hero"
          alt={content.imageAlt}
          sizes="100vw"
          eager
          className={styles.photo}
        />
        <div className={styles.fade} aria-hidden="true" />
      </div>
    </section>
  );
}
