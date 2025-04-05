import { Toaster } from "@/components/ui/sonner";
import { font } from "@/lib/client/styles/fonts/font";
import { cn } from "@cn";
import "@/lib/client/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { Router } from "next/router";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST!,
      person_profiles: "identified_only",
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();
      },
    });

    const handleRouteChange = () => posthog?.capture("$pageview");

    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <main className={cn("bg-background h-full w-full", font.className)}>
          <Component {...pageProps} />
          <Toaster position="top-center" />
        </main>
      </QueryClientProvider>
    </PostHogProvider>
  );
}
