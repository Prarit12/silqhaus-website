"use client";

import { useState, useEffect, useId, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Language = {
  code: string;
  name: string;
  flag: JSX.Element;
};

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    flag: (
      <svg viewBox="0 0 640 480" className="w-5 h-4">
        <path d="M0 0v480h640V0z" fill="#012169" />
        <path
          d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"
          fill="#fff"
        />
        <path
          d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"
          fill="#C8102E"
        />
        <path d="M241 0v480h160V0zM0 160v160h640V160z" fill="#fff" />
        <path d="M0 193v96h640v-96zM273 0v480h96V0z" fill="#C8102E" />
      </svg>
    ),
  },
  {
    code: "th",
    name: "ไทย",
    flag: (
      <svg viewBox="0 0 640 480" className="w-5 h-4">
        <g fillRule="evenodd">
          <path fill="#f4f5f8" d="M0 0h640v480H0z" />
          <path fill="#2d2a4a" d="M0 162.5h640v160H0z" />
          <path fill="#a51931" d="M0 0h640v80H0zm0 400h640v80H0z" />
          <path fill="#f4f5f8" d="M0 80h640v82.5H0zm0 240h640v80H0z" />
        </g>
      </svg>
    ),
  },
];

interface LanguageSwitcherProps {
  className?: string;
  variant?: "desktop" | "mobile";
}

export default function LanguageSwitcher({
  className = "",
  variant = "desktop",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const currentLanguage =
    languages.find((l) => l.code === locale) || languages[0];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uniqueId = useId();

  const handleLanguageChange = (language: Language) => {
    setIsDropdownOpen(false);
    setFocusedIndex(0);
    buttonRef.current?.focus();
    const query = window.location.search.slice(1);
    const href = query ? `${pathname}?${query}` : pathname;
    router.replace(href, { locale: language.code as any });
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setIsDropdownOpen(true);
      setFocusedIndex(0);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      setIsDropdownOpen(false);
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    switch (e.key) {
      case "Escape":
        setIsDropdownOpen(false);
        setFocusedIndex(0);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        setFocusedIndex((prev) => {
          const nextIndex = (prev + 1) % languages.length;
          itemRefs.current[nextIndex]?.focus();
          return nextIndex;
        });
        break;
      case "ArrowUp":
        setFocusedIndex((prev) => {
          const nextIndex = (prev - 1 + languages.length) % languages.length;
          itemRefs.current[nextIndex]?.focus();
          return nextIndex;
        });
        break;
      case "Enter":
      case " ":
        handleLanguageChange(languages[focusedIndex]);
        break;
      case "Home":
        setFocusedIndex(() => {
          itemRefs.current[0]?.focus();
          return 0;
        });
        break;
      case "End":
        setFocusedIndex(() => {
          const lastIndex = languages.length - 1;
          itemRefs.current[lastIndex]?.focus();
          return lastIndex;
        });
        break;
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      const currentIndex = languages.findIndex((lang) => lang.code === locale);
      const targetIndex = currentIndex >= 0 ? currentIndex : 0;
      setFocusedIndex(targetIndex);
      itemRefs.current[targetIndex]?.focus();
    }
  }, [isDropdownOpen, locale]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-language-switcher]")) {
        setIsDropdownOpen(false);
        setFocusedIndex(0);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDropdownOpen) {
        setIsDropdownOpen(false);
        setFocusedIndex(0);
        buttonRef.current?.focus();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isDropdownOpen]);

  if (variant === "mobile") {
    return (
      <div className={`relative ${className}`} data-language-switcher>
        <button
          ref={buttonRef}
          id={`mobile-language-button-${uniqueId}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onKeyDown={handleTriggerKeyDown}
          className="flex items-center justify-between w-full py-3 px-4 rounded-xl transition-all duration-200 font-poppins text-sm text-white/80 hover:bg-white/5 hover:text-white"
          aria-label={`Current language: ${currentLanguage.name}. Click to change language`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          aria-controls={`mobile-language-menu-${uniqueId}`}
        >
          <div className="flex items-center gap-2.5">
            {currentLanguage.flag}
            <span className="font-medium">{currentLanguage.name}</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div
            id={`mobile-language-menu-${uniqueId}`}
            role="menu"
            aria-labelledby={`mobile-language-button-${uniqueId}`}
            aria-orientation="vertical"
            className="mt-1 mx-1 rounded-xl overflow-hidden border border-white/10 bg-white/5"
          >
            {languages.map((language, index) => (
              <button
                key={language.code}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                onClick={() => handleLanguageChange(language)}
                onKeyDown={handleMenuKeyDown}
                role="menuitemradio"
                aria-checked={locale === language.code}
                tabIndex={focusedIndex === index ? 0 : -1}
                className={`flex items-center gap-2.5 w-full py-3 px-4 transition-all duration-200 font-poppins text-sm ${
                  locale === language.code
                    ? "text-white bg-[#7e6725]/15"
                    : "text-white/70 hover:bg-[#7e6725]/10 hover:text-white"
                }`}
              >
                {language.flag}
                <span className="font-medium">{language.name}</span>
                {locale === language.code && (
                  <svg
                    className="w-4 h-4 ml-auto text-[#7e6725]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} data-language-switcher>
      <button
        ref={buttonRef}
        id={`language-switcher-button-${uniqueId}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onKeyDown={handleTriggerKeyDown}
        className="cursor-pointer transition-all duration-300 w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 hover:scale-110"
        aria-label={`Current language: ${currentLanguage.name}. Click to change language`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
        aria-controls={`language-menu-${uniqueId}`}
        data-testid="button-language-switcher"
      >
        {currentLanguage.flag}
      </button>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          id={`language-menu-${uniqueId}`}
          role="menu"
          aria-labelledby={`language-switcher-button-${uniqueId}`}
          aria-orientation="vertical"
          className="absolute top-full right-0 mt-2 w-12 bg-ink-2 rounded-lg shadow-lg border border-line z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200"
        >
          {languages.map((language, index) => (
            <button
              key={language.code}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              id={`language-option-${language.code}-${uniqueId}`}
              onClick={() => handleLanguageChange(language)}
              onKeyDown={handleMenuKeyDown}
              role="menuitemradio"
              aria-checked={locale === language.code}
              tabIndex={focusedIndex === index ? 0 : -1}
              className={`w-full h-10 flex items-center justify-center hover:bg-gold/10 transition-colors cursor-pointer border-b border-line last:border-b-0 first:rounded-t-lg last:rounded-b-lg ${
                locale === language.code ? "bg-gold/5" : ""
              } ${focusedIndex === index ? "bg-gold/10" : ""}`}
              data-testid={`language-option-${language.code}`}
            >
              {language.flag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
