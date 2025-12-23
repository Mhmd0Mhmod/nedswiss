const API_BASE_URL = "https://nedsite.runasp.net/api";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.ned-swiss.ch",
  generateRobotsTxt: true,
  generateIndexSitemap: true,

  // Robots.txt optimization
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/_next/*",
          "/static/*",
          "/*.json",
          "/favicon.ico",
        ],
      },
    ],
    additionalSitemaps: ["https://www.ned-swiss.ch/sitemap.xml"],
  },

  additionalPaths: async (config) => {
    const result = [];
    const locales = ["de", "en", "fr"];
    const staticRoutes = ["", "/about", "/services", "/blogs", "/contact"];

    // Helper to generate alternateRefs for a path
    const getAlternateRefs = (path) =>
      locales.map((locale) => ({
        href: `${config.siteUrl}/${locale}${path}`,
        hreflang: locale,
      }));

    // 1. Add static routes for all locales with full hreflang support
    locales.forEach((locale) => {
      staticRoutes.forEach((route) => {
        result.push({
          loc: `/${locale}${route}`,
          changefreq: route === "" ? "daily" : "weekly",
          priority: route === "" ? 1.0 : 0.8,
          lastmod: new Date().toISOString(),
          alternateRefs: getAlternateRefs(route),
        });
      });
    });
    try {
      // 2. Fetch all blogs for dynamic paths
      const response = await fetch(`${API_BASE_URL}/Blog`);
      if (response.ok) {
        const blogs = await response.json();

        blogs.forEach((blog) => {
          if (blog.slug && blog.status === 1) {
            locales.forEach((locale) => {
              const blogPath = `/blogs/${blog.slug}`;
              result.push({
                loc: `/${locale}${blogPath}`,
                changefreq: "daily", // Blogs are more dynamic
                priority: 0.7,
                lastmod: blog.updatedAt || new Date().toISOString(),
                alternateRefs: getAlternateRefs(blogPath),
              });
            });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching blogs for sitemap:", error);
    }

    return result;
  },

  transform: async (config, path) => {
    // Exclude the default paths that next-sitemap might find automatically
    // (like [locale] segments) to avoid duplicates since we manualy
    // handle all localized routes in additionalPaths for 100% control.
    if (path.includes("[locale]")) return null;

    // Default transform for any other paths found
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
