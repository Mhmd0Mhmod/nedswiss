import type { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  locale: string;
  imageUrl?: string;
  imageAlt?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];
  author?: string;
}

const defaultImageUrl = "https://www.ned-swiss.ch/nedswiss.jpg";
const defaultImageAlt = "NED Swiss - Digital Excellence, Swiss Precision";
const siteUrl = "https://www.ned-swiss.ch";

export function generateMetadata({
  title,
  description,
  path,
  locale,
  imageUrl = defaultImageUrl,
  imageAlt = defaultImageAlt,
  noIndex = false,
  canonicalUrl,
  keywords = [],
  publishedTime,
  modifiedTime,
  articleSection,
  articleTags = [],
  author = "NED Swiss Team",
}: SEOProps): Metadata {
  const fullTitle = title.includes("NED Swiss")
    ? title
    : `${title} | NED Swiss`;
  const url = `${siteUrl}/${locale}${path}`;
  const canonical = canonicalUrl || url;

  // Default keywords for NED Swiss
  const defaultKeywords = [
    "NED Swiss",
    "Swiss digital agency",
    "web development Switzerland",
    "graphic design Zurich",
    "digital marketing Swiss",
    "SEO services Switzerland",
    "software solutions Swiss",
    "advertising agency Zurich",
    "Swiss precision",
    "digital excellence",
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(", ");

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: author, url: siteUrl }],
    creator: "NED Swiss",
    publisher: "NED Swiss",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonical,
      languages: {
        en: `${siteUrl}/en${path}`,
        de: `${siteUrl}/de${path}`,
        fr: `${siteUrl}/fr${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: url,
      siteName: "NED Swiss",
      locale: locale,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: "@nedswiss",
      creator: "@nedswiss",
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "Y4GYP30Wj3efsbEVKjXSQpUlwK4Wt5wB6p4DTK8bYOs",
      yandex: "your-yandex-verification-code",
      yahoo: "your-yahoo-verification-code",
      other: {
        "msvalidate.01": "your-bing-verification-code",
      },
    },
  };

  // Add article-specific metadata for blog posts
  if (
    publishedTime ||
    modifiedTime ||
    articleSection ||
    articleTags.length > 0
  ) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      section: articleSection,
      tags: articleTags,
      authors: [author],
    };
  }

  return metadata;
}

// Specific metadata generators for different page types
export function generateHomeMetadata(locale: string): Metadata {
  return generateMetadata({
    title: "NED Swiss | Digital Excellence, Swiss Precision",
    description:
      "Leading Swiss digital agency delivering exceptional web development, design, and digital marketing services. Transform your business with Swiss precision and digital excellence.",
    path: "",
    locale,
    keywords: [
      "digital transformation",
      "Swiss web agency",
      "business growth",
      "digital solutions",
      "Swiss quality",
    ],
  });
}

export function generateAboutMetadata(locale: string): Metadata {
  return generateMetadata({
    title: "About NED Swiss | Swiss Digital Excellence",
    description:
      "Discover the story behind NED Swiss, our team, values, and commitment to delivering exceptional digital solutions with Swiss precision and innovation.",
    path: "/about",
    locale,
    keywords: [
      "about NED Swiss",
      "Swiss digital team",
      "agency story",
      "Swiss values",
      "digital expertise",
    ],
  });
}

export function generateServicesMetadata(locale: string): Metadata {
  return generateMetadata({
    title: "Digital Services | Web Development, Design & Marketing",
    description:
      "Comprehensive digital services including web development, graphic design, digital marketing, SEO, and software solutions. Swiss quality guaranteed.",
    path: "/services",
    locale,
    keywords: [
      "digital services",
      "web development services",
      "graphic design services",
      "digital marketing agency",
      "SEO services",
      "software development",
    ],
  });
}

export function generateContactMetadata(locale: string): Metadata {
  return generateMetadata({
    title: "Contact NED Swiss | Get Your Free Consultation",
    description:
      "Ready to transform your digital presence? Contact NED Swiss today for a free consultation. We respond within 24 hours during business days.",
    path: "/contact",
    locale,
    keywords: [
      "contact NED Swiss",
      "free consultation",
      "digital agency contact",
      "Swiss agency contact",
      "get quote",
    ],
  });
}

export function generateBlogMetadata(locale: string): Metadata {
  return generateMetadata({
    title: "Blog & Insights | NED Swiss Digital Trends",
    description:
      "Stay ahead with the latest digital trends, insights, and expert tips from NED Swiss. Discover innovative strategies for business growth.",
    path: "/blogs",
    locale,
    keywords: [
      "digital marketing blog",
      "web development insights",
      "Swiss digital trends",
      "business growth tips",
      "technology insights",
    ],
  });
}

export function generateBlogPostMetadata({
  title,
  description,
  slug,
  locale,
  publishedTime,
  modifiedTime,
  imageUrl,
  tags = [],
}: {
  title: string;
  description: string;
  slug: string;
  locale: string;
  publishedTime?: string;
  modifiedTime?: string;
  imageUrl?: string;
  tags?: string[];
}): Metadata {
  return generateMetadata({
    title: `${title} | NED Swiss Blog`,
    description,
    path: `/blogs/${slug}`,
    locale,
    imageUrl,
    publishedTime,
    modifiedTime,
    articleSection: "Digital Marketing",
    articleTags: tags,
    keywords: [
      ...tags,
      "digital insights",
      "business tips",
      "technology trends",
    ],
  });
}

export function generateServicePageMetadata({
  serviceName,
  serviceDescription,
  serviceSlug,
  locale,
}: {
  serviceName: string;
  serviceDescription: string;
  serviceSlug: string;
  locale: string;
}): Metadata {
  return generateMetadata({
    title: `${serviceName} | Professional Swiss Services`,
    description: serviceDescription,
    path: `/services/${serviceSlug}`,
    locale,
    keywords: [
      serviceName.toLowerCase(),
      `${serviceName.toLowerCase()} Switzerland`,
      `Swiss ${serviceName.toLowerCase()}`,
      "professional services",
      "Swiss quality",
    ],
  });
}
