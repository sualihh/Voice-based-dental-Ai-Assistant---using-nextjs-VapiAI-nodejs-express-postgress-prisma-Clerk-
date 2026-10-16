import Image from "next/image";

function Footer() {
  return (
    <footer id="about" className="px-6 py-12 border-t bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="DentWise Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-semibold text-lg">Dent AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered dental assistant providing instant answers and personalized care guidance for all your oral health needs. Built for real people with real dental questions.
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
                <span>
                  FAQ
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span>
                  Help center
                </span>
              </li>
              <li>
                <span>
                  Contact us
                </span>
              </li>
              <li>
                <span>
                  Status
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span>
                  Privacy
                </span>
              </li>
              <li>
                <span>
                  Terms
                </span>
              </li>
              <li>
                <span>
                  Security
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 DentAI. Built for real people with real dental questions.</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;