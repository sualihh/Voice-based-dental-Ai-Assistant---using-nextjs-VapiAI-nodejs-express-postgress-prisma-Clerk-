import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TanStackProvider from "@/components/providers/TanStackProvider";
import UserSync from "@/components/UserSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hulux AI - Your Dental Assistant",
  description:
    "Hulux AI helps you find dental guidance and book appointments with a dentist.",
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
            colorPrimary: "#1687bd",
            colorBackground: "#ffffff",
          },
        }}
      >
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <UserSync />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </TanStackProvider>
  );
}
