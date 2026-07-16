import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale !== "th";

  return {
    title: isEn
      ? "Monthly Stay Inquiry | Silqhaus"
      : "สอบถามการเข้าพักรายเดือน | Silqhaus",
    description: isEn
      ? "Get special pricing for extended stays of 30 days or more. Submit your inquiry and our team will be in touch."
      : "รับราคาพิเศษสำหรับการพำนักระยะยาว 30 วันขึ้นไป ส่งแบบฟอร์มและทีมงานของเราจะติดต่อกลับ",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${baseUrl}/${locale}/monthly-inquiry`,
    },
  };
}

export default function MonthlyInquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
