import Image from "next/image";
import {Container} from "@/components/shared/Container/Container";
import {contactImages} from "@/content/contact";
import type messages from "@/i18n/messages/contact/en.json";
import {ContactFaq} from "./ContactFaq";
import styles from "./ContactLower.module.css";

type ContactMessages = typeof messages;

export function ContactLower({c}: {c: ContactMessages}) {
  const steps = [
    {title: c.step1Title, body: c.step1Body},
    {title: c.step2Title, body: c.step2Body},
    {title: c.step3Title, body: c.step3Body},
    {title: c.step4Title, body: c.step4Body},
  ];
  const items = [
    {question: c.q1, answer: c.a1}, {question: c.q2, answer: c.a2},
    {question: c.q3, answer: c.a3}, {question: c.q4, answer: c.a4},
    {question: c.q5, answer: c.a5}, {question: c.q6, answer: c.a6},
    {question: c.q7, answer: c.a7},
  ];
  return <section className={styles.section}>
    <Container className={styles.grid}>
      <div className={styles.process}>
        <p className={styles.eyebrow}>{c.processEyebrow}</p>
        <h2 className={styles.heading}>{c.processTitle}</h2>
        <ol className={styles.steps}>{steps.map((step, index) => <li className={styles.step} key={step.title}>
          <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
          <div><h3 className={styles.stepTitle}>{step.title}</h3><p className={styles.stepBody}>{step.body}</p></div>
        </li>)}</ol>
      </div>
      <figure className={styles.editorial}>
        <div className={styles.photo}><Image src={contactImages.editorial} alt="" width={1200} height={1328} sizes="(max-width: 639px) 150vw, (max-width: 1199px) 65vw, 40vw" /></div>
        <figcaption className={styles.caption}>{c.caption}</figcaption>
      </figure>
      <div className={styles.faq}>
        <p className={styles.eyebrow}>{c.faqEyebrow}</p>
        <h2 className={styles.heading}>{c.faqTitle}</h2>
        <ContactFaq items={items} />
      </div>
    </Container>
  </section>;
}
