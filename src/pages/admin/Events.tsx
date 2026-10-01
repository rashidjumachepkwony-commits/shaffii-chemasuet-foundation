import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPatch, apiDelete } from "@/services/api";
import type { Event, PaginatedResponse, ApiResponse } from "@/types";
import { Plus, Search, Edit, Trash2, Calendar, Eye } from "lucide-react";

export default function AdminEvents() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(15);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<Event | null>(null);
  const [updatingStatus, setUpdatingStatus] = React.useState<string | null>(null);
  const { success, error: showError } = useToast();

  const loadEvents = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<PaginatedResponse<Event>>(
        "/admin/events",
        { page, limit, search: search || undefined }
      );
      setEvents(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  React.useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleStatusChange = async (event: Event, status: string) => {
    setUpdatingStatus(event.id);
    try {
      await apiPatch(`/admin/events/${event.id}`, { status });
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, status: status as any } : e))
      );
      success("Event status updated");
    } catch (err: any) {
      showError(err.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/admin/events/${deleteTarget.id}`);
      setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setTotalItems((prev) => prev - 1);
      success("Event deleted successfully");
    } catch (err: any) {
      showError(err.message || "Failed to delete event");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-neutral-900">
          Events
        </h1>
        <Link to="/admin/events/new">
          <Button rounded="full">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
        <Input
          type="search"
          placeholder="Search events..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading events..." />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      ) : events.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
          <p className="text-neutral-500">No events found.</p>
          <Link to="/admin/events/new" className="mt-2 inline-block">
            <Button>Create your first event</Button>
          </Link>
        </Card>
      ) : (
        <>
          <Card variant="elevated" padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left font-semibold">Title</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Published</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-neutral-100">
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/events/${event.id}/edit`}
                          className="font-medium text-neutral-900 hover:text-foundation-700"
                        >
                          {event.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {new Date(event.event_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          color={
                            event.status === "PUBLISHED"
                              ? "green"
                              : event.status === "COMPLETED"
                              ? "blue"
                              : event.status === "CANCELLED"
                              ? "red"
                              : "neutral"
                          }
                        >
                          {event.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {event.published ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/admin/events/${event.id}/edit`}
                            className="rounded-xl p-1 text-neutral-600 hover:bg-neutral-100"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/events/${event.slug}`}
                            target="_blank"
                            className="rounded-xl p-1 text-neutral-600 hover:bg-neutral-100"
                            title="View public"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(event)}
                            className="rounded-xl p-1 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={limit}
              onPageChange={setPage}
              showPageSize
            />
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
