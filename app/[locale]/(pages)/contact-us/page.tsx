"use client";
import { useState, useEffect, type FormEvent } from "react";
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
import { Phone, Mail, Users, Send, Loader2 } from "lucide-react";
import {
  COUNTRY_CODES,
  getCodeFromValue,
  DEFAULT_COUNTRY_VALUE,
} from "@/lib/country-codes";
import { useTranslations } from "next-intl";

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@silqhaus.com";
const SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE || "+66 (0) 929490211";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID_SDR || "";
const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_SDR || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY_SDR || "";

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
    <main className="min-h-screen bg-[#0a0a0a]">
      <section className="relative bg-gradient-to-br from-[#ffffff] to-[#a3894a] text-[#0a0a0a] pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-[#0a0a0a]/20 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-[#0a0a0a]" />
            </div>
            <p className="text-[#0a0a0a] text-sm font-poppins font-light tracking-[0.3em] uppercase mb-4">
              {t("hero.subtitle")}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-gilroy font-bold mb-6 leading-tight tracking-wide">
              {t("hero.title")}
            </h1>
            <p className="text-[#0a0a0a]/90 max-w-3xl mx-auto font-poppins font-light text-lg sm:text-xl leading-snug mb-8">
              {t("hero.description")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card
            id="inquiry-form"
            className="bg-[#141414] border border-white/10 shadow-lg"
          >
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#ffffff] rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0a0a0a]" />
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
              <form onSubmit={handleGuestSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="guest-name"
                      className="font-poppins font-medium text-white"
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
                      className="font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#ffffff] text-white placeholder:text-white/40"
                      placeholder={t("form.placeholders.fullName")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="guest-email"
                      className="font-poppins font-medium text-white"
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
                      className={`font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#ffffff] text-white placeholder:text-white/40 ${errors.email ? "border-red-500" : ""}`}
                      placeholder={t("form.placeholders.email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1 font-poppins">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="guest-phone"
                    className="font-poppins font-medium text-white"
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
                      <SelectTrigger className="w-[140px] font-poppins bg-[#1a1a1a] border-white/20 text-white">
                        <SelectValue placeholder="+66" />
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
                      className={`flex-1 font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#ffffff] text-white placeholder:text-white/40 ${errors.phone ? "border-red-500" : ""}`}
                      placeholder={t("form.placeholders.phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1 font-poppins">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="guest-message"
                    className="font-poppins font-medium text-white"
                  >
                    {t("form.labels.message")}
                  </Label>
                  <Textarea
                    id="guest-message"
                    value={guestForm.message}
                    onChange={(e) =>
                      setGuestForm({ ...guestForm, message: e.target.value })
                    }
                    required
                    maxLength={MAX_MESSAGE_CHARS}
                    placeholder={t("form.placeholders.message")}
                    className="min-h-[120px] font-poppins bg-[#1a1a1a] border-white/20 focus:border-[#ffffff] text-white placeholder:text-white/40"
                  />
                </div>
                <div className="text-right text-white/60 text-xs font-poppins">
                  {guestForm.message.length}/{MAX_MESSAGE_CHARS}
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
                    className="w-full sm:w-auto bg-[#ffffff] text-white hover:bg-[#6d5820] px-8 py-4 rounded-md text-base font-poppins font-medium tracking-wide transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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

      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white mb-6 tracking-wide font-gilroy font-bold leading-tight">
              {t("guestServices.title")}
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto font-poppins font-light text-lg leading-snug">
              {t("guestServices.description")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-24 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#ffffff] rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-[#0a0a0a]" />
              </div>
              <h3 className="font-poppins font-semibold text-white text-lg mb-2">
                {t("guestServices.hotline.title")}
              </h3>
              <p className="text-white/70 font-poppins font-light text-sm mb-4">
                {t("guestServices.hotline.description")}
              </p>
              <div className="text-white font-poppins font-medium">
                <div>{SUPPORT_PHONE}</div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#ffffff] rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-[#0a0a0a]" />
              </div>
              <h3 className="font-poppins font-semibold text-white text-lg mb-2">
                {t("guestServices.email.title")}
              </h3>
              <p className="text-white/70 font-poppins font-light text-sm mb-4">
                {t("guestServices.email.description")}
              </p>
              <div className="text-white font-poppins font-medium">
                <div>{SUPPORT_EMAIL}</div>
                <div className="text-sm text-white/60 mt-1">
                  {t("guestServices.email.note")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
