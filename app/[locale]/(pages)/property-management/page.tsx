"use client";
import { useState, useEffect, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Home,
  TrendingUp,
  Shield,
  Clock,
  Users,
  Camera,
  Calendar,
  Headphones,
  ChevronRight,
  CheckCircle,
  Star,
  BarChart3,
  MapPin,
  Percent,
  Loader2,
  Settings,
  Sparkles,
  ClipboardCheck,
  Eye,
  X,
} from "lucide-react";
import { SiAirbnb } from "react-icons/si";
import {
  COUNTRY_CODES,
  getCodeFromValue,
  DEFAULT_COUNTRY_VALUE,
} from "@/lib/country-codes";
import Image from "next/image";
import { useTranslations } from "next-intl";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

export default function PropertyManagement() {
  const t = useTranslations("propertyManagement");
  const tw = useTranslations("whyOwners");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: DEFAULT_COUNTRY_VALUE,
    phone: "",
    propertyLocation: "",
    propertyType: "",
    message: "",
    preferredContactMethod: "",
    contactAddress: "",
    contactAddressCountryCode: DEFAULT_COUNTRY_VALUE,
    preferredContactTime: "",
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

  useEffect(() => {
    if (formData.preferredContactMethod === "email" && formData.email) {
      setFormData((prev) => ({ ...prev, contactAddress: prev.email }));
    } else if (formData.preferredContactMethod === "phone" && formData.phone) {
      setFormData((prev) => ({
        ...prev,
        contactAddress: prev.phone,
        contactAddressCountryCode: prev.countryCode,
      }));
    }
  }, [
    formData.preferredContactMethod,
    formData.email,
    formData.phone,
    formData.countryCode,
  ]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9\s\-]{6,15}$/;
    return phone === "" || phoneRegex.test(phone);
  };

  const CONTACT_METHODS = [
    { value: "email", label: t("contact.form.contactMethods.email") },
    { value: "phone", label: t("contact.form.contactMethods.phone") },
    { value: "whatsapp", label: t("contact.form.contactMethods.whatsapp") },
    { value: "line", label: t("contact.form.contactMethods.line") },
    { value: "wechat", label: t("contact.form.contactMethods.wechat") },
  ];

  const CONTACT_TIMES = [
    { value: "morning", label: t("contact.form.contactTimes.morning") },
    { value: "afternoon", label: t("contact.form.contactTimes.afternoon") },
    { value: "evening", label: t("contact.form.contactTimes.evening") },
    { value: "anytime", label: t("contact.form.contactTimes.anytime") },
  ];

  const getContactPlaceholder = () => {
    switch (formData.preferredContactMethod) {
      case "email":
        return t("contact.form.contactPlaceholders.email");
      case "phone":
        return t("contact.form.contactPlaceholders.phone");
      case "whatsapp":
        return t("contact.form.contactPlaceholders.whatsapp");
      case "line":
        return t("contact.form.contactPlaceholders.line");
      case "wechat":
        return t("contact.form.contactPlaceholders.wechat");
      default:
        return t("contact.form.contactPlaceholders.default");
    }
  };

  const getContactLabel = () => {
    switch (formData.preferredContactMethod) {
      case "email":
        return t("contact.form.contactLabels.email");
      case "phone":
        return t("contact.form.contactLabels.phone");
      case "whatsapp":
        return t("contact.form.contactLabels.whatsapp");
      case "line":
        return t("contact.form.contactLabels.line");
      case "wechat":
        return t("contact.form.contactLabels.wechat");
      default:
        return t("contact.form.contactLabels.default");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { email?: string; phone?: string } = {};
    if (!validateEmail(formData.email))
      newErrors.email = t("contact.validation.invalidEmail");
    if (!validatePhone(formData.phone))
      newErrors.phone = t("contact.validation.invalidPhone");
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const dialCode = getCodeFromValue(formData.countryCode);
    const fullPhone = formData.phone
      ? `${dialCode} ${formData.phone}`
      : "Not provided";
    const contactMethodLabel =
      CONTACT_METHODS.find((m) => m.value === formData.preferredContactMethod)
        ?.label || "Not specified";
    const contactTimeLabel =
      CONTACT_TIMES.find((ct) => ct.value === formData.preferredContactTime)
        ?.label || "Not specified";
    const contactAddressDialCode = getCodeFromValue(
      formData.contactAddressCountryCode,
    );
    const contactAddressFull =
      (formData.preferredContactMethod === "phone" ||
        formData.preferredContactMethod === "whatsapp") &&
      formData.contactAddress
        ? `${contactAddressDialCode} ${formData.contactAddress}`
        : formData.contactAddress || "Not provided";

    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: fullPhone,
      location: formData.propertyLocation,
      type: formData.propertyType || "Not specified",
      description: formData.message || "No additional details provided",
      preferred_contact_method: contactMethodLabel,
      contact_address: contactAddressFull,
      preferred_contact_time: contactTimeLabel,
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
        (window as any).fbq(
          "trackCustom",
          "PropertyManagementLeadFormSubmission",
        );
      }
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        countryCode: DEFAULT_COUNTRY_VALUE,
        phone: "",
        propertyLocation: "",
        propertyType: "",
        message: "",
        preferredContactMethod: "",
        contactAddress: "",
        contactAddressCountryCode: DEFAULT_COUNTRY_VALUE,
        preferredContactTime: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: Camera,
      title: t("services.items.photography.title"),
      description: t("services.items.photography.description"),
    },
    {
      icon: TrendingUp,
      title: t("services.items.pricing.title"),
      description: t("services.items.pricing.description"),
    },
    {
      icon: Calendar,
      title: t("services.items.booking.title"),
      description: t("services.items.booking.description"),
    },
    {
      icon: Users,
      title: t("services.items.guestCommunication.title"),
      description: t("services.items.guestCommunication.description"),
    },
    {
      icon: Home,
      title: t("services.items.maintenance.title"),
      description: t("services.items.maintenance.description"),
    },
    {
      icon: Shield,
      title: t("services.items.compliance.title"),
      description: t("services.items.compliance.description"),
    },
  ];

  const benefits = [
    {
      stat: t("stats.revenueIncrease.stat"),
      label: t("stats.revenueIncrease.label"),
      description: t("stats.revenueIncrease.description"),
    },
    {
      stat: t("stats.guestRating.stat"),
      label: t("stats.guestRating.label"),
      description: t("stats.guestRating.description"),
    },
    {
      stat: t("stats.occupancyRate.stat"),
      label: t("stats.occupancyRate.label"),
      description: t("stats.occupancyRate.description"),
    },
    {
      stat: t("stats.support.stat"),
      label: t("stats.support.label"),
      description: t("stats.support.description"),
    },
  ];

  const testimonials = [
    {
      name: t("testimonials.items.testimonial1.name"),
      property: t("testimonials.items.testimonial1.property"),
      quote: t("testimonials.items.testimonial1.quote"),
      rating: 5,
    },
    {
      name: t("testimonials.items.testimonial2.name"),
      property: t("testimonials.items.testimonial2.property"),
      quote: t("testimonials.items.testimonial2.quote"),
      rating: 5,
    },
    {
      name: t("testimonials.items.testimonial3.name"),
      property: t("testimonials.items.testimonial3.property"),
      quote: t("testimonials.items.testimonial3.quote"),
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: t("faq.items.faq1.question"),
      answer: t("faq.items.faq1.answer"),
    },
    {
      question: t("faq.items.faq2.question"),
      answer: t("faq.items.faq2.answer"),
    },
    {
      question: t("faq.items.faq3.question"),
      answer: t("faq.items.faq3.answer"),
    },
    {
      question: t("faq.items.faq4.question"),
      answer: t("faq.items.faq4.answer"),
    },
    {
      question: t("faq.items.faq5.question"),
      answer: t("faq.items.faq5.answer"),
    },
    {
      question: t("faq.items.faq6.question"),
      answer: t("faq.items.faq6.answer"),
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-[#0a0a0a]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/property-management/hero-2026.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <p className="text-[#ffffff] text-sm font-poppins tracking-[0.3em] uppercase mb-6">
              {t("hero.subtitle")}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-gilroy font-bold text-white mb-8 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-xl text-white/80 font-poppins leading-relaxed mb-10">
              {t("hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-white text-ink hover:bg-white/90 font-poppins px-8 py-6 text-lg"
                onClick={() =>
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {t("hero.ctaPrimary")}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-white/40 text-white hover:bg-white hover:text-ink font-poppins px-8 py-6 text-lg"
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {t("hero.ctaSecondary")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-gilroy font-bold text-[#ffffff] mb-2">
                  {benefit.stat}
                </p>
                <p className="text-white font-poppins font-semibold mb-1">
                  {benefit.label}
                </p>
                <p className="text-white/60 font-poppins text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#ffffff] text-sm font-poppins tracking-[0.3em] uppercase mb-4">
              {t("platforms.subtitle")}
            </p>
            <h2 className="text-3xl md:text-4xl font-gilroy font-bold text-white mb-6">
              {t("platforms.title")}
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto font-poppins leading-relaxed">
              {t("platforms.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center max-w-4xl mx-auto">
            <div className="bg-[#0a0a0a] rounded-xl p-8 text-center border border-[#ffffff]/20 hover:border-[#ffffff]/50 transition-colors">
              <SiAirbnb className="w-16 h-16 text-[#FF5A5F] mx-auto mb-4" />
              <h3 className="text-white font-gilroy font-bold text-lg">
                Airbnb
              </h3>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-8 text-center border border-[#ffffff]/20 hover:border-[#ffffff]/50 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-[#3D67A6] font-bold text-2xl">Vrbo</span>
              </div>
              <h3 className="text-white font-gilroy font-bold text-lg">Vrbo</h3>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-8 text-center border border-[#ffffff]/20 hover:border-[#ffffff]/50 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-[#003580] font-bold text-lg">
                  Booking<span className="text-[#003580]">.com</span>
                </span>
              </div>
              <h3 className="text-white font-gilroy font-bold text-lg">
                Booking.com
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* Why Choose Silqhaus — Alternating Image+Text Sections      */}
      {/* (Replaces the original "Why Choose Us" card-based section) */}
      {/* ========================================================== */}

      {/* Section 1: Operations Philosophy — image LEFT */}
      <section className="py-20 lg:py-28 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src={tw("hardTruth.image")}
                alt={tw("hardTruth.title")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={80}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#ffffff]/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-[#ffffff]" />
                </div>
                <p className="text-[#ffffff] text-xs font-poppins tracking-[0.3em] uppercase">
                  {tw("hardTruth.subtitle")}
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-gilroy font-bold text-white mb-6">
                {tw("hardTruth.title")}
              </h2>
              <p className="text-white/70 font-poppins leading-relaxed mb-6">
                {tw("hardTruth.description")}
              </p>
              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    {i < 2 ? (
                      <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-[#ffffff] flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-white/80 font-poppins text-sm leading-relaxed">
                      {tw(`hardTruth.points.${i}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: In-House Housekeeping — image RIGHT */}
      <section className="py-20 lg:py-28 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="lg:order-2 relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src={tw("housekeeping.image")}
                alt={tw("housekeeping.title")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={80}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
            </div>
            <div className="lg:order-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#ffffff]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#ffffff]" />
                </div>
                <p className="text-[#ffffff] text-xs font-poppins tracking-[0.3em] uppercase">
                  {tw("housekeeping.subtitle")}
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-gilroy font-bold text-white mb-4">
                {tw("housekeeping.title")}
              </h2>
              <p className="text-white/70 font-poppins leading-relaxed mb-6">
                {tw("housekeeping.description")}
              </p>
              <div className="space-y-6">
                <div>
                  <p className="text-white/50 font-poppins text-xs uppercase tracking-wider mb-3">
                    {tw("housekeeping.outsourcedProblems.title")}
                  </p>
                  <div className="space-y-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex items-start gap-3">
                        <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/60 font-poppins text-sm">
                          {tw(`housekeeping.outsourcedProblems.items.${i}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/50 font-poppins text-xs uppercase tracking-wider mb-3">
                    {tw("housekeeping.ourModel.title")}
                  </p>
                  <div className="space-y-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-[#ffffff] flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 font-poppins text-sm">
                          {tw(`housekeeping.ourModel.items.${i}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: AI Quality Control — image LEFT */}
      <section className="py-20 lg:py-28 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src={tw("aiQuality.image")}
                alt={tw("aiQuality.title")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={80}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/60 to-transparent" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#ffffff]/10 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-[#ffffff]" />
                </div>
                <p className="text-[#ffffff] text-xs font-poppins tracking-[0.3em] uppercase">
                  {tw("aiQuality.subtitle")}
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-gilroy font-bold text-white mb-4">
                {tw("aiQuality.title")}
              </h2>
              <p className="text-white/70 font-poppins leading-relaxed mb-6">
                {tw("aiQuality.description")}
              </p>
              <div className="space-y-3 mb-6">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#ffffff] flex-shrink-0 mt-0.5" />
                    <p className="text-white/80 font-poppins text-sm leading-relaxed">
                      {tw(`aiQuality.features.${i}`)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#ffffff]/20">
                <p className="text-[#ffffff] font-poppins font-semibold text-sm">
                  {tw("aiQuality.conclusion")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Real-Time Owner Visibility — image RIGHT */}
      <section className="py-20 lg:py-28 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="lg:order-2 relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src={tw("realTimeVisibility.image")}
                alt={tw("realTimeVisibility.title")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={80}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
            </div>
            <div className="lg:order-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#ffffff]/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#ffffff]" />
                </div>
                <p className="text-[#ffffff] text-xs font-poppins tracking-[0.3em] uppercase">
                  {tw("realTimeVisibility.subtitle")}
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-gilroy font-bold text-white mb-4">
                {tw("realTimeVisibility.title")}
              </h2>
              <p className="text-white/70 font-poppins leading-relaxed mb-6">
                {tw("realTimeVisibility.description")}
              </p>
              <div className="space-y-3 mb-6">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#ffffff] flex-shrink-0 mt-0.5" />
                    <p className="text-white/80 font-poppins text-sm leading-relaxed">
                      {tw(`realTimeVisibility.features.${i}`)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-[#141414] rounded-xl p-4 border border-[#ffffff]/20">
                <p className="text-[#ffffff] font-poppins font-semibold text-sm">
                  {tw("realTimeVisibility.conclusion")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#ffffff] text-sm font-poppins tracking-[0.3em] uppercase mb-4">
              {t("services.subtitle")}
            </p>
            <h2 className="text-4xl font-gilroy font-bold text-white mb-6">
              {t("services.title")}
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto font-poppins leading-relaxed">
              {t("services.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-[#141414] rounded-xl p-8 border border-[#ffffff]/20 hover:border-[#ffffff]/50 transition-colors"
              >
                <service.icon className="w-12 h-12 text-[#ffffff] mb-6" />
                <h3 className="text-white font-gilroy font-bold text-xl mb-3">
                  {service.title}
                </h3>
                <p className="text-white/70 font-poppins leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#ffffff] text-sm font-poppins tracking-[0.3em] uppercase mb-4">
              {t("howItWorks.subtitle")}
            </p>
            <h2 className="text-4xl font-gilroy font-bold text-white mb-6">
              {t("howItWorks.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: t("howItWorks.steps.step1.step"),
                title: t("howItWorks.steps.step1.title"),
                description: t("howItWorks.steps.step1.description"),
              },
              {
                step: t("howItWorks.steps.step2.step"),
                title: t("howItWorks.steps.step2.title"),
                description: t("howItWorks.steps.step2.description"),
              },
              {
                step: t("howItWorks.steps.step3.step"),
                title: t("howItWorks.steps.step3.title"),
                description: t("howItWorks.steps.step3.description"),
              },
              {
                step: t("howItWorks.steps.step4.step"),
                title: t("howItWorks.steps.step4.title"),
                description: t("howItWorks.steps.step4.description"),
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-white text-ink flex items-center justify-center mx-auto mb-6">
                  <span className="font-gilroy font-bold text-xl">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-white font-gilroy font-bold text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-white/70 font-poppins">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[#ffffff] text-sm font-poppins tracking-[0.3em] uppercase mb-4">
                {t("contact.subtitle")}
              </p>
              <h2 className="text-4xl font-gilroy font-bold text-white mb-6">
                {t("contact.title")}
              </h2>
              <p className="text-white/70 font-poppins leading-relaxed mb-8">
                {t("contact.description")}
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#ffffff]/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#ffffff]" />
                  </div>
                  <div>
                    <p className="text-white font-poppins font-semibold">
                      {t("contact.benefits.quickResponse.title")}
                    </p>
                    <p className="text-white/60 font-poppins text-sm">
                      {t("contact.benefits.quickResponse.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#ffffff]/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#ffffff]" />
                  </div>
                  <div>
                    <p className="text-white font-poppins font-semibold">
                      {t("contact.benefits.noObligation.title")}
                    </p>
                    <p className="text-white/60 font-poppins text-sm">
                      {t("contact.benefits.noObligation.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#ffffff]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#ffffff]" />
                  </div>
                  <div>
                    <p className="text-white font-poppins font-semibold">
                      {t("contact.benefits.expertAdvice.title")}
                    </p>
                    <p className="text-white/60 font-poppins text-sm">
                      {t("contact.benefits.expertAdvice.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] rounded-xl p-8 border border-[#ffffff]/20">
              <h3 className="text-2xl font-gilroy font-bold text-white mb-6">
                {t("contact.form.title")}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-poppins text-sm mb-2">
                      {t("contact.form.labels.fullName")}
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-[#0a0a0a] border-[#ffffff]/30 text-white focus:border-[#ffffff] placeholder:text-white/40"
                      placeholder={t("contact.form.placeholders.fullName")}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-poppins text-sm mb-2">
                      {t("contact.form.labels.email")}
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, email: value });
                        if (value && !validateEmail(value)) {
                          setErrors((prev) => ({
                            ...prev,
                            email: t("contact.validation.invalidEmail"),
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
                            email: t("contact.validation.invalidEmail"),
                          }));
                        }
                      }}
                      className={`bg-[#0a0a0a] border-[#ffffff]/30 text-white focus:border-[#ffffff] placeholder:text-white/40 ${errors.email ? "border-red-500" : ""}`}
                      placeholder={t("contact.form.placeholders.email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1 font-poppins">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-poppins text-sm mb-2">
                      {t("contact.form.labels.phone")}
                    </label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.countryCode}
                        onValueChange={(value) =>
                          setFormData({ ...formData, countryCode: value })
                        }
                      >
                        <SelectTrigger className="w-[120px] bg-[#0a0a0a] border-[#ffffff]/30 text-white">
                          <SelectValue placeholder="+66" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#141414] border-[#ffffff]/30">
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
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone)
                            setErrors((prev) => ({
                              ...prev,
                              phone: undefined,
                            }));
                        }}
                        className={`flex-1 bg-[#0a0a0a] border-[#ffffff]/30 text-white focus:border-[#ffffff] placeholder:text-white/40 ${errors.phone ? "border-red-500" : ""}`}
                        placeholder={t("contact.form.placeholders.phone")}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1 font-poppins">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white font-poppins text-sm mb-2">
                      {t("contact.form.labels.propertyLocation")}
                    </label>
                    <Input
                      type="text"
                      required
                      value={formData.propertyLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyLocation: e.target.value,
                        })
                      }
                      className="bg-[#0a0a0a] border-[#ffffff]/30 text-white focus:border-[#ffffff] placeholder:text-white/40"
                      placeholder={t(
                        "contact.form.placeholders.propertyLocation",
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white font-poppins text-sm mb-2">
                    {t("contact.form.labels.propertyType")}
                  </label>
                  <Input
                    type="text"
                    value={formData.propertyType}
                    onChange={(e) =>
                      setFormData({ ...formData, propertyType: e.target.value })
                    }
                    className="bg-[#0a0a0a] border-[#ffffff]/30 text-white focus:border-[#ffffff] placeholder:text-white/40"
                    placeholder={t("contact.form.placeholders.propertyType")}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-poppins text-sm mb-2">
                      {t("contact.form.labels.preferredContactMethod")}
                    </label>
                    <Select
                      value={formData.preferredContactMethod}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          preferredContactMethod: value,
                          contactAddress: "",
                        })
                      }
                    >
                      <SelectTrigger className="bg-[#0a0a0a] border-[#ffffff]/30 text-white">
                        <SelectValue
                          placeholder={t(
                            "contact.form.placeholders.contactMethod",
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-[#141414] border-[#ffffff]/30">
                        {CONTACT_METHODS.map((method) => (
                          <SelectItem
                            key={method.value}
                            value={method.value}
                            className="text-white hover:bg-[#ffffff]/20"
                          >
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-white font-poppins text-sm mb-2">
                      {getContactLabel()}
                    </label>
                    {formData.preferredContactMethod === "phone" ||
                    formData.preferredContactMethod === "whatsapp" ? (
                      <div className="flex gap-2">
                        <Select
                          value={formData.contactAddressCountryCode}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              contactAddressCountryCode: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-[120px] bg-[#0a0a0a] border-[#ffffff]/30 text-white">
                            <SelectValue placeholder="+66" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#141414] border-[#ffffff]/30">
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
                          type="text"
                          value={formData.contactAddress}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contactAddress: e.target.value,
                            })
                          }
                          className="flex-1 bg-[#0a0a0a] border-[#ffffff]/30 text-white focus:border-[#ffffff] placeholder:text-white/40"
                          placeholder={getContactPlaceholder()}
                        />
                      </div>
                    ) : (
                      <Input
                        type="text"
                        value={formData.contactAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactAddress: e.target.value,
                          })
                        }
                        className="bg-[#0a0a0a] border-[#ffffff]/30 text-white focus:border-[#ffffff] placeholder:text-white/40"
                        placeholder={getContactPlaceholder()}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-white font-poppins text-sm mb-2">
                    {t("contact.form.labels.preferredContactTime")}
                  </label>
                  <Select
                    value={formData.preferredContactTime}
                    onValueChange={(value) =>
                      setFormData({ ...formData, preferredContactTime: value })
                    }
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[#ffffff]/30 text-white">
                      <SelectValue
                        placeholder={t("contact.form.placeholders.contactTime")}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-[#141414] border-[#ffffff]/30">
                      {CONTACT_TIMES.map((time) => (
                        <SelectItem
                          key={time.value}
                          value={time.value}
                          className="text-white hover:bg-[#ffffff]/20"
                        >
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-white font-poppins text-sm mb-2">
                    {t("contact.form.labels.tellUsAboutProperty")}
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-[#0a0a0a] border-[#ffffff]/30 text-white focus:border-[#ffffff] placeholder:text-white/40 min-h-[120px]"
                    placeholder={t(
                      "contact.form.placeholders.propertyDescription",
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-ink hover:bg-white/90 font-poppins py-6 text-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t("contact.form.submitting")}
                    </>
                  ) : (
                    <>
                      {t("contact.form.submitButton")}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                {submitStatus === "success" && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                    <p className="text-green-400 font-poppins">
                      {t("contact.form.successMessage")}
                    </p>
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
                    <p className="text-red-400 font-poppins">
                      {t("contact.form.errorMessage")}
                    </p>
                  </div>
                )}
                <p className="text-white/50 font-poppins text-xs text-center">
                  {t("contact.form.privacyNotice")}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#ffffff] text-sm font-poppins tracking-[0.3em] uppercase mb-4">
              {t("testimonials.subtitle")}
            </p>
            <h2 className="text-4xl font-gilroy font-bold text-white mb-6">
              {t("testimonials.title")}
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto font-poppins leading-relaxed">
              {t("testimonials.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#0a0a0a] rounded-xl p-8 border border-[#ffffff]/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-[#ffffff] fill-[#ffffff]"
                    />
                  ))}
                </div>
                <p className="text-white/80 font-poppins leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-white font-gilroy font-bold">
                    {testimonial.name}
                  </p>
                  <p className="text-white/60 font-poppins text-sm">
                    {testimonial.property}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#ffffff] text-sm font-poppins tracking-[0.3em] uppercase mb-4">
              {t("faq.subtitle")}
            </p>
            <h2 className="text-4xl font-gilroy font-bold text-white mb-6">
              {t("faq.title")}
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#141414] rounded-lg border border-[#ffffff]/20 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#ffffff]/10 transition-colors"
                >
                  <span className="text-white font-poppins font-medium">
                    {faq.question}
                  </span>
                  <ChevronRight
                    className={`w-5 h-5 text-[#ffffff] transform transition-transform ${openFaq === index ? "rotate-90" : ""}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-white/70 font-poppins leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
