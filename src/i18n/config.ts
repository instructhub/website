export type Locale = (typeof locales)[number];

export const locales = ["en", "zh-tw"] as const;
export const localesDetail = [
  { flag: "", name: "English" },
  { flag: "", name: "繁體中文" },
];

export const defaultLocale: Locale = "en";
