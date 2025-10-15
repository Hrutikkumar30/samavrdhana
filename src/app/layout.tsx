import type { Metadata } from "next";
import Script from "next/script"; // ✅ add this
import "./globals.css";
import ClientLayout from "./clientLayout/ClientLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL = API_URL;
const SHARE_IMAGE = `${SITE_URL}/social-share-image.png`;

export const metadata: Metadata = {
  title: "Samvardhana Properties – Real Estate Projects & Developers",
  description:
    "Looking to buy apartments in Bangalore? Samvardhana Properties offers luxury flats designed for your dream home.",
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}`,
    },
  },
  openGraph: {
    title: "Samvardhana Properties – Real Estate Projects & Developers",
    description:
      "Looking to buy apartments in Bangalore? Samvardhana Properties offers luxury flats designed for your dream home.",
    url: SITE_URL,
    siteName: "Samvardhana Properties – Real Estate Projects & Developers",
    type: "website",
    images: [
      {
        url: SHARE_IMAGE,
        width: 1200,
        height: 630,
        alt: "Samvardhana Properties – Real Estate Projects & Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samvardhana Properties – Real Estate Projects & Developers",
    description:
      "Looking to buy apartments in Bangalore? Samvardhana Properties offers luxury flats designed for your dream home.",
    images: [SHARE_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="qB277XP4uzjSPgXCb5EBOAdmfI4Zz9iAnFpqUBTBsFY"
        />
        {/* ✅ Structured Data for Organization */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Samvardhana Properties – Real Estate Projects & Developers",
              url: SITE_URL,
              logo: `${SITE_URL}/favicon.ico`,
              sameAs: [
                "https://www.facebook.com/",
                "https://www.instagram.com/",
                "https://www.linkedin.com/",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-XXXXXXXXXX",
                contactType: "Customer Service",
              },
            }),
          }}
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
