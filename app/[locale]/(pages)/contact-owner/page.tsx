"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import emailjs from "@emailjs/browser";
import { Link } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Send, Loader2, ArrowRight } from "lucide-react";
import ContactChannels from "@/components/contact-channels";
import {
  COUNTRY_CODES,
  getCodeFromValue,
  DEFAULT_COUNTRY_VALUE,
} from "@/lib/country-codes";
import { useTranslations } from "next-intl";

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@silqhaus.com";

// Same owner-lead pipeline the property-management page uses.
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

const WHY_KEYS = [
  "os",
  "mali",
  "verified",
  "pricing",
  "portal",
  "ownerFirst",
  "compliance",
  "small",
  "distribution",
] as const;

const PROPERTY_TYPES = [
  "villa",
  "condo",
  "apartment",
  "townhouse",
  "hotel",
  "other",
] as const;

const LOCATIONS = [
  "phuket",
  "pattaya",
  "bangkok",
  "samui",
  "huahin",
  "chiangmai",
  "other",
] as const;

/** Shared input skin — matches the contact page. */
const FIELD =
  "h-11 rounded-lg bg-white/[0.04] border-line text-white placeholder:text-white/50 focus:border-white/40 focus-visible:ring-1 focus-visible:ring-white/25 transition-colors";

