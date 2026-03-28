import type { Metadata } from "next";
import { Barlow_Condensed, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

/**
 * TNS DIGITAL - Premium Storytelling Template
 * -----------------------------------------
 * This project serves as a high-end boilerplate for creating immersive,
 * scroll-based storytelling experiences. Created and maintained by TNS DIGITAL.
 */

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Premium Experience | TNS DIGITAL",
  description: "A cinematic scroll journey created by TNS DIGITAL",
  authors: [{ name: "TNS DIGITAL" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${barlowCondensed.variable}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              '@font-face{font-family:"Balenia";src:url("/polices/balenia/BaleniaDEMO-Regular.ttf") format("truetype");font-style:normal;font-weight:400;font-display:swap;}@font-face{font-family:"Balenia";src:url("/polices/balenia/BaleniaDEMO-Italic.ttf") format("truetype");font-style:italic;font-weight:400;font-display:swap;}',
          }}
        />
      </head>
      <body className="relative min-h-screen overflow-x-hidden bg-black text-white/90 antialiased">
        {/* Persistent Background - Dark Base */}
        <div className="fixed inset-0 z-[-1] bg-black">
           {/* Subtle Dark Gradient Mesh */}
           <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]" />
           
           {/* Texture Overlay */}
           <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_55%)] mix-blend-overlay pointer-events-none" />
        </div>
        
        {children}
      </body>
    </html>
  );
}
