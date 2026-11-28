import Image from "next/image";
import { WeddingsEditable, type WeddingsEditing } from "../WeddingsCommon/weddingsEditing";
import type { CmsImage } from "@/content/sanity/home";
import type { Locale } from "next-intl";
import type { WeddingsPreview } from "@/content/resolver/weddings";
import type { WeddingsContent } from "@/content/weddings";
import { WeddingsPreviewStatus } from "../WeddingsCommon/WeddingsPreviewStatus";

import { Link } from "@/i18n/navigation";
import { weddingsImages } from "@/content/weddings";
import { Hero } from "@/components/shared/Hero";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import type { WeddingsHeroBlockProps } from "./WeddingsHeroBlock.types";
import { HERO_TITLE_ID } from "../WeddingsCommon/WeddingsCommon.constants";
import styles from "./WeddingsHeroBlock.module.css";

export function WeddingsHeroBlock({
  content,
  homeLabel,
  planLabel,
  image,
  editing,
  eventSubject,
  previewStatus,
}: WeddingsHeroBlockProps & {
  image?: CmsImage;
  editing: WeddingsEditing;
  eventSubject: string;
  previewStatus?: { locale: Locale; preview: WeddingsPreview | null; content: WeddingsContent };
}) {
  return (
    <>
      {previewStatus && <WeddingsPreviewStatus {...previewStatus} editing={editing} />}
      <Hero
        titleId={HERO_TITLE_ID}
        title={content.title}
        data-weddings-section="hero"
        breadcrumb={
          <p className={styles.breadcrumb}>
            <Link href="/">
              <WeddingsEditable attribute={editing("labels.home")}>{homeLabel}</WeddingsEditable>
            </Link>
            <span aria-hidden="true"> / </span>
            <span>{content.title.replace(/\n/g, " ")}</span>
          </p>
        }
        subtitle={content.lead}
        description={content.body}
        handwritten={content.handwritten}
        handwrittenClassName={styles.heroHandwritten}
        annotations={{
          title: editing("hero.title"),
          subtitle: editing("hero.lead"),
          description: editing("hero.body"),
          handwritten: editing("hero.handwritten"),
        }}
        actions={
          <EnquiryLink subject={eventSubject}>
            <WeddingsEditable attribute={editing("labels.planEvent")}>{planLabel}</WeddingsEditable>
          </EnquiryLink>
        }
        image={
          <Image
            data-sanity={editing("hero.photo", true)}
            style={image ? { objectPosition: image.position } : undefined}
            src={image?.src ?? weddingsImages.hero}
            alt={content.imageAlt}
            fill
            sizes="100vw"
            priority
          />
        }
      />
    </>
  );
}
