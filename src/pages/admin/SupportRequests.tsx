import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPatch } from "@/services/api";
import type { PaginatedResponse } from "@/types";
import { Search, Eye, RefreshCw, User, Phone, Mail, MapPin, Clock } from "lucide-react";

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
  status: "New" | "Under Review" | "Approved" | "InProgress" | "Completed" | "Rejected" | "Closed";
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

const statusOptions = [
  { value: "New", label: "New" },
  { value: "Under Review", label: "Under Review" },
  { value: "Approved", label: "Approved" },
  { value: "InProgress", label: "In Progress" },
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
  "Education support",
  "Food support",
  "Medical assistance",
  "Financial assistance",
  "Emergency assistance",
  "Family/community support",
  "Youth support",
  "Elderly support",
  "Disability-related support",
  "Housing/shelter assistance",
  "Business/livelihood support",
  "Other",
];

export default function AdminSupportRequests() {
  const { success, error: showError } = useToast();
  const [requests, setRequests] = React.useState<SupportRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [countyFilter, setCountyFilter] = React.useState("");
  const [selected, setSelected] = React.useState<SupportRequest | null>(null);
  const [updating, setUpdating] = React.useState<"status" | "notes" | null>(null);
  const [notesValue, setNotesValue] = React.useState("");

  const loadRequests = React.useCallback(async () => {
    setLoading(true);
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
      showError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, typeFilter, countyFilter, showError]);

  React.useEffect(() => {
    loadRequests();
  }, [loadRequests]);

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

  const handleView = (req: SupportRequest) => {
    setSelected(req);
    setNotesValue(req.internal_notes || "");
  };

  const closeModal = () => {
    setSelected(null);
    setNotesValue("");
  };

  const getUrgencyColor = (u: string) => urgencyColors[u] || "bg-neutral-100 text-neutral-800";

  const getStatusStyle = (s: SupportRequest["status"]) => {
    const key = s === "Under Review" ? "UnderReview" : s === "InProgress" ? "InProgress" : s;
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Request Details</h2>
              <div>
                <label className="text-sm text-neutral-500">Reference</label>
                <p className="font-mono">{selected.reference_number}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-500">Full Name</label>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4 text-neutral-400" />
                  {selected.full_name}
                </p>
              </div>
              <div>
                <label className="text-sm text-neutral-500">ID Number</label>
                <p>{selected.id_number}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-500">Phone Numbers</label>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-neutral-400" />
                  {selected.phone_number}
                </p>
                {selected.alternative_phone && (
                  <p className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-neutral-400" />
                    {selected.alternative_phone}
                  </p>
                )}
              </div>
              {selected.email && (
                <div>
                  <label className="text-sm text-neutral-500">Email</label>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-neutral-400" />
                    {selected.email}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm text-neutral-500">Location</label>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  {selected.county}, {selected.sub_county}, {selected.ward}
                </p>
                <p className="text-sm text-neutral-600 mt-1">{selected.current_location}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Support Details</h2>
              <div>
                <label className="text-sm text-neutral-500">Type of Support</label>
                <p>{selected.support_type}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-500">Urgency</label>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${getUrgencyColor(selected.urgency)}`}
                >
                  {selected.urgency}
                </span>
              </div>
              <div>
                <label className="text-sm text-neutral-500">People Needing Support</label>
                <p>{selected.people_needing_support || "—"}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-500">Preferred Contact</label>
                <p>{selected.preferred_contact_method || "—"}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-500">Status</label>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected, e.target.value)}
                  disabled={updating === "status"}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-500">Description of Support Needed</label>
                <p className="mt-1 text-neutral-800">{selected.support_description}</p>
              </div>
              {selected.additional_information && (
                <div>
                  <label className="text-sm text-neutral-500">Additional Information</label>
                  <p className="mt-1">{selected.additional_information}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-neutral-500">Internal Notes</label>
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  placeholder="Add internal notes..."
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm resize-y min-h-[80px]"
                />
                <button
                  onClick={handleNotesSave}
                  disabled={updating === "notes"}
                  className="mt-2 px-4 py-2 text-sm rounded-xl bg-foundation-700 text-white hover:bg-foundation-800"
                >
                  {updating === "notes" ? "Saving..." : "Save Notes"}
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Clock className="h-3 w-3" />
                <span>Created: {new Date(selected.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <RefreshCw className="h-3 w-3" />
                <span>Updated: {new Date(selected.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
