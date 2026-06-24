import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AWS Route 53 Console",
  description: "Manage DNS Records and Hosted Zones in a Route 53 Clone console.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#f2f3f3]`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
