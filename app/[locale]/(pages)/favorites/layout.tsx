import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorites | Silqhaus - Your Saved Properties",
  description: "View your saved favorite properties. Keep track of the luxury vacation rentals you love.",
  openGraph: {
    title: "Favorites | Silqhaus - Your Saved Properties",
    description: "View your saved favorite properties. Keep track of the luxury vacation rentals you love.",
    url: "https://silqhaus.com/favorites",
    siteName: "Silqhaus",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Favorites | Silqhaus - Your Saved Properties",
    description: "View your saved favorite properties. Keep track of the luxury vacation rentals you love.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
