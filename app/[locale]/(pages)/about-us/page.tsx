"use client";
import Image from "next/image";
import { MapPin, Users, Home, Award, Heart, Shield } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function AboutUs() {
  const t = useTranslations("aboutUs");

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <section className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/about-us/hero.jpg"
            alt={t("hero.heroAlt")}
            fill
            sizes="100vw"
            quality={80}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <p className="text-[#7e6725] text-sm font-poppins tracking-[0.3em] uppercase mb-4">
            {t("hero.subtitle")}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-gilroy font-bold text-white mb-6 max-w-3xl">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-white/80 font-poppins font-light max-w-2xl leading-snug">
            {t("hero.description")}
          </p>
        </div>
      </section>

      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#7e6725] text-sm font-poppins tracking-[0.3em] uppercase mb-4">
                {t("whoWeAre.subtitle")}
              </p>
              <h2 className="text-4xl font-gilroy font-bold text-white mb-6">
                {t("whoWeAre.title")}
              </h2>
              <p className="text-white/70 font-poppins leading-snug mb-6">
                {t("whoWeAre.description1")}
              </p>
              <p className="text-white/70 font-poppins leading-snug mb-6">
                {t("whoWeAre.description2")}
              </p>
              <p className="text-white/70 font-poppins leading-snug">
                {t("whoWeAre.description3")}
              </p>
            </div>
            <div className="relative">
              <div className="relative w-full h-[400px]">
                <Image
                  src="/about-us/villa.jpg"
                  alt={t("whoWeAre.villaAlt")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={80}
                  className="object-cover rounded-xl shadow-xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#7e6725]/20 rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#7e6725] text-sm font-poppins tracking-[0.3em] uppercase mb-4">
              {t("locations.subtitle")}
            </p>
            <h2 className="text-4xl font-gilroy font-bold text-white mb-6">
              {t("locations.title")}
            </h2>
            <p className="text-white/70 font-poppins max-w-2xl mx-auto leading-snug">
              {t("locations.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#141414] rounded-xl p-8 border border-[#7e6725]/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#7e6725]/10 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-[#7e6725]" />
                </div>
                <h3 className="text-2xl font-gilroy font-bold text-white">
                  {t("locations.phuket.name")}
                </h3>
              </div>
              <p className="text-white/70 font-poppins leading-snug mb-4">
                {t("locations.phuket.description")}
              </p>
              <ul className="space-y-2 text-white/60 font-poppins text-sm">
                {[0, 1, 2].map((i) => (
                  <li key={i}>• {t(`locations.phuket.areas.${i}`)}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#141414] rounded-xl p-8 border border-[#7e6725]/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#7e6725]/10 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-[#7e6725]" />
                </div>
                <h3 className="text-2xl font-gilroy font-bold text-white">
                  {t("locations.pattaya.name")}
                </h3>
              </div>
              <p className="text-white/70 font-poppins leading-snug mb-4">
                {t("locations.pattaya.description")}
              </p>
              <ul className="space-y-2 text-white/60 font-poppins text-sm">
                {[0, 1, 2].map((i) => (
                  <li key={i}>• {t(`locations.pattaya.areas.${i}`)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#7e6725] text-sm font-poppins tracking-[0.3em] uppercase mb-4">
              {t("whySilqhaus.subtitle")}
            </p>
            <h2 className="text-4xl font-gilroy font-bold text-white mb-6">
              {t("whySilqhaus.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Home, key: "luxuryFocus" },
              { icon: Users, key: "localExpertise" },
              { icon: Award, key: "multiPlatform" },
              { icon: Heart, key: "personalTouch" },
              { icon: Shield, key: "transparentPricing" },
              { icon: MapPin, key: "support247" },
            ].map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="bg-[#0a0a0a] rounded-xl p-8 border border-[#7e6725]/20"
              >
                <Icon className="w-12 h-12 text-[#7e6725] mb-6" />
                <h3 className="text-xl font-gilroy font-bold text-white mb-3">
                  {t(`whySilqhaus.items.${key}.title`)}
                </h3>
                <p className="text-white/70 font-poppins leading-snug">
                  {t(`whySilqhaus.items.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-gilroy font-bold text-white mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-white/70 font-poppins text-lg mb-8 max-w-2xl mx-auto leading-snug">
            {t("cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/property-management"
              className="bg-[#7e6725] hover:bg-[#6d5820] text-white font-poppins px-8 py-4 text-lg transition-colors inline-block"
            >
              {t("cta.propertyManagement")}
            </Link>
            <Link
              href="/our-property"
              className="border border-[#7e6725] text-[#7e6725] hover:bg-[#7e6725]/10 font-poppins px-8 py-4 text-lg transition-colors inline-block"
            >
              {t("cta.browseProperties")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
