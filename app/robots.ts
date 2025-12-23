import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/", "/*.json", "/favicon.ico"],
    },
    sitemap: "https://nedswiss-drab.vercel.app/sitemap.xml",
  };
}
