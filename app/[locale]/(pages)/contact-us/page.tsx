"use client";
import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import emailjs from "@emailjs/browser";
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
import { Send, Loader2 } from "lucide-react";
import ContactChannels from "@/components/contact-channels";
import {
  COUNTRY_CODES,
  getCodeFromValue,
  DEFAULT_COUNTRY_VALUE,
} from "@/lib/country-codes";
import { useTranslations } from "next-intl";

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@silqhaus.com";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID_SDR || "";
const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_SDR || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY_SDR || "";

/** Shared input skin — the site's ink/hairline language. */
const FIELD =
  "h-11 rounded-lg bg-white/[0.04] border-line text-white placeholder:text-white/50 focus:border-white/40 focus-visible:ring-1 focus-visible:ring-white/25 transition-colors";

export default function ContactUs() {
  const t = useTranslations("contactUs");

  const [guestForm, setGuestForm] = useState({
    name: "",
    email: "",
    countryCode: DEFAULT_COUNTRY_VALUE,
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  useEffect(() => {
    if (submitStatus === "success" || submitStatus === "error") {
      const timer = setTimeout(() => {
        setSubmitStatus("idle");
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9\s\-]{6,15}$/;
    return phone === "" || phoneRegex.test(phone);
  };

  const handleGuestSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { email?: string; phone?: string } = {};

    if (!validateEmail(guestForm.email)) {
      newErrors.email = t("form.validation.invalidEmail");
    }

    if (!validatePhone(guestForm.phone)) {
      newErrors.phone = t("form.validation.invalidPhone");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const dialCode = getCodeFromValue(guestForm.countryCode);
    const fullPhone = guestForm.phone
      ? `${dialCode} ${guestForm.phone}`
      : t("form.notProvided");

    const templateParams = {
      name: guestForm.name,
      email: guestForm.email,
      phone: fullPhone,
      message: guestForm.message || t("form.noMessage"),
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY,
      );
      setSubmitStatus("success");
      setGuestForm({
        name: "",
        email: "",
        countryCode: DEFAULT_COUNTRY_VALUE,
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const MAX_MESSAGE_CHARS = 800;

  return (
    <main className="min-h-screen bg-ink">
      {/* ── Hero — full-bleed photo, same grammar as the region guides ── */}
      <section className="relative h-[52vh] min-h-[420px] flex items-end overflow-hidden">
        <Image
          src="/photos/contact-us-hero.jpg"
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
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16">
          <h1 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight normal-case text-balance">
            {t("hero.title")}
          </h1>
          <p className="text-white/80 mt-4 text-lg sm:text-xl leading-relaxed max-w-2xl">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* ── Inquiry form + direct lines ── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* The form */}
          <div
            id="inquiry-form"
            className="lg:col-span-3 rounded-2xl sm:rounded-3xl border border-line bg-white/[0.02] p-6 sm:p-9"
          >
            <h2 className="font-display text-white text-2xl sm:text-3xl font-light leading-[1.1] tracking-tight normal-case">
              {t("form.title")}
            </h2>
            <p className="text-white/60 mt-2 text-[15px] leading-relaxed">
              {t("form.subtitle")}
            </p>

            <form onSubmit={handleGuestSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="guest-name"
                    className="text-white/85 text-sm font-medium"
                  >
                    {t("form.labels.fullName")}
                  </Label>
                  <Input
                    id="guest-name"
                    type="text"
                    value={guestForm.name}
                    onChange={(e) =>
                      setGuestForm({ ...guestForm, name: e.target.value })
                    }
                    required
                    autoComplete="name"
                    className={FIELD}
                    placeholder={t("form.placeholders.fullName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="guest-email"
                    className="text-white/85 text-sm font-medium"
                  >
                    {t("form.labels.email")}
                  </Label>
                  <Input
                    id="guest-email"
                    type="email"
                    value={guestForm.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setGuestForm({ ...guestForm, email: value });
                      if (value && !validateEmail(value)) {
                        setErrors((prev) => ({
                          ...prev,
                          email: t("form.validation.invalidEmail"),
                        }));
                      } else {
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value && !validateEmail(value)) {
                        setErrors((prev) => ({
                          ...prev,
                          email: t("form.validation.invalidEmail"),
                        }));
                      }
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
                  htmlFor="guest-phone"
                  className="text-white/85 text-sm font-medium"
                >
                  {t("form.labels.phone")}
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={guestForm.countryCode}
                    onValueChange={(value) =>
                      setGuestForm({ ...guestForm, countryCode: value })
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
                    id="guest-phone"
                    type="tel"
                    value={guestForm.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      setGuestForm({ ...guestForm, phone: value });
                      if (value && !validatePhone(value)) {
                        setErrors((prev) => ({
                          ...prev,
                          phone: t("form.validation.invalidPhone"),
                        }));
                      } else {
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value && !validatePhone(value)) {
                        setErrors((prev) => ({
                          ...prev,
                          phone: t("form.validation.invalidPhone"),
                        }));
                      }
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

              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-4">
                  <Label
                    htmlFor="guest-message"
                    className="text-white/85 text-sm font-medium"
                  >
                    {t("form.labels.message")}
                  </Label>
                  <span className="text-white/40 text-xs tabular-nums">
                    {guestForm.message.length}/{MAX_MESSAGE_CHARS}
                  </span>
                </div>
                <Textarea
                  id="guest-message"
                  value={guestForm.message}
                  onChange={(e) =>
                    setGuestForm({ ...guestForm, message: e.target.value })
                  }
                  required
                  maxLength={MAX_MESSAGE_CHARS}
                  placeholder={t("form.placeholders.message")}
                  className={`min-h-[140px] ${FIELD} h-auto`}
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
            </form>
          </div>

          {/* Direct lines — for the guests who'd rather not fill a form */}
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
