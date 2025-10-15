import BlogsCard from "./BlogsCard";
import BlogsBanner from "./BlogsBanner";
import { Metadata } from "next";

// ✅ NEW: Force fresh data on each request (helps with caching/sharing)
export const dynamic = "force-dynamic";

import { GetBlogsInfo } from "@/api/apis";

const FAVICON_URL = "/favicon.ico";
const DEFAULT_OG_IMAGE = "/default-og-image.jpg"; // Double-check: This file MUST be in /public

export const generateMetadata = async (): Promise<Metadata> => {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  try {
    const response = await GetBlogsInfo();
    const blogs = response?.data?.data || [];
    const firstBlog = blogs[0];

    if (!firstBlog) {
      console.warn("No blogs found in API; using full fallback.");
      return getFallbackMetadata(SITE_URL);
    }

    const blogTitle = firstBlog.title || "Latest Blog Post";
    let blogDescription =
      firstBlog.description || "Discover our latest insights.";

    // Clean & truncate description (strip HTML)
    blogDescription =
      blogDescription
        .replace(/<[^>]*>/g, "")
        .substring(0, 150)
        .trim() + "...";

    // ✅ ENHANCED: Build & validate absolute image URL
    let blogImage = `${SITE_URL}${DEFAULT_OG_IMAGE}`;
    if (firstBlog.blogImages?.length > 0) {
      const imgPath = firstBlog.blogImages[0].image;
      const cleanPath = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
      const fullImgUrl = `${SITE_URL}${cleanPath}`;

      // ✅ NEW: Basic reachability check (server-side fetch HEAD to verify)
      try {
        const headRes = await fetch(fullImgUrl, { method: "HEAD" });
        if (headRes.ok && /\.(jpg|jpeg|png|webp|gif)$/i.test(cleanPath)) {
          blogImage = fullImgUrl;
          console.log("✅ Valid image found:", fullImgUrl);
        } else {
          console.warn("❌ Image not reachable or invalid format:", fullImgUrl);
        }
      } catch (fetchError) {
        console.warn(
          "❌ Image fetch failed (maybe CORS/path issue):",
          fullImgUrl,
          fetchError
        );
      }
    } else {
      console.warn("No images in first blog; using default.");
    }

    const finalTitle = `Latest Blog: ${blogTitle}`; // ✅ Tweak for list feel (customize this!)

    console.log("✅ /blogs Metadata Generated:", {
      title: finalTitle,
      description: blogDescription,
      image: blogImage,
      firstBlogId: firstBlog.id || "N/A", // Helps debug which blog it's pulling
    });

    return {
      title: finalTitle,
      description: blogDescription,
      openGraph: {
        title: finalTitle,
        description: blogDescription,
        url: `${SITE_URL}/blogs`,
        type: "website",
        siteName: "Your Site Name", // Update to your actual site name
        images: [
          {
            url: blogImage,
            width: 1200,
            height: 630,
            alt: blogTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: finalTitle,
        description: blogDescription,
        images: [blogImage],
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

// Fallback with logging
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

export default function Blogs() {
  return (
    <div>
      <BlogsBanner />
      <BlogsCard />
    </div>
  );
}
