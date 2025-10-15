import BlogsCard from "./BlogsCard";
import BlogsBanner from "./BlogsBanner";
import { Metadata } from "next";
import { GetBlogsInfo } from "@/api/apis";

const FAVICON_URL = "/favicon.ico";
const DEFAULT_OG_IMAGE = "/default-og-image.jpg"; // make sure this exists in /public

export const generateMetadata = async (): Promise<Metadata> => {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"; // Move up for reuse

  try {
    const response = await GetBlogsInfo();
    const blogs = response?.data?.data || [];
    const firstBlog = blogs[0];

    if (!firstBlog) {
      console.warn("No blogs found in API response; using defaults.");
      return getFallbackMetadata(SITE_URL);
    }

    const blogTitle = firstBlog.title || "Blogs";
    let blogDescription = firstBlog.description || "Check out all our blogs.";

    // Clean & truncate description
    blogDescription =
      blogDescription
        .replace(/<[^>]*>/g, "")
        .substring(0, 150)
        .trim() + "...";

    // ✅ FIX: Ensure OG image has an absolute HTTPS URL
    const blogImage =
      firstBlog.blogImages?.length > 0
        ? `${SITE_URL}${
            firstBlog.blogImages[0].image.startsWith("/")
              ? firstBlog.blogImages[0].image
              : "/" + firstBlog.blogImages[0].image
          }`
        : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

    console.log("Using API metadata:", {
      blogTitle,
      blogDescription,
      blogImage,
    });

    return {
      title: blogTitle,
      description: blogDescription,
      openGraph: {
        title: blogTitle,
        description: blogDescription,
        url: `${SITE_URL}/blogs`, // Fixed: Use template literal for consistency
        type: "website",
        siteName: "Your Site Name",
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
        title: blogTitle,
        description: blogDescription,
        images: [blogImage],
      },
      icons: {
        icon: `${SITE_URL}${FAVICON_URL}`,
      },
      metadataBase: new URL(SITE_URL), // ✅ Ensures all relative URLs resolve correctly
      alternates: {
        // ✅ NEW: Canonical tag fix for SEO
        canonical: `${SITE_URL}/blogs`, // Points to clean /blogs URL (no params/queries)
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return getFallbackMetadata(SITE_URL);
  }
};

// Fallback Metadata
function getFallbackMetadata(SITE_URL: string): Metadata {
  const fallbackImage = `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  return {
    title: "Blogs",
    description: "Check out all our blogs.",
    openGraph: {
      title: "Blogs",
      description: "Check out all our blogs.",
      url: `${SITE_URL}/blogs`, // Fixed: Use template literal
      type: "website",
      images: [
        {
          url: fallbackImage,
          width: 1200,
          height: 630,
          alt: "Blogs",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blogs",
      description: "Check out all our blogs.",
      images: [fallbackImage],
    },
    icons: {
      icon: `${SITE_URL}${FAVICON_URL}`,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      // ✅ NEW: Canonical in fallback too
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
