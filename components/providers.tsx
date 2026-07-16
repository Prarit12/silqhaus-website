"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    });
    const listingsDefaults = { retry: false as const };
    client.setQueryDefaults(["guesty", "listings"], listingsDefaults);
    client.setQueryDefaults(["hostaway", "listings"], listingsDefaults);
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
