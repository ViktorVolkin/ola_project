import type { SVGProps } from "react";

type IconName = "arrow-right" | "arrow-up-right" | "chevron-down" | "check" | "menu" | "close";

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  const paths: Record<IconName, string> = {
    "arrow-right": "M3.33 8h9.34M8 3.33 12.67 8 8 12.67",
    "arrow-up-right": "M4.67 11.33 11.33 4.67M4.67 4.67h6.66v6.66",
    "chevron-down": "m4 6 4 4 4-4",
    check: "m3.5 8 3 3 6-6",
    menu: "M3 4h10M3 8h10M3 12h10",
    close: "m4 4 8 8M12 4l-8 8",
  };

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
