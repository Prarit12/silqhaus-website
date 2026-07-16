"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-line bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display font-light tracking-[0.2em] text-snow text-3xl normal-case">
              {t("brand")}
            </h2>
            <div className="hairline-gold max-w-[70px]" />
            <p className="text-snow/70 font-poppins font-light text-sm leading-relaxed max-w-sm">
              {t("tagline")}
            </p>
            <p className="text-snow/80 font-poppins italic font-medium text-sm leading-relaxed">
              {t("company")}
            </p>

            <div className="space-y-2 pt-4">
              <p className="text-snow font-poppins font-medium text-sm">
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
              </p>
              <p className="text-snow font-poppins font-medium text-sm">
                {process.env.NEXT_PUBLIC_CONTACT_PHONE}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-snow font-poppins font-medium text-sm uppercase tracking-wider">
              {t("about")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/guides"
                  className="text-snow/70 hover:text-gold font-poppins font-light text-sm transition-colors duration-300"
                >
                  {t("guides")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-snow/70 hover:text-gold font-poppins font-light text-sm transition-colors duration-300"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/property-management"
                  className="text-snow/70 hover:text-gold font-poppins font-light text-sm transition-colors duration-300"
                >
                  {t("propertyManagement")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-snow font-poppins font-medium text-sm uppercase tracking-wider">
              {t("explore")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/our-property"
                  className="text-snow/70 hover:text-gold font-poppins font-light text-sm transition-colors duration-300"
                >
                  {t("properties")}
                </Link>
              </li>
              <li>
                <Link
                  href="/destination"
                  className="text-snow/70 hover:text-gold font-poppins font-light text-sm transition-colors duration-300"
                >
                  {t("destinations")}
                </Link>
              </li>
              <li>
                <Link
                  href="/experiences"
                  className="text-snow/70 hover:text-gold font-poppins font-light text-sm transition-colors duration-300"
                >
                  {t("experiences")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-snow font-poppins font-medium text-sm uppercase tracking-wider">
              {t("contact")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact-us"
                  className="text-snow/70 hover:text-gold font-poppins font-light text-sm transition-colors duration-300"
                >
                  {t("contactUs")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-snow font-poppins font-medium text-sm uppercase tracking-wider">
              {t("legal")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-snow/70 hover:text-gold font-poppins font-light text-sm transition-colors duration-300"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-use"
                  className="text-snow/70 hover:text-gold font-poppins font-light text-sm transition-colors duration-300"
                >
                  {t("termsOfService")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line/30 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61574421009619"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-snow flex items-center justify-center text-snow hover:border-gold hover:text-gold transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/silqhaus_vacationrentals/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-snow flex items-center justify-center text-snow hover:border-gold hover:text-gold transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.linkedin.com/company/silqhaus"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-snow flex items-center justify-center text-snow hover:border-gold hover:text-gold transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://www.youtube.com/@Silqhaus"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-snow flex items-center justify-center text-snow hover:border-gold hover:text-gold transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="https://tiktok.com/@silqhaus"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-snow flex items-center justify-center text-snow hover:border-gold hover:text-gold transition-colors duration-300"
                aria-label="TikTok"
              >
                <SiTiktok size={16} />
              </a>
            </div>

            <p className="text-snow/60 font-poppins font-light text-sm text-center">
              © {currentYear} Silqhaus. {t("allRightsReserved")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
