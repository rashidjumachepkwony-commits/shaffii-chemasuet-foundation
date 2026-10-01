import { Link, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, LogIn, User, LogOut } from "lucide-react";
import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
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

export function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <nav
        className="container mx-auto flex items-center justify-between py-4 px-4 md:px-6"
        aria-label="Main navigation"
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foundation-700 text-white font-bold">
            SC
          </div>
          <div>
            <span className="font-display text-xl font-bold text-neutral-900">
              Shaffii Chemasuet Foundation
            </span>
            <p className="text-xs text-neutral-500">
              [Foundation Tagline]
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition-colors",
                  "hover:bg-neutral-100 hover:text-foundation-700",
                  isActive && "bg-foundation-50 text-foundation-700"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}

          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <Link to="/dashboard" className="rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                <User className="h-4 w-4 inline mr-1" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-foundation-700 px-4 py-2 text-sm font-semibold text-white hover:bg-foundation-800"
            >
              <LogIn className="h-4 w-4 inline mr-1" />
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-neutral-700 md:hidden"
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
          "md:hidden border-t border-neutral-200 bg-white transition-all duration-200",
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
                    ? "bg-foundation-50 text-foundation-700"
                    : "text-neutral-700 hover:bg-neutral-100"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="rounded-xl px-4 py-3 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              <LogOut className="h-4 w-4 inline mr-2" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-foundation-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-foundation-800"
            >
              <LogIn className="h-4 w-4 inline mr-2" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
