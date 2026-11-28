
import type {ReactNode} from "react";

type CmsEditableProps = {
  attribute?: string;
  children: ReactNode;
};

export function CmsEditable({
  attribute,
  children,
}: CmsEditableProps) {
  if (!attribute) {
    return <>{children}</>;
  }

  return (
    <span data-sanity={attribute}>
      {children}
    </span>
  );
}
