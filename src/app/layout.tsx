import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from "./providers";
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';
import LayoutWrapper from "@/components/myComponents/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Unsplash Clone | High Quality Wallpapers & Photos",
    template: "%s"
  },
  description: "A beautiful Unsplash clone built with Next.js, featuring a high-performance masonry grid and seamless photo discovery.",
  keywords: ["photography", "wallpapers", "free photos", "unsplash clone", "nextjs", "high quality images"],
  authors: [{ name: "Cursed Coder" }],
  creator: "Cursed Coder",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: "Unsplash Clone | High Quality Wallpapers & Photos",
    description: "A beautiful Unsplash clone built with Next.js",
    url: "/",
    siteName: "Unsplash Clone",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unsplash Clone",
    description: "High quality wallpapers & photos",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://plus.unsplash.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-0000000000000000'}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextTopLoader color="#000000" showSpinner={false} />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <SpeedInsights />
        </body>
      </Providers>
    </html>
  );
}