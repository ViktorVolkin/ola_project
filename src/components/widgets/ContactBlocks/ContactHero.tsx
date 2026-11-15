import Image from "next/image";
import {Link} from "@/i18n/navigation";
import {Container} from "@/components/shared/Container/Container";
import {EnquiryLink} from "@/components/widgets/EnquiryLink/EnquiryLink";
import {contactImages} from "@/content/contact";
import type en from "@/i18n/messages/contact/en.json";
import styles from "./ContactHero.module.css";

export function ContactHero({c}: {c: typeof en}) {
  return (
    <section className={styles.hero} aria-labelledby="contact-hero-title">
      <Container className={styles.layout}>
        <div className={styles.copy}>
          <nav className={styles.breadcrumb} aria-label={c.page}>
            <Link href="/">{c.home}</Link><span aria-hidden="true"> / </span><span aria-current="page">{c.page}</span>
          </nav>
          <h1 id="contact-hero-title" className={styles.title}>{c.heroTitle}</h1>
          <p className={styles.body}>{c.heroBody}</p>
          <div className={styles.action}><EnquiryLink>{c.heroAction}</EnquiryLink></div>
          <p className={styles.script}>{c.heroScript}</p>
        </div>
        <div className={styles.photo}>
          <Image src={contactImages.hero} alt="" fill priority sizes="(min-width: 1100px) 60vw, 100vw" className={styles.image} />
        </div>
      </Container>
    </section>
  );
}
