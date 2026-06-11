import type { Metadata, Viewport } from "next";
import {
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Nunito_Sans,
  Bricolage_Grotesque,
  DM_Sans,
} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/src/components/auth-provider";
import { ThemeProvider } from "@/src/context/theme-context";
import { ToastProvider } from "@/src/components/ui/toast";
import { PlatformSettingsHydrator } from "@/src/components/settings/platform-settings-hydrator";
import { HelpChat } from "@/src/components/help-chat";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Uifry — Best Finance App",
  description: "Uifry — The best finance app on Playstore. Budget, expenses, and financial decisions made easy.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#001E2B" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} ${nunitoSans.variable} ${bricolageGrotesque.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('faas-theme')||'system';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';var raw=localStorage.getItem('faas-platform-settings');if(raw){var s=JSON.parse(raw).state;if(s&&s.accentColor){document.documentElement.classList.add('accent-'+s.accentColor);}if(s&&s.compactNav){document.documentElement.classList.add('compact-nav');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          <ToastProvider>
            <PlatformSettingsHydrator />
            <AuthProvider>
              {children}
              <HelpChat />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
