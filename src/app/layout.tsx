import type { Metadata } from "next";
import { Imbue, Victor_Mono } from "next/font/google";
import "./globals.css";
import DynamicBackground from "@/components/DynamicBackground";

const imbue = Imbue({
  variable: "--font-imbue",
  subsets: ["latin"],
  weight: ["100", "400", "700", "900"],
});

const victorMono = Victor_Mono({
  variable: "--font-victor-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "HH Goa 2026 | Frame Generator",
  description: "Generate your personalized Hacker House Goa 2026 frame or builder ID card.",
  openGraph: {
    title: "HH Goa 2026 Frame Generator",
    description: "I'm ready for Hacker House Goa 2026! Generate your personalized frame or builder ID card.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "HH Goa 2026" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${imbue.variable} ${victorMono.variable} antialiased h-full`}
    >
      <body className="relative min-h-full flex flex-col bg-brand-bg text-black font-mono selection:bg-brand-neon selection:text-black">
        <DynamicBackground />
        {children}
      </body>
    </html>
  );
}
