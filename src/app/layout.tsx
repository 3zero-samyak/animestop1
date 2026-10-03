import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import AuthToastHost from "@/components/auth/AuthToastHost";
import { JourneyProvider } from "@/components/journey/JourneyProvider";
import { SavedItemsProvider } from "@/components/saved/SavedItemsProvider";
import GlobalJourney from "@/components/layout/GlobalJourney";
import { DISPLAY_MODE_COOKIE_KEY, ModeProvider } from "@/components/mode/ModeProvider";
import { AuthProvider } from "@/lib/AuthProvider";
import type { DisplayMode } from "@/types/displayMode";

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
  const initialMode = normalizeModeCookie(cookieStore.get(DISPLAY_MODE_COOKIE_KEY)?.value);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${dancingScript.variable}`}
      data-display-mode={initialMode}
    >
      <body>
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
