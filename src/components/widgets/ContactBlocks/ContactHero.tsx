import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {Container} from "@/components/shared/Container/Container";
import {EnquiryLink} from "@/components/widgets/EnquiryLink/EnquiryLink";
import {contactImages} from "@/content/contact";
import type {ContactContent} from "@/content/sanity/contact";
import type {CmsImage} from "@/content/sanity/home";
import {ContactEditable, type ContactEditing} from "./contactEditing";
import styles from "./ContactHero.module.css";

type ContactHeroProps = {
  content: Pick<ContactContent, "home" | "page" | "heroTitle" | "heroBody" | "heroAction" | "heroScript">;
  image?: CmsImage;
  editing: ContactEditing;
};

export function ContactHero({content, image, editing}: ContactHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="contact-hero-title">
      <Container className={styles.layout}>
        <div className={styles.copy}>
          <nav className={styles.breadcrumb} aria-label={content.page}>
            <ContactEditable attribute={editing("home")}>
              <Link href="/">{content.home}</Link>
            </ContactEditable>
            <span aria-hidden="true"> / </span>
            <ContactEditable attribute={editing("page")}>
              <span aria-current="page">{content.page}</span>
            </ContactEditable>
          </nav>
          <h1 id="contact-hero-title" data-sanity={editing("heroTitle")} className={styles.title}>
            {content.heroTitle}
          </h1>
          <p data-sanity={editing("heroBody")} className={styles.body}>
            {content.heroBody}
          </p>
          <div className={styles.action}>
            <ContactEditable attribute={editing("heroAction")}>
              <EnquiryLink>{content.heroAction}</EnquiryLink>
            </ContactEditable>
          </div>
          <p data-sanity={editing("heroScript")} className={styles.script}>
            {content.heroScript}
          </p>
        </div>
        <div className={styles.photo}>
          <Image
            data-sanity={editing("hero.photo", true)}
            style={image ? {objectPosition: image.position} : undefined}
            src={image?.src ?? contactImages.hero}
            alt=""
            fill
            priority
            sizes="(min-width: 1100px) 60vw, 100vw"
            className={styles.image}
          />
        </div>
      </Container>
    </section>
  );
}
