"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { EXPERIENCE_REGIONS } from "@/config/experience-regions";
import { DESTINATION_REGIONS } from "@/config/destination-regions";

/** Night-to-sunset ramp shared with the region-guide banner. */
const SUNSET =
  "linear-gradient(90deg,#09081F 0%,#382124 30%,#673929 52%,#95522E 70%,#C46A33 85%,#F38338 100%)";

const STAY: { key: string; href: string }[] = [
  { key: "vacationRentals", href: "/our-property" },
  { key: "monthlyStays", href: "/monthly-inquiry" },
  { key: "forRent", href: "/properties-for-rent" },
  { key: "forSale", href: "/properties-for-sale" },
];

const COMPANY: { key: string; href: string }[] = [
  { key: "aboutUs", href: "/about-us" },
  { key: "ourStory", href: "/our-story" },
  { key: "propertyManagement", href: "/property-management" },
];

const CONTACT: { key: string; href: string }[] = [
  { key: "contactUs", href: "/contact-us" },
  { key: "forGuests", href: "/contact-guest" },
  { key: "forOwners", href: "/contact-owner" },
  { key: "forAgencies", href: "/contact-agency" },
];

const SOCIALS = [
  { href: "https://www.facebook.com/profile.php?id=61574421009619", label: "Facebook", Icon: Facebook },
  { href: "https://www.instagram.com/silqhaus_vacationrentals/", label: "Instagram", Icon: Instagram },
  { href: "https://www.linkedin.com/company/silqhaus", label: "LinkedIn", Icon: Linkedin },
  { href: "https://www.youtube.com/@Silqhaus", label: "YouTube", Icon: Youtube },
  { href: "https://tiktok.com/@silqhaus", label: "TikTok", Icon: SiTiktok },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("footer");
  const tRegions = useTranslations("experiences.regions.items");
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;

  // The Guides column follows `hasGuide` — flip a region on in
  // config/experience-regions.ts and it appears here automatically.
  const columns: { title: string; links: { label: string; href: string }[] }[] =
    [
      {
        title: t("stay"),
        links: STAY.map((l) => ({ label: t(l.key), href: l.href })),
      },
      {
        title: t("destinations"),
        links: DESTINATION_REGIONS.map((r) => ({
          label: t("vacationRentalsIn", { region: tRegions(`${r.key}.name`) }),
          href: `/destination/${r.key}`,
        })),
      },
      {
        title: t("guidesCol"),
        links: [
          { label: t("experiences"), href: "/experiences" },
          ...EXPERIENCE_REGIONS.filter((r) => r.hasGuide).map((r) => ({
            label: t("regionGuide", { region: tRegions(`${r.key}.name`) }),
            href: `/experiences/${r.key}`,
          })),
          { label: t("guides"), href: "/guides" },
        ],
      },
      {
        title: t("companyCol"),
        links: COMPANY.map((l) => ({ label: t(l.key), href: l.href })),
      },
      {
        title: t("contact"),
        links: CONTACT.map((l) => ({ label: t(l.key), href: l.href })),
      },
    ];

  return (
    <footer className="bg-ink">
      {/* Sunset hairline — echoes the region-guide banner */}
      <div
        className="h-[2px] w-full"
        style={{ backgroundImage: SUNSET }}
        aria-hidden="true"
      />

      {/* Full-bleed like the header — the footer spans the viewport while
          page content stays capped at max-w-site. */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-14 sm:py-16">
        {/* xl fits brand + all five link columns on one line; below that the
            columns wrap in pairs. */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-x-8 gap-y-10 mb-12">
          {/* Brand block — same wordmark as the header */}
          <div className="col-span-2 space-y-4">
            {/* Wordmark and tagline read as one lockup */}
            <div>
              <Link href="/" aria-label="Silqhaus home" className="inline-block">
                <Image
                  src="/logos/silqhaus-wordmark.png"
                  alt="Silqhaus"
                  width={767}
                  height={291}
                  className="h-9 w-auto transition-opacity duration-300 hover:opacity-80"
                />
              </Link>
              <p className="text-white/60 font-light text-sm leading-relaxed max-w-sm mt-2.5">
                {t("tagline")}
              </p>
            </div>
            {/* Registered office */}
            <address className="not-italic text-white/60 text-sm leading-relaxed pt-1">
              <span className="block text-white/80">{t("company")}</span>
              <span className="block">{t("addressLine1")}</span>
              <span className="block">{t("addressLine2")}</span>
            </address>

            <p className="text-white/45 text-[13px] leading-relaxed">
              {t("tatLicense")}
            </p>

            {/* Phone and email side by side to keep the block compact */}
            <div className="flex flex-wrap gap-x-12 gap-y-4 pt-2">
              {phone && (
                <div>
                  <p className="text-white/45 text-[11px] font-medium uppercase tracking-[0.14em]">
                    {t("phoneLabel")}
                  </p>
                  <a
                    href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                    className="block text-white/85 text-sm mt-1.5 transition-colors hover:text-white"
                  >
                    {phone}
                  </a>
                </div>
              )}
              {email && (
                <div>
                  <p className="text-white/45 text-[11px] font-medium uppercase tracking-[0.14em]">
                    {t("emailLabel")}
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="block text-white/85 text-sm mt-1.5 transition-colors hover:text-white"
                  >
                    {email}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex w-9 h-9 items-center justify-center rounded-full border border-line text-white/70 transition-colors duration-300 hover:border-white/40 hover:text-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="space-y-4">
              <h3 className="text-white/45 text-[11px] font-bold uppercase tracking-[0.18em]">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={`${l.href}-${l.label}`}>
                    <Link
                      href={l.href}
                      className="text-white/60 text-sm transition-colors duration-300 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar — legal folds in here */}
        <div className="border-t border-line pt-7 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-white/45 text-sm text-center">
            © {currentYear} Silqhaus. {t("allRightsReserved")}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-white/55 text-sm transition-colors duration-300 hover:text-white"
            >
              {t("privacyPolicy")}
            </Link>
            <Link
              href="/terms-of-use"
              className="text-white/55 text-sm transition-colors duration-300 hover:text-white"
            >
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
