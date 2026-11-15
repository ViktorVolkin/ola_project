import Image from "next/image";
import type contactMessages from "@/i18n/messages/contact/en.json";
import {contactImages} from "@/content/contact";
import {Container} from "@/components/shared/Container/Container";
import {EnquiryLink} from "@/components/widgets/EnquiryLink/EnquiryLink";
import styles from "./ContactTopics.module.css";

type ContactMessages = typeof contactMessages;

export function ContactTopics({c}: {c: ContactMessages}) {
  const topics = [
    {title: c.topic1Title, body: c.topic1Body, image: contactImages.question},
    {title: c.topic2Title, body: c.topic2Body, image: contactImages.custom},
    {title: c.topic3Title, body: c.topic3Body, image: contactImages.events},
  ];

  return (
    <section className={styles.section} data-contact-section="topics">
      <Container>
        <ul className={styles.list}>
          {topics.map((topic) => (
            <li className={styles.card} key={topic.image}>
              <div className={styles.photo}>
                <Image src={topic.image} alt="" fill sizes="(min-width: 1100px) 410px, (min-width: 560px) 232px, 124px" className={styles.image} />
              </div>
              <div className={styles.copy}>
                <div className={styles.text}>
                  <h2 className={styles.title}>{topic.title}</h2>
                  <p className={styles.body}>{topic.body}</p>
                </div>
                <EnquiryLink variant="text" icon="arrow-up-right" subject={topic.title} className={styles.action}>
                  <span className={styles.visuallyHidden}>{c.heroAction}: {topic.title}</span>
                </EnquiryLink>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
