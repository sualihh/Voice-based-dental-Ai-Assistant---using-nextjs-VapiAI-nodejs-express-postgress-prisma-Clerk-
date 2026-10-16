import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import PricinSection from "@/components/landing/PricinSection";
import WhatToAsk from "@/components/landing/WhatToAsk";

export default async function Home() {
  const user = await currentUser();

  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <HowItWorks />
      <WhatToAsk />
      <PricinSection />
      <CTA />
      <Footer />
    </div>
  );
}
