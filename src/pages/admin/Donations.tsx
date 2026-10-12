import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPatch, apiDelete } from "@/services/api";
import type { Donation, PaginatedResponse } from "@/types";
import { Search, Banknote, Trash2 } from "lucide-react";

const donationStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export default function AdminDonations() {
  const { success, error: showError } = useToast();
  const [donations, setDonations] = React.useState<Donation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<Donation | null>(null);
  const [updating, setUpdating] = React.useState<string | null>(null);

  const loadDonations = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<PaginatedResponse<Donation>>("/admin/donations", {
        page, limit: 15, search: search || undefined,
      });
      setDonations(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      showError(err.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  }, [page, search, showError]);

  React.useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/admin/donations/${deleteTarget.id}`);
      setDonations((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setTotalItems((prev) => Math.max(prev - 1, 0));
      success("Donation deleted");
    } catch (err: any) {
      showError(err.message || "Failed to delete donation");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = async (donation: Donation, status: string) => {
    setUpdating(donation.id);
    try {
      await apiPatch(`/admin/donations/${donation.id}`, { status });
      setDonations((prev) =>
        prev.map((d) => (d.id === donation.id ? { ...d, status } : d))
      );
      success("Status updated");
    } catch (err: any) {
      showError(err.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Donations</h1>
        <div className="text-right">
          <p className="text-2xl font-bold text-gold-500">KSh {totalAmount.toLocaleString()}</p>
          <p className="text-sm text-neutral-600">Total (current page)</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
        <Input type="search" placeholder="Search donations..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading..." />
      ) : donations.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center">
          <Banknote className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
          <p className="text-neutral-500">No donations found.</p>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-neutral-50">
                  <th className="px-4 py-3 text-left">Donor</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-left">Method</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3">{d.donor_name || "Anonymous"}</td>
                    <td className="px-4 py-3">{d.donor_email || "-"}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      KSh {(d.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{d.payment_method || "-"}</td>
                    <td className="px-4 py-3 min-w-[150px]">
                      <Select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d, e.target.value)}
                        disabled={updating === d.id}
                        className="w-full"
                      >
                        {donationStatusOptions.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(d.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteTarget(d)}
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
        title="Delete Donation"
        message={`Are you sure you want to delete the donation of KSh ${deleteTarget?.amount?.toLocaleString()}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
