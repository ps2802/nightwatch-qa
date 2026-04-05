import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { AppShell } from "@/components/northstar/shell/app-shell";
import { NorthstarAppProvider } from "@/lib/northstar/context";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Northstar",
  description: "Board-first founder campaign workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <NorthstarAppProvider>
          <AppShell>{children}</AppShell>
        </NorthstarAppProvider>
      </body>
    </html>
  );
}
