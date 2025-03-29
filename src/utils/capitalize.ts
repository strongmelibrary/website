export type RemovePrefixAndLowercase<
  T extends string,
  Prefix extends string,
> = T extends `${Prefix}${infer Rest}`
  ? Rest extends `${infer First}${infer Remaining}`
    ? `${Lowercase<First>}${Remaining}`
    : never
  : never;

export type OnlyWithPrefix<
  T extends string,
  Prefix extends string,
> = T extends `${Prefix}${string}` ? T : never;

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
