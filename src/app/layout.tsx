import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Lal Divane | Infinite Void Platform",
  description: "A premium, high-fidelity digital music experience built for the infinite digital abyss.",
  icons: {
    icon: "/lal-divane-avatar.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} antialiased bg-void-bg text-moonlit font-sans`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
