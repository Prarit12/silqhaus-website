"use client";
import {
  Utensils,
  Building2,
  Waves,
  Mountain,
  Camera,
  Calendar,
} from "lucide-react";
import { useTranslations } from "next-intl";

const experienceKeys = [
  { key: "culinary", icon: Utensils },
  { key: "temple", icon: Building2 },
  { key: "island", icon: Waves },
  { key: "wellness", icon: Mountain },
  { key: "photography", icon: Camera },
  { key: "festival", icon: Calendar },
];

const seasonKeys = [
  { key: "cool", borderColor: "border-[#ffffff]" },
  { key: "hot", borderColor: "border-[#c4a962]" },
  { key: "rainy", borderColor: "border-[#ffffff]/50" },
];

const essentialKeys = ["visa", "currency", "language", "health"];

export default function Experiences() {
  const t = useTranslations("experiences");

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <section className="py-24 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-white text-sm font-poppins font-light tracking-[0.3em] uppercase mb-4">
              {t("hero.subtitle")}
            </p>
            <h1 className="text-white mb-6 tracking-wide font-gilroy font-bold leading-tight text-4xl sm:text-5xl uppercase">
              {t("hero.title")}
            </h1>
            <p className="text-white/70 max-w-4xl mx-auto font-poppins font-light text-lg leading-snug">
              {t("hero.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experienceKeys.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="bg-[#141414] rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 border border-[#ffffff]/20 hover:border-[#ffffff]/50"
              >
                <div className="w-12 h-12 mb-6 bg-[#ffffff] rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-poppins font-bold text-xl mb-4">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-white/70 font-poppins font-light leading-snug mb-4">
                  {t(`items.${key}.description`)}
                </p>
                <div className="text-white font-poppins font-medium text-sm">
                  {t("featuredLabel")}: {t(`items.${key}.featured`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#ffffff] text-sm font-poppins font-light tracking-[0.3em] uppercase mb-4">
              {t("travelPlanning.subtitle")}
            </p>
            <h2 className="text-white mb-6 tracking-wide font-gilroy font-bold leading-tight text-3xl sm:text-4xl">
              {t("travelPlanning.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl text-white font-poppins font-bold mb-6">
                {t("travelPlanning.bestTime")}
              </h3>
              <div className="space-y-6">
                {seasonKeys.map(({ key, borderColor }) => (
                  <div key={key} className={`border-l-4 ${borderColor} pl-6`}>
                    <h4 className="font-poppins font-semibold text-white text-lg mb-2">
                      {t(`seasons.${key}.title`)}
                    </h4>
                    <p className="text-white/70 font-poppins font-light leading-snug">
                      {t(`seasons.${key}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-white font-poppins font-bold mb-6">
                {t("travelPlanning.essentials")}
              </h3>
              <div className="space-y-4">
                {essentialKeys.map((key) => (
                  <div
                    key={key}
                    className="bg-[#141414] rounded-lg p-6 border border-[#ffffff]/20"
                  >
                    <h4 className="font-poppins font-semibold text-white text-lg mb-3">
                      {t(`essentials.${key}.title`)}
                    </h4>
                    <p className="text-white/70 font-poppins font-light text-sm leading-tight">
                      {t(`essentials.${key}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
