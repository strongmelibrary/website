import clsx from "clsx";
import React from "react";
interface HeaderProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  isActive?: boolean;
  className?: string;
}

export const HeaderLink = ({ className, ...rest }: HeaderProps) => {
  return (
    <a
      className={clsx(
        "type-heading",
        "font-bold",
        "text-gray-700",
        "transition-all",
        "duration-200",
        "ease-in-out",
        "hover:opacity-100",
        "py-2",
        "border-b-[2px]",
        "tracking-[0.05em]",
        {
          "border-gray-700 opacity-100": rest.isActive,
          "border-transparent opacity-70": !rest.isActive,
        },
        className,
      )}
      {...rest}
    />
  );
};

export default HeaderLink;
