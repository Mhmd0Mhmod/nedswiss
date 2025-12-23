import { MetadataRoute } from "next";

const API_BASE_URL = "https://nedsite.runasp.net/api";
const SITE_URL = "https://nedswiss-drab.vercel.app";
const LOCALES = ["de", "en", "fr"];
const DEFAULT_LOCALE = "de";
const STATIC_ROUTES = ["", "/about", "/services", "/blogs", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result: MetadataRoute.Sitemap = [];

  // Helper to generate professional alternate links including x-default
  const getAlternates = (path: string) => {
    const languages: Record<string, string> = {};

    LOCALES.forEach((locale: string) => {
      languages[locale] = `${SITE_URL}/${locale}${path}`;
    });

    // Google highly recommends x-default for international sites
    // It should point to the version that doesn't target a specific language/region
    // or to the most prominent version (usually the default locale).
    languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

    return { languages };
  };

  // 1. Static Routes
  LOCALES.forEach((locale) => {
    STATIC_ROUTES.forEach((route) => {
      const path = `/${locale}${route}`;
      result.push({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: getAlternates(route),
      });
    });
  });

  try {
    // 2. Dynamic Blog Routes
    // Using a longer timeout to ensure Google can fetch even if the API is slow
    const response = await fetch(`${API_BASE_URL}/Blog`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const blogs = await response.json();

      blogs.forEach((blog: any) => {
        if (blog.slug && blog.status === 1) {
          const blogPath = `/blogs/${blog.slug}`;
          LOCALES.forEach((locale: string) => {
            const path = `/${locale}${blogPath}`;
            result.push({
              url: `${SITE_URL}${path}`,
              lastModified: blog.updatedAt
                ? new Date(blog.updatedAt)
                : new Date(),
              changeFrequency: "daily",
              priority: 0.7,
              alternates: getAlternates(blogPath),
            });
          });
        }
      });
    }
  } catch (error) {
    console.error("Professional Sitemap Error: Failed to fetch blogs:", error);
  }

  return result;
}
