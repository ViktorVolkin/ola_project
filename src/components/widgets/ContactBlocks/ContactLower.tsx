import Image from "next/image";
import {Container} from "@/components/shared/Container/Container";
import {contactImages} from "@/content/contact";
import type {ContactContent} from "@/content/sanity/contact";
import type {CmsImage} from "@/content/sanity/home";
import {ContactFaq} from "./ContactFaq";
import type {ContactEditing} from "./contactEditing";
import styles from "./ContactLower.module.css";

type ContactLowerProps = {
  content: Pick<
    ContactContent,
    | "processEyebrow"
    | "processTitle"
    | "step1Title"
    | "step1Body"
    | "step2Title"
    | "step2Body"
    | "step3Title"
    | "step3Body"
    | "step4Title"
    | "step4Body"
    | "caption"
    | "faqEyebrow"
    | "faqTitle"
    | "q1"
    | "a1"
    | "q2"
    | "a2"
    | "q3"
    | "a3"
    | "q4"
    | "a4"
    | "q5"
    | "a5"
    | "q6"
    | "a6"
    | "q7"
    | "a7"
  >;
  image?: CmsImage;
  editing: ContactEditing;
};

export function ContactLower({content, image, editing}: ContactLowerProps) {
  const steps = [
    {title: content.step1Title, body: content.step1Body, titlePath: "step1Title", bodyPath: "step1Body"},
    {title: content.step2Title, body: content.step2Body, titlePath: "step2Title", bodyPath: "step2Body"},
    {title: content.step3Title, body: content.step3Body, titlePath: "step3Title", bodyPath: "step3Body"},
    {title: content.step4Title, body: content.step4Body, titlePath: "step4Title", bodyPath: "step4Body"},
  ];
  const items = [
    {question: content.q1, answer: content.a1, questionPath: "q1", answerPath: "a1"},
    {question: content.q2, answer: content.a2, questionPath: "q2", answerPath: "a2"},
    {question: content.q3, answer: content.a3, questionPath: "q3", answerPath: "a3"},
    {question: content.q4, answer: content.a4, questionPath: "q4", answerPath: "a4"},
    {question: content.q5, answer: content.a5, questionPath: "q5", answerPath: "a5"},
    {question: content.q6, answer: content.a6, questionPath: "q6", answerPath: "a6"},
    {question: content.q7, answer: content.a7, questionPath: "q7", answerPath: "a7"},
  ];
  return (
    <section className={styles.section}>
      <Container className={styles.grid}>
        <div className={styles.process}>
          <p data-sanity={editing("processEyebrow")} className={styles.eyebrow}>
            {content.processEyebrow}
          </p>
          <h2 data-sanity={editing("processTitle")} className={styles.heading}>
            {content.processTitle}
          </h2>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li className={styles.step} key={step.title}>
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 data-sanity={editing(step.titlePath)} className={styles.stepTitle}>
                    {step.title}
                  </h3>
                  <p data-sanity={editing(step.bodyPath)} className={styles.stepBody}>
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <figure className={styles.editorial}>
          <div className={styles.photo}>
            <Image
              data-sanity={editing("editorial.photo", true)}
              style={image ? {objectPosition: image.position} : undefined}
              src={image?.src ?? contactImages.editorial}
              alt=""
              width={1200}
              height={1328}
              sizes="(max-width: 639px) 150vw, (max-width: 1199px) 65vw, 40vw"
            />
          </div>
          <figcaption className={styles.caption} data-sanity={editing("caption")}>
            {content.caption}
          </figcaption>
        </figure>
        <div className={styles.faq}>
          <p data-sanity={editing("faqEyebrow")} className={styles.eyebrow}>{content.faqEyebrow}</p>
          <h2 data-sanity={editing("faqTitle")} className={styles.heading}>{content.faqTitle}</h2>
          <ContactFaq items={items} attributes={items.map(item => ({question: editing(item.questionPath), answer: editing(item.answerPath)}))} />
        </div>
      </Container>
    </section>
  );
}
