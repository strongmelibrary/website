import * as tb from "react-icons/tb";

import {
  OnlyWithPrefix,
  RemovePrefixAndLowercase,
} from "../utils/capitalize";

export type BrandIcons = OnlyWithPrefix<keyof typeof tb, "TbBrand">;
export type Brands = RemovePrefixAndLowercase<BrandIcons, "TbBrand">;

export interface Link {
  href: string;
  label: string;
  isActive?: boolean;
}

export interface SocialLink {
  href: string;
  brand: Brands;
}
