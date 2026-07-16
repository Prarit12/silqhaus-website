import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | Silqhaus - A Passion for Hospitality",
  description: "Discover how Silqhaus became Thailand's premier luxury rental brand. Our journey from a passion for hospitality to exceptional vacation experiences.",
  openGraph: {
    title: "Our Story | Silqhaus - A Passion for Hospitality",
    description: "Discover how Silqhaus became Thailand's premier luxury rental brand. Our journey from a passion for hospitality to exceptional vacation experiences.",
    url: "https://silqhaus.com/our-story",
    siteName: "Silqhaus",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story | Silqhaus - A Passion for Hospitality",
    description: "Discover how Silqhaus became Thailand's premier luxury rental brand. Our journey from a passion for hospitality to exceptional vacation experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OurStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
