"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Phone, MessageCircle, Send, Loader2, Copy, Check } from "lucide-react";
import { SiWhatsapp, SiWechat, SiLine } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COUNTRY_CODES,
  getCodeFromValue,
  DEFAULT_COUNTRY_VALUE,
} from "@/lib/country-codes";
import type { PMSListing } from "@/lib/silqhaus-pms/listings";

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@silqhaus.com";

const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE_TEL || "";
const CONTACT_WHATSAPP = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "";
const CONTACT_WECHAT = process.env.NEXT_PUBLIC_CONTACT_WECHAT || "";
const CONTACT_LINE = process.env.NEXT_PUBLIC_CONTACT_LINE || "";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";

const TERMS_VERSION = "2026-04-01";

type PurposeKey =
  | "more_info"
  | "schedule_viewing"
  | "want_to_buy"
  | "want_to_rent";

type ApiResponse =
  | { ok: true; id?: string }
  | {
      ok: false;
      error: {
        code:
          | "validation_error"
          | "rate_limited"
          | "unauthorized"
          | "upstream_error"
          | "network_error";
        message: string;
        fields?: Record<string, string>;
        retryAfter?: number;
      };
    };

interface Props {
  listing: PMSListing;
  basePath: "properties-for-rent" | "properties-for-sale";
}

const FIELD_PATH_MAP: Record<string, "name" | "email" | "phone"> = {
  "contact.name": "name",
  "contact.email": "email",
  "contact.phone": "phone",
  "contact.phone.number": "phone",
  "contact.phone.e164": "phone",
  "contact.phone.countryCode": "phone",
  "contact.phone.countryIso": "phone",
};

