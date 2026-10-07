import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarShell from "../components/NavbarShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neta – Know Your Leader",
  description:
    "Citizen dashboard for MPs and MLAs with verified affidavits, live sentiment, and RTI impact.",
  metadataBase: new URL("https://neta.ink"),
  openGraph: {
    title: "Neta – Know Your Leader",
    description:
      "Search any MP or MLA, see verified criminal cases and assets, and track open complaints.",
    url: "https://neta.ink/",
    siteName: "Neta",
    images: [
      {
        url: "https://neta.ink/og-default.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neta – Know Your Leader",
    description:
      "Citizen dashboard for Indian politics with live intel, RTI workflows, and open data APIs.",
    images: ["https://neta.ink/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <NavbarShell />
        <main className="min-h-screen pt-20 lg:pt-24">{children}</main>
      </body>
    </html>
  );
}
