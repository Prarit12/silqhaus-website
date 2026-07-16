"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";
import { NavFavoritesLink } from "./nav-favorites-link";

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations("navigation");

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("experiences"), href: "/experiences" },
    { label: t("propertyManagement"), href: "/property-management" },
    { label: t("vacationRentals"), href: "/our-property" },
  ];

  const navItemsAfterDropdown = [
    { label: t("guides"), href: "/guides" },
    { label: t("contactUs"), href: "/contact-us" },
  ];

  const propertyItems = [
    {
      label: t("forRent"),
      href: "/properties-for-rent",
      description: t("forRentDescription"),
    },
    {
      label: t("forSale"),
      href: "/properties-for-sale",
      description: t("forSaleDescription"),
    },
  ];

  // const propertyItems = [
  //   {
  //     label: "All Properties",
  //     href: "/our-property",
  //     description: "Browse our full collection",
  //   },
  //   { label: 'Favorites', href: '/favorites', description: 'Your saved properties', icon: Heart },
  // ];

  // const contactItems = [
  //   {
  //     label: "Contact Us",
  //     href: "/contact-us",
  //     description: "For booking inquiries and support",
  //     key: "contact-us",
  //   },
  //   {
  //     label: "Become an Owner",
  //     href: "/contact-owner",
  //     description: "Buy property for rentals",
  //     key: "become-owner",
  //   },
  //   {
  //     label: "For Owner",
  //     href: "/contact-owner",
  //     description: "We manage your property",
  //     key: "for-owner",
  //   },
  //   {
  //     label: "For Agencies",
  //     href: "/contact-agency",
  //     description: "Partnership opportunities",
  //     key: "for-agencies",
  //   },
  // ];

  // Close mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        isMobileMenuOpen &&
        !target.closest("[data-mobile-menu]") &&
        !target.closest('[data-testid="button-mobile-menu"]')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed left-0 w-full z-[60] transition-all duration-500 ease-in-out ${
          isScrolled ? "top-3" : "top-6"
        }`}
        role="navigation"
        aria-label="Main"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between rounded-full h-12 md:h-14 px-2.5 md:px-3 transition-all duration-500 ${
              isScrolled
                ? "bg-ink/95 border border-line backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                : "bg-black/20 border border-white/15 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
            }`}
          >
            {/* Logo */}
            <Link href="/" aria-label="Silqhaus home">
              <Image
                src="/logos/silqhaus-wordmark.png"
                alt="Silqhaus"
                width={767}
                height={291}
                priority
                className="h-6 sm:h-7 md:h-8 w-auto transition-opacity duration-300 hover:opacity-80"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-4 md:gap-5">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href);

                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={`cursor-pointer transition-colors duration-300 font-poppins font-medium text-xs md:text-sm ${
                        isActive
                          ? "text-white border-b-2 border-[#ffffff]"
                          : "text-white/80 hover:text-white hover:border-b-2 hover:border-[#ffffff]"
                      } pb-1`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}

              {/* Properties Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsPropertyDropdownOpen(true)}
                onMouseLeave={() => setIsPropertyDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() =>
                    setIsPropertyDropdownOpen(!isPropertyDropdownOpen)
                  }
                  data-testid="button-properties-dropdown"
                  aria-haspopup="menu"
                  aria-expanded={isPropertyDropdownOpen}
                  className={`cursor-pointer transition-colors duration-300 font-poppins font-medium text-xs md:text-sm flex items-center gap-1 ${
                    pathname.startsWith("/properties-for-rent") ||
                    pathname.startsWith("/properties-for-sale")
                      ? "text-white"
                      : "text-white/80 hover:text-white hover:border-b-2 hover:border-[#ffffff]"
                  }`}
                >
                  {t("properties")}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isPropertyDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isPropertyDropdownOpen && (
                  <div
                    role="menu"
                    className="absolute top-full left-0 pt-2 w-64 z-50"
                  >
                    <div className="bg-[#0a0a0a] rounded-lg shadow-lg border border-line animate-in fade-in-0 slide-in-from-top-2 duration-200">
                      {propertyItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <div
                            role="menuitem"
                            className="block px-4 py-3 hover:bg-[#ffffff]/10 focus:bg-[#ffffff]/10 transition-colors cursor-pointer border-b border-line last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                            onClick={() => setIsPropertyDropdownOpen(false)}
                            data-testid={`link-properties-${item.href.replace("/", "")}`}
                          >
                            <div className="font-poppins font-medium text-snow text-sm">
                              {item.label}
                            </div>
                            <div className="font-poppins text-mist text-xs mt-0.5">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {navItemsAfterDropdown.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={`cursor-pointer transition-colors duration-300 font-poppins font-medium text-xs md:text-sm ${
                        isActive
                          ? "text-white border-b-2 border-[#ffffff]"
                          : "text-white/80 hover:text-white hover:border-b-2 hover:border-[#ffffff]"
                      } pb-1`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}

              {/* Contact Dropdown */}
              {/* <div className="relative">
                <button
                  onClick={() =>
                    setIsContactDropdownOpen(!isContactDropdownOpen)
                  }
                  className="cursor-pointer transition-colors duration-300 font-poppins font-medium text-xs md:text-sm flex items-center gap-1 text-white/80 hover:text-white hover:border-b-2 hover:border-[#ffffff] pb-1 mt-1"
                >
                  CONTACT
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isContactDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isContactDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-ink-2 rounded-lg shadow-lg border border-line z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    {contactItems.map((item) => (
                      <Link key={item.key} href={item.href}>
                        <div
                          className="block px-4 py-3 hover:bg-gold/10 transition-colors cursor-pointer border-b border-line last:border-b-0"
                          onClick={() => setIsContactDropdownOpen(false)}
                        >
                          <div className="font-poppins font-medium text-snow text-sm">
                            {item.label}
                          </div>
                          <div className="font-poppins text-mist text-xs">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div> */}
              <NavFavoritesLink />

              {/* Language Switcher */}
              <LanguageSwitcher />
            </div>

            {/* Mobile: Language Switcher + Menu Button */}
            <div className="xl:hidden flex items-center gap-1.5">
              <NavFavoritesLink />
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-full bg-white/5 hover:bg-white/10 p-1.5 transition-colors duration-200"
                data-testid="button-mobile-menu"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu-panel"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div
        data-mobile-menu
        className={`fixed inset-0 z-[70] xl:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "visible opacity-100 pointer-events-auto"
            : "invisible opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        id="mobile-menu-panel"
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-20 left-4 right-4 max-h-[calc(100vh-100px)] overflow-y-auto bg-[#0a0a0a] border border-[#ffffff]/30 rounded-2xl shadow-2xl transition-all duration-300 ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          {/* Close button header */}
          <div className="flex items-center justify-between p-4 border-b border-[#ffffff]/20">
            <span className="font-poppins font-semibold text-white text-sm tracking-wide">
              {t("menu")}
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          <div className="p-6 pt-4 space-y-2">
            {/* Navigation Items */}
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`block py-3 px-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#ffffff]/20 text-white border-l-2 border-[#ffffff]"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="font-poppins font-medium text-sm tracking-wide">
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* Properties Section */}
            <div className="pt-2">
              <div className="py-2 px-4 text-[#ffffff] font-poppins font-semibold text-xs uppercase tracking-widest">
                {t("properties")}
              </div>
              {propertyItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`block py-3 px-4 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-[#ffffff]/20 text-white border-l-2 border-[#ffffff]"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="font-poppins font-medium text-sm">
                        {item.label}
                      </span>
                      <p className="font-poppins text-white/50 text-xs mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {navItemsAfterDropdown.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`block py-3 px-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#ffffff]/20 text-white border-l-2 border-[#ffffff]"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="font-poppins font-medium text-sm tracking-wide">
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* Our Property Section */}
            {/* <div className="pt-2">
              <div className="py-2 px-4 text-[#ffffff] font-poppins font-semibold text-xs uppercase tracking-widest">
                Our Property
              </div>
              {propertyItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`block py-3 px-4 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-[#ffffff]/20 text-white border-l-2 border-[#ffffff]"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="font-poppins font-medium text-sm">
                        {item.label}
                      </span>
                      <p className="font-poppins text-white/50 text-xs mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div> */}

            {/* Contact Section */}
            {/* <div className="pt-2">
              <div className="py-2 px-4 text-[#ffffff] font-poppins font-semibold text-xs uppercase tracking-widest">
                Contact
              </div>
              {contactItems.map((item) => (
                <Link key={item.key} href={item.href}>
                  <div
                    className="block py-3 px-4 rounded-xl transition-all duration-200 text-white/80 hover:bg-white/5 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="font-poppins font-medium text-sm">
                      {item.label}
                    </span>
                    <p className="font-poppins text-white/50 text-xs mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div> */}

            {/* Divider */}
            <div className="pt-4 pb-2">
              <div className="h-px bg-gradient-to-r from-transparent via-[#ffffff]/30 to-transparent" />
            </div>

            {/* Contact Info */}
            <div className="px-4 py-3 space-y-3">
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                className="flex items-center gap-3 text-white/70 hover:text-[#ffffff] transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-poppins text-sm">
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </span>
              </a>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE_TEL}`}
                className="flex items-center gap-3 text-white/70 hover:text-[#ffffff] transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="font-poppins text-sm">
                  {process.env.NEXT_PUBLIC_CONTACT_PHONE}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
