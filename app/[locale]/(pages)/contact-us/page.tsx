import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { MapPin, Navigation } from "lucide-react";
import ContactChannels from "@/components/contact-channels";

/** A stable landmark query so the pin lands on Boat Plaza regardless of how
 * the postal address is written elsewhere on the site. */
const OFFICE_MAP_QUERY = "Boat Plaza, Cherng Talay, Thalang District, Phuket";

export default async function ContactUs() {
  const t = await getTranslations("contactUs");
  const tf = await getTranslations("footer");

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    OFFICE_MAP_QUERY,
  )}&z=15&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    OFFICE_MAP_QUERY,
  )}`;

  return (
    <main className="min-h-screen bg-ink">
      {/* ── Hero — full-bleed photo, same grammar as the region guides ── */}
      <section className="relative h-[52vh] min-h-[420px] flex items-end overflow-hidden">
        <Image
          src="/photos/contact-us-team.jpg"
          alt={t("contactHero.title")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[35%_center] sm:object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-black/25 to-black/10"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-site mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16">
          <h1 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight normal-case text-balance">
            {t("contactHero.title")}
          </h1>
          <p className="text-white/80 mt-4 text-lg sm:text-xl leading-relaxed max-w-2xl">
            {t("contactHero.description")}
          </p>
        </div>
      </section>

      {/* ── Office + map · direct lines ── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Where to find us */}
          <div className="lg:col-span-3 rounded-2xl sm:rounded-3xl border border-line bg-white/[0.02] p-6 sm:p-9">
            <span className="eyebrow mb-5">{t("office.eyebrow")}</span>
            <h2 className="font-display text-white text-2xl sm:text-3xl font-light leading-[1.1] tracking-tight normal-case">
              {t("office.title")}
            </h2>
            <p className="text-white/60 mt-2 text-[15px] leading-relaxed max-w-md">
              {t("office.description")}
            </p>

            <div className="mt-6 flex items-start gap-3">
              <MapPin
                className="w-5 h-5 text-white/50 mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <address className="not-italic">
                <span className="block text-white font-medium">
                  {tf("company")}
                </span>
                <span className="block text-white/60 text-[15px] leading-relaxed">
                  {tf("addressLine1")}
                </span>
                <span className="block text-white/60 text-[15px] leading-relaxed">
                  {tf("addressLine2")}
                </span>
                <span className="block text-white/40 text-sm mt-1">
                  {tf("tatLicense")}
                </span>
              </address>
            </div>

            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white transition-colors"
            >
              <Navigation className="w-4 h-4" aria-hidden="true" />
              {t("office.directions")}
            </a>

            <div className="mt-7 overflow-hidden rounded-xl border border-line">
              <iframe
                src={mapSrc}
                title={t("office.title")}
                width="100%"
                height={360}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
                className="block w-full grayscale-[0.15] contrast-[1.05]"
              />
            </div>
          </div>

          {/* Direct lines — for the guests who'd rather reach a person */}
          <aside className="lg:col-span-2 flex flex-col">
            <h2 className="font-display text-white text-2xl sm:text-3xl font-light leading-[1.1] tracking-tight normal-case">
              {t("guestServices.title")}
            </h2>
            <p className="text-white/60 mt-2 text-[15px] leading-relaxed">
              {t("guestServices.description")}
            </p>

            <ContactChannels
              phoneTitle={t("guestServices.hotline.title")}
              phoneDescription={t("guestServices.hotline.description")}
              emailTitle={t("guestServices.email.title")}
              emailDescription={`${t("guestServices.email.description")} · ${t("guestServices.email.note")}`}
              className="mt-6"
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
