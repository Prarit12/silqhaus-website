import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest Login | Silqhaus - Access Your Account",
  description: "Sign in to your Silqhaus account to manage bookings, view saved properties, and access exclusive member benefits.",
  openGraph: {
    title: "Guest Login | Silqhaus - Access Your Account",
    description: "Sign in to your Silqhaus account to manage bookings, view saved properties, and access exclusive member benefits.",
    url: "https://silqhaus.com/guest-login",
    siteName: "Silqhaus",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guest Login | Silqhaus - Access Your Account",
    description: "Sign in to your Silqhaus account to manage bookings, view saved properties, and access exclusive member benefits.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function GuestLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
