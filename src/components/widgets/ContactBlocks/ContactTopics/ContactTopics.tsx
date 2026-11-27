import Image from "next/image";
import { contactImages } from "@/content/contact";
import { Container } from "@/components/shared/Container/Container";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";
import type { ContactContent } from "@/content/sanity/contact";
import type { CmsImage } from "@/content/sanity/home";
import { ContactEditable, type ContactEditing } from "../contactEditing";
import styles from "./ContactTopics.module.css";

type ContactTopicsProps = {
  content: Pick<
    ContactContent,
    | "topic1Title"
    | "topic1Body"
    | "topic2Title"
    | "topic2Body"
    | "topic3Title"
    | "topic3Body"
    | "heroAction"
  >;
  images: { question?: CmsImage; custom?: CmsImage; events?: CmsImage };
  editing: ContactEditing;
};

const topics = [
  { title: "topic1Title", body: "topic1Body", image: "question", photoPath: "question.photo" },
  { title: "topic2Title", body: "topic2Body", image: "custom", photoPath: "custom.photo" },
  { title: "topic3Title", body: "topic3Body", image: "events", photoPath: "events.photo" },
] as const;

export function ContactTopics({ content, images, editing }: ContactTopicsProps) {
  const items = topics.map((slot) => ({
    title: content[slot.title],
    body: content[slot.body],
    src: images[slot.image]?.src ?? contactImages[slot.image as keyof typeof contactImages],
    position: images[slot.image]?.position,
    path: slot.photoPath,
    titlePath: slot.title,
    bodyPath: slot.body,
  }));

  return (
    <section className={styles.section} data-contact-section="topics">
      <Container>
        <ul className={styles.list}>
          {items.map((topic) => (
            <li className={styles.card} key={topic.titlePath}>
              <div className={styles.photo}>
                <Image
                  data-sanity={editing(topic.path, true)}
                  style={topic.position ? { objectPosition: topic.position } : undefined}
                  src={topic.src}
                  alt=""
                  fill
                  sizes="(min-width: 1100px) 410px, 500px"
                  className={styles.image}
                />
              </div>
              <div className={styles.copy}>
                <div className={styles.text}>
                  <h2 data-sanity={editing(topic.titlePath)} className={styles.title}>
                    {topic.title}
                  </h2>
                  <p data-sanity={editing(topic.bodyPath)} className={styles.body}>
                    {topic.body}
                  </p>
                </div>
                <ContactEditable attribute={editing("heroAction")}>
                  <EnquiryLink
                    variant="text"
                    icon="arrow-up-right"
                    subject={topic.title}
                    className={styles.action}
                  >
                    <span className={styles.visuallyHidden}>
                      {content.heroAction}: {topic.title}
                    </span>
                  </EnquiryLink>
                </ContactEditable>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
