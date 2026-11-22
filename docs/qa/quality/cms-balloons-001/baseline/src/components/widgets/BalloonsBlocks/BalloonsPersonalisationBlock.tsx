import type { BalloonsContent } from "@/content/balloons";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import { BalloonsPhoto } from "./BalloonsPhoto";
import styles from "./BalloonsPersonalisationBlock.module.css";

export function BalloonsPersonalisationBlock({
  content,
  enquireLabel,
}: {
  content: BalloonsContent["personalisation"];
  enquireLabel: string;
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
            alt={content.imageAlt}
            sizes="(min-width: 1280px) 608px, 100vw"
            className={styles.scene}
          />
          <div className={styles.content}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>{content.eyebrow}</p>
              <h2
                className={styles.heading}
                id="balloons-personalisation-title"
              >
                {content.title}
              </h2>
              <p className={styles.body}>{content.body}</p>
            </div>
            <ul className={styles.extras}>
              {content.extras.map((item) => (
                <li key={item.id} className={styles.extra}>
                  <BalloonsPhoto
                    kind={item.id}
                    alt={item.imageAlt}
                    sizes="(min-width: 640px) 146px, 50vw"
                    className={styles.extraPhoto}
                  />
                  <div className={styles.caption}>
                    <p className={styles.extraLabel}>{item.title}</p>
                    <EnquiryLink
                      variant="text"
                      subject={item.title}
                      className={styles.enquire}
                    >
                      <span className={styles.compactAction}>
                        {enquireLabel}
                        <span className={styles.visuallyHidden}>
                          {" "}
                          — {item.title}
                        </span>
                      </span>
                      <span className={styles.desktopAction}>{item.title}</span>
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
