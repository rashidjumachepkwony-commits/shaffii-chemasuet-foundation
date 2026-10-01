import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import * as React from "react";

const dashboardNav = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Events", href: "/dashboard/events", icon: Calendar },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardLayout() {
  const location = useLocation();
  const { user, signOut, role } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <nav className="hidden md:block w-64 bg-white border-r border-neutral-200">
        <div className="p-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foundation-700 text-white font-bold">
              SC
            </div>
            <span className="font-display text-lg font-bold text-neutral-900">
              Dashboard
            </span>
          </div>
          <ul className="space-y-1">
            {dashboardNav.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-foundation-50 text-foundation-700"
                        : "text-neutral-700 hover:bg-neutral-100"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            onClick={handleLogout}
            className="mt-8 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          {role && (
            <p className="mt-4 text-xs text-neutral-500">
              Role: {role}
            </p>
          )}
        </div>
      </nav>

      <div className="flex-1">
        <header className="bg-white border-b border-neutral-200 md:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-neutral-700"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <span className="font-display text-lg font-bold text-neutral-900">
              Dashboard
            </span>
          </div>
        </header>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)}>
            <nav
              className="h-full w-64 bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="space-y-1">
                {dashboardNav.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-foundation-50 text-foundation-700"
                            : "text-neutral-700 hover:bg-neutral-100"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={handleLogout}
                className="mt-8 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>
        )}

        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
