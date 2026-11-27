import clsx from "clsx";
import { Container } from "@/components/shared/Container/Container";
import styles from "./Hero.module.css";
import { HeroProps } from "./Hero.types";

export function Hero({
  variant = "overlay",
  titleId,
  title,
  image,
  eyebrow,
  breadcrumb,
  subtitle,
  description,
  actions,
  handwritten,
  handwrittenClassName,
  children,
  decoration,
  heart,
  annotations,
  className = "",
  ...sectionProps
}: HeroProps) {
  const media = (
    <div className={styles.media}>
      {image}

      <div className={styles.fade} aria-hidden="true" />

      {variant === "overlay" && handwritten && (
        <p className={clsx(styles.handwritten, handwrittenClassName)} data-sanity={annotations?.handwritten}>
          {handwritten}
        </p>
      )}

      {decoration}

      {heart && (
        <div className={styles.heart} aria-hidden="true">
          {heart}
        </div>
      )}
    </div>
  );

  return (
    <section
      {...sectionProps}
      className={clsx(styles.hero, styles[variant], className)}
      aria-labelledby={titleId}
      data-sanity={annotations?.section}
    >
      <Container
        className={clsx(styles.content, annotations?.title && styles.editableContent)}
      >
        <div className={styles.copy}>
          {breadcrumb}

          {eyebrow && (
            <p className={styles.eyebrow} data-sanity={annotations?.eyebrow}>
              {eyebrow}
            </p>
          )}

          <h1 id={titleId} className={styles.title} data-sanity={annotations?.title}>
            {title}
          </h1>

          {subtitle && (
            <p className={styles.subtitle} data-sanity={annotations?.subtitle}>
              {subtitle}
            </p>
          )}

          {description && (
            <p className={styles.description} data-sanity={annotations?.description}>
              {description}
            </p>
          )}

          {actions && <div className={styles.actions}>{actions}</div>}

          {variant === "split" && handwritten && (
            <p className={clsx(styles.handwritten, handwrittenClassName)} data-sanity={annotations?.handwritten}>
              {handwritten}
            </p>
          )}

          {children}
        </div>

        {variant === "split" && media}
      </Container>

      {variant === "overlay" && media}
    </section>
  );
}
