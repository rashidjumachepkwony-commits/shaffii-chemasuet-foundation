import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Link } from "react-router-dom";
import { adminService } from "@/services/index";
import {
  Calendar,
  Users,
  Folder,
  Newspaper,
  Image,
  Activity,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  total_users: number;
  total_events: number;
  upcoming_events: number;
  total_registrations: number;
  checked_in: number;
  total_projects: number;
  total_news: number;
  total_volunteers: number;
  recent_registrations: any[];
  recent_activity: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminService.getDashboard();
        setStats(data as unknown as DashboardStats);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
    );
  }

  if (!stats) {
    return <p className="text-neutral-500">No data available.</p>;
  }

  const statCards = [
    { label: "Total Users", value: stats.total_users, icon: Users, color: "bg-blue-100 text-blue-800" },
    { label: "Total Events", value: stats.total_events, icon: Calendar, color: "bg-emerald-100 text-emerald-800" },
    { label: "Upcoming Events", value: stats.upcoming_events, icon: Calendar, color: "bg-green-100 text-green-800" },
    { label: "Total Registrations", value: stats.total_registrations, icon: Users, color: "bg-purple-100 text-purple-800" },
    { label: "Checked In", value: stats.checked_in, icon: Activity, color: "bg-amber-100 text-amber-800" },
    { label: "Projects", value: stats.total_projects, icon: Folder, color: "bg-foundation-100 text-foundation-800" },
    { label: "News", value: stats.total_news, icon: Newspaper, color: "bg-neutral-100 text-neutral-800" },
    { label: "Volunteers", value: stats.total_volunteers, icon: Users, color: "bg-gold-100 text-neutral-800" },
  ];

  const quickActions = [
    { label: "Create Event", href: "/admin/events/new", icon: Calendar },
    { label: "Manage Events", href: "/admin/events", icon: Calendar },
    { label: "Manage Registrations", href: "/admin/events", icon: Users },
    { label: "Manage Attendance", href: "/admin/attendance", icon: Activity },
    { label: "Manage Users", href: "/admin/users", icon: Users },
    { label: "Add Project", href: "/admin/projects", icon: Folder },
    { label: "Add News", href: "/admin/news", icon: Newspaper },
    { label: "Manage Gallery", href: "/admin/gallery", icon: Image },
    { label: "Settings", href: "/admin/settings", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-neutral-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-neutral-600">
          Overview of your foundation's activities and engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label} variant="elevated" className="p-6 text-center">
            <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-neutral-900">{card.value}</p>
            <p className="text-sm text-neutral-600">{card.label}</p>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.href}>
              <Card
                variant="elevated"
                className="p-4 text-center transition-transform hover:scale-105 cursor-pointer"
              >
                <div className="mb-2 flex justify-center">
                  <action.icon className="h-6 w-6 text-foundation-700" />
                </div>
                <span className="text-sm font-medium text-neutral-900">
                  {action.label}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {stats.recent_registrations && stats.recent_registrations.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">
            Recent Registrations
          </h2>
          <Card variant="elevated" padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left font-semibold">Reference</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Event</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_registrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-neutral-100">
                      <td className="px-4 py-3 font-mono text-xs">
                        {reg.registration_reference}
                      </td>
                      <td className="px-4 py-3">{reg.full_name}</td>
                      <td className="px-4 py-3">{reg.event?.title || reg.event_id}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full px-2 py-1 text-xs">
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
