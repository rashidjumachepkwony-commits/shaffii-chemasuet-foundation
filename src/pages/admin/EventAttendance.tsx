import * as React from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPatch } from "@/services/api";
import type { EventRegistration, PaginatedResponse } from "@/types";
import { Search, Check, QrCode, Users, BarChart3 } from "lucide-react";

export default function AdminEventAttendance() {
  const { id } = useParams<{ id: string }>();
  const { success, error: showError } = useToast();
  const [registrations, setRegistrations] = React.useState<EventRegistration[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(20);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("REGISTERED");
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const loadRegistrations = React.useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<PaginatedResponse<EventRegistration>>(
        `/admin/events/${id}/registrations`,
        {
          page,
          limit,
          search: search || undefined,
          status: statusFilter || undefined,
        }
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

  const checkIn = async (regId: string) => {
    setProcessingId(regId);
    try {
      await apiPatch(`/admin/events/${id}/registrations/${regId}`, {
        status: "CHECKED_IN",
      });
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === regId ? { ...r, status: "CHECKED_IN" } : r
        )
      );
      success("Attendee checked in");
    } catch (err: any) {
      showError(err.message || "Check-in failed");
    } finally {
      setProcessingId(null);
    }
  };

  const markDidNotAttend = async (regId: string) => {
    setProcessingId(regId);
    try {
      await apiPatch(`/admin/events/${id}/registrations/${regId}`, {
        status: "DID_NOT_ATTEND",
      });
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === regId ? { ...r, status: "DID_NOT_ATTEND" } : r
        )
      );
      success("Marked as did not attend");
    } catch (err: any) {
      showError(err.message || "Failed to update");
    } finally {
      setProcessingId(null);
    }
  };

  const undoCheckIn = async (regId: string) => {
    setProcessingId(regId);
    try {
      await apiPatch(`/admin/events/${id}/registrations/${regId}`, {
        status: "REGISTERED",
      });
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === regId ? { ...r, status: "REGISTERED" } : r
        )
      );
      success("Check-in undone");
    } catch (err: any) {
      showError(err.message || "Failed to undo check-in");
    } finally {
      setProcessingId(null);
    }
  };

  const statusCounts = {
    total: totalItems,
    registered: 0,
    checkedIn: 0,
    didNotAttend: 0,
    cancelled: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">
          Attendance Management
        </h1>
        <Button variant="outline" size="sm">
          <QrCode className="mr-2 h-4 w-4" />
          QR Check-in
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card variant="elevated" className="p-4 text-center">
          <p className="text-2xl font-bold text-neutral-900">{statusCounts.total}</p>
          <p className="text-xs text-neutral-600">Total</p>
        </Card>
        <Card variant="elevated" className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {registrations.filter((r) => r.status === "REGISTERED").length}
          </p>
          <p className="text-xs text-neutral-600">Registered</p>
        </Card>
        <Card variant="elevated" className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {registrations.filter((r) => r.status === "CHECKED_IN").length}
          </p>
          <p className="text-xs text-neutral-600">Checked In</p>
        </Card>
        <Card variant="elevated" className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {registrations.filter((r) => r.status === "DID_NOT_ATTEND").length}
          </p>
          <p className="text-xs text-neutral-600">No-show</p>
        </Card>
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

      {loading ? (
        <LoadingSpinner label="Loading..." />
      ) : registrations.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
          <p className="text-neutral-500">No attendees found.</p>
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
                  <th className="px-4 py-3 text-left font-semibold">Attendees</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3 font-mono text-xs">
                      {reg.registration_reference}
                    </td>
                    <td className="px-4 py-3 font-medium">{reg.full_name}</td>
                    <td className="px-4 py-3">{reg.email}</td>
                    <td className="px-4 py-3">{reg.attendee_count}</td>
                    <td className="px-4 py-3">{reg.status}</td>
                    <td className="px-4 py-3 text-right">
                      {reg.status === "REGISTERED" && (
                        <Button
                          size="sm"
                          onClick={() => checkIn(reg.id)}
                          disabled={processingId === reg.id}
                          className="mr-1"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Check In
                        </Button>
                      )}
                      {reg.status === "CHECKED_IN" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => undoCheckIn(reg.id)}
                          disabled={processingId === reg.id}
                        >
                          Undo
                        </Button>
                      )}
                      {reg.status === "REGISTERED" && (
                        <button
                          onClick={() => markDidNotAttend(reg.id)}
                          disabled={processingId === reg.id}
                          className="text-xs text-neutral-600 hover:text-neutral-800"
                        >
                          No-show
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
    </div>
  );
}
