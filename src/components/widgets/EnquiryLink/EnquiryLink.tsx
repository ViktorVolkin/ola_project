import type {ReactNode} from "react";
import {getTranslations} from "next-intl/server";
import {site} from "@/content/site";
import {actionClassName, type ActionVariant} from "@/components/shared/ActionLink";
import {ActionButton} from "@/components/shared/ActionButton";
import {Icon} from "@/components/shared/Icon";
import {getEnquiryUrl} from "./enquiry-url";

export async function EnquiryLink({children, variant = "primary", className, subject, icon = "arrow-right"}: {
  children: ReactNode;
  variant?: ActionVariant;
  className?: string;
  subject?: string;
  icon?: "arrow-right" | "arrow-up-right";
}) {
  const t = await getTranslations("Enquiry");
  const content = <>{children}<Icon name={icon} /></>;
  const classes = actionClassName(variant, className);
  const href = getEnquiryUrl(site.whatsappUrl, subject);

  if (!href) {
    return <ActionButton variant={variant} className={className} disabled title={t("unavailable")} aria-describedby="enquiry-unavailable" data-enquiry-subject={subject}>{content}</ActionButton>;
  }

  return <a href={href} className={classes} target="_blank" rel="noopener noreferrer" data-enquiry-subject={subject}>{content}</a>;
}
