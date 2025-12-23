import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always use locale prefix to ensure proper routing
  localePrefix: "always",

  // Disable automatic locale detection - always use German (de) as default
  localeDetection: false,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/((?!api|_next|_vercel|sitemap\\.xml|robots\\.txt|.*\\..*).*)"],
};
