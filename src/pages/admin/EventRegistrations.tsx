import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPatch, apiPost } from "@/services/api";
import {
  eventActivityLabels,
  eventAgeGroupLabels,
} from "@/lib/eventRegistrationOptions";
import type { EventRegistration, PaginatedResponse } from "@/types";
import { Search, Download, CheckCircle, XCircle, RefreshCw, Users } from "lucide-react";

export default function AdminEventRegistrations() {
  const { id } = useParams<{ id: string }>();
  const { success, error: showError } = useToast();
  const [registrations, setRegistrations] = React.useState<EventRegistration[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(15);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = React.useState<EventRegistration | null>(null);

  const loadRegistrations = React.useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<PaginatedResponse<EventRegistration>>(
        `/admin/events/${id}/registrations`,
        { page, limit, search: search || undefined, status: statusFilter || undefined }
      );
      setRegistrations(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [id, page, limit, search, statusFilter]);

  React.useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const handleStatusChange = async (regId: string, status: string) => {
    setProcessingId(regId);
    try {
      await apiPatch(`/admin/events/${id}/registrations/${regId}`, { status });
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status: status as any } : r))
      );
      success("Registration status updated");
    } catch (err: any) {
      showError(err.message || "Failed to update registration");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await apiPatch(`/admin/events/${id}/registrations/${cancelTarget.id}`, {
        status: "CANCELLED",
      });
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === cancelTarget.id ? { ...r, status: "CANCELLED" } : r
        )
      );
      success("Registration cancelled");
    } catch (err: any) {
      showError(err.message || "Failed to cancel registration");
    } finally {
      setCancelTarget(null);
    }
  };

  const exportToCsv = () => {
    const headers = [
      "Reference",
      "Name",
      "Email",
      "Phone",
      "Organization",
      "Attendees",
      "Age Group",
      "Activity Interest",
      "County",
      "Locality",
      "Other Activity",
      "Support Needs",
      "Status",
      "Created",
    ];
    const rows = registrations.map((r) => [
      r.registration_reference,
      r.full_name,
      r.email,
      r.phone || "",
      r.organization || "",
      r.attendee_count,
      r.age_group
        ? eventAgeGroupLabels[r.age_group as keyof typeof eventAgeGroupLabels] || r.age_group
        : "",
      r.activity_interest
        ? eventActivityLabels[r.activity_interest as keyof typeof eventActivityLabels] || r.activity_interest
        : "",
      r.county || "",
      r.locality || "",
      r.activity_other || "",
      r.notes || "",
      r.status,
      new Date(r.created_at).toISOString(),
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) =>
          row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n") + "\n";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `event-registrations-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">
          Event Registrations
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search by name or reference..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="REGISTERED">Registered</option>
          <option value="CHECKED_IN">Checked In</option>
          <option value="DID_NOT_ATTEND">Did Not Attend</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
      </div>

      <div className="text-sm text-neutral-600">
        <span className="font-medium">{totalItems}</span> total registration
        {totalItems !== 1 ? "s" : ""}
      </div>

      {loading ? (
        <LoadingSpinner label="Loading registrations..." />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      ) : registrations.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
          <p className="text-neutral-500">No registrations found.</p>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-semibold">Reference</th>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold">Attendees</th>
                  <th className="px-4 py-3 text-left font-semibold">Participant Details</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Created</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3 font-mono text-xs">
                      {reg.registration_reference}
                    </td>
                    <td className="px-4 py-3">{reg.full_name}</td>
                    <td className="px-4 py-3">{reg.email}</td>
                    <td className="px-4 py-3">{reg.phone || "-"}</td>
                    <td className="px-4 py-3">{reg.attendee_count}</td>
                    <td className="px-4 py-3">
                      <div>
                        {reg.age_group
                          ? eventAgeGroupLabels[reg.age_group as keyof typeof eventAgeGroupLabels] || reg.age_group
                          : "Age group not provided"}
                      </div>
                      <div className="text-neutral-500">
                        {reg.activity_interest
                          ? eventActivityLabels[reg.activity_interest as keyof typeof eventActivityLabels] || reg.activity_interest
                          : "Activity not provided"}
                        {reg.activity_other ? `: ${reg.activity_other}` : ""}
                      </div>
                      <div className="text-neutral-500">
                        {[reg.locality, reg.county].filter(Boolean).join(", ") || "Location not provided"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={reg.status}
                        onChange={(e) =>
                          handleStatusChange(reg.id, e.target.value)
                        }
                        disabled={processingId === reg.id}
                        className="w-40"
                      >
                        <option value="REGISTERED">Registered</option>
                        <option value="CHECKED_IN">Checked In</option>
                        <option value="DID_NOT_ATTEND">Did Not Attend</option>
                        <option value="CANCELLED">Cancelled</option>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/events/${id}/registrations/${reg.id}`}
                        className="rounded-xl p-1 text-neutral-600 hover:bg-neutral-100"
                        title="View details"
                      >
                        <Search className="h-4 w-4" />
                      </Link>
                      {reg.status !== "CANCELLED" && (
                        <button
                          onClick={() => setCancelTarget(reg)}
                          className="rounded-xl p-1 text-red-600 hover:bg-red-50"
                          title="Cancel registration"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel Registration"
        message={`Cancel registration ${cancelTarget?.registration_reference}?`}
        destructive
        confirmLabel="Cancel Registration"
      />
    </div>
  );
}
