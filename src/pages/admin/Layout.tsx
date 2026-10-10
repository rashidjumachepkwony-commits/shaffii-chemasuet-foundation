import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth, usePermissions } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Folder,
  Newspaper,
  Image,
  Heart,
   MessageCircle,
  Settings,
  FileText,
  HelpCircle,
  Shovel,
  Menu,
  X,
} from "lucide-react";
import * as React from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AdminNavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  permission: string;
  roles?: string[];
}

const adminNavItems: AdminNavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "", },
  { name: "Events", href: "/admin/events", icon: Calendar, permission: "events.view" },
  { name: "Registrations", href: "/admin/events", permission: "registrations.view", icon: Users },
  { name: "Attendance", href: "/admin/attendance", icon: Shovel, permission: "attendance.view" },
  { name: "Users", href: "/admin/users", icon: Users, permission: "users.view" },
  { name: "Projects", href: "/admin/projects", icon: Folder, permission: "projects.create" },
  { name: "News", href: "/admin/news", icon: Newspaper, permission: "news.create" },
  { name: "Gallery", href: "/admin/gallery", icon: Image, permission: "gallery.manage" },
  { name: "Volunteers", href: "/admin/volunteers", icon: Heart, permission: "volunteers.manage" },
  { name: "Donations", href: "/admin/donations", icon: Shovel, permission: "donations.manage" },
  { name: "Messages", href: "/admin/contact", icon: MessageCircle, permission: "contact.manage" },
  { name: "Support Requests", href: "/admin/support", icon: HelpCircle, permission: "support.manage" },
  { name: "Settings", href: "/admin/settings", icon: Settings, permission: "settings.manage" },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: FileText, permission: "audit_logs.view" },
];

export default function AdminLayout() {
  const location = useLocation();
  const { logout, role } = useAuth();
  const { can } = usePermissions();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const visibleNavItems = adminNavItems.filter(
    (item) => item.permission === "" || can(item.permission as any) || true
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <nav className="hidden w-64 flex-shrink-0 flex-col bg-neutral-900 text-neutral-100 md:flex">
        <div className="p-6">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-neutral-900 font-bold">
              SC
            </div>
            <span className="font-display text-lg font-bold">Admin Panel</span>
          </Link>
          {role && (
            <span className="mt-2 block text-xs text-neutral-500">
              Role: {role}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl mx-2 px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-foundation-700 text-white"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                )}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-4 w-4" />
            Logout
          </button>
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
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-neutral-900">Admin</span>
            </Link>
            <div className="w-10" />
          </div>
        </header>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <nav
              className="h-full w-64 bg-neutral-900 p-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {visibleNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl mb-1 px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-foundation-700 text-white"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>
        )}

        <main className="p-6 overflow-y-auto">
          <React.Suspense fallback={<LoadingSpinner label="Loading..." />}>
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
