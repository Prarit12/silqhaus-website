"use client";

import Script from "next/script";

export default function ChatwootWidget() {
  const token = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;
  if (!token) return null;

  return (
    <Script
      src="https://app.chatwoot.com/packs/js/sdk.js"
      strategy="afterInteractive"
      onLoad={() => {
        (window as any).chatwootSDK.run({
          websiteToken: token,
          baseUrl: "https://app.chatwoot.com",
        });
      }}
    />
  );
}
