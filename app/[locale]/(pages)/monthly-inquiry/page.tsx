"use client";

import { Suspense, useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Send, Loader2, Calendar } from "lucide-react";
import {
  COUNTRY_CODES,
  getCodeFromValue,
  DEFAULT_COUNTRY_VALUE,
} from "@/lib/country-codes";
import { useTranslations } from "next-intl";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID_SDR || "";
const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_LONGTERMSTAY || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY_SDR || "";
const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@silqhaus.com";

function formatDateForDisplay(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function MonthlyInquiryForm() {
  const t = useTranslations("monthlyInquiry");
  const searchParams = useSearchParams();
  const propertyName = searchParams.get("property") || "";

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: DEFAULT_COUNTRY_VALUE,
    phone: "",
    tenants: "",
    moveIn: "",
    moveOut: "",
    property: propertyName,
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    moveOut?: string;
  }>({});

  useEffect(() => {
    setForm((prev) => ({ ...prev, property: propertyName }));
  }, [propertyName]);

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

  const getMoveOutMin = () => {
    if (!form.moveIn) return today;
    const d = new Date(form.moveIn);
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!validateEmail(form.email)) {
      newErrors.email = t("validation.invalidEmail");
    }
    if (!validatePhone(form.phone)) {
      newErrors.phone = t("validation.invalidPhone");
    }
    if (form.moveIn && form.moveOut && form.moveOut <= form.moveIn) {
      newErrors.moveOut = t("validation.moveOutAfterMoveIn");
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
      : t("notProvided");

    const templateParams = {
      name: form.name,
      email: form.email,
      phone: fullPhone,
      tenants: form.tenants || t("notProvided"),
      move_in: form.moveIn
        ? formatDateForDisplay(form.moveIn)
        : t("notProvided"),
      move_out: form.moveOut
        ? formatDateForDisplay(form.moveOut)
        : t("notProvided"),
      property: form.property || t("notProvided"),
      message: form.message || t("notProvided"),
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY,
      );
      setSubmitStatus("success");
      setForm({
        name: "",
        email: "",
        countryCode: DEFAULT_COUNTRY_VALUE,
        phone: "",
        tenants: "",
        moveIn: "",
        moveOut: "",
        property: propertyName,
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
    <main className="min-h-screen bg-[#0a0a0a]">
      <section className="relative bg-gradient-to-br from-[#7e6725] to-[#a3894a] text-[#0a0a0a] pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-[#0a0a0a]/20 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-[#0a0a0a]" />
            </div>
            <p className="text-[#0a0a0a] text-sm font-poppins font-light tracking-[0.3em] uppercase mb-4">
              {t("hero.subtitle")}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-gilroy font-bold mb-6 leading-tight tracking-wide">
              {t("hero.title")}
            </h1>
            <p className="text-[#0a0a0a]/90 max-w-3xl mx-auto font-poppins font-light text-lg sm:text-xl leading-snug">
              {t("hero.description")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-[#141414] border border-white/10 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#7e6725] rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#0a0a0a]" />
                </div>
                <div>
                  <CardTitle className="text-white font-gilroy font-bold text-2xl">
                    {t("form.title")}
                  </CardTitle>
                  <p className="text-white/70 font-poppins">
                    {t("form.subtitle")}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="inq-name"
                      className="font-poppins font-medium text-white"
                    >
                      {t("form.labels.fullName")}{" "}
                      <span className="text-[#7e6725]">*</span>
                    </Label>
                    <Input
                      id="inq-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder={t("form.placeholders.fullName")}
                      className="font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#7e6725] text-white placeholder:text-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="inq-email"
                      className="font-poppins font-medium text-white"
                    >
                      {t("form.labels.email")}{" "}
                      <span className="text-[#7e6725]">*</span>
                    </Label>
                    <Input
                      id="inq-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm({ ...form, email: value });
                        if (value && !validateEmail(value)) {
                          setErrors((prev) => ({
                            ...prev,
                            email: t("validation.invalidEmail"),
                          }));
                        } else {
                          setErrors((prev) => ({ ...prev, email: undefined }));
                        }
                      }}
                      placeholder={t("form.placeholders.email")}
                      className={`font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#7e6725] text-white placeholder:text-white/40 ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs font-poppins">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="inq-phone"
                    className="font-poppins font-medium text-white"
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
                      <SelectTrigger className="w-[140px] font-poppins bg-[#1a1a1a] border-white/20 text-white">
                        <SelectValue placeholder="+66" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/20">
                        {COUNTRY_CODES.map((cc) => (
                          <SelectItem
                            key={cc.value}
                            value={cc.value}
                            className="text-white hover:bg-[#7e6725]/20"
                          >
                            {cc.code} {cc.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="inq-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm({ ...form, phone: value });
                        if (value && !validatePhone(value)) {
                          setErrors((prev) => ({
                            ...prev,
                            phone: t("validation.invalidPhone"),
                          }));
                        } else {
                          setErrors((prev) => ({ ...prev, phone: undefined }));
                        }
                      }}
                      placeholder={t("form.placeholders.phone")}
                      className={`flex-1 font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#7e6725] text-white placeholder:text-white/40 ${errors.phone ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-400 text-xs font-poppins">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="inq-tenants"
                    className="font-poppins font-medium text-white"
                  >
                    {t("form.labels.tenants")}
                  </Label>
                  <Input
                    id="inq-tenants"
                    type="number"
                    min="1"
                    value={form.tenants}
                    onChange={(e) =>
                      setForm({ ...form, tenants: e.target.value })
                    }
                    placeholder={t("form.placeholders.tenants")}
                    className="font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#7e6725] text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-poppins font-medium text-white">
                    {t("form.labels.dates")}{" "}
                    <span className="text-[#7e6725]">*</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-white/50 text-xs font-poppins">
                        {t("form.labels.moveIn")}
                      </p>
                      <Input
                        type="date"
                        required
                        min={today}
                        value={form.moveIn}
                        onChange={(e) => {
                          const moveIn = e.target.value;
                          let autoMoveOut = "";
                          if (moveIn) {
                            const d = new Date(moveIn);
                            d.setDate(d.getDate() + 30);
                            autoMoveOut = d.toISOString().split("T")[0];
                          }
                          setForm({
                            ...form,
                            moveIn,
                            moveOut: autoMoveOut,
                          });
                          setErrors((prev) => ({
                            ...prev,
                            moveOut: undefined,
                          }));
                        }}
                        className="font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#7e6725] text-white [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-white/50 text-xs font-poppins">
                        {t("form.labels.moveOut")}
                      </p>
                      <Input
                        type="date"
                        required
                        min={getMoveOutMin()}
                        value={form.moveOut}
                        onChange={(e) => {
                          setForm({ ...form, moveOut: e.target.value });
                          setErrors((prev) => ({
                            ...prev,
                            moveOut: undefined,
                          }));
                        }}
                        className={`font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#7e6725] text-white [color-scheme:dark] ${errors.moveOut ? "border-red-500" : ""}`}
                      />
                    </div>
                  </div>
                  {errors.moveOut && (
                    <p className="text-red-400 text-xs font-poppins">
                      {errors.moveOut}
                    </p>
                  )}
                  <p className="text-white/40 text-xs font-poppins">
                    {t("form.datesNote")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="inq-property"
                    className="font-poppins font-medium text-white"
                  >
                    {t("form.labels.property")}
                  </Label>
                  <Input
                    id="inq-property"
                    type="text"
                    readOnly
                    value={form.property}
                    className="font-poppins bg-[#1a1a1a] border-white/10 text-white/50 cursor-not-allowed"
                  />
                  {!form.property && (
                    <p className="text-white/40 text-xs font-poppins">
                      {t("form.propertyNote")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="inq-message"
                    className="font-poppins font-medium text-white"
                  >
                    {t("form.labels.message")}
                  </Label>
                  <Textarea
                    id="inq-message"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    maxLength={600}
                    placeholder={t("form.placeholders.message")}
                    className="min-h-[120px] font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#7e6725] text-white placeholder:text-white/40"
                  />
                  <div className="text-right text-white/40 text-xs font-poppins">
                    {form.message.length}/600
                  </div>
                </div>

                {submitStatus === "success" && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                    <p className="text-green-400 font-poppins text-sm">
                      {t("form.successMessage")}
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                    <p className="text-red-400 font-poppins text-sm">
                      {t("form.errorMessage", { email: SUPPORT_EMAIL })}
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#7e6725] text-white hover:bg-[#6d5820] px-8 py-4 rounded-md text-base font-poppins font-medium tracking-wide transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default function MonthlyInquiryPage() {
  return (
    <Suspense fallback={null}>
      <MonthlyInquiryForm />
    </Suspense>
  );
}
