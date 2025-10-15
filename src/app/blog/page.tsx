// /app/blogs/page.tsx
import BlogsCard from "./BlogsCard";
import BlogsBanner from "./BlogsBanner";
import { Metadata } from "next";

// ✅ Force fresh data
export const dynamic = "force-dynamic";

import { GetBlogsInfo } from "@/api/apis";

const FAVICON_URL = "/favicon.ico";
const DEFAULT_OG_IMAGE = "/default-og-image.jpg"; // Ensure in /public

// ✅ Helper for image URL (no fetch validation)
function buildImageUrl(imgPath?: string, siteUrl: string = ""): string {
  if (!imgPath) return `${siteUrl}${DEFAULT_OG_IMAGE}`;
  const cleanPath = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
  return `${siteUrl}${cleanPath}`;
}

export const generateMetadata = async (): Promise<Metadata> => {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  try {
    const response = await GetBlogsInfo();
    const blogs = response?.data?.data || [];

    // Generic for list page
    const pageTitle = "All Blogs";
    const pageDescription =
      "Explore our collection of insightful blog posts on various topics.";

    // Use first valid image
    let pageImage = `${SITE_URL}${DEFAULT_OG_IMAGE}`;
    if (blogs.length > 0 && blogs[0].blogImages?.length > 0) {
      pageImage = buildImageUrl(blogs[0].blogImages[0].image, SITE_URL);
      console.log("✅ Using first blog image for OG:", pageImage);
    } else {
      console.warn("No images; using default OG.");
    }

    console.log("✅ /blogs Metadata Generated:", {
      title: pageTitle,
      image: pageImage,
      blogCount: blogs.length,
    });

    return {
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `${SITE_URL}/blogs`,
        type: "website",
        siteName: "Your Site Name", // Update this
        images: [
          {
            url: pageImage,
            width: 1200,
            height: 630,
            alt: pageTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: pageDescription,
        images: [pageImage],
      },
      icons: {
        icon: `${SITE_URL}${FAVICON_URL}`,
      },
      metadataBase: new URL(SITE_URL),
      alternates: {
        canonical: `${SITE_URL}/blogs`,
      },
    };
  } catch (error) {
    console.error("❌ Error in /blogs metadata:", error);
    return getFallbackMetadata(SITE_URL);
  }
};

// Fallback
function getFallbackMetadata(SITE_URL: string): Metadata {
  const fallbackImage = `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  console.log("🔄 Using fallback for /blogs:", { fallbackImage });
  return {
    title: "All Blogs",
    description: "Explore our collection of insightful blog posts.",
    openGraph: {
      title: "All Blogs",
      description: "Explore our collection of insightful blog posts.",
      url: `${SITE_URL}/blogs`,
      type: "website",
      images: [
        {
          url: fallbackImage,
          width: 1200,
          height: 630,
          alt: "All Blogs",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "All Blogs",
      description: "Explore our collection of insightful blog posts.",
      images: [fallbackImage],
    },
    icons: {
      icon: `${SITE_URL}${FAVICON_URL}`,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/blogs`,
    },
  };
}

// Simple server component—no data fetch here (let client handle for session)
export default function Blogs() {
  return (
    <div>
      <BlogsBanner />
      <BlogsCard />
    </div>
  );
}
