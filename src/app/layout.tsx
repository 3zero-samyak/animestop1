import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, Dancing_Script, Bangers, Permanent_Marker } from "next/font/google";
import "./globals.css";
import "./visual-system.css";
import AuthToastHost from "@/components/auth/AuthToastHost";
import { JourneyProvider } from "@/components/journey/JourneyProvider";
import { SavedItemsProvider } from "@/components/saved/SavedItemsProvider";
import GlobalJourney from "@/components/layout/GlobalJourney";
import { ModeProvider } from "@/components/mode/ModeProvider";
import { AuthProvider } from "@/lib/AuthProvider";
import { type DisplayMode, DISPLAY_MODE_COOKIE_KEY } from "@/types/displayMode";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "AnimeStop - Built by anime fans. For anime fans.",
  description: "Discover your next anime journey. Built by anime fans, for anime fans.",
  keywords: ["anime", "manga", "community", "stories", "otaku"],
};

function normalizeModeCookie(value: string | undefined): DisplayMode {
  return value === 'manga' ? 'manga' : 'anime';
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(DISPLAY_MODE_COOKIE_KEY)?.value;
  const initialMode = normalizeModeCookie(rawCookie);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${dancingScript.variable} ${bangers.variable} ${permanentMarker.variable}`}
      data-display-mode={initialMode}
      data-mode={initialMode}
    >
      <body data-display-mode={initialMode} data-mode={initialMode}>
        <AuthProvider>
          <ModeProvider initialMode={initialMode}>
            <SavedItemsProvider>
              <JourneyProvider>
                <AuthToastHost />
                {children}
                <GlobalJourney />
              </JourneyProvider>
            </SavedItemsProvider>
          </ModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
