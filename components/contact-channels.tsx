"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { SiWhatsapp, SiWechat, SiLine } from "react-icons/si";

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@silqhaus.com";
const SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE || "+66 (0) 929490211";
const CONTACT_WHATSAPP =
  process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "+66 92 949 0211";
const CONTACT_LINE = process.env.NEXT_PUBLIC_CONTACT_LINE || "@Silqhaus";
const CONTACT_WECHAT = process.env.NEXT_PUBLIC_CONTACT_WECHAT || "silqhaus";

/** Add-friend link for a LINE id. Official Account handles (starting with "@")
 * use the OA path; a personal LINE id uses the `~` search path. */
const lineHref = (id: string) =>
  id.startsWith("http")
    ? id
    : id.startsWith("@")
      ? `https://line.me/R/ti/p/${encodeURIComponent(id)}`
      : `https://line.me/ti/p/~${id}`;

type Channel = {
  key: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  title: string;
  description: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
};

/**
 * The shared "reach us" list — phone, WhatsApp, LINE, WeChat, email, plus the
 * live-chat button. Channel labels come from the `contactChannels` namespace;
 * the phone and email rows are labelled by the calling page so the same list
 * can address guests or owners. LINE and WeChat show as "coming soon" until
 * their NEXT_PUBLIC_CONTACT_* ids are set.
 */
export default function ContactChannels({
  phoneTitle,
  phoneDescription,
  emailTitle,
  emailDescription,
  className = "",
}: {
  phoneTitle: string;
  phoneDescription: string;
  emailTitle: string;
  emailDescription: string;
  className?: string;
}) {
  const t = useTranslations("contactChannels");
  const [wechatCopied, setWechatCopied] = useState(false);

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_WECHAT);
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2500);
    } catch (err) {
      console.error("WeChat copy failed:", err);
    }
  };

  const talkToStaff = () => {
    const cw = (window as any).$chatwoot;
    if (cw && typeof cw.toggle === "function") {
      cw.toggle("open");
    } else {
      window.location.href = `mailto:${SUPPORT_EMAIL}`;
    }
  };

  const channels: Channel[] = [
    {
      key: "phone",
      href: `tel:${SUPPORT_PHONE.replace(/[^+\d]/g, "")}`,
      title: phoneTitle,
      description: phoneDescription,
      value: SUPPORT_PHONE,
      Icon: Phone,
    },
  ];

  if (CONTACT_WHATSAPP) {
    channels.push({
      key: "whatsapp",
      href: `https://wa.me/${CONTACT_WHATSAPP.replace(/[^0-9]/g, "")}`,
      external: true,
      title: t("whatsapp.title"),
      description: t("whatsapp.description"),
      value: CONTACT_WHATSAPP,
      Icon: SiWhatsapp,
    });
  }

  // LINE & WeChat always show — announced until their id lands in .env.
  channels.push(
    CONTACT_LINE
      ? {
          key: "line",
          href: lineHref(CONTACT_LINE),
          external: true,
          title: t("line.title"),
          description: t("line.description"),
          value: CONTACT_LINE.startsWith("http") ? "line.me" : CONTACT_LINE,
          Icon: SiLine,
        }
      : {
          key: "line",
          title: t("line.title"),
          description: t("line.description"),
          value: t("comingSoon"),
          Icon: SiLine,
        },
  );

  channels.push(
    CONTACT_WECHAT
      ? {
          key: "wechat",
          onClick: copyWechat,
          title: t("wechat.title"),
          description: t("wechat.description"),
          value: wechatCopied ? t("wechat.copied") : CONTACT_WECHAT,
          Icon: SiWechat,
        }
      : {
          key: "wechat",
          title: t("wechat.title"),
          description: t("wechat.description"),
          value: t("comingSoon"),
          Icon: SiWechat,
        },
  );

  channels.push({
    key: "email",
    href: `mailto:${SUPPORT_EMAIL}`,
    title: emailTitle,
    description: emailDescription,
    value: SUPPORT_EMAIL,
    Icon: Mail,
  });

  const rowClass =
    "group flex w-full items-start gap-3 border-t border-line py-3 text-left";

  const body = (c: Channel, live: boolean) => (
    <>
      <span
        className={`mt-0.5 inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-full border border-line transition-colors ${
          live
            ? "text-white/70 group-hover:border-white/40 group-hover:text-white"
            : "text-white/40"
        }`}
      >
        <c.Icon className="w-3.5 h-3.5" />
      </span>
      <span className="min-w-0">
        <span
          className={`block font-semibold text-sm tracking-tight ${
            live ? "text-white" : "text-white/70"
          }`}
        >
          {c.title}
        </span>
        <span className="block text-white/55 text-xs mt-0.5 leading-relaxed">
          {c.description}
        </span>
        <span
          className={`block text-[13px] mt-1 transition-colors ${
            live ? "text-white/85 group-hover:text-white" : "text-white/40 italic"
          }`}
        >
          {c.value}
        </span>
      </span>
    </>
  );

  return (
    <div className={`flex flex-1 flex-col ${className}`}>
      {channels.map((c) => {
        if (c.onClick) {
          return (
            <button
              key={c.key}
              type="button"
              onClick={c.onClick}
              className={rowClass}
            >
              {body(c, true)}
            </button>
          );
        }
        if (c.href) {
          return (
            <a
              key={c.key}
              href={c.href}
              {...(c.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={rowClass}
            >
              {body(c, true)}
            </a>
          );
        }
        // Announced but not yet connectable — no dead link.
        return (
          <div key={c.key} className={rowClass}>
            {body(c, false)}
          </div>
        );
      })}

      {/* mt-auto pins this to the bottom, level with the form panel */}
      <div className="border-t border-line pt-5 mt-auto">
        <button
          type="button"
          onClick={talkToStaff}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/40 text-white px-7 py-3 text-sm font-medium transition-colors hover:border-white hover:bg-white/10"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          {t("chatCta")}
        </button>
      </div>
    </div>
  );
}
