"use client";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Plane, ChevronRight, ArrowLeft } from "lucide-react";

export default function DestinationPattaya() {
  const t = useTranslations("destination.pattaya");
  const locale = useLocale();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("beaches");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const tabValues = [
      "beaches",
      "cultural",
      "nature",
      // "entertainment",
      // "markets",
    ];
    if (tabValues.includes(hash)) {
      setActiveTab(hash);
    }

    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.history.pushState({}, "", `#${value}`);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.history.pushState({}, "", `#${id}`);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goToProperties = () => {
    router.push("/our-property?location=Pattaya");
  };

  const attractionsData = [
    {
      category: "Beaches",
      translationKey: "jomtienBeach",
      image: "/pattaya/jomtien-beach.webp",
      linkEn: "",
      linkTh: "",
    },
    {
      category: "Beaches",
      translationKey: "pattayaBeach",
      image: "/pattaya/pattaya-beach.webp",
      linkEn: "",
      linkTh: "",
    },
    {
      category: "Nature",
      translationKey: "kohLarn",
      image: "/pattaya/koh-larn-pattaya.webp",
      linkEn: "",
      linkTh: "",
    },
    {
      category: "Cultural",
      translationKey: "sanctuaryOfTruth",
      image: "/pattaya/sanctuary_of_truth.avif",
      linkEn:
        "https://www.silqhaus.com/en/guides/sanctuary-of-truth-pattaya-complete-guide",
      linkTh: "",
    },
    {
      category: "Cultural",
      translationKey: "bigBuddha",
      image: "/pattaya/wat-phra-yai-pattaya.avif",
      linkEn: "",
      linkTh: "",
    },
    {
      category: "Cultural",
      translationKey: "nongNooch",
      image: "/pattaya/nong-nooch-pattaya.jpg",
      linkEn: "",
      linkTh: "",
    },
    {
      category: "Cultural",
      translationKey: "ramayanaWaterPark",
      image: "/pattaya/ramayana-water-park-pattaya.jpg",
      linkEn: "",
      linkTh: "",
    },
    {
      category: "Cultural",
      translationKey: "floatingMarket",
      image: "/pattaya/pattaya-floating-marketing.webp",
      linkEn: "",
      linkTh: "",
    },
    {
      category: "Cultural",
      translationKey: "nightMarket",
      image: "/pattaya/thepprasit-night-market-pattaya.jpg",
      linkEn: "",
      linkTh: "",
    },
  ];

  const faqs = [
    {
      q: t("faqs.q1"),
      a: t("faqs.a1"),
    },
    {
      q: t("faqs.q2"),
      a: t("faqs.a2"),
    },
    {
      q: t("faqs.q3"),
      a: t("faqs.a3"),
    },
    {
      q: t("faqs.q4"),
      a: t("faqs.a4"),
    },
  ];

  const getAttractionsByCategory = (category: string) => {
    return attractionsData.filter(
      (attr) => attr.category.toLowerCase() === category.toLowerCase(),
    );
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/pattaya/pattaya-hero-section.jpg"
            alt={t("heroAlt")}
            fill
            sizes="100vw"
            quality={100}
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 w-full">
          <Link
            href="/destination"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#7e6725] mb-4 sm:mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backLink")}
          </Link>
          <div className="flex items-center gap-2 text-[#7e6725] mb-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wider font-poppins">
              {t("region")}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-gilroy font-bold tracking-wide">
            {t("title")}
          </h1>
          <p className="mt-3 sm:mt-4 text-white/70 text-base sm:text-lg max-w-2xl font-poppins font-light">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6 py-3 sm:py-4 scrollbar-hide flex-wrap overflow-x-auto">
            <button
              onClick={() => scrollToSection("overview")}
              className="text-white/60 hover:text-[#7e6725] text-sm font-poppins whitespace-nowrap transition-colors"
            >
              {t("navOverview")}
            </button>
            <button
              onClick={() => scrollToSection("attractions")}
              className="text-white/60 hover:text-[#7e6725] text-sm font-poppins whitespace-nowrap transition-colors"
            >
              {t("navAttractions")}
            </button>
            <button
              onClick={() => scrollToSection("getting-there")}
              className="text-white/60 hover:text-[#7e6725] text-sm font-poppins whitespace-nowrap transition-colors"
            >
              {t("navGettingThere")}
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-white/60 hover:text-[#7e6725] text-sm font-poppins whitespace-nowrap transition-colors"
            >
              {t("navFaq")}
            </button>
            <button
              onClick={goToProperties}
              className="sm:ml-auto bg-[#7e6725] hover:bg-[#6d5820] text-white text-sm font-poppins px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              {t("viewProperties")}
            </button>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-gilroy font-bold mb-4 sm:mb-6">
                {t("discoverTitle")}{" "}
                <span className="text-[#7e6725]">{t("discoverHighlight")}</span>
              </h2>
              <div className="space-y-4 text-white/80 font-poppins font-light leading-relaxed">
                <p>{t("discoverP1")}</p>
                <p>{t("discoverP2")}</p>
                <p>{t("discoverP3")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <p className="text-[#7e6725] text-2xl sm:text-3xl font-gilroy font-bold">
                  {t("stat1Value")}
                </p>
                <p className="text-white/60 text-sm font-poppins mt-1">
                  {t("stat1Label")}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <p className="text-[#7e6725] text-2xl sm:text-3xl font-gilroy font-bold">
                  {t("stat2Value")}
                </p>
                <p className="text-white/60 text-sm font-poppins mt-1">
                  {t("stat2Label")}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <p className="text-[#7e6725] text-2xl sm:text-3xl font-gilroy font-bold">
                  {t("stat3Value")}
                </p>
                <p className="text-white/60 text-sm font-poppins mt-1">
                  {t("stat3Label")}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <p className="text-[#7e6725] text-2xl sm:text-3xl font-gilroy font-bold">
                  {t("stat4Value")}
                </p>
                <p className="text-white/60 text-sm font-poppins mt-1">
                  {t("stat4Label")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attractions Section */}
      <section
        id="attractions"
        className="py-12 sm:py-16 md:py-20 bg-[#0d0d0d]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-gilroy font-bold mb-2">
            {t("attractionsTitle")}{" "}
            <span className="text-[#7e6725]">{t("attractionsHighlight")}</span>
          </h2>
          <p className="text-white/60 font-poppins font-light mb-6 sm:mb-8">
            {t("attractionsSubtitle")}
          </p>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full flex flex-col gap-20 sm:gap-8 md:gap-6 lg:gap-0"
          >
            <TabsList className="w-full flex flex-wrap gap-2 bg-transparent justify-start mb-6 sm:mb-8">
              {[
                { value: "beaches", label: "tabBeaches" },
                { value: "cultural", label: "tabCultural" },
                { value: "nature", label: "tabNature" },
                // { value: "entertainment", label: "tabEntertainment" },
                // { value: "markets", label: "tabMarkets" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="px-4 py-2 text-sm font-poppins rounded-full border border-white/20 data-[state=active]:bg-[#7e6725] data-[state=active]:border-[#7e6725] data-[state=active]:text-white text-white/60 hover:text-white transition-colors"
                >
                  {t(tab.label)}
                </TabsTrigger>
              ))}
            </TabsList>

            {["beaches", "cultural", "nature", "entertainment", "markets"].map(
              (category) => {
                const categoryLabelMap: { [key: string]: string } = {
                  beaches: t("tabBeaches"),
                  cultural: t("tabCultural"),
                  nature: t("tabNature"),
                  entertainment: t("tabEntertainment"),
                  markets: t("tabMarkets"),
                };
                return (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {getAttractionsByCategory(category).map(
                        (attraction, idx) => {
                          const link =
                            locale === "th"
                              ? attraction.linkTh || attraction.linkEn || "#"
                              : attraction.linkEn || "#";
                          return (
                            <div className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-[#7e6725]/40 transition-all duration-300">
                              <div className="aspect-[4/3] relative overflow-hidden">
                                <Image
                                  src={attraction.image}
                                  alt={t(
                                    `attractions.${attraction.translationKey}.name`,
                                  )}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  quality={80}
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-3">
                                  {/* <span className="text-[#7e6725] text-xs font-poppins uppercase tracking-wider"> */}
                                  <span className="text-white text-xs font-poppins uppercase tracking-wider">
                                    {categoryLabelMap[category]}
                                  </span>
                                </div>
                              </div>
                              <div className="p-4 sm:p-5">
                                <h3 className="text-lg font-gilroy font-semibold mb-2">
                                  {t(
                                    `attractions.${attraction.translationKey}.name`,
                                  )}
                                </h3>
                                <p className="text-white/60 text-sm font-poppins font-light line-clamp-3">
                                  {t(
                                    `attractions.${attraction.translationKey}.description`,
                                  )}
                                </p>

                                {link !== "#" && (
                                  <Link href={link} className="group" key={idx}>
                                    <h3 className="text-[#7e6725] font-gilroy font-semibold mt-3 hover:underline cursor-pointer">
                                      {t("readMore")}
                                    </h3>
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </TabsContent>
                );
              },
            )}
          </Tabs>
        </div>
      </section>

      {/* Getting There Section */}
      <section
        id="getting-there"
        className="py-12 sm:py-16 md:py-20 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/pattaya/pattaya-beach.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Plane className="w-6 h-6 text-[#7e6725]" />
            <h2 className="text-2xl sm:text-3xl font-gilroy font-bold">
              {t("gettingThereTitle")}{" "}
              <span className="text-[#7e6725]">
                {t("gettingThereHighlight")}
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/10">
              <h3 className="text-lg font-gilroy font-semibold mb-3">
                {t("fromBangkokTitle")}
              </h3>
              <p className="text-white/70 text-sm font-poppins font-light">
                {t("fromBangkokDesc")}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/10">
              <h3 className="text-lg font-gilroy font-semibold mb-3">
                {t("byAirTitle")}
              </h3>
              <p className="text-white/70 text-sm font-poppins font-light">
                {t("byAirDesc")}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/10">
              <h3 className="text-lg font-gilroy font-semibold mb-3">
                {t("gettingAroundTitle")}
              </h3>
              <p className="text-white/70 text-sm font-poppins font-light">
                {t("gettingAroundDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 md:py-20 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-gilroy font-bold mb-6 sm:mb-8 text-center">
            {t("faqTitle")}{" "}
            <span className="text-[#7e6725]">{t("faqHighlight")}</span>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/10"
              >
                <h3 className="text-base sm:text-lg font-gilroy font-semibold mb-2 flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-[#7e6725] flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-white/70 text-sm font-poppins font-light pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-gilroy font-bold mb-4">
            {t("ctaTitle")}{" "}
            <span className="text-[#7e6725]">{t("ctaHighlight")}</span>?
          </h2>
          <p className="text-white/70 font-poppins font-light mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t("ctaSubtitle")}
          </p>
          <button
            onClick={goToProperties}
            className="bg-[#7e6725] hover:bg-[#6d5820] text-white font-poppins px-8 py-4 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            {t("ctaButton")}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </main>
  );
}
