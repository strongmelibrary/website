import clsx from "clsx";
import React from "react";
// Use ?url to get the public URL as a string (not processed as asset)
import brandMark from "/brand/variant_mark.svg?url";
import brandTitle from "/brand/title.svg?url";

import { SITE_TITLE } from "../../config";

export const HeaderLogo = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        "decoration-none",
        "flex",
        "flex-row",
        "items-center",
        "space-x-3",
        "m-[16px]",
        "h-[60px]",
        "max-w-full",
        className,
      )}
    >
      <img
        src={brandMark}
        alt="Strong, Me Public Library logo mark"
        className="w-[60px] h-full"
      />
      <img
        src={brandTitle}
        alt={SITE_TITLE}
        className="w-auto h-[80%] mt-[1%] max-w-[calc(100%_-_60px)]"
      />
    </div>
  );
};
