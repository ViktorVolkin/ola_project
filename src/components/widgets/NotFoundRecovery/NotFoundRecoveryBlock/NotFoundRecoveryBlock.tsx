import { Container } from "@/components/shared/Container/Container";
import { ActionLink } from "@/components/shared/ActionLink";
import { NotFoundArtwork } from "../NotFoundArtwork/NotFoundArtwork";
import styles from "./NotFoundRecoveryBlock.module.css";

export type NotFoundCopy = {
  eyebrow: string;
  title: string;
  body: string;
  home: string;
  explore: string;
  signature: string;
};

export function NotFoundRecoveryBlock({ copy }: { copy: NotFoundCopy }) {
  return (
    <section aria-labelledby="not-found-title">
      <Container className={styles.layout}>
        <div className={styles.content}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h1 id="not-found-title" className={styles.heading}>
              {copy.title}
            </h1>
          </div>
          <div className={styles.support}>
            <p className={styles.body}>{copy.body}</p>
            <div className={styles.actions}>
              <ActionLink href="/" className={styles.primary}>
                {copy.home}
              </ActionLink>
              <ActionLink href="/bouquets" variant="secondary">
                {copy.explore}
              </ActionLink>
            </div>
          </div>
        </div>
        <NotFoundArtwork
          signature={copy.signature}
          className={styles.artCell}
        />
      </Container>
    </section>
  );
}
