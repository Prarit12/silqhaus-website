import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

import en from "../messages/en.json";
import th from "../messages/th.json";

const messages: Record<string, typeof en> = { en, th };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale] || messages[routing.defaultLocale],
  };
});
