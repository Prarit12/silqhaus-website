import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agency Partnership | Silqhaus - Partner With Us",
  description: "Become a Silqhaus partner agency. Connect with us to explore partnership opportunities for luxury vacation rentals in Thailand.",
  openGraph: {
    title: "Agency Partnership | Silqhaus - Partner With Us",
    description: "Become a Silqhaus partner agency. Connect with us to explore partnership opportunities for luxury vacation rentals in Thailand.",
    url: "https://silqhaus.com/contact-agency",
    siteName: "Silqhaus",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agency Partnership | Silqhaus - Partner With Us",
    description: "Become a Silqhaus partner agency. Connect with us to explore partnership opportunities for luxury vacation rentals in Thailand.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactAgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
