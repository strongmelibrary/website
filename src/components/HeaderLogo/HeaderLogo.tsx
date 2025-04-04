import clsx from "clsx";
import React from "react";
import brandMark from "../../../public/brand/variant_mark.svg";
import brandTitle from "../../../public/brand/title.svg";

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
        alt="Logo Mark"
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
