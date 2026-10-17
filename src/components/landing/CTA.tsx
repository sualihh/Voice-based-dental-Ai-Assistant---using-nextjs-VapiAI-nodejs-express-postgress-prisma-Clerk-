import { SignUpButton } from "@clerk/nextjs";
import { CalendarIcon, MicIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function CTA() {
  return (
    <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-muted/10 via-background to-muted/5">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.03),transparent_70%)]"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full border border-primary/10">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-primary">
                  Ready When You Are
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Your dental health
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  journey starts here
                </span>
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Get started with dental guidance or book a visit with a dentist.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <SignUpButton mode="modal" forceRedirectUrl="/pro">
                <Button
                  size="lg"
                  className="px-6 py-3 font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  <MicIcon className="mr-2 h-4 w-4" />
                  Try Hulux AI
                </Button>
              </SignUpButton>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-6 py-3 font-semibold border border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 rounded-xl"
              >
                <Link href="/appointments">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Book appointment
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - CTA Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Image */}
              <div className="relative">
                {/* Subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl scale-110"></div>

                <Image
                  src="/cta.png"
                  alt="Hulux AI dental assistant"
                  width={300}
                  height={300}
                  className="relative w-80 h-auto drop-shadow-xl hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default CTA;
