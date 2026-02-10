import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = "https://a-dchaser.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ADchaser | The TikTok Ad Spy Tool",
  description:
    "Save, organize, and analyze winning TikTok ads in seconds. The #1 tool for dropshippers and marketers.",
  openGraph: {
    title: "ADchaser | The TikTok Ad Spy Tool",
    description:
      "Save, organize, and analyze winning TikTok ads in seconds. The #1 tool for dropshippers and marketers.",
    url: siteUrl,
    siteName: "ADchaser",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADchaser | The TikTok Ad Spy Tool",
    description:
      "Save, organize, and analyze winning TikTok ads in seconds. The #1 tool for dropshippers and marketers.",
    creator: "@yourhandle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#10b981' }, // Emerald-500 to match our brand
        elements: {
          formButtonPrimary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
          card: 'bg-black/40 backdrop-blur-xl border border-white/10', // Glassmorphism!
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} antialiased`}
        >
          {children}
          <Toaster richColors position="bottom-center" />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
