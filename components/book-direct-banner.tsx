"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

/**
 * "Book direct — best rate guarantee" promo band shown under the hero.
 * The CTA opens the live Chatwoot chat (talk to staff); if the chat SDK
 * isn't ready it falls back to the contact page. No backend/API changes.
 */
export default function BookDirectBanner() {
  const t = useTranslations("home.bookDirect");
  const router = useRouter();
  const [email, setEmail] = useState("");

  const talkToStaff = () => {
    const mail = email.trim();
    const cw = (window as any).$chatwoot;
    if (cw && typeof cw.toggle === "function") {
      if (mail) {
        try {
          cw.setUser(mail, { email: mail });
        } catch {
          /* non-fatal */
        }
      }
      cw.toggle("open");
    } else {
      router.push(
        mail
          ? { pathname: "/contact-us", query: { email: mail } }
          : "/contact-us",
      );
    }
  };

  return (
    <section className="relative overflow-hidden border-y border-line">
      {/* Monochrome graphite band (echoes the hero gradient) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, #2c2c2c 0%, #161616 55%, #0d0d0d 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          <div className="lg:flex-1">
            <h2 className="text-white font-semibold text-xl sm:text-2xl md:text-3xl leading-tight tracking-tight normal-case">
              {t("title")}
            </h2>
            <p className="text-white/60 font-poppins text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              talkToStaff();
            }}
            className="flex flex-col sm:flex-row items-stretch gap-3 lg:shrink-0"
          >
            <div className="flex items-center gap-3 bg-white rounded-full px-5 py-3 min-w-0 sm:w-80 shadow-lg shadow-black/30">
              <Mail
                className="w-5 h-5 text-neutral-400 shrink-0"
                aria-hidden="true"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                aria-label={t("emailPlaceholder")}
                className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-400 outline-none font-poppins text-[15px]"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-white text-ink px-7 py-3 font-poppins font-semibold text-[15px] hover:bg-white/90 transition-colors shrink-0"
            >
              {t("cta")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