export default function ContactOwner() {
  const t = useTranslations("contactOwner");

  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: DEFAULT_COUNTRY_VALUE,
    phone: "",
    propertyType: "",
    location: "",
    bedrooms: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  useEffect(() => {
    if (submitStatus === "success" || submitStatus === "error") {
      const timer = setTimeout(() => setSubmitStatus("idle"), 20000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) =>
    phone === "" || /^[0-9\s\-]{6,15}$/.test(phone);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { email?: string; phone?: string } = {};
    if (!validateEmail(form.email)) {
      newErrors.email = t("form.validation.invalidEmail");
    }
    if (!validatePhone(form.phone)) {
      newErrors.phone = t("form.validation.invalidPhone");
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const dialCode = getCodeFromValue(form.countryCode);
    const fullPhone = form.phone
      ? `${dialCode} ${form.phone}`
      : t("form.notProvided");

    const templateParams = {
      name: form.name,
      email: form.email,
      phone: fullPhone,
      location: form.location
        ? t(`form.locations.${form.location}`)
        : t("form.notProvided"),
      type: form.propertyType
        ? t(`form.types.${form.propertyType}`)
        : t("form.notProvided"),
      description: [
        form.bedrooms ? `Bedrooms: ${form.bedrooms}` : "",
        form.message || t("form.noMessage"),
      ]
        .filter(Boolean)
        .join("\n"),
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY,
      );
      if (
        typeof window !== "undefined" &&
        typeof (window as any).fbq === "function"
      ) {
        (window as any).fbq("trackCustom", "OwnerPartnerFormSubmission");
      }
      setSubmitStatus("success");
      setForm({
        name: "",
        email: "",
        countryCode: DEFAULT_COUNTRY_VALUE,
        phone: "",
        propertyType: "",
        location: "",
        bedrooms: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink">
      {/* ── Hero ── */}
      <section className="relative h-[52vh] min-h-[420px] flex items-end overflow-hidden">
        <Image
          src="/photos/partner-with-us-hero.jpg"
          alt={t("hero.title")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-black/25 to-black/10"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-site mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16">
          <h1 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight normal-case text-balance">
            {t("hero.title")}
          </h1>
          <p className="text-white/80 mt-4 text-lg sm:text-xl leading-relaxed max-w-2xl">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* ── Why us — the competitive case, in bullets ── */}
      <section className="py-14 sm:py-20 border-b border-line">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 mb-9 sm:mb-11">
            <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
              {t("why.title")}
            </h2>
            <p className="text-white/55 max-w-md text-base leading-relaxed">
              {t("why.intro")}
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10">
            {WHY_KEYS.map((k) => (
              <li
                key={k}
                className="flex items-start gap-3.5 border-t border-line py-5"
              >
                <span
                  className="mt-0.5 inline-flex w-6 h-6 shrink-0 items-center justify-center rounded-full border border-white/25 text-white"
                  aria-hidden="true"
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-white font-semibold text-[15px] tracking-tight">
                    {t(`why.items.${k}.title`)}
                  </span>
                  <span className="block text-white/55 text-sm mt-1.5 leading-relaxed">
                    {t(`why.items.${k}.desc`)}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/property-management"
            className="inline-flex items-center gap-1.5 mt-8 text-sm font-medium text-white/75 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            {t("why.moreLink")}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Form + direct lines ── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          <div
            id="owner-form"
            className="lg:col-span-3 rounded-2xl sm:rounded-3xl border border-line bg-white/[0.02] p-6 sm:p-9"
          >
            <h2 className="font-display text-white text-2xl sm:text-3xl font-light leading-[1.1] tracking-tight normal-case">
              {t("form.title")}
            </h2>
            <p className="text-white/60 mt-2 text-[15px] leading-relaxed">
              {t("form.subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="owner-name"
                    className="text-white/85 text-sm font-medium"
                  >
                    {t("form.labels.fullName")}
                  </Label>
                  <Input
                    id="owner-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    autoComplete="name"
                    className={FIELD}
                    placeholder={t("form.placeholders.fullName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="owner-email"
                    className="text-white/85 text-sm font-medium"
                  >
                    {t("form.labels.email")}
                  </Label>
                  <Input
                    id="owner-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm({ ...form, email: value });
                      setErrors((prev) => ({
                        ...prev,
                        email:
                          value && !validateEmail(value)
                            ? t("form.validation.invalidEmail")
                            : undefined,
                      }));
                    }}
                    required
                    autoComplete="email"
                    className={`${FIELD} ${errors.email ? "border-red-400/70" : ""}`}
                    placeholder={t("form.placeholders.email")}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="owner-phone"
                  className="text-white/85 text-sm font-medium"
                >
                  {t("form.labels.phone")}
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={form.countryCode}
                    onValueChange={(value) =>
                      setForm({ ...form, countryCode: value })
                    }
                  >
                    <SelectTrigger className={`w-[132px] shrink-0 ${FIELD}`}>
                      <SelectValue placeholder="+66" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#161616] border-line text-white">
                      {COUNTRY_CODES.map((cc) => (
                        <SelectItem
                          key={cc.value}
                          value={cc.value}
                          className="text-white focus:bg-white/10 focus:text-white"
                        >
                          {cc.code} {cc.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="owner-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm({ ...form, phone: value });
                      setErrors((prev) => ({
                        ...prev,
                        phone:
                          value && !validatePhone(value)
                            ? t("form.validation.invalidPhone")
                            : undefined,
                      }));
                    }}
                    autoComplete="tel-national"
                    className={`flex-1 ${FIELD} ${errors.phone ? "border-red-400/70" : ""}`}
                    placeholder={t("form.placeholders.phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="owner-type"
                    className="text-white/85 text-sm font-medium"
                  >
                    {t("form.labels.propertyType")}
                  </Label>
                  <Select
                    value={form.propertyType}
                    onValueChange={(value) =>
                      setForm({ ...form, propertyType: value })
                    }
                  >
                    <SelectTrigger id="owner-type" className={FIELD}>
                      <SelectValue placeholder={t("form.placeholders.select")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#161616] border-line text-white">
                      {PROPERTY_TYPES.map((pt) => (
                        <SelectItem
                          key={pt}
                          value={pt}
                          className="text-white focus:bg-white/10 focus:text-white"
                        >
                          {t(`form.types.${pt}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="owner-location"
                    className="text-white/85 text-sm font-medium"
                  >
                    {t("form.labels.location")}
                  </Label>
                  <Select
                    value={form.location}
                    onValueChange={(value) =>
                      setForm({ ...form, location: value })
                    }
                  >
                    <SelectTrigger id="owner-location" className={FIELD}>
                      <SelectValue placeholder={t("form.placeholders.select")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#161616] border-line text-white">
                      {LOCATIONS.map((loc) => (
                        <SelectItem
                          key={loc}
                          value={loc}
                          className="text-white focus:bg-white/10 focus:text-white"
                        >
                          {t(`form.locations.${loc}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="owner-bedrooms"
                    className="text-white/85 text-sm font-medium"
                  >
                    {t("form.labels.bedrooms")}
                  </Label>
                  <Input
                    id="owner-bedrooms"
                    type="number"
                    min="1"
                    max="30"
                    value={form.bedrooms}
                    onChange={(e) =>
                      setForm({ ...form, bedrooms: e.target.value })
                    }
                    className={FIELD}
                    placeholder={t("form.placeholders.bedrooms")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="owner-message"
                  className="text-white/85 text-sm font-medium"
                >
                  {t("form.labels.message")}
                </Label>
                <Textarea
                  id="owner-message"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  maxLength={800}
                  placeholder={t("form.placeholders.message")}
                  className={`min-h-[130px] ${FIELD} h-auto`}
                />
              </div>

              {submitStatus === "success" && (
                <div
                  role="status"
                  className="rounded-xl border border-green-400/25 bg-green-400/10 p-4 text-center"
                >
                  <p className="text-green-300 text-sm">
                    {t("form.successMessage")}
                  </p>
                </div>
              )}

              {submitStatus === "error" && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-center"
                >
                  <p className="text-red-300 text-sm">
                    {t("form.errorMessage", { email: SUPPORT_EMAIL })}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white text-ink px-8 py-3.5 text-sm font-semibold transition-colors hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="w-4 h-4 animate-spin motion-reduce:hidden"
                        aria-hidden="true"
                      />
                      {t("form.submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" aria-hidden="true" />
                      {t("form.submit")}
                    </>
                  )}
                </button>
                <p className="text-white/45 text-xs leading-relaxed">
                  {t("form.disclaimer")}
                </p>
              </div>
            </form>
          </div>

          {/* Direct lines */}
          <aside className="lg:col-span-2 flex flex-col">
            <h2 className="font-display text-white text-2xl sm:text-3xl font-light leading-[1.1] tracking-tight normal-case">
              {t("direct.title")}
            </h2>
            <p className="text-white/60 mt-2 text-[15px] leading-relaxed">
              {t("direct.description")}
            </p>

            <ContactChannels
              phoneTitle={t("direct.phone")}
              phoneDescription={t("direct.phoneDescription")}
              emailTitle={t("direct.email")}
              emailDescription={t("direct.emailDescription")}
              className="mt-6"
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
