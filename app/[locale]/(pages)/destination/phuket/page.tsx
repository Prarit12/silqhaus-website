import { redirect } from "@/i18n/navigation";

/**
 * The legacy Phuket destination page merged into the Experiences guide —
 * its beaches, blog-guide links, and attractions now live there.
 */
export default async function DestinationPhuket({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/experiences/phuket", locale });
}
