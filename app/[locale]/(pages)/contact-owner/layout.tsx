import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Owners | Silqhaus - List Your Property",
  description: "List your property with Silqhaus. We offer professional management, marketing, and guest services to maximize your rental income.",
  openGraph: {
    title: "Property Owners | Silqhaus - List Your Property",
    description: "List your property with Silqhaus. We offer professional management, marketing, and guest services to maximize your rental income.",
    url: "https://silqhaus.com/contact-owner",
    siteName: "Silqhaus",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Owners | Silqhaus - List Your Property",
    description: "List your property with Silqhaus. We offer professional management, marketing, and guest services to maximize your rental income.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
