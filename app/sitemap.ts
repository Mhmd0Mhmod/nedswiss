import { MetadataRoute } from "next";

const API_BASE_URL = "https://nedsite.runasp.net/api";
const SITE_URL = "https://nedswiss-drab.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["de", "en", "fr"];
  const staticRoutes = ["", "/about", "/services", "/blogs", "/contact"];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Add static routes for all locales
  for (const locale of locales) {
    for (const route of staticRoutes) {
      const path = route === "" ? "" : route;
      const languages = Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
      );

      sitemapEntries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages,
        },
      });
    }
  }

  // 2. Add dynamic blog routes
  try {
    const response = await fetch(`${API_BASE_URL}/Blog`);
    if (response.ok) {
      const blogs = await response.json();

      for (const blog of blogs) {
        const slug = blog.slug || blog.Slug;
        const status = blog.status !== undefined ? blog.status : blog.Status;
        const updatedAt =
          blog.updatedAt || blog.UpdatedAt || new Date().toISOString();

        if (slug && status === 1) {
          const blogPath = `/blogs/${slug}`;
          const languages = Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}${blogPath}`])
          );

          for (const locale of locales) {
            sitemapEntries.push({
              url: `${SITE_URL}/${locale}${blogPath}`,
              lastModified: new Date(updatedAt),
              changeFrequency: "daily",
              priority: 0.7,
              alternates: {
                languages,
              },
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
  }

  return sitemapEntries;
}
