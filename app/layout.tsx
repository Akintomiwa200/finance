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
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} ${nunitoSans.variable} ${bricolageGrotesque.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full"><AuthProvider>
          {children}
          <HelpChat />
        </AuthProvider></body>
    </html>
  );
}
