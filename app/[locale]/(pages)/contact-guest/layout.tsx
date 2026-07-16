import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest Inquiry | Silqhaus - Plan Your Stay",
  description: "Planning a luxury vacation in Thailand? Contact Silqhaus to inquire about our premium properties in Phuket and Pattaya.",
  openGraph: {
    title: "Guest Inquiry | Silqhaus - Plan Your Stay",
    description: "Planning a luxury vacation in Thailand? Contact Silqhaus to inquire about our premium properties in Phuket and Pattaya.",
    url: "https://silqhaus.com/contact-guest",
    siteName: "Silqhaus",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guest Inquiry | Silqhaus - Plan Your Stay",
    description: "Planning a luxury vacation in Thailand? Contact Silqhaus to inquire about our premium properties in Phuket and Pattaya.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactGuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
