import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPatch, apiDelete } from "@/services/api";
import type { Volunteer, PaginatedResponse } from "@/types";
import { Search, User, Mail, Phone, Trash2 } from "lucide-react";

const statusOptions = [
  { value: "NEW", label: "New" },
  { value: "REVIEWING", label: "Reviewing" },
  { value: "APPROVED", label: "Approved" },
  { value: "DECLINED", label: "Declined" },
  { value: "CONTACTED", label: "Contacted" },
];

export default function AdminVolunteers() {
  const { success, error: showError } = useToast();
  const [volunteers, setVolunteers] = React.useState<Volunteer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [updating, setUpdating] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Volunteer | null>(null);

  const loadVolunteers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<PaginatedResponse<Volunteer>>("/admin/volunteers", {
        page, limit: 15, search: search || undefined, status: statusFilter || undefined,
      });
      setVolunteers(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  React.useEffect(() => {
    loadVolunteers();
  }, [loadVolunteers]);

  const handleStatusChange = async (volunteer: Volunteer, status: string) => {
    setUpdating(volunteer.id);
    try {
      await apiPatch(`/admin/volunteers/${volunteer.id}`, { status });
      setVolunteers((prev) =>
        prev.map((v) => (v.id === volunteer.id ? { ...v, status: status as any } : v))
      );
      success("Status updated");
    } catch (err: any) {
      showError(err.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/admin/volunteers/${deleteTarget.id}`);
      setVolunteers((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      setTotalItems((prev) => Math.max(prev - 1, 0));
      success("Volunteer deleted");
    } catch (err: any) {
      showError(err.message || "Failed to delete volunteer");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Volunteers</h1>
        <Button asChild><a href="/volunteer">New Application</a></Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
          <Input type="search" placeholder="Search volunteers..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading..." />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      ) : volunteers.length === 0 ? (
        <p className="text-neutral-500">No volunteers found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-neutral-50">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Interest</th>
                  <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Applied</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v) => (
                  <tr key={v.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3 font-medium">{v.full_name}</td>
                    <td className="px-4 py-3">{v.email || "-"}</td>
                    <td className="px-4 py-3">{v.phone || "-"}</td>
                    <td className="px-4 py-3">{v.area_of_interest || "-"}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={v.status}
                        onChange={(e) => handleStatusChange(v, e.target.value)}
                        disabled={updating === v.id}
                        className="w-36"
                      >
                        {statusOptions.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-4 py-3">{new Date(v.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteTarget(v)}
                        className="rounded-xl p-1 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} pageSize={15} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Volunteer"
        message={`Are you sure you want to delete "${deleteTarget?.full_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
