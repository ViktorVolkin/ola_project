import {Container} from "@/components/shared/Container/Container";
import Image from "next/image";
import type {AboutContent} from "./types";
import styles from "./AboutPrinciplesBlock.module.css";

type AboutPrinciplesBlockProps = {
    items: AboutContent["principles"];
    label: string;
};

export function AboutPrinciplesBlock({items, label}: AboutPrinciplesBlockProps) {
  return (
    <section className={styles.principles} aria-label={label}>
      <Container>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.label}>
            <Image
              src={`/assets/icons/${item.icon}`}
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      </Container>
    </section>
  );
}
