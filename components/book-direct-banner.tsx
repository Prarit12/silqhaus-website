"use client";

import { Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

/**
 * "Book direct — best rate guarantee" promo band shown under the hero.
 * Two paths: send an inquiry via the contact form (we follow up), or open
 * the live Chatwoot chat right away (falls back to the contact page if the
 * chat SDK isn't ready). No backend/API changes.
 */
export default function BookDirectBanner() {
  const t = useTranslations("home.bookDirect");
  const router = useRouter();

  const talkToStaff = () => {
    const cw = (window as any).$chatwoot;
    if (cw && typeof cw.toggle === "function") {
      cw.toggle("open");
    } else {
      router.push("/contact-us");
    }
  };

  return (
    <section className="relative overflow-hidden bg-ink bg-[linear-gradient(90deg,#09081F_0%,#382124_30%,#673929_52%,#95522E_70%,#C46A33_85%,#F38338_100%)]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          <div className="lg:flex-1">
            <h2 className="text-white font-bold text-xl sm:text-2xl lg:text-[1.65rem] leading-[1.15] tracking-tight normal-case xl:whitespace-nowrap">
              {t("title")}
            </h2>
            <p className="text-white/70 font-poppins text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Equal columns so both pills are exactly the same size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 lg:shrink-0">
            {/* Path one — inquiry form, we follow up */}
            <div className="flex flex-col gap-1.5">
              <p className="text-white/70 text-xs pl-2">{t("inquiryHint")}</p>
              <Link
                href="/contact-us"
                className="inline-flex w-full sm:min-w-56 items-center justify-center gap-2.5 rounded-full border border-transparent bg-white text-ink px-6 py-3 font-poppins font-semibold text-[15px] whitespace-nowrap hover:bg-neutral-200 transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                {t("inquiryCta")}
              </Link>
            </div>

            {/* Path two — no waiting, straight to live chat */}
            <div className="flex flex-col gap-1.5">
              <p className="text-white/70 text-xs pl-2">{t("ctaHint")}</p>
              <button
                type="button"
                onClick={talkToStaff}
                className="inline-flex w-full sm:min-w-56 items-center justify-center gap-2.5 rounded-full border border-transparent bg-white text-ink px-6 py-3 font-poppins font-semibold text-[15px] whitespace-nowrap hover:bg-neutral-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {t("cta")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
