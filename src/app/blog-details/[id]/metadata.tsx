import { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${API_URL}/blog/${id}`);
    const data = await res.json();

    return {
      title: data.title,
      description: data.description?.substring(0, 200) + "...",
      openGraph: {
        title: data.title,
        description: data.description?.substring(0, 200) + "...",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog-details/${id}`,
        siteName: "Samvardhana Properties",
        images: [
          {
            url: `${API_URL}/${data.blogImages?.[0]?.image}`,
            width: 1200,
            height: 630,
            alt: data.title,
          },
        ],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.description?.substring(0, 200) + "...",
        images: [`${API_URL}/${data.blogImages?.[0]?.image}`],
      },
    };
  } catch (error) {
    return {
      title: "Blog Detail - Samvardhana Properties",
      description: "Read our latest blog post",
    };
  }
}
