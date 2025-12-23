const API_BASE_URL = "https://nedsite.runasp.net/api";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://nedswiss-drab.vercel.app", // Updated to main domain
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  exclude: ["/api/*", "/_next/*", "/static/*"],

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
    additionalSitemaps: ["https://nedswiss-drab.vercel.app/sitemap.xml"],
  },

  additionalPaths: async (config) => {
    const result = [];
    const locales = ["de", "en", "fr"];
    const staticRoutes = ["", "/about", "/services", "/blogs", "/contact"];

    // Helper to generate alternateRefs for a path (path should NOT include locale)
    const getAlternateRefs = (path) =>
      locales.map((locale) => ({
        href: `${config.siteUrl}/${locale}${path}`,
        hreflang: locale,
      }));

    // 1. Add static routes for all locales
    locales.forEach((locale) => {
      staticRoutes.forEach((route) => {
        const fullPath = `/${locale}${route}`;
        result.push({
          loc: fullPath,
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
          const slug = blog.slug || blog.Slug;
          const status = blog.status !== undefined ? blog.status : blog.Status;
          const updatedAt =
            blog.updatedAt || blog.UpdatedAt || new Date().toISOString();

          if (slug && status === 1) {
            const blogPathOnly = `/blogs/${slug}`;
            locales.forEach((locale) => {
              const fullBlogPath = `/${locale}${blogPathOnly}`;
              result.push({
                loc: fullBlogPath,
                changefreq: "daily",
                priority: 0.7,
                lastmod: updatedAt,
                alternateRefs: getAlternateRefs(blogPathOnly),
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
  // This is key: manually handling locales in additionalPaths
  // so we don't need next-sitemap to try and be "smart" about it
  transform: async (config, path) => {
    // Return null for any paths that next-sitemap might have auto-discovered
    // if we want full control via additionalPaths
    // In this case, we'll keep the default transform but skip pages we manually added
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
