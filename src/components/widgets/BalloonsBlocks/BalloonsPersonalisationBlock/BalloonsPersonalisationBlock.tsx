import type { BalloonsContent } from "@/content/balloons";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import { BalloonsPhoto } from "../BalloonsPhoto/BalloonsPhoto";
import type {BalloonsImages} from "@/content/sanity/balloons";
import {BalloonsEditable, type BalloonsEditing} from "../balloonsEditing";
import styles from "./BalloonsPersonalisationBlock.module.css";

export function BalloonsPersonalisationBlock({
  content,
  enquireLabel,
  images, editing, localExtras,
}: {
  content: BalloonsContent["personalisation"];
  enquireLabel: string;
  images: BalloonsImages; editing: BalloonsEditing; localExtras: BalloonsContent["personalisation"]["extras"];
}) {
  return (
    <section
      className={styles.section}
      aria-labelledby="balloons-personalisation-title"
      data-balloons-section="personalisation"
    >
      <Container className={styles.inner}>
        <div className={styles.row}>
          <BalloonsPhoto
            kind="scene"
            image={images.scene} annotation={editing("personalisation.photo", true)}
            alt={content.imageAlt}
            sizes="(min-width: 1280px) 608px, 100vw"
            className={styles.scene}
          />
          <div className={styles.content}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}><BalloonsEditable attribute={editing("personalisation.eyebrow")}>{content.eyebrow}</BalloonsEditable></p>
              <h2
                className={styles.heading}
                id="balloons-personalisation-title"
              >
                <BalloonsEditable attribute={editing("personalisation.title")}>{content.title}</BalloonsEditable>
              </h2>
              <p className={styles.body}><BalloonsEditable attribute={editing("personalisation.body")}>{content.body}</BalloonsEditable></p>
            </div>
            <ul className={styles.extras}>
              {content.extras.map((item) => (
                <li key={item.id} className={styles.extra}>
                  <BalloonsPhoto
                    kind={item.id}
                    image={images[item.id]} annotation={editing(`personalisation.${item.id}.photo`, true)}
                    alt={item.imageAlt}
                    sizes="(min-width: 640px) 146px, 50vw"
                    className={styles.extraPhoto}
                  />
                  <div className={styles.caption}>
                    <p className={styles.extraLabel}><BalloonsEditable attribute={editing(`personalisation.${item.id}.title`)}>{item.title}</BalloonsEditable></p>
                    <EnquiryLink
                      variant="text"
                      subject={localExtras.find(local => local.id === item.id)?.title ?? item.title}
                      className={styles.enquire}
                    >
                      <span className={styles.compactAction}>
                        <BalloonsEditable attribute={editing("labels.enquire")}>{enquireLabel}</BalloonsEditable>
                        <span className={styles.visuallyHidden}>
                          {" "}
                          — {item.title}
                        </span>
                      </span>
                      <span className={styles.desktopAction}><BalloonsEditable attribute={editing(`personalisation.${item.id}.title`)}>{item.title}</BalloonsEditable></span>
                    </EnquiryLink>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
