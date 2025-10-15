import { Metadata } from "next";
import { GetBlogDetails } from "@/api/apis";
import BlogDetailsSection from "../page"; // Adjust path if needed

type Props = {
  params: Promise<{ id: string }>; // Next.js 14+ async params
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: blogId } = await params; // Await for async params

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  try {
    const blogResponse = await GetBlogDetails(blogId);
    const blog = blogResponse.data;
    // localStorage.setItem("blog", "hiiii");
    console.log("Fetched blog details for metadata:", blog);

    if (!blog) {
      return getFallbackMetadata(SITE_URL);
    }

    const blogTitle = blog.title;
    let blogDescription = blog.description;
    // Clean & truncate description (strip HTML)
    blogDescription =
      blogDescription
        .replace(/<[^>]*>/g, "")
        .substring(0, 160)
        .trim() + "...";

    const imagePath = blog.blogImages?.[0]?.image;
    const blogImage = imagePath
      ? `${API_URL}/${
          imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
        }` // Ensure clean path
      : null;

    console.log("Blog Details Metadata Loaded:", {
      blogTitle,
      blogDescription,
      blogImage,
    });

    return {
      metadataBase: new URL(SITE_URL), // Ensures absolute URLs
      title: blogTitle,
      description: blogDescription,
      openGraph: {
        title: blogTitle,
        description: blogDescription,
        type: "article",
        url: `${SITE_URL}/blog-details/${blogId}`, // Full canonical-like URL
        siteName: "Samvardhana Properties – Real Estate Projects & Developers",
        images: blogImage
          ? [{ url: blogImage, width: 1200, height: 630, alt: blogTitle }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: blogTitle,
        description: blogDescription,
        images: blogImage ? [blogImage] : [],
      },
      icons: {
        icon: `${SITE_URL}/favicon.ico`, // Add favicon if needed
      },
      alternates: {
        // ✅ NEW: Canonical tag fix for SEO
        canonical: `${SITE_URL}/blog-details/${blogId}`, // Exact URL for this post (no params)
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return getFallbackMetadata(SITE_URL);
  }
}

// Fallback Metadata
function getFallbackMetadata(siteUrl: string): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: "Blog Not Found",
    description: "The requested blog could not be found",
    openGraph: {
      title: "Blog Not Found",
      description: "The requested blog could not be found",
      type: "article",
      url: siteUrl,
      siteName: "Samvardhana Properties – Real Estate Projects & Developers",
      images: [],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog Not Found",
      description: "The requested blog could not be found",
      images: [],
    },
    icons: {
      icon: `${siteUrl}/favicon.ico`,
    },
    alternates: {
      // ✅ Canonical in fallback (points to 404 or home if needed)
      canonical: siteUrl,
    },
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const { id: blogId } = await params; // Await for async params
  return <BlogDetailsSection blogId={blogId} />;
}
