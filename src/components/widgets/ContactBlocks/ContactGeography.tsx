import Image from "next/image";
import {Container} from "@/components/shared/Container/Container";
import {EnquiryLink} from "@/components/widgets/EnquiryLink/EnquiryLink";
import {contactImages} from "@/content/contact";
import type en from "@/i18n/messages/contact/en.json";
import styles from "./ContactGeography.module.css";

export function ContactGeography({c}: {c: typeof en}) {
  return (
    <section className={styles.section} aria-labelledby="contact-geography-title">
      <Container className={styles.layout}>
        <div className={styles.info}>
          <p className={styles.eyebrow}>{c.geoEyebrow}</p>
          <h2 id="contact-geography-title" className={styles.title}>{c.geoTitle}</h2>
          <p className={styles.body}>{c.geoBody}</p>
          <div className={styles.rows}>
            <div className={styles.row}><h3>{c.row1Title}</h3><p>{c.row1Body}</p></div>
            <div className={styles.row}><h3>{c.row2Title}</h3><p>{c.row2Body}</p></div>
            <div className={styles.row}>
              <EnquiryLink variant="text" className={styles.rowAction}>
                <span><span className={styles.rowTitle}>{c.row3Title}</span><span className={styles.rowBody}>{c.row3Body}</span></span>
              </EnquiryLink>
            </div>
          </div>
        </div>
        <div className={styles.group}>
          <div className={styles.photo}>
            <Image src={contactImages.geography} alt="" width={1600} height={1236} sizes="(min-width: 1100px) 50vw, 100vw" className={styles.image} />
          </div>
          <div className={styles.panel}>
            <p className={styles.eyebrow}>{c.panelEyebrow}</p>
            <h3 className={styles.panelTitle}>{c.panelTitle}</h3>
            <p className={styles.panelBody}>{c.panelBody}</p>
            <EnquiryLink variant="secondary" subject={c.panelAction}>{c.panelAction}</EnquiryLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
