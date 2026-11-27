import { Hero } from "@/components/shared/Hero";
import Image from "next/image";
import { ActionLink } from "@/components/shared/ActionLink";
import { aboutImages } from "@/content/about";
import type { AboutContent } from "../types";
import type { CmsImage } from "@/content/sanity/home";
import { AboutEditable, type AboutEditing } from "../aboutEditing";
import { wideSizes } from "../imageSizes";

type AboutHeroBlockProps = {
  content: AboutContent["hero"];
  storyLabel: string;
  image?: CmsImage;
  editing: AboutEditing;
};

export function AboutHeroBlock({ content, storyLabel, image, editing }: AboutHeroBlockProps) {
  return (
    <Hero
      titleId="about-hero-title"
      title={content.title}
      eyebrow={content.eyebrow}
      description={content.body}
      handwritten={content.handwritten}
      annotations={{
        eyebrow: editing("hero.eyebrow"),
        title: editing("hero.title"),
        description: editing("hero.body"),
        handwritten: editing("hero.handwritten"),
      }}
      actions={
        <ActionLink href="#our-story">
          <AboutEditable attribute={editing("labels.ourStory")}>{storyLabel}</AboutEditable>
        </ActionLink>
      }
      image={
        <Image
          data-sanity={editing("hero.photo", true)}
          style={image ? { objectPosition: image.position } : undefined}
          src={image?.src ?? aboutImages.hero}
          alt={content.alt}
          fill
          priority
          sizes={wideSizes}
        />
      }
      heart={<Image src="/assets/icons/heart.svg" alt="" width={20} height={20} />}
    />
  );
}
