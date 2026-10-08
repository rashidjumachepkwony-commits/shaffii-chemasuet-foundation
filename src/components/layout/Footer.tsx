import { Link } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";

export function Footer() {
  const { settings } = useSettings();

  const foundationName =
    settings["foundation_name"]?.value || "Shafie Chemasuet Foundation";
  const foundationEmail = settings["foundation_email"]?.value || "info@shaffiichemasuetfoundation.org";
  const foundationPhone = settings["foundation_phone"]?.value || "+254 769 020 852";
  const foundationAddress = settings["foundation_address"]?.value || "Nairobi, Kenya";
  const footerText = settings["footer_text"]?.value || "The Shafie Chemasuet Foundation is a registered non-profit organization dedicated to sustainable community development and social impact across Kenya.";

  const facebook = settings["social_facebook"]?.value;
  const twitter = settings["social_twitter"]?.value;
  const instagram = settings["social_instagram"]?.value;
  const linkedin = settings["social_linkedin"]?.value;
  const youtube = settings["social_youtube"]?.value;

  const socialLinks = [
    { name: "Facebook", icon: "facebook", url: facebook },
    { name: "Twitter", icon: "twitter", url: twitter },
    { name: "Instagram", icon: "instagram", url: instagram },
    { name: "LinkedIn", icon: "linkedin", url: linkedin },
    { name: "YouTube", icon: "youtube", url: youtube },
  ].filter((social) => social.url && social.url !== "#");

  const year = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "News", href: "/news" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Volunteer", href: "/volunteer" },
    { name: "Donate", href: "/donate" },
    { name: "Contact", href: "/contact" },
  ];

  const programs = [
    "Youth Empowerment",
    "Women & Girls",
    "Education & Mentorship",
    "Digital Skills",
    "Livelihoods",
    "Community Health",
    "Environment",
  ];

  return (
    <footer className="bg-neutral-900 text-neutral-200">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-foundation-700 text-white font-bold">
                <span className="font-display text-lg">SC</span>
              </div>
              <span className="font-display text-xl font-bold text-white">
                {foundationName}
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {footerText}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-neutral-400 transition-colors hover:text-white hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              Our Programs
            </h3>
            <ul className="space-y-2">
              {programs.map((program) => (
                <li key={program}>
                  <span className="text-sm text-neutral-400">{program}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
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

            {socialLinks.length > 0 && (
              <div className="mt-6 flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-neutral-400 transition-all duration-200 hover:bg-gold-500 hover:text-neutral-900"
                    aria-label={social.name}
                  >
                    <span className="text-sm font-bold">{social.icon}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-500">
          <p>© {year} {foundationName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
