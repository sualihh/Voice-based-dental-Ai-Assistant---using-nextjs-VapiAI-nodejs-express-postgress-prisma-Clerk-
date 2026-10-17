import { SignUpButton } from "@clerk/nextjs";
import { CalendarIcon, MicIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-sky-50 pt-16 text-slate-900">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 hidden bg-cover bg-center md:block"
        style={{ backgroundImage: "url('/hulhero-desktop.png')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-white/95 via-white/80 to-transparent md:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-[position:74%_center] md:hidden"
        style={{ backgroundImage: "url('/hulux-hero-mobile.png')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white/90 via-white/65 to-white/20 md:hidden"
      />

      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 md:py-16">
        <div className="max-w-2xl">
          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            A healthier smile starts here.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-700 sm:text-lg">
            Get dental guidance and book a visit with a dentist, all in one
            place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <SignUpButton mode="modal" forceRedirectUrl="/pro">
              <Button size="lg">
                <MicIcon className="size-5" />
                Ask Hulux AI
              </Button>
            </SignUpButton>

            <Button size="lg" variant="outline" asChild>
              <Link href="/appointments">
                <CalendarIcon className="size-5" />
                Book a visit
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
