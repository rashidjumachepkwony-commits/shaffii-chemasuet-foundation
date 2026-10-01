import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { RequireAuth } from "@/hooks/useAuthGuard";
import { apiGet, extractData } from "@/services/api";
import type { EventRegistration, PaginatedResponse, ApiResponse } from "@/types";
import { Calendar, MapPin, Clock, FileText, Search, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function DashboardEventsPage() {
  return (
    <RequireAuth>
      <DashboardEventsContent />
    </RequireAuth>
  );
}

function DashboardEventsContent() {
  const [registrations, setRegistrations] = React.useState<EventRegistration[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const loadRegistrations = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<PaginatedResponse<EventRegistration>>(
        "/dashboard/registrations",
        { page, limit, search: search || undefined }
      );
      setRegistrations(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  React.useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const statusColor = {
    REGISTERED: { bg: "bg-blue-100", text: "text-blue-800" },
    CHECKED_IN: { bg: "bg-emerald-100", text: "text-emerald-800" },
    DID_NOT_ATTEND: { bg: "bg-amber-100", text: "text-amber-800" },
    CANCELLED: { bg: "bg-red-100", text: "text-red-800" },
  };

  return (
    <SectionWrapper spacing="lg">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-neutral-900">
          My Event Registrations
        </h1>
        <p className="mt-2 text-neutral-600">
          Manage and view all your event registrations.
        </p>
      </div>

      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search registrations..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading..." />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      ) : registrations.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
          <h3 className="text-lg font-medium text-neutral-900">
            No registrations found
          </h3>
          <p className="mt-2 text-neutral-500">
            You haven't registered for any events yet.
          </p>
          <a
            href="/events"
            className="mt-4 inline-block text-foundation-700 font-medium"
          >
            Browse events →
          </a>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {registrations.map((reg) => {
              const colors = statusColor[reg.status as keyof typeof statusColor] || statusColor.REGISTERED;
              return (
                <Card key={reg.id} variant="elevated" className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-lg text-neutral-900">
                          {reg.event?.title || reg.event_id}
                        </h3>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}>
                          {reg.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-neutral-600">
                        {reg.event?.event_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(reg.event.event_date).toLocaleDateString()}
                          </span>
                        )}
                        {reg.event?.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {reg.event.venue}
                          </span>
                        )}
                        {reg.event?.start_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reg.event.start_time}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-neutral-700">Reference:</span>{" "}
                        <span className="text-foundation-700 font-mono">
                          {reg.registration_reference}
                        </span>
                      </div>
                      {reg.attendee_count > 1 && (
                        <p className="mt-1 text-sm text-neutral-600">
                          Attendees: {reg.attendee_count}
                        </p>
                      )}
                    </div>
                    {reg.event?.slug && (
                      <a
                        href={`/events/${reg.event.slug}`}
                        className="text-sm font-medium text-foundation-700 hover:underline"
                      >
                        View Event
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={limit}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
}
