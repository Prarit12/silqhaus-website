"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, ChevronDown, Heart } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";
import HeroSearchBar from "./hero-search-bar";
import PartnerModal from "./partner-modal";
import { NavFavoritesLink } from "./nav-favorites-link";
import { usePMSFavorites } from "@/hooks/use-pms-saved";

/** Same source + digit-stripping the contact channels use. */
const CONTACT_WHATSAPP =
  process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "+66 92 949 0211";
const WHATSAPP_HREF = `https://wa.me/${CONTACT_WHATSAPP.replace(/[^0-9]/g, "")}`;
const PHONE_DISPLAY =
  process.env.NEXT_PUBLIC_CONTACT_PHONE_TEL || "+66929490211";

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const tFav = useTranslations("pmsFavorites");
  const { count: favoritesCount } = usePMSFavorites();

  const [isScrolled, setIsScrolled] = useState(false);

  // Pages with a full-bleed hero want the transparent nav at the top; the
  // search results page has no hero, so keep the nav solid there so the search
  // pill reads as a clean header bar above the filter row.
  const solidHeader = isScrolled || pathname === "/our-property";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isUtilityMenuOpen, setIsUtilityMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // The bar is deliberately down to a single item: "Partner with us" opens the
  // owner / agency chooser. Vacation Rentals, Destinations, Guides and Contact
  // all still ship — reached from the hero search, the homepage sections and
  // the footer.

  /** Scrolled = white bar, so every control on it flips to ink. NB: the custom
   * `ink` colour has no alpha variant (text-ink/70 silently renders white), so
   * the muted states use the neutral scale. */
  const navLinkClass = (isActive: boolean) =>
    // No bottom border: the underline shifted items off the header's
    // centreline on hover. Colour alone carries hover + active state.
    `cursor-pointer transition-colors duration-300 font-poppins font-medium text-xs md:text-sm leading-none ${
      isActive
        ? solidHeader
          ? "text-ink"
          : "text-white"
        : solidHeader
          ? "text-neutral-600 hover:text-ink"
          : "text-white/80 hover:text-white"
    }`;

  const iconBtnClass = `flex items-center rounded-full p-1.5 transition-colors duration-200 ${
    solidHeader
      ? "bg-neutral-100 hover:bg-neutral-200"
      : "bg-white/5 hover:bg-white/10"
  }`;
  const iconColor = solidHeader ? "text-ink" : "text-white";

  // Rental-type selector: the trigger shows whichever type the current
  // route belongs to, defaulting to Monthly.
  const rentalItems = [
    {
      label: t("vacationRentals"),
      href: "/our-property",
      description: t("vacationRentalsDescription"),
    },
    {
      label: t("monthlyRental"),
      href: "/monthly-inquiry",
      description: t("monthlyRentalDescription"),
    },
    {
      label: t("yearlyRental"),
      href: "/properties-for-rent",
      description: t("yearlyRentalDescription"),
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

  // Close the desktop account menu on outside click or Escape.
  useEffect(() => {
    if (!isUtilityMenuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (!(event.target as Element).closest("[data-utility-menu]")) {
        setIsUtilityMenuOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsUtilityMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [isUtilityMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[60] transition-all duration-500 ease-in-out ${
          solidHeader
            ? "bg-white border-b border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Main"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_minmax(0,22rem)_1fr] items-center gap-2 h-14 md:h-16 px-2.5 md:px-3 transition-all duration-500">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Silqhaus home"
              className="justify-self-start"
            >
              {/* Real ink artwork on the white bar rather than a CSS invert,
               * so the wordmark lands on brand #0d0d0d instead of pure black. */}
              <Image
                src={
                  solidHeader
                    ? "/logos/silqhaus-wordmark-dark.png"
                    : "/logos/silqhaus-wordmark.png"
                }
                alt="Silqhaus"
                width={767}
                height={291}
                priority
                className="h-6 sm:h-7 md:h-8 w-auto transition-opacity duration-300 hover:opacity-80"
              />
            </Link>

            {/* Centered search — its own grid column, so it lands on the true
                page centre regardless of the logo / actions widths. Shown on
                every page. */}
            <div className="justify-self-center w-full max-w-md min-w-0 px-2 sm:px-4">
              <HeroSearchBar variant="compact" />
            </div>

            {/* Right cluster: desktop nav + mobile controls share one grid cell */}
            <div className="justify-self-end flex items-center">
            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-4 md:gap-5 shrink-0">
              {/* Partner with us — opens the owner / agency chooser */}
              <button
                type="button"
                onClick={() => setIsPartnerOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isPartnerOpen}
                className={navLinkClass(
                  pathname.startsWith("/property-management") ||
                    pathname.startsWith("/contact-agency"),
                )}
              >
                {t("partnerWithUs")}
              </button>

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
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Account / utility menu — holds wishlists + guest login */}
              <div className="relative" data-utility-menu>
                <button
                  type="button"
                  onClick={() => setIsUtilityMenuOpen(!isUtilityMenuOpen)}
                  data-testid="button-account-menu"
                  aria-haspopup="menu"
                  aria-expanded={isUtilityMenuOpen}
                  aria-label={t("account")}
                  className={iconBtnClass}
                >
                  <Menu className={`w-5 h-5 ${iconColor}`} />
                </button>

                {isUtilityMenuOpen && (
                  <div
                    role="menu"
                    className="absolute top-full right-0 pt-2 w-56 z-50"
                  >
                    <div className="bg-[#0a0a0a] rounded-lg shadow-lg border border-line overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200 divide-y divide-line">
                      {rentalItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <div
                            role="menuitem"
                            onClick={() => setIsUtilityMenuOpen(false)}
                            className="block px-4 py-3 hover:bg-[#ffffff]/10 transition-colors cursor-pointer"
                            data-testid={`link-rental-${item.href.replace("/", "")}`}
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
                      <NavFavoritesLink
                        variant="mobile"
                        onNavigate={() => setIsUtilityMenuOpen(false)}
                      />
                      <Link href="/guest-login">
                        <div
                          role="menuitem"
                          onClick={() => setIsUtilityMenuOpen(false)}
                          className="block px-4 py-3 hover:bg-[#ffffff]/10 transition-colors cursor-pointer"
                        >
                          <span className="font-poppins font-medium text-snow text-sm">
                            {t("guestLogin")}
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: Language Switcher + Menu Button */}
            <div className="xl:hidden flex items-center gap-1.5 shrink-0">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={iconBtnClass}
                data-testid="button-mobile-menu"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu-panel"
              >
                {isMobileMenuOpen ? (
                  <X className={`w-6 h-6 ${iconColor}`} />
                ) : (
                  <Menu className={`w-6 h-6 ${iconColor}`} />
                )}
              </button>
            </div>
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

            {/* Partner with us — same chooser, opened from the drawer */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPartnerOpen(true);
              }}
              aria-haspopup="dialog"
              className="block w-full text-left py-3 px-4 rounded-xl transition-all duration-200 text-white/80 hover:bg-white/5 hover:text-white"
            >
              <span className="font-poppins font-medium text-sm tracking-wide">
                {t("partnerWithUs")}
              </span>
            </button>

            {/* Rentals Section */}
            <div className="pt-2">
              <div className="py-2 px-4 text-[#ffffff] font-poppins font-semibold text-xs uppercase tracking-widest">
                {t("rentals")}
              </div>
              {rentalItems.map((item) => {
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

            {/* Account: wishlists + guest login */}
            <div className="pt-2">
              <div className="py-2 px-4 text-[#ffffff] font-poppins font-semibold text-xs uppercase tracking-widest">
                {t("account")}
              </div>
              <Link href="/favorites">
                <div
                  className={`flex items-center justify-between gap-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                    pathname.startsWith("/favorites")
                      ? "bg-[#ffffff]/20 text-white border-l-2 border-[#ffffff]"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2 font-poppins font-medium text-sm tracking-wide">
                    <Heart className="w-4 h-4" />
                    {tFav("navLabel")}
                  </span>
                  {favoritesCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white text-ink text-[10px] font-bold leading-none">
                      {favoritesCount}
                    </span>
                  )}
                </div>
              </Link>
              <Link href="/guest-login">
                <div
                  className={`block py-3 px-4 rounded-xl transition-all duration-200 ${
                    pathname.startsWith("/guest-login")
                      ? "bg-[#ffffff]/20 text-white border-l-2 border-[#ffffff]"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-poppins font-medium text-sm tracking-wide">
                    {t("guestLogin")}
                  </span>
                </div>
              </Link>
            </div>

            {/* Divider */}
            <div className="pt-4 pb-2">
              <div className="h-px bg-gradient-to-r from-transparent via-[#ffffff]/30 to-transparent" />
            </div>

            {/* Contact Info */}
            <div className="px-4 py-3 space-y-3">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-white/70 hover:text-[#ffffff] transition-colors"
              >
                <SiWhatsapp className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="font-poppins text-sm">
                  {t("bookAStay")} {PHONE_DISPLAY}
                </span>
              </a>
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

      <PartnerModal
        open={isPartnerOpen}
        onClose={() => setIsPartnerOpen(false)}
      />
    </>
  );
}
