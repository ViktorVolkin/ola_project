import {Container} from "@/components/shared/Container/Container";
import Image from "next/image";
import type {AboutContent} from "../types";
import type {AboutEditing} from "../aboutEditing";
import styles from "./AboutPrinciplesBlock.module.css";

type AboutPrinciplesBlockProps = {
    items: AboutContent["principles"];
    label: string;
    editing: AboutEditing;
};

export function AboutPrinciplesBlock({items, label, editing}: AboutPrinciplesBlockProps) {
  return (
    <section className={styles.principles} aria-label={label}>
      <Container>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index}>
            <Image
              src={`/assets/icons/${item.icon}`}
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
            />
            <span data-sanity={editing(`principles.${index}.label`)}>{item.label}</span>
          </li>
        ))}
      </ul>
      </Container>
    </section>
  );
}
