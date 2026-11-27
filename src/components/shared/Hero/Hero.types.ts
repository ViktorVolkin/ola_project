import type { HTMLAttributes, ReactNode } from "react";

export type HeroVariant = "overlay" | "split";

export type HeroProps = Omit<HTMLAttributes<HTMLElement>, "children" | "title"> & {
  variant?: HeroVariant;

  titleId: string;
  title: ReactNode;
  image: ReactNode;

  eyebrow?: ReactNode;
  breadcrumb?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  handwritten?: ReactNode;
  handwrittenClassName?: string;

  children?: ReactNode;
  decoration?: ReactNode;
  heart?: ReactNode;

  annotations?: {
    section?: string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    handwritten?: string;
  };
};
