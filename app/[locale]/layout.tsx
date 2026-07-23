import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Manrope, Trirong, Sacramento } from "next/font/google";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Providers from "@/components/providers";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

/** Hero display face — a serif against Manrope's geometric sans, and one of
 * the few elegant display families that also carries Thai glyphs. Still the
 * hero face for Thai, which no Latin script font covers. */
const trirong = Trirong({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "600"],
  display: "swap",
  variable: "--font-trirong",
});

/** Signature script for the Latin hero headline only. */
const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-sacramento",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const isDev = process.env.NODE_ENV === "development";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Silqhaus",
    legalName: "Better Home and Better Living Co., Ltd.",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/logos/silqhaus-logo-navigation.png`,
    },
    email: "info@silqhaus.com",
    telephone: "+66929490211",
    sameAs: [
      "https://www.facebook.com/profile.php?id=61574421009619",
      "https://www.instagram.com/silqhaus",
      "https://www.linkedin.com/company/silqhaus",
      "https://www.youtube.com/@Silqhaus",
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "Silqhaus",
    url: baseUrl,
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: ["en", "th"],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${baseUrl}/#business`,
    name: "Silqhaus",
    description:
      locale === "th"
        ? "บริการจัดการอสังหาริมทรัพย์และที่พักหรูระดับพรีเมียมในประเทศไทย"
        : "Luxury vacation rental property management in Thailand",
    url: baseUrl,
    telephone: "+66929490211",
    email: "info@silqhaus.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TH",
      addressLocality: "Phuket",
      addressRegion: "Phuket",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Phuket",
        "@id": "https://www.wikidata.org/wiki/Q193299",
      },
      {
        "@type": "City",
        name: "Pattaya",
        "@id": "https://www.wikidata.org/wiki/Q193453",
      },
    ],
    priceRange: "$$$$",
    image: `${baseUrl}/logos/silqhaus-logo-navigation.png`,
  };

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${trirong.variable} ${sacramento.variable}`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://hostaway-platform.s3.us-west-2.amazonaws.com"
        />
        <link
          rel="dns-prefetch"
          href="https://hostaway-platform.s3.us-west-2.amazonaws.com"
        />
        <JsonLd data={organizationSchema} />
        <JsonLd data={webSiteSchema} />
        <JsonLd data={localBusinessSchema} />
        {isDev && (
          <Script id="mailerlite-universal" strategy="afterInteractive">
            {`
              (function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
              .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
              n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
              (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
              ml('account', '2266541');
            `}
          </Script>
        )}
      </head>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
      <body className="min-h-screen bg-ink text-snow font-poppins antialiased">
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navigation />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
