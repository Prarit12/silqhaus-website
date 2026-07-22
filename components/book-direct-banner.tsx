"use client";

import { Mail, BadgePercent, ShieldCheck, Headset } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Same source + digit-stripping the other contact surfaces use. */
const CONTACT_WHATSAPP =
  process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "+66 92 949 0211";
const WHATSAPP_HREF = `https://wa.me/${CONTACT_WHATSAPP.replace(/[^0-9]/g, "")}`;

/** Shared pill — compact, so the band stays tight. */
const CTA_CLASS =
  "inline-flex w-full items-center justify-center gap-2 rounded-full border border-transparent bg-white text-ink px-4 py-2.5 font-poppins font-semibold text-sm whitespace-nowrap hover:bg-neutral-200 transition-colors";

/** Why booking direct beats the OTAs: price, security, then service. */
const REASONS = [
  { key: "reason1", Icon: BadgePercent },
  { key: "reason2", Icon: ShieldCheck },
  { key: "reason3", Icon: Headset },
] as const;

/**
 * "Book direct — best rate guarantee" promo band shown under the hero.
 * Two paths: send an inquiry via the guest form (we follow up), or reach a
 * human straight away on WhatsApp.
 */
export default function BookDirectBanner() {
  const t = useTranslations("home.bookDirect");

  return (
    <section className="relative overflow-hidden bg-ink bg-[linear-gradient(90deg,#09081F_0%,#382124_30%,#673929_52%,#95522E_70%,#C46A33_85%,#F38338_100%)]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          <div className="lg:flex-1">
            <h2 className="text-white font-bold text-xl sm:text-2xl lg:text-[1.65rem] leading-[1.15] tracking-tight normal-case xl:whitespace-nowrap">
              {t("title")}
            </h2>
            {/* Three reasons carry the proof, so they replace the old
             * subtitle rather than adding a row: same box height, and they
             * stay on the dark end of the gradient where white type is legible. */}
            <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
              {REASONS.map(({ key, Icon }) => (
                <li key={key} className="flex items-center gap-2">
                  <Icon
                    className="w-4 h-4 shrink-0 text-white/70"
                    aria-hidden="true"
                  />
                  <span className="text-white/85 font-poppins text-[13px] leading-snug">
                    {t(key)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Two paths — leave it with us, or reach a human on WhatsApp now */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2.5 lg:shrink-0">
            {/* Path one — inquiry form, we follow up */}
            <div className="flex flex-col gap-1.5">
              <p className="text-white/70 text-xs pl-2">{t("inquiryHint")}</p>
              <Link href="/contact-guest" className={CTA_CLASS}>
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                {t("inquiryCta")}
              </Link>
            </div>

            {/* Path two — a real number, one tap into WhatsApp. The live dot
             * replaces the plain hint: same slot, but it answers *why* not to
             * wait rather than just asking. */}
            <div className="flex flex-col gap-1.5">
              <p className="flex items-baseline gap-2 text-white/70 text-xs pl-2 whitespace-nowrap">
                {t("ctaHint")}
                <span className="inline-flex items-center gap-1.5 text-[11px] text-white/60">
                  <span
                    className="relative flex h-1.5 w-1.5 shrink-0 self-center"
                    aria-hidden="true"
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping motion-reduce:animate-none" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {t("onlineStatus")}
                </span>
              </p>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className={CTA_CLASS}
              >
                <SiWhatsapp className="w-4 h-4 shrink-0" aria-hidden="true" />
                {CONTACT_WHATSAPP}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
