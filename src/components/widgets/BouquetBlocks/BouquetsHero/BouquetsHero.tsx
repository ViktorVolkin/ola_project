import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/components/shared/Hero";
import { actionClassName } from "@/components/shared/ActionLink";
import { Icon } from "@/components/shared/Icon";
import styles from "./BouquetsHero.module.css";

export type BouquetsHeroProps = {
  content: {
    breadcrumb: string;
    title: string;
    subtitle: string;
    body: string;
    script: string;
    actionLabel: string;
  };
  inspirationHref: string;
  image: { src: string; alt: string; width: number; height: number; position?: string };
  editing?: {breadcrumb?: string; title?: string; subtitle?: string; description?: string; handwritten?: string; action?: string; image?: string};
};

export function BouquetsHero({ content, inspirationHref, image, editing }: BouquetsHeroProps) {
  // The supplied breadcrumb is a combined "home / current page" string.
  const separator = content.breadcrumb.indexOf("/");
  const home = separator < 0 ? "" : content.breadcrumb.slice(0, separator).trim();
  const current = separator < 0 ? content.breadcrumb : content.breadcrumb.slice(separator + 1).trim();

  return (
    <Hero titleId="bouquets-title" data-bouquets-section="hero" title={content.title} subtitle={content.subtitle} description={content.body} handwritten={content.script} annotations={editing}
      breadcrumb={<p className={styles.breadcrumb} data-sanity={editing?.breadcrumb}>{home && <><Link href="/">{home}</Link><span aria-hidden="true"> / </span></>}<span aria-current="page">{current}</span></p>}
      actions={<a href={inspirationHref} className={actionClassName("primary")}><span data-sanity={editing?.action}>{content.actionLabel}</span><Icon name="arrow-right" /></a>}
      image={<Image src={image.src} width={image.width} height={image.height} alt={image.alt} data-sanity={editing?.image} style={image.position ? {objectPosition: image.position} : undefined} sizes="(min-width: 1100px) 53vw, 100vw" fetchPriority="high" />}
    />
  );
}
