import type { BalloonsContent } from "@/content/balloons";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/components/shared/Hero";
import { actionClassName } from "@/components/shared/ActionLink";
import { Icon } from "@/components/shared/Icon";
import Image from "next/image";
import { balloonsImages } from "@/content/balloons";
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
    <>
    {previewStatus && <BalloonsPreviewStatus {...previewStatus} editing={editing} />}
    <Hero titleId="balloons-title" data-balloons-section="hero"
      breadcrumb={<p className={styles.breadcrumb}><Link href="/"><BalloonsEditable attribute={editing("labels.home")}>{homeLabel}</BalloonsEditable></Link><span aria-hidden="true"> / </span><span><BalloonsEditable attribute={editing("pageTitle")}>{pageTitle}</BalloonsEditable></span></p>}
      title={<><span className={styles.mobileTitle}><BalloonsEditable attribute={editing("hero.title")}>{content.title}</BalloonsEditable></span><span className={styles.tabletTitle}><BalloonsEditable attribute={editing("hero.titleTablet")}>{content.titleTablet}</BalloonsEditable></span><span className={styles.desktopTitle}><BalloonsEditable attribute={editing("hero.titleDesktop")}>{content.titleDesktop}</BalloonsEditable></span></>}
      description={<BalloonsEditable attribute={editing("hero.body")}>{content.body}</BalloonsEditable>}
      actions={<a href="#our-favourites" className={actionClassName("primary")}><BalloonsEditable attribute={editing("labels.exploreSets")}>{exploreLabel}</BalloonsEditable><Icon name="arrow-right" /></a>}
      image={<Image data-balloon-photo="hero" data-sanity={editing("hero.photo", true)} src={images.hero?.src ?? balloonsImages.hero} style={images.hero ? {objectPosition: images.hero.position} : undefined} alt={content.imageAlt} fill sizes="100vw" priority />}
    />
    </>
  );
}
