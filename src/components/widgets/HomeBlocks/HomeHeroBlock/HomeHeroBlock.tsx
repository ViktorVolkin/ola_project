import Image from "next/image";
import { Hero } from "@/components/shared/Hero/Hero";
import { ActionLink } from "@/components/shared/ActionLink";
import { EnquiryLink } from "@/components/widgets/EnquiryLink/EnquiryLink";

import { homeImages } from "@/content/home";
import type { HomeHeroBlockProps } from "./HomeHeroBlock.types";
import { fullImageSizes } from "../imageSizes";
import { cmsImageProps } from "../HomeCommon/cmsImageProps";
import { homeHeadingIds } from "../HomeCommon/headingIds";
import { homeEditing, HomeEditable } from "../HomeCommon/homeEditing";

export async function HomeHeroBlock({
  content,
  shopLabel,
  chooseLabel,
  images,
}: HomeHeroBlockProps) {
  const field = await homeEditing();

  return (
    <Hero
      variant="overlay"
      titleId={homeHeadingIds.hero}
      title={content.title}
      eyebrow={content.eyebrow}
      description={content.description}
      handwritten={content.handwritten}
      annotations={{
        section: field("hero.photo", true),
        eyebrow: field("hero.eyebrow"),
        title: field("hero.title"),
        description: field("hero.description"),
        handwritten: field("hero.handwritten"),
      }}
      image={
        <Image
          data-sanity={field("hero.photo", true)}
          src={images?.hero?.src ?? homeImages.hero}
          {...cmsImageProps(images?.hero)}
          alt={content.alt}
          fill
          sizes={fullImageSizes}
          priority
        />
      }
      actions={
        <>
          <ActionLink href="/bouquets">
            <HomeEditable path="labels.shopBouquets">{shopLabel}</HomeEditable>
          </ActionLink>

          <EnquiryLink variant="secondary">
            <HomeEditable path="labels.letOlaChoose">{chooseLabel}</HomeEditable>
          </EnquiryLink>
        </>
      }
      heart={<Image src="/assets/icons/heart.svg" alt="" width={64} height={64} />}
    />
  );
}
