import clsx from "clsx";
import { Container } from "@/components/shared/Container/Container";
import Image, { getImageProps } from "next/image";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/shared/Icon";
import type { HomeServicesBlockProps } from "./HomeServicesBlock.types";
import { homeImages, homeServices } from "@/content/home";
import styles from "./HomeServices.module.css";
import common from "../HomeCommon/HomeCommon.module.css";
import {cmsImageProps} from "../HomeCommon/cmsImageProps";
import {homeEditing} from "../HomeCommon/homeEditing";

export async function HomeServicesBlock({ content, label, images }: HomeServicesBlockProps) {
  const field = await homeEditing();
  const mobileWeddingImage = getImageProps({
    src: images?.weddingsMobile?.src ?? homeImages.events,
    alt: content.weddings.alt,
    fill: true,
    sizes: "calc(100vw - 40px)",
  }).props;
  const serviceImageSizes =
    "(min-width: 1440px) 411px, (min-width: 1200px) calc((100vw - 208px) / 3), (min-width: 600px) calc((100vw - 88px) / 2), calc(100vw - 40px)";
  return (
    <Container as="section" className={styles.services} aria-label={label}>
      {homeServices.map((service) => {
        const item = content[service.id];
        return (
          <Link
            key={service.id}
            data-sanity={field(`services.${service.id}.photo`, true)}
            data-sanity-desktop={service.id === "weddings" ? field("services.weddings.photo", true) : undefined}
            data-sanity-mobile={service.id === "weddings" ? field("services.weddingsMobile", true) : undefined}
            href={service.href}
            className={clsx(styles.service, styles[service.id] ?? "")}
          >
            <picture className={styles.servicePhoto}>
              {service.id === "weddings" && (
                <source
                  media="(max-width: 599px)"
                  srcSet={mobileWeddingImage.srcSet}
                  sizes={mobileWeddingImage.sizes}
                />
              )}
              <Image
                data-sanity={field(`services.${service.id}.photo`, true)}
                data-sanity-desktop={service.id === "weddings" ? field("services.weddings.photo", true) : undefined}
                data-sanity-mobile={service.id === "weddings" ? field("services.weddingsMobile", true) : undefined}
                src={images?.[service.id]?.src ?? service.image}
                {...cmsImageProps(images?.[service.id], service.id === "weddings" ? images?.weddingsMobile : undefined)}
                alt={item.alt}
                fill
                sizes={
                  service.id === "weddings"
                    ? "(min-width: 1200px) 33vw, (min-width: 600px) calc(100vw - 64px), calc(100vw - 40px)"
                    : serviceImageSizes
                }
                className={common.cover}
              />
            </picture>
            <div className={styles.serviceFade} aria-hidden="true" />
            <div className={styles.serviceCaption}>
              <div>
                <h2 data-sanity={field(`services.${service.id}.title`)}>{item.title}</h2>
                <p data-sanity={field(`services.${service.id}.description`)}>{item.description}</p>
              </div>
              <span className={styles.serviceArrow}>
                <Icon name="arrow-up-right" />
              </span>
            </div>
          </Link>
        );
      })}
    </Container>
  );
}
