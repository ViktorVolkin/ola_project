import Image from "next/image";
import { WeddingsEditable, type WeddingsEditing } from "../WeddingsCommon/weddingsEditing";
import type { CmsImage } from "@/content/sanity/home";
import type {Locale} from "next-intl";
import type {WeddingsPreview} from "@/content/resolver/weddings";
import type {WeddingsContent} from "@/content/weddings";
import {WeddingsPreviewStatus} from "../WeddingsCommon/WeddingsPreviewStatus";

import { Link } from "@/i18n/navigation";
import { weddingsImages } from "@/content/weddings";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import type { WeddingsHeroBlockProps } from "./WeddingsHeroBlock.types";
import { HERO_TITLE_ID } from "../WeddingsCommon/WeddingsCommon.constants";
import styles from "./WeddingsHeroBlock.module.css";

export function WeddingsHeroBlock({ content, homeLabel, planLabel, image, editing, eventSubject, previewStatus }: WeddingsHeroBlockProps & {image?: CmsImage; editing: WeddingsEditing; eventSubject: string; previewStatus?: {locale: Locale; preview: WeddingsPreview | null; content: WeddingsContent}}) {
  return (
    <>
    {previewStatus && <WeddingsPreviewStatus {...previewStatus} editing={editing} />}
    <section className={styles.hero} aria-labelledby={HERO_TITLE_ID} data-weddings-section="hero">
      <Container className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.breadcrumb}>
            <Link href="/"><WeddingsEditable attribute={editing("labels.home")}>{homeLabel}</WeddingsEditable></Link>
            <span aria-hidden="true"> / </span>
            <span>{content.title.replace(/\n/g, " ")}</span>
          </p>
          <h1 data-sanity={editing("hero.title")} id={HERO_TITLE_ID} className={styles.title}>
            {content.title}
          </h1>
          <p data-sanity={editing("hero.lead")} className={styles.lead}>{content.lead}</p>
          <p data-sanity={editing("hero.body")} className={styles.body}>{content.body}</p>
          <EnquiryLink subject={eventSubject}><WeddingsEditable attribute={editing("labels.planEvent")}>{planLabel}</WeddingsEditable></EnquiryLink>
        </div>
      </Container>
      <div className={styles.photo}>
        <Image
          data-sanity={editing("hero.photo", true)}
          style={image ? {objectPosition: image.position} : undefined}
          src={image?.src ?? weddingsImages.hero}
          alt={content.imageAlt}
          fill
          sizes="100vw"
          priority
          className={styles.cover}
        />
        <div className={styles.fade} aria-hidden="true" />
        <p data-sanity={editing("hero.handwritten")} className={styles.handwritten} aria-hidden="true">
          {content.handwritten}
        </p>
      </div>
    </section>
    </>
  );
}
