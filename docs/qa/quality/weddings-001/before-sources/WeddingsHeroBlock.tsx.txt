import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {weddingsImages, type WeddingsContent} from "@/content/weddings";
import {Container} from "@/components/shared/Container/Container";
import {EnquiryLink} from "@/components/widgets/EnquiryLink/EnquiryLink";
import styles from "./WeddingsHeroBlock.module.css";

export function WeddingsHeroBlock({
  content,
  homeLabel,
  planLabel
}: {
  content: WeddingsContent["hero"];
  homeLabel: string;
  planLabel: string;
}) {
  return (
    <section className={styles.hero} aria-labelledby="weddings-title" data-weddings-section="hero">
      <Container className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.breadcrumb}>
            <Link href="/">{homeLabel}</Link>
            <span aria-hidden="true"> / </span>
            <span>{content.title.replace(/\n/g, " ")}</span>
          </p>
          <h1 id="weddings-title" className={styles.title}>
            {content.title}
          </h1>
          <p className={styles.lead}>{content.lead}</p>
          <p className={styles.body}>{content.body}</p>
          <EnquiryLink subject={content.title.replace(/\n/g, " ")}>{planLabel}</EnquiryLink>
        </div>
      </Container>
      <div className={styles.photo}>
        <Image
          src={weddingsImages.hero}
          alt={content.imageAlt}
          fill
          sizes="100vw"
          priority
          className={styles.cover}
        />
        <div className={styles.fade} aria-hidden="true" />
        <p className={styles.handwritten} aria-hidden="true">
          {content.handwritten}
        </p>
      </div>
    </section>
  );
}
