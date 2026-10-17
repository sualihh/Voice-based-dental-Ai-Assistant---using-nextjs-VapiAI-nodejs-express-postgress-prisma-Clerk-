import Image from "next/image";

function Footer() {
  return (
    <footer
      id="about"
      className="relative isolate overflow-hidden px-6 py-12 border-t"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-[position:75%_center]"
        style={{ backgroundImage: "url('/hulux-about-background.png')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-white/95 via-white/80 to-white/45"
      />
      <div className="relative max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Hulux AI logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-semibold text-lg">Hulux AI</span>
            </div>
            <h2 className="text-xl font-semibold">About Hulux AI</h2>
            <p className="text-sm text-muted-foreground">
              Hulux AI helps you find dental guidance and book appointments with
              a dentist.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/#how-it-works" className="hover:text-foreground">
                  How it works
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/voice" className="hover:text-foreground">
                  Try Hulux AI
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Appointments</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/appointments" className="hover:text-foreground">
                  Book a visit
                </a>
              </li>
              <li>
                <a href="/appointments" className="hover:text-foreground">
                  Manage appointments
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Hulux AI.</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
