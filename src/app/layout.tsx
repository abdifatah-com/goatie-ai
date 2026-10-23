import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "./analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const description =
  "Goatie AI — Intelligence designed to evolve. Build applications that reason, adapt, and collaborate.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.openui.com"),
  title: "Goatie AI — Intelligence Designed To Evolve",
  description,
  icons: {
    icon: "/shiro-face.svg",
    shortcut: "/shiro-face.svg",
    apple: "/shiro-face.svg",
  },
  openGraph: { title: "Goatie AI", description, siteName: "Goatie AI", type: "website" },
  twitter: { card: "summary_large_image", title: "Goatie AI", description },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
