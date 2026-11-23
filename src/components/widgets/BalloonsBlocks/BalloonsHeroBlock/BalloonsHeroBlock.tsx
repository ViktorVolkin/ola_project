import type { BalloonsContent } from "@/content/balloons";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container/Container";
import { actionClassName } from "@/components/shared/ActionLink";
import { Icon } from "@/components/shared/Icon";
import { BalloonsPhoto } from "../BalloonsPhoto/BalloonsPhoto";
import type {BalloonsImages} from "@/content/sanity/balloons";
import {BalloonsEditable, type BalloonsEditing} from "../balloonsEditing";
import {BalloonsPreviewStatus} from "../BalloonsPreviewStatus";
import type {BalloonsPreview} from "@/content/resolver/balloons";
import type {Locale} from "next-intl";
import styles from "./BalloonsHeroBlock.module.css";

export function BalloonsHeroBlock({
  content,
  pageTitle,
  homeLabel,
  exploreLabel,
  images, editing, previewStatus,
}: {
  content: BalloonsContent["hero"];
  pageTitle: string;
  homeLabel: string;
  exploreLabel: string;
  images: BalloonsImages; editing: BalloonsEditing; previewStatus?: {locale: Locale; preview: BalloonsPreview | null; content: BalloonsContent};
}) {
  return (
    <section
      className={styles.section}
      aria-labelledby="balloons-title"
      data-balloons-section="hero"
    >
      {previewStatus && <BalloonsPreviewStatus {...previewStatus} editing={editing} />}
      <Container className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.breadcrumb}>
            <Link href="/"><BalloonsEditable attribute={editing("labels.home")}>{homeLabel}</BalloonsEditable></Link>
            <span aria-hidden="true"> / </span>
            <span><BalloonsEditable attribute={editing("pageTitle")}>{pageTitle}</BalloonsEditable></span>
          </p>
          <h1 id="balloons-title" className={styles.title}>
            <span className={styles.mobileTitle}><BalloonsEditable attribute={editing("hero.title")}>{content.title}</BalloonsEditable></span>
            <span className={styles.tabletTitle}><BalloonsEditable attribute={editing("hero.titleTablet")}>{content.titleTablet}</BalloonsEditable></span>
            <span className={styles.desktopTitle}><BalloonsEditable attribute={editing("hero.titleDesktop")}>{content.titleDesktop}</BalloonsEditable></span>
          </h1>
          <p className={styles.body}><BalloonsEditable attribute={editing("hero.body")}>{content.body}</BalloonsEditable></p>
        </div>
        <a href="#our-favourites" className={actionClassName("primary")}>
          <BalloonsEditable attribute={editing("labels.exploreSets")}>{exploreLabel}</BalloonsEditable>
          <Icon name="arrow-right" />
        </a>
      </Container>
      <div className={styles.scene}>
        <BalloonsPhoto
          kind="hero"
          image={images.hero} annotation={editing("hero.photo", true)}
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
