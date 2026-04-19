import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Variable } from "lucide-react";
import UserSync from "@/components/UserSync";
import TanStackProvider from "@/components/providers/TanStackProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dental Wise AI - Your Dental Assistant",
  description:
    "Get instant answers to your dental questions with Dental Wise AI, your trusted dental assistant. Powered by advanced AI technology, Dental Wise AI provides accurate and reliable information to help you make informed decisions about your oral health. Whether you have questions about dental care, treatments, or oral hygiene, Dental Wise AI is here to assist you 24/7. Experience the future of dental care with Dental Wise AI today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanStackProvider>
      <ClerkProvider
        appearance={{
          variables: {
            colorPrimary: "#1da1f2",
            colorBackground: "#f3f4f6",
            colorText: "#111827",
            colorTextSecondary: "#6b7280",
            colorInputBackground: "#f3f4f6",
          },
        }}
      >
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
          >
            {/* <UserSync /> */}
            {children}
          </body>
        </html>
      </ClerkProvider>
    </TanStackProvider>
  );
}
