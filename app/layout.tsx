import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FEDDY STUDIO | Photography & Videography",
  description:
    "FEDDY STUDIO — professional photography and videography for portraits, graduations, weddings, baby bumps, events and commercial content.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "FEDDY STUDIO | Photography & Videography",
    description:
      "Professional studio and outdoor photography in Thika, Kenya.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-light antialiased">{children}</body>
    </html>
  );
}