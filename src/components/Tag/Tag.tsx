import React from "react";
import { HiTag } from "react-icons/hi2";

const Tag = ({
  children,
  href,
  count,
  anchorClassName,
  ...rest
}: {
  children: string;
  href?: string;
  count?: number;
  anchorClassName?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>) => {
  return (
    <span {...rest}>
      <a
        className={["tag", anchorClassName].filter(Boolean).join(" ")}
        href={href}
      >
        <HiTag aria-hidden="true" className="w-3 h-3" />
        <span>{children}</span>
        {count !== undefined && <span>({count})</span>}
      </a>
    </span>
  );
};

export default Tag;
