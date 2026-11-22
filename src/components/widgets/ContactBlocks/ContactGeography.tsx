import Image from "next/image";
import {Container} from "@/components/shared/Container/Container";
import {EnquiryLink} from "@/components/widgets/EnquiryLink/EnquiryLink";
import {contactImages} from "@/content/contact";
import type {ContactContent} from "@/content/sanity/contact";
import type {CmsImage} from "@/content/sanity/home";
import {ContactEditable, type ContactEditing} from "./contactEditing";
import styles from "./ContactGeography.module.css";

type ContactGeographyProps = {
  content: Pick<
    ContactContent,
    | "geoEyebrow"
    | "geoTitle"
    | "geoBody"
    | "row1Title"
    | "row1Body"
    | "row2Title"
    | "row2Body"
    | "row3Title"
    | "row3Body"
    | "panelEyebrow"
    | "panelTitle"
    | "panelBody"
    | "panelAction"
  >;
  image?: CmsImage;
  editing: ContactEditing;
};

export function ContactGeography({content, image, editing}: ContactGeographyProps) {
  return (
    <section className={styles.section} aria-labelledby="contact-geography-title">
      <Container className={styles.layout}>
        <div className={styles.info}>
          <p data-sanity={editing("geoEyebrow")} className={styles.eyebrow}>
            {content.geoEyebrow}
          </p>
          <h2 id="contact-geography-title" data-sanity={editing("geoTitle")} className={styles.title}>
            {content.geoTitle}
          </h2>
          <p data-sanity={editing("geoBody")} className={styles.body}>
            {content.geoBody}
          </p>
          <div className={styles.rows}>
            <div className={styles.row}>
              <h3 data-sanity={editing("row1Title")}>{content.row1Title}</h3>
              <p data-sanity={editing("row1Body")}>{content.row1Body}</p>
            </div>
            <div className={styles.row}>
              <h3 data-sanity={editing("row2Title")}>{content.row2Title}</h3>
              <p data-sanity={editing("row2Body")}>{content.row2Body}</p>
            </div>
            <div className={styles.row}>
              <ContactEditable attribute={editing("row3Title")}>
                <EnquiryLink variant="text" className={styles.rowAction}>
                  <span>
                    <span className={styles.rowTitle}>{content.row3Title}</span>
                    <span className={styles.rowBody}>{content.row3Body}</span>
                  </span>
                </EnquiryLink>
              </ContactEditable>
            </div>
          </div>
        </div>
        <div className={styles.group}>
          <div className={styles.photo}>
            <Image
              data-sanity={editing("geography.photo", true)}
              style={image ? {objectPosition: image.position} : undefined}
              src={image?.src ?? contactImages.geography}
              alt=""
              width={1600}
              height={1236}
              sizes="(min-width: 1100px) 50vw, 100vw"
              className={styles.image}
            />
          </div>
          <div className={styles.panel}>
            <p data-sanity={editing("panelEyebrow")} className={styles.eyebrow}>
              {content.panelEyebrow}
            </p>
            <h3 data-sanity={editing("panelTitle")} className={styles.panelTitle}>
              {content.panelTitle}
            </h3>
            <p data-sanity={editing("panelBody")} className={styles.panelBody}>
              {content.panelBody}
            </p>
            <ContactEditable attribute={editing("panelAction")}>
              <EnquiryLink variant="secondary" subject={content.panelAction}>
                {content.panelAction}
              </EnquiryLink>
            </ContactEditable>
          </div>
        </div>
      </Container>
    </section>
  );
}
