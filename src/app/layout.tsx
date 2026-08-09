import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalJourney from "@/components/layout/GlobalJourney";
import Script from 'next/script';
import { ModeProvider } from "@/components/mode/ModeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AnimeStop - Built by anime fans. For anime fans.",
  description: "Discover your next anime journey. Built by anime fans, for anime fans.",
  keywords: ["anime", "manga", "community", "stories", "otaku"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      data-display-mode="anime"
    >
      <head>
        <Script id="animestop-display-mode" strategy="beforeInteractive">
          {`(function() {
              try {
                var stored = localStorage.getItem('animestop-display-mode');
                var mode = (stored === 'manga' || stored === 'anime') ? stored : 'anime';
                document.documentElement.dataset.displayMode = mode;
              } catch (e) {
                document.documentElement.dataset.displayMode = 'anime';
              }
            })();`}
        </Script>
      </head>
      <body>
        <ModeProvider>
          {children}
          <GlobalJourney />
        </ModeProvider>
      </body>
    </html>
  );
}
