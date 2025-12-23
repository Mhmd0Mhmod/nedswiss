const API_BASE_URL = "https://nedsite.runasp.net/api";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://nedswiss-drab.vercel.app",
  generateRobotsTxt: true,
  generateIndexSitemap: true,

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/_vercel/"],
      },
    ],
  },

  additionalPaths: async (config) => {
    const result = [];
    const locales = ["de", "en", "fr"];
    const routes = ["", "/about", "/services", "/blogs", "/contact"];

    // Helper to generate absolute alternateRefs
    const getAlternateRefs = (route) => [
      { hreflang: "de", href: `${config.siteUrl}/de${route}` },
      { hreflang: "en", href: `${config.siteUrl}/en${route}` },
      { hreflang: "fr", href: `${config.siteUrl}/fr${route}` },
    ];

    // 1. Static Routes
    locales.forEach((locale) => {
      routes.forEach((route) => {
        const path = `/${locale}${route}`;
        result.push({
          loc: `${config.siteUrl}${path}`,
          changefreq: "weekly",
          priority: route === "" ? 1.0 : 0.8,
          alternateRefs: getAlternateRefs(route),
        });
      });
    });

    try {
      // 2. Dynamic Blog Routes
      const response = await fetch(`${API_BASE_URL}/Blog`);
      if (response.ok) {
        const blogs = await response.json();
        const blogLocales = ["de", "en", "fr"];

        blogs.forEach((blog) => {
          if (blog.slug && blog.status === 1) {
            blogLocales.forEach((locale) => {
              const blogPath = `/blogs/${blog.slug}`;
              const path = `/${locale}${blogPath}`;
              result.push({
                loc: `${config.siteUrl}${path}`,
                changefreq: "daily",
                priority: 0.7,
                lastmod: blog.updatedAt || new Date().toISOString(),
                alternateRefs: getAlternateRefs(blogPath),
              });
            });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }

    return result;
  },

  transform: async (config, path) => {
    // Return null for any paths found by the default crawler
    // since we manually handle everything in additionalPaths for 100% control
    // and to avoid the doubling bug caused by automatic i18n logic.
    return null;
  },
};
