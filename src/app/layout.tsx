import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Sidebar from "@/components/myComponents/Sidebar";
import { Suspense } from "react";
import Navbar from "@/components/myComponents/Navbar";
import BottomNav from "@/components/myComponents/BottomNav";
import { Providers } from "./providers";
import ToastContainer from "@/components/myComponents/Toast";
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
    template: "%s | Unsplash Clone"
  },
  description: "A beautiful Unsplash clone built with Next.js, featuring a high-performance masonry grid and seamless photo discovery.",
  keywords: ["photography", "wallpapers", "free photos", "unsplash clone", "nextjs", "high quality images"],
  authors: [{ name: "Cursed Coder" }],
  creator: "Cursed Coder",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex min-h-screen bg-white">
            {/* Sidebar - Hidden on small screens (handled in Sidebar component too) */}
            <div className="hidden lg:block lg:w-16 fixed left-0 top-0 h-full z-50">
              <Sidebar />
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 w-full lg:pl-16">
              <Suspense fallback={<div className="h-16 animate-pulse bg-gray-100"></div>}>
                <Navbar />
              </Suspense>

              <main className="flex-1 mt-[110px] md:mt-[120px] pb-20 lg:pb-0">
                {children}
              </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav />

            <ToastContainer />
            
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/sw.js').then(function(registration) {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                      }, function(err) {
                        console.log('ServiceWorker registration failed: ', err);
                      });
                    });
                  }
                `,
              }}
            />
          </div>
          <SpeedInsights />
        </body>
      </Providers>
    </html>
  );
}