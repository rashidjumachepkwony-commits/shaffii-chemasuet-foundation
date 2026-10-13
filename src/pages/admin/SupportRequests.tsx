import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPatch, apiDelete } from "@/services/api";
import type { PaginatedResponse } from "@/types";
import { Search, Eye, RefreshCw, User, Phone, Mail, MapPin, Clock, Save, CheckCircle, Trash2, Edit3 } from "lucide-react";

type SupportRequest = {
  id: string;
  reference_number: string;
  full_name: string;
  id_number: string;
  phone_number: string;
  alternative_phone: string | null;
  email: string | null;
  country: string;
  county: string;
  sub_county: string;
  ward: string;
  location: string;
  current_location: string;
  support_type: string;
  support_description: string;
  urgency: "Emergency" | "Urgent" | "Normal";
  people_needing_support: string | null;
  additional_information: string | null;
  preferred_contact_method: string | null;
  status: "New" | "Under Review" | "Approved" | "In Progress" | "Completed" | "Rejected" | "Closed";
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

const statusOptions = [
  { value: "New", label: "New" },
  { value: "Under Review", label: "Under Review" },
  { value: "Approved", label: "Approved" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Rejected", label: "Rejected" },
  { value: "Closed", label: "Closed" },
];

const urgencyColors: Record<string, string> = {
  Emergency: "bg-red-100 text-red-800",
  Urgent: "bg-orange-100 text-orange-800",
  Normal: "bg-blue-100 text-blue-800",
};

const statusColors: Record<string, string> = {
  New: "bg-gray-100 text-gray-800",
  UnderReview: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  InProgress: "bg-blue-100 text-blue-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
  Closed: "bg-neutral-200 text-neutral-800",
};

const supportTypeFilterOptions = [
  "Education support", "Food support", "Medical assistance",
  "Financial assistance", "Emergency assistance", "Family/community support",
  "Youth support", "Elderly support", "Disability-related support",
  "Housing/shelter assistance", "Business/livelihood support", "Other",
];

const supportTypeOptions = supportTypeFilterOptions;

const contactMethodOptions = ["Phone call", "SMS", "WhatsApp", "Email"];

export default function AdminSupportRequests() {
  const { success, error: showError } = useToast();
  const [requests, setRequests] = React.useState<SupportRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [countyFilter, setCountyFilter] = React.useState("");
  const [selected, setSelected] = React.useState<SupportRequest | null>(null);
  const [draft, setDraft] = React.useState<Partial<SupportRequest>>({});
  const [saving, setSaving] = React.useState(false);
  const [updating, setUpdating] = React.useState<"status" | "notes" | "approve" | null>(null);
  const [notesValue, setNotesValue] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<SupportRequest | null>(null);

  const loadRequests = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<PaginatedResponse<SupportRequest>>(
        "/admin/support",
        {
          page,
          limit: 15,
          search: search || undefined,
          status: statusFilter || undefined,
          support_type: typeFilter || undefined,
          county: countyFilter || undefined,
        }
      );
      setRequests(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, typeFilter, countyFilter]);

  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleView = (req: SupportRequest) => {
    setSelected(req);
    setDraft({ ...req });
    setNotesValue(req.internal_notes || "");
  };

  const closeModal = () => {
    setSelected(null);
    setDraft({});
    setNotesValue("");
  };

  const handleFieldChange = (key: keyof SupportRequest, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await apiPatch(`/admin/support/${selected.id}`, draft);
      const merged = { ...selected, ...draft };
      setSelected(merged);
      setRequests((prev) =>
        prev.map((r) => (r.id === selected.id ? merged : r))
      );
      setDraft(merged);
      success("Request updated successfully");
    } catch (err: any) {
      showError(err.message || "Failed to update request");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (req: SupportRequest, status: string) => {
    setUpdating("status");
    try {
      await apiPatch(`/admin/support/${req.id}/status`, { status });
      setRequests((prev) =>
        prev.map((r) =>
          r.id === req.id ? { ...r, status: status as SupportRequest["status"] } : r
        )
      );
      if (selected?.id === req.id) {
        setSelected({ ...selected, status: status as SupportRequest["status"] });
      }
      success("Status updated");
    } catch (err: any) {
      showError(err.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleApprove = async () => {
    if (!selected) return;
    setUpdating("approve");
    try {
      await apiPatch(`/admin/support/${selected.id}/status`, { status: "Approved" });
      const updated = { ...selected, status: "Approved" as SupportRequest["status"] };
      setSelected(updated);
      setRequests((prev) =>
        prev.map((r) => (r.id === selected.id ? { ...r, status: "Approved" as SupportRequest["status"] } : r))
      );
      success("Support request accepted and marked as Approved");
    } catch (err: any) {
      showError(err.message || "Failed to accept request");
    } finally {
      setUpdating(null);
    }
  };

  const handleNotesSave = async () => {
    if (!selected) return;
    setUpdating("notes");
    try {
      await apiPatch(`/admin/support/${selected.id}/status`, {
        status: selected.status,
        internal_notes: notesValue,
      });
      setSelected({ ...selected, internal_notes: notesValue });
      success("Notes updated");
    } catch (err: any) {
      showError(err.message || "Failed to save notes");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/admin/support/${deleteTarget.id}`);
      setRequests((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setTotalItems((prev) => Math.max(prev - 1, 0));
      success("Support request deleted");
      if (selected?.id === deleteTarget.id) {
        closeModal();
      }
    } catch (err: any) {
      showError(err.message || "Failed to delete request");
    } finally {
      setDeleteTarget(null);
    }
  };

  const getUrgencyColor = (u: string) => urgencyColors[u] || "bg-neutral-100 text-neutral-800";

  const getStatusStyle = (s: SupportRequest["status"]) => {
    const key = s === "Under Review" ? "UnderReview" : s === "In Progress" ? "InProgress" : s;
    return statusColors[key] || "bg-neutral-100 text-neutral-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Support Requests</h1>
        {selected && (
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm bg-neutral-100 rounded-xl hover:bg-neutral-200"
          >
            Back to List
          </button>
        )}
      </div>

      {!selected ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              {supportTypeFilterOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
            <Input
              type="text"
              placeholder="Filter by county..."
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
            />
          </div>

          <p className="text-sm text-neutral-500 mb-4">{totalItems} request(s) found</p>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner label="Loading..." />
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
          ) : (
            <Card className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 px-4 font-medium">Reference</th>
                    <th className="pb-3 px-4 font-medium">Name</th>
                    <th className="pb-3 px-4 font-medium">Contact</th>
                    <th className="pb-3 px-4 font-medium">Support Type</th>
                    <th className="pb-3 px-4 font-medium">Urgency</th>
                    <th className="pb-3 px-4 font-medium">Status</th>
                    <th className="pb-3 px-4 font-medium">Created</th>
                    <th className="pb-3 px-4 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-neutral-500">
                        No support requests found
                      </td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id} className="border-b hover:bg-neutral-50">
                        <td className="px-4 py-3 font-mono text-xs">
                          {req.reference_number || req.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3">{req.full_name}</td>
                        <td className="px-4 py-3">
                          {req.phone_number}
                          {req.email && <><br />{req.email}</>}
                        </td>
                        <td className="px-4 py-3">{req.support_type}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(req.urgency)}`}
                          >
                            {req.urgency}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(req.status)}`}
                        >
                          {req.status}
                        </span>
                        </td>
                        <td className="px-4 py-3 text-neutral-500">
                          {new Date(req.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleView(req)}
                            className="text-sm px-3 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200"
                          >
                            <Eye className="h-4 w-4 inline mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => setDeleteTarget(req)}
                            className="text-sm px-3 py-1 rounded-lg text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          )}

          {!loading && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Request Details</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-neutral-500">{selected.reference_number}</span>
              {selected.status !== "Approved" && selected.status !== "Completed" && selected.status !== "Closed" && (
                <button
                  onClick={handleApprove}
                  disabled={updating === "approve"}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-60"
                  title="Accept / Approve"
                >
                  <CheckCircle className="h-3 w-3" />
                  {updating === "approve" ? "Accepting..." : "Accept"}
                </button>
              )}
              <button
                onClick={() => setDeleteTarget(selected)}
                className="inline-flex items-center justify-center p-1.5 rounded-xl text-red-600 hover:bg-red-50"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reference</label>
                <p className="font-mono text-sm text-neutral-600">{selected.reference_number}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-neutral-400" />
                  <Input
                    value={draft.full_name ?? ""}
                    onChange={(e) => handleFieldChange("full_name", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ID Number</label>
                <Input
                  value={draft.id_number ?? ""}
                  onChange={(e) => handleFieldChange("id_number", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Numbers</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-neutral-400" />
                  <Input
                    value={draft.phone_number ?? ""}
                    onChange={(e) => handleFieldChange("phone_number", e.target.value)}
                  />
                </div>
                <Input
                  className="mt-2"
                  value={draft.alternative_phone ?? ""}
                  onChange={(e) => handleFieldChange("alternative_phone", e.target.value)}
                  placeholder="Alternative phone (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  <Input
                    value={draft.email ?? ""}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  <Input
                    value={draft.county ?? ""}
                    onChange={(e) => handleFieldChange("county", e.target.value)}
                    placeholder="County"
                  />
                </div>
                <Input
                  className="mt-2"
                  value={draft.sub_county ?? ""}
                  onChange={(e) => handleFieldChange("sub_county", e.target.value)}
                  placeholder="Sub-county"
                />
                <Input
                  className="mt-2"
                  value={draft.ward ?? ""}
                  onChange={(e) => handleFieldChange("ward", e.target.value)}
                  placeholder="Ward"
                />
                <Input
                  className="mt-2"
                  value={draft.location ?? ""}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  placeholder="Location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Physical Location</label>
                <Input
                  value={draft.current_location ?? ""}
                  onChange={(e) => handleFieldChange("current_location", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type of Support</label>
                <Select
                  value={draft.support_type ?? ""}
                  onChange={(e) => handleFieldChange("support_type", e.target.value)}
                >
                  <option value="" disabled>Select support type</option>
                  {supportTypeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Urgency</label>
                <Select
                  value={draft.urgency ?? "Normal"}
                  onChange={(e) => handleFieldChange("urgency", e.target.value)}
                >
                  {["Emergency", "Urgent", "Normal"].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">People Needing Support</label>
                <Input
                  value={draft.people_needing_support ?? ""}
                  onChange={(e) => handleFieldChange("people_needing_support", e.target.value)}
                  placeholder="e.g. 4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
                <Select
                  value={draft.preferred_contact_method ?? ""}
                  onChange={(e) => handleFieldChange("preferred_contact_method", e.target.value)}
                >
                  <option value="" disabled>Select method</option>
                  {contactMethodOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected, e.target.value)}
                  disabled={updating === "status"}
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description of Support Needed</label>
                <textarea
                  rows={4}
                  value={draft.support_description ?? ""}
                  onChange={(e) => handleFieldChange("support_description", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm resize-y"
                  placeholder="Explain clearly what assistance is needed..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Additional Information</label>
                <textarea
                  rows={3}
                  value={draft.additional_information ?? ""}
                  onChange={(e) => handleFieldChange("additional_information", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm resize-y"
                  placeholder="Any other information..."
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleNotesSave}
                  disabled={updating === "notes"}
                  className="px-4 py-2 text-sm rounded-xl bg-neutral-100 hover:bg-neutral-200"
                >
                  {updating === "notes" ? "Saving..." : "Save Notes"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foundation-700 text-white text-sm font-medium hover:bg-foundation-800 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-6">
            <Clock className="h-3 w-3" />
            <span>Created: {new Date(selected.created_at).toLocaleString()}</span>
            <RefreshCw className="h-3 w-3" />
            <span>Updated: {new Date(selected.updated_at).toLocaleString()}</span>
            {selected.internal_notes && (
              <>
                <Edit3 className="h-3 w-3" />
                <span>Has internal notes</span>
              </>
            )}
          </div>
        </Card>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Support Request"
        message={`Are you sure you want to delete request ${deleteTarget?.reference_number}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
