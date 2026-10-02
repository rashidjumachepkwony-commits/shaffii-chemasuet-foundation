import { Link, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, LogIn, User, LogOut } from "lucide-react";
import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";

const navigation = [
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

export function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user, signOut, loading } = useAuth();
  const { getSetting } = useSettings();
  const navigate = useNavigate();

  const foundationName = getSetting("foundation_name", "Shaffii Chemasuet Foundation");
  const foundationTagline = getSetting("foundation_tagline", "Empowering People. Strengthening Communities. Creating Opportunities.");

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <nav
        className="container mx-auto flex items-center justify-between py-3 px-4 md:px-6"
        aria-label="Main navigation"
      >
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-foundation-700 text-white transition-transform group-hover:scale-105">
            <span className="font-display text-lg font-bold">SC</span>
          </div>
          <div>
            <span className="font-display text-xl font-bold text-neutral-900">
              {foundationName}
            </span>
            <p className="text-xs text-gold-600 leading-tight">
              {foundationTagline}
            </p>
          </div>
        </Link>

        <div className="hidden items-center justify-center gap-1.5 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2.5 text-sm font-medium text-neutral-700 rounded-xl transition-all duration-200",
                  "hover:bg-neutral-50 hover:text-foundation-700",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold-400",
                  isActive &&
                    "bg-gold-50 text-foundation-700 shadow-sm"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2.5 text-sm font-medium text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                <User className="h-4 w-4 inline mr-1" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="p-2.5 rounded-xl text-neutral-700 hover:bg-neutral-50 hover:text-foundation-700 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-all duration-200 hover:bg-gold-400 hover:shadow-md"
            >
              <LogIn className="h-4 w-4 mr-1.5" />
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-xl p-2.5 text-neutral-700 lg:hidden hover:bg-neutral-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "lg:hidden overflow-hidden border-t border-neutral-200 bg-white transition-all duration-300",
          menuOpen ? "max-h-screen" : "hidden"
        )}
      >
        <div className="flex flex-col gap-1 py-2 px-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "rounded-xl px-4 py-3 text-sm font-medium",
                  isActive
                    ? "bg-gold-50 text-foundation-700"
                    : "text-neutral-700 hover:bg-neutral-50 hover:text-foundation-700"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              disabled={loading}
              className="rounded-xl px-4 py-3 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-foundation-700"
            >
              <LogOut className="h-4 w-4 inline mr-2" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-gold-500 px-4 py-3 text-center text-sm font-semibold text-neutral-900 hover:bg-gold-400"
            >
              <LogIn className="h-4 w-4 inline mr-2" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