export function PMSPropertyInquiry({ listing, basePath }: Props) {
  const t = useTranslations("pmsPropertyInquiry");
  const locale = useLocale() as "en" | "th";
  const side: "rent" | "sale" =
    basePath === "properties-for-rent" ? "rent" : "sale";

  const purposeOptions: PurposeKey[] =
    side === "rent"
      ? ["more_info", "schedule_viewing", "want_to_rent"]
      : ["more_info", "schedule_viewing", "want_to_buy"];

  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: DEFAULT_COUNTRY_VALUE,
    phone: "",
    purpose: purposeOptions[0] as PurposeKey,
    message: "",
    terms: false,
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    terms?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [wechatCopied, setWechatCopied] = useState(false);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePhone = (p: string) => /^[0-9\s\-]{6,15}$/.test(p);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!form.name.trim()) {
      newErrors.name = t("validation.nameRequired");
    }
    if (!validateEmail(form.email)) {
      newErrors.email = t("validation.invalidEmail");
    }
    if (!validatePhone(form.phone)) {
      newErrors.phone = t("validation.invalidPhone");
    }
    if (!form.terms) {
      newErrors.terms = t("validation.termsRequired");
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    const dialCode = getCodeFromValue(form.countryCode);
    const countryIso = (form.countryCode.split("-")[1] || "").toUpperCase();
    const digits = form.phone.replace(/[^0-9]/g, "");
    const e164 = `${dialCode}${digits.replace(/^0+/, "")}`;
    const purposeLabel = t(`purpose.${form.purpose}`);
    const listingUrl = `${SITE_URL.replace(/\/$/, "")}/${locale}/${basePath}/${listing.slug}`;

    const payload = {
      source: "silqhaus.com",
      locale,
      submittedAt: new Date().toISOString(),
      listing: {
        id: listing.id || listing.slug,
        slug: listing.slug,
        title: listing.title,
        side,
        url: listingUrl,
      },
      contact: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: { countryCode: dialCode, countryIso, number: form.phone, e164 },
      },
      inquiry: {
        purpose: form.purpose,
        purposeLabel,
        message: form.message || null,
      },
      consent: {
        termsAccepted: true as const,
        termsVersion: TERMS_VERSION,
      },
    };

    let pmsResult: ApiResponse;
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => null)) as ApiResponse | null;
      pmsResult =
        body ??
        (res.ok
          ? ({ ok: true } as ApiResponse)
          : ({
              ok: false,
              error: { code: "upstream_error", message: `HTTP ${res.status}` },
            } as ApiResponse));
    } catch (err) {
      console.error("PMS inquiry error:", err);
      pmsResult = {
        ok: false,
        error: { code: "network_error", message: "Network error" },
      };
    }

    setIsSubmitting(false);

    if (pmsResult.ok) {
      setStatus("success");
      setForm({
        name: "",
        email: "",
        countryCode: DEFAULT_COUNTRY_VALUE,
        phone: "",
        purpose: purposeOptions[0] as PurposeKey,
        message: "",
        terms: false,
      });
      return;
    }

    setStatus("error");
    if (pmsResult.error.code === "rate_limited") {
      setErrorMessage(t("form.errorRateLimited"));
    } else if (
      pmsResult.error.code === "validation_error" &&
      pmsResult.error.fields
    ) {
      const fieldErrs: typeof errors = {};
      for (const [path, msg] of Object.entries(pmsResult.error.fields)) {
        const target = FIELD_PATH_MAP[path];
        if (target) fieldErrs[target] = msg;
      }
      if (Object.keys(fieldErrs).length > 0) setErrors(fieldErrs);
      setErrorMessage(t("form.errorValidation"));
    } else {
      setErrorMessage(t("form.errorMessage", { email: SUPPORT_EMAIL }));
    }
  };

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_WECHAT);
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2500);
    } catch (err) {
      console.error("WeChat copy failed:", err);
    }
  };

  const channels: Array<{
    key: "phone" | "whatsapp" | "wechat" | "line";
    href?: string;
    onClick?: () => void;
    label: string;
    value: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [];
  if (CONTACT_PHONE) {
    channels.push({
      key: "phone",
      href: `tel:${CONTACT_PHONE}`,
      label: t("channels.phone"),
      value: CONTACT_PHONE,
      Icon: Phone,
    });
  }
  if (CONTACT_WHATSAPP) {
    const num = CONTACT_WHATSAPP.replace(/[^0-9]/g, "");
    channels.push({
      key: "whatsapp",
      href: `https://wa.me/${num}`,
      label: t("channels.whatsapp"),
      value: CONTACT_WHATSAPP,
      Icon: SiWhatsapp,
    });
  }
  if (CONTACT_WECHAT) {
    channels.push({
      key: "wechat",
      onClick: copyWechat,
      label: t("channels.wechat"),
      value: CONTACT_WECHAT,
      Icon: SiWechat,
    });
  }
  if (CONTACT_LINE) {
    const lineHref = CONTACT_LINE.startsWith("http")
      ? CONTACT_LINE
      : `https://line.me/ti/p/~${CONTACT_LINE}`;
    channels.push({
      key: "line",
      href: lineHref,
      label: t("channels.line"),
      value: CONTACT_LINE.startsWith("http")
        ? t("channels.openLine")
        : CONTACT_LINE,
      Icon: SiLine,
    });
  }

  const showChannels = channels.length > 0;

  return (
    <section data-testid="section-pms-property-inquiry">
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 md:p-6">
        <div>
          <h2 className="text-xl md:text-2xl font-gilroy font-semibold text-white mb-1">
            {t("form.title")}
          </h2>
          <p className="text-white/60 font-poppins text-sm mb-5">
            {t("form.subtitle", { property: listing.title })}
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
            data-testid="inquiry-form"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="pms-inq-name"
                  className="font-poppins text-white"
                >
                  {t("form.labels.name")}{" "}
                  <span className="text-[#ffffff]">*</span>
                </Label>
                <Input
                  id="pms-inq-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm({ ...form, name: v });
                    setErrors((prev) => ({
                      ...prev,
                      name: v.trim() ? undefined : prev.name,
                    }));
                  }}
                  placeholder={t("form.placeholders.name")}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={
                    errors.name ? "pms-inq-name-err" : undefined
                  }
                  className={`font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#ffffff] text-white placeholder:text-white/40 ${errors.name ? "border-red-500" : ""}`}
                  data-testid="inquiry-name"
                />
                {errors.name && (
                  <p
                    id="pms-inq-name-err"
                    role="alert"
                    className="text-red-400 text-xs font-poppins"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="pms-inq-email"
                  className="font-poppins text-white"
                >
                  {t("form.labels.email")}{" "}
                  <span className="text-[#ffffff]">*</span>
                </Label>
                <Input
                  id="pms-inq-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm({ ...form, email: v });
                    setErrors((prev) => ({
                      ...prev,
                      email:
                        v && !validateEmail(v)
                          ? t("validation.invalidEmail")
                          : undefined,
                    }));
                  }}
                  placeholder={t("form.placeholders.email")}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={
                    errors.email ? "pms-inq-email-err" : undefined
                  }
                  className={`font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#ffffff] text-white placeholder:text-white/40 ${errors.email ? "border-red-500" : ""}`}
                  data-testid="inquiry-email"
                />
                {errors.email && (
                  <p
                    id="pms-inq-email-err"
                    role="alert"
                    className="text-red-400 text-xs font-poppins"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="pms-inq-phone"
                className="font-poppins text-white"
              >
                {t("form.labels.phone")}{" "}
                <span className="text-[#ffffff]">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={form.countryCode}
                  onValueChange={(v) => setForm({ ...form, countryCode: v })}
                >
                  <SelectTrigger
                    aria-label={t("form.labels.countryCode")}
                    className="w-[140px] font-poppins bg-[#1a1a1a] border-white/20 text-white"
                    data-testid="inquiry-country-code"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/20">
                    {COUNTRY_CODES.map((cc) => (
                      <SelectItem
                        key={cc.value}
                        value={cc.value}
                        className="text-white hover:bg-[#ffffff]/20"
                      >
                        {cc.code} {cc.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="pms-inq-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm({ ...form, phone: v });
                    setErrors((prev) => ({
                      ...prev,
                      phone:
                        v && !validatePhone(v)
                          ? t("validation.invalidPhone")
                          : undefined,
                    }));
                  }}
                  placeholder={t("form.placeholders.phone")}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={
                    errors.phone ? "pms-inq-phone-err" : undefined
                  }
                  className={`flex-1 font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#ffffff] text-white placeholder:text-white/40 ${errors.phone ? "border-red-500" : ""}`}
                  data-testid="inquiry-phone"
                />
              </div>
              {errors.phone && (
                <p
                  id="pms-inq-phone-err"
                  role="alert"
                  className="text-red-400 text-xs font-poppins"
                >
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="pms-inq-purpose"
                className="font-poppins text-white"
              >
                {t("form.labels.purpose")}{" "}
                <span className="text-[#ffffff]">*</span>
              </Label>
              <Select
                value={form.purpose}
                onValueChange={(v) =>
                  setForm({ ...form, purpose: v as PurposeKey })
                }
              >
                <SelectTrigger
                  id="pms-inq-purpose"
                  className="font-poppins bg-[#1a1a1a] border-white/20 text-white"
                  data-testid="inquiry-purpose"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/20">
                  {purposeOptions.map((p) => (
                    <SelectItem
                      key={p}
                      value={p}
                      className="text-white hover:bg-[#ffffff]/20"
                    >
                      {t(`purpose.${p}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="pms-inq-message"
                className="font-poppins text-white"
              >
                {t("form.labels.message")}
              </Label>
              <Textarea
                id="pms-inq-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={2000}
                placeholder={t("form.placeholders.message")}
                className="min-h-[110px] font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#ffffff] text-white placeholder:text-white/40"
                data-testid="inquiry-message"
              />
              <div className="text-right text-white/40 text-xs font-poppins">
                {form.message.length}/2000
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="pms-inq-terms"
                checked={form.terms}
                onCheckedChange={(c) => {
                  const checked = c === true;
                  setForm({ ...form, terms: checked });
                  setErrors((prev) => ({
                    ...prev,
                    terms: checked ? undefined : prev.terms,
                  }));
                }}
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={
                  errors.terms ? "pms-inq-terms-err" : undefined
                }
                className="mt-0.5 border-white/30 data-[state=checked]:bg-[#ffffff] data-[state=checked]:border-[#ffffff]"
                data-testid="inquiry-terms"
              />
              <div>
                <label
                  htmlFor="pms-inq-terms"
                  className="text-white/80 text-sm font-poppins leading-snug cursor-pointer"
                >
                  {t.rich("form.terms", {
                    termsLink: (chunks) => (
                      <a
                        href={`/${locale}/terms-of-use`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#a3894a] underline hover:text-[#c0a05e]"
                      >
                        {chunks}
                      </a>
                    ),
                    privacyLink: (chunks) => (
                      <a
                        href={`/${locale}/privacy-policy`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#a3894a] underline hover:text-[#c0a05e]"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </label>
                {errors.terms && (
                  <p
                    id="pms-inq-terms-err"
                    role="alert"
                    className="text-red-400 text-xs font-poppins mt-1"
                  >
                    {errors.terms}
                  </p>
                )}
              </div>
            </div>

            {status === "success" && (
              <div
                role="status"
                aria-live="polite"
                className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
              >
                <p className="text-green-400 font-poppins text-sm">
                  {t("form.successMessage")}
                </p>
              </div>
            )}
            {status === "error" && (
              <div
                role="alert"
                aria-live="assertive"
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
              >
                <p className="text-red-400 font-poppins text-sm">
                  {errorMessage}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ffffff] hover:bg-[#ffffff] text-white font-poppins font-medium px-6 py-5 rounded-full text-sm uppercase tracking-wider"
              data-testid="inquiry-submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("form.submitting")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t("form.submit")}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Channels (hidden entirely if all four envs missing) */}
        {showChannels && (
          <>
            <div
              className="relative my-6 flex items-center justify-center"
              data-testid="inquiry-or-divider"
            >
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              <span className="relative bg-[#141414] px-3 text-[11px] font-poppins font-medium uppercase tracking-[0.2em] text-white/50">
                {t("or")}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-4 h-4 text-[#a3894a]" />
                <h3 className="text-base md:text-lg font-gilroy font-semibold text-white">
                  {t("channels.title")}
                </h3>
              </div>
              <p className="text-white/60 font-poppins text-xs mb-4">
                {t("channels.subtitle")}
              </p>
              <div className="space-y-2">
                {channels.map(({ key, href, onClick, label, value, Icon }) => {
                  const inner = (
                    <>
                      <span className="w-9 h-9 rounded-full bg-[#ffffff]/20 flex items-center justify-center text-[#a3894a] flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium">
                          {label}
                        </span>
                        <span className="block text-xs text-white/50 truncate">
                          {value}
                        </span>
                      </span>
                      {key === "wechat" &&
                        (wechatCopied ? (
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <Copy className="w-4 h-4 text-white/40 flex-shrink-0" />
                        ))}
                    </>
                  );
                  const className =
                    "flex items-center gap-3 bg-[#1a1a1a] border border-white/10 hover:border-[#ffffff] hover:bg-[#ffffff]/10 transition-colors rounded-xl px-4 py-3 text-white font-poppins w-full text-left";
                  if (onClick) {
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={onClick}
                        className={className}
                        data-testid={`inquiry-channel-${key}`}
                        aria-label={`${label}: ${value}`}
                      >
                        {inner}
                      </button>
                    );
                  }
                  return (
                    <a
                      key={key}
                      href={href}
                      target={href!.startsWith("tel:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className={className}
                      data-testid={`inquiry-channel-${key}`}
                    >
                      {inner}
                    </a>
                  );
                })}
              </div>
              {wechatCopied && (
                <p
                  role="status"
                  aria-live="polite"
                  className="text-green-400 text-xs font-poppins mt-3"
                >
                  {t("channels.wechatCopied")}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
