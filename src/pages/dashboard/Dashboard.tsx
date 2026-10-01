import { Link, useNavigate } from "react-router-dom";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { RequireAuth } from "@/hooks/useAuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardService } from "@/services/index";
import type { EventRegistration } from "@/types";
import { Calendar, MapPin, Clock, FileText } from "lucide-react";

interface DashboardData {
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    organization: string | null;
    avatar_url: string | null;
  } | null;
  upcoming_registrations: any[];
  past_registrations: any[];
  stats: Record<string, number>;
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}

function DashboardContent() {
  const { user, profile: userProfile, role } = useAuth();
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await dashboardService.getUserDashboard();
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <SectionWrapper>
        <LoadingSpinner label="Loading dashboard..." />
      </SectionWrapper>
    );
  }

  if (error) {
    return (
      <SectionWrapper>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </SectionWrapper>
    );
  }

  const upcomingRegistrations = data?.upcoming_registrations || [];
  const pastRegistrations = data?.past_registrations || [];
  const stats = data?.stats || {};

  return (
    <SectionWrapper spacing="lg">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-neutral-900">
          Welcome, {data?.profile?.full_name || user?.email || "User"}
        </h1>
        <p className="mt-1 text-neutral-600">
          Role: <span className="font-medium">{role || "USER"}</span>
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card variant="elevated" className="p-6 text-center">
          <p className="text-3xl font-bold text-foundation-700">{stats.upcoming_events ?? 0}</p>
          <p className="text-sm text-neutral-600">Upcoming Events</p>
        </Card>
        <Card variant="elevated" className="p-6 text-center">
          <p className="text-3xl font-bold text-gold-500">{stats.total_registrations ?? 0}</p>
          <p className="text-sm text-neutral-600">My Registrations</p>
        </Card>
        <Card variant="elevated" className="p-6 text-center">
          <p className="text-3xl font-bold text-neutral-700">{stats.attended ?? 0}</p>
          <p className="text-sm text-neutral-600">Attended</p>
        </Card>
      </div>

      <div className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-neutral-900">
            Upcoming Registrations
          </h2>
          <Link to="/dashboard/events">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {upcomingRegistrations.length === 0 ? (
          <Card variant="elevated" className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
            <p className="text-neutral-500">No upcoming event registrations.</p>
            <Link to="/events" className="mt-2 inline-block text-foundation-700 font-medium">
              Browse events →
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingRegistrations.map((reg) => (
              <RegistrationCard key={reg.id} registration={reg} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-neutral-900">
            Past Events
          </h2>
          <Link to="/dashboard/events">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {pastRegistrations.length === 0 ? (
          <p className="text-neutral-500">No past event registrations.</p>
        ) : (
          <div className="space-y-4">
            {pastRegistrations.map((reg) => (
              <RegistrationCard key={reg.id} registration={reg} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link to="/dashboard/profile">
          <Button variant="outline" rounded="full">
            Edit Profile
          </Button>
        </Link>
      </div>
    </SectionWrapper>
  );
}

function RegistrationCard({ registration }: { registration: any }) {
  const event = registration.event;
  const statusColor = {
    REGISTERED: "bg-blue-100 text-blue-800",
    CHECKED_IN: "bg-emerald-100 text-emerald-800",
    DID_NOT_ATTEND: "bg-amber-100 text-amber-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <Card variant="elevated" className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg text-neutral-900">{event?.title}</h3>
            <Badge color={registration.status === "CHECKED_IN" ? "green" : registration.status === "CANCELLED" ? "red" : "blue"}>
              {registration.status}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-neutral-600">
            {event?.event_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(event.event_date).toLocaleDateString()}
              </div>
            )}
            {event?.venue && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.venue}
              </div>
            )}
            {event?.start_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {event.start_time}
              </div>
            )}
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium text-neutral-700">Reference:</span>{" "}
            <span className="text-foundation-700 font-mono">
              {registration.registration_reference}
            </span>
          </div>
        </div>
        {event?.slug && (
          <Link to={`/events/${event.slug}`} className="text-sm font-medium text-foundation-700 hover:underline">
            View Event
          </Link>
        )}
      </div>
    </Card>
  );
}
