import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Silqhaus - Luxury Vacation Rentals in Thailand",
  description:
    "Experience luxury vacation rentals in Phuket and Pattaya, Thailand. Premium villas, exceptional service, and unforgettable stays.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
