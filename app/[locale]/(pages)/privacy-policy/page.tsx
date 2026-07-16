"use client";
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("privacyPolicyPage");

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <section className="relative py-24 bg-[#141414]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#141414]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <p className="text-[#7e6725] text-sm font-poppins tracking-[0.3em] uppercase mb-4">
            {t("header.operator")}
          </p>
          <h1 className="text-4xl md:text-5xl font-gilroy font-bold text-white mb-4">
            {t("pageTitle")}
          </h1>
          <p className="text-white/60 font-poppins text-sm">
            {t("header.website")}
          </p>
          <p className="text-white/60 font-poppins text-sm">
            {t("header.address")}
          </p>
          <p className="text-white/60 font-poppins text-sm mt-2">
            {t("effectiveDate")}
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("intro.p1")}
            </p>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("intro.p2")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section1.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section1.p1")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/60 font-poppins text-sm ml-4 mb-4">
              {[0, 1].map((i) => (
                <li key={i}>{t(`section1.items.${i}`)}</li>
              ))}
            </ul>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section1.p2")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section2.title")}
            </h2>

            <h3 className="text-lg font-gilroy font-semibold text-[#7e6725] mb-3 mt-6">
              {t("section2.sub1.title")}
            </h3>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section2.sub1.p1")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/60 font-poppins text-sm ml-4">
              {[0, 1, 2, 3].map((i) => (
                <li key={i}>{t(`section2.sub1.items.${i}`)}</li>
              ))}
            </ul>

            <h3 className="text-lg font-gilroy font-semibold text-[#7e6725] mb-3 mt-6">
              {t("section2.sub2.title")}
            </h3>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section2.sub2.p1")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/60 font-poppins text-sm ml-4 mb-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <li key={i}>{t(`section2.sub2.items.${i}`)}</li>
              ))}
            </ul>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section2.sub2.p2")}
            </p>

            <h3 className="text-lg font-gilroy font-semibold text-[#7e6725] mb-3 mt-6">
              {t("section2.sub3.title")}
            </h3>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section2.sub3.p1")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section3.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section3.p1")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/60 font-poppins text-sm ml-4 mb-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <li key={i}>{t(`section3.items.${i}`)}</li>
              ))}
            </ul>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section3.p2")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section4.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section4.p1")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/60 font-poppins text-sm ml-4">
              {[0, 1, 2].map((i) => (
                <li key={i}>{t(`section4.items.${i}`)}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section5.title")}
            </h2>

            <h3 className="text-lg font-gilroy font-semibold text-[#7e6725] mb-3 mt-6">
              {t("section5.sub1.title")}
            </h3>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section5.sub1.p1")}
            </p>

            <h3 className="text-lg font-gilroy font-semibold text-[#7e6725] mb-3 mt-6">
              {t("section5.sub2.title")}
            </h3>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section5.sub2.p1")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/60 font-poppins text-sm ml-4 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <li key={i}>{t(`section5.sub2.categories.${i}`)}</li>
              ))}
            </ul>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section5.sub2.p2")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/60 font-poppins text-sm ml-4 mb-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <li key={i}>{t(`section5.sub2.tools.${i}`)}</li>
              ))}
            </ul>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section5.sub2.p3")}
            </p>

            <h3 className="text-lg font-gilroy font-semibold text-[#7e6725] mb-3 mt-6">
              {t("section5.sub3.title")}
            </h3>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section5.sub3.p1")}
            </p>

            <h3 className="text-lg font-gilroy font-semibold text-[#7e6725] mb-3 mt-6">
              {t("section5.sub4.title")}
            </h3>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section5.sub4.p1")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section6.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section6.p1")}
            </p>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section6.p2")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section7.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section7.p1")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/60 font-poppins text-sm ml-4">
              {[0, 1, 2, 3].map((i) => (
                <li key={i}>{t(`section7.items.${i}`)}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section8.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section8.p1")}
            </p>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section8.p2")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/60 font-poppins text-sm ml-4 mb-4">
              {[0, 1, 2].map((i) => (
                <li key={i}>{t(`section8.items.${i}`)}</li>
              ))}
            </ul>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section8.p3")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section9.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section9.p1")}
            </p>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section9.p2")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section10.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section10.p1")}
            </p>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section10.p2")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section11.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section11.p1")}
            </p>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section11.p2")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section12.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section12.p1")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/60 font-poppins text-sm ml-4 mb-4">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <li key={i}>{t(`section12.items.${i}`)}</li>
              ))}
            </ul>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section12.p2")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section13.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section13.p1")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section14.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section14.p1")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section15.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section15.p1")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section16.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section16.p1")}
            </p>
            <p className="text-white/70 font-poppins leading-relaxed">
              {t("section16.p2")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div>
            <h2 className="text-2xl font-gilroy font-bold text-white mb-4">
              {t("section17.title")}
            </h2>
            <p className="text-white/70 font-poppins leading-relaxed mb-4">
              {t("section17.p1")}
            </p>
            <div className="bg-[#141414] rounded-xl p-6 border border-[#7e6725]/20">
              <p className="text-white font-poppins font-medium">
                {t("section17.companyName")}
              </p>
              <p className="text-white/70 font-poppins text-sm">
                {t("section17.address")}
              </p>
              <p className="text-[#7e6725] font-poppins text-sm mt-1">
                {t("section17.email")}
              </p>
              <p className="text-white/70 font-poppins text-sm">
                {t("section17.telephone")}
              </p>
            </div>
            <p className="text-white/70 font-poppins leading-relaxed mt-4">
              {t("section17.p2")}
            </p>
          </div>

          <div className="border-t border-[#7e6725]/20" />

          <div className="text-center pb-8">
            <p className="text-white/50 font-poppins text-sm">
              {t("lastUpdated")}
            </p>
            <p className="text-white/50 font-poppins text-sm">
              {t("copyright")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
