import { Link } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const { settings } = useSettings();

  const foundationName =
    settings["foundation_name"]?.value || "Shaffii Chemasuet Foundation";
  const foundationEmail = settings["foundation_email"]?.value || "[FOUNDATION EMAIL]";
  const foundationPhone = settings["foundation_phone"]?.value || "[FOUNDATION PHONE]";
  const foundationAddress = settings["foundation_address"]?.value || "[FOUNDATION ADDRESS]";
  const footerText = settings["footer_text"]?.value || "[FOOTER TEXT]";

  const year = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
    { name: "News", href: "/news" },
    { name: "Gallery", href: "/gallery" },
    { name: "Volunteer", href: "/volunteer" },
    { name: "Donate", href: "/donate" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="border-t border-neutral-200 bg-neutral-900 text-neutral-300">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foundation-700 text-white font-bold">
                SC
              </div>
              <span className="font-display text-xl font-bold text-white">
                {foundationName}
              </span>
            </div>
            <p className="text-sm text-neutral-400">{footerText}</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold-500 shrink-0" />
                <span className="text-sm">{foundationAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold-500" />
                <span className="text-sm">{foundationPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold-500" />
                <span className="text-sm">{foundationEmail}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Connect</h3>
            <p className="text-sm text-neutral-400">
              Follow us for updates and stories.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-500">
          <p>© {year} {foundationName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
