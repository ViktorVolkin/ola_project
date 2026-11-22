import type {ComponentProps} from "react";
import {actionClassName, type ActionVariant} from "./ActionLink";

type ActionButtonProps = Omit<ComponentProps<"button">, "className"> & {
  variant?: ActionVariant;
  className?: string;
};

export function ActionButton({type = "button", variant = "primary", className, ...props}: ActionButtonProps) {
  return <button type={type} className={actionClassName(variant, className)} {...props} />;
}
