import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";

  return {
    rules: [
      {
        userAgent: "*", // Applies to all crawlers
        disallow: ["/admin/", "/private/", "/api/"], // Block sensitive routes
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // Reference to your sitemap
  };
}
