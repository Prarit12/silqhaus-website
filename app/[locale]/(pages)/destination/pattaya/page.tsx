import { redirect } from "@/i18n/navigation";

/**
 * The legacy Pattaya destination page merged into the Experiences guide —
 * its highlights and attractions now live there.
 */
export default async function DestinationPattaya({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/experiences/pattaya", locale });
}
