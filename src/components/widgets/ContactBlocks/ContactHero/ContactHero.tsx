import Image from "next/image";
import {Link} from "@/i18n/navigation";
import { Hero } from "@/components/shared/Hero";
import {EnquiryLink} from "@/components/widgets/EnquiryLink/EnquiryLink";
import {contactImages} from "@/content/contact";
import type {ContactContent} from "@/content/sanity/contact";
import type {CmsImage} from "@/content/sanity/home";
import {ContactEditable, type ContactEditing} from "../contactEditing";
import styles from "./ContactHero.module.css";

type ContactHeroProps = {
  content: Pick<ContactContent, "home" | "page" | "heroTitle" | "heroBody" | "heroAction" | "heroScript">;
  image?: CmsImage;
  editing: ContactEditing;
};

export function ContactHero({content, image, editing}: ContactHeroProps) {
  return (
    <Hero titleId="contact-hero-title" title={content.heroTitle} description={content.heroBody} handwritten={content.heroScript}
      annotations={{title: editing("heroTitle"), description: editing("heroBody"), handwritten: editing("heroScript")}}
      breadcrumb={<nav className={styles.breadcrumb} aria-label={content.page}><ContactEditable attribute={editing("home")}><Link href="/">{content.home}</Link></ContactEditable><span aria-hidden="true"> / </span><ContactEditable attribute={editing("page")}><span aria-current="page">{content.page}</span></ContactEditable></nav>}
      actions={<ContactEditable attribute={editing("heroAction")}><EnquiryLink>{content.heroAction}</EnquiryLink></ContactEditable>}
      image={<Image data-sanity={editing("hero.photo", true)} style={image ? {objectPosition: image.position} : undefined} src={image?.src ?? contactImages.hero} alt="" fill priority sizes="(min-width: 1100px) 60vw, 100vw" />}
    />
  );
}
