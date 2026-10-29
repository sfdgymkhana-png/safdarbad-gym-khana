import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://safdarbad-gymkhana.vercel.app"),
  title: "SAFDARBAD GYM KHAN’A | Strength • Discipline • Fitness",
  description:
    "Official website of Safdarbad Gym Khan’a located at Fatima Center, Top Floor, Main Bazar, City Safdarabad. Premier weight training, strength coaching, and fitness community. Monthly membership PKR 2,500.",
  keywords: [
    "Safdarbad Gym Khan'a",
    "Gym in Safdarabad",
    "Fitness Center Safdarabad",
    "Weight Training Safdarabad",
    "Fatima Center Gym",
    "Bodybuilding Safdarabad",
  ],
  authors: [{ name: "Safdarbad Gym Khan'a" }],
  openGraph: {
    title: "SAFDARBAD GYM KHAN’A | Build Your Strength",
    description:
      "Join the premier fitness facility in Safdarabad. State of the art equipment, strength coaching, and real discipline.",
    url: "https://safdarbad-gymkhana.vercel.app",
    siteName: "Safdarbad Gym Khan'a",
    images: [
      {
        url: "/images/logo.png",
        width: 1024,
        height: 1024,
        alt: "Safdarbad Gym Khan'a Logo",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

import StoreInitializer from "@/components/StoreInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${oswald.variable} ${inter.variable} antialiased bg-[#101010] text-white selection:bg-[#FF6B00] selection:text-white min-h-screen`}>
        <StoreInitializer />
        {children}
      </body>
    </html>
  );
}
