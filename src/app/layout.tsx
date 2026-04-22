import type { Metadata } from "next";
import { Inter_Tight, Roboto_Mono } from "next/font/google";
import { Fraunces } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  axes: ["opsz"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "WireShield | Real estate cybercrime prevention",
  description:
    "AI-powered monitoring for every real estate transaction. Protect against wire fraud, phishing, impersonation, and BEC attacks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${fraunces.variable} ${robotoMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <AnalyticsProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
