import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPatch, apiDelete } from "@/services/api";
import type { ContactMessage, PaginatedResponse } from "@/types";
import { Search, Mail, Phone, Eye, Trash2 } from "lucide-react";

const statusOptions = [
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function AdminContact() {
  const { success, error: showError } = useToast();
  const [messages, setMessages] = React.useState<ContactMessage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [updating, setUpdating] = React.useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = React.useState<ContactMessage | null>(null);

  const loadMessages = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<PaginatedResponse<ContactMessage>>("/admin/contact", {
        page, limit: 15, search: search || undefined, status: statusFilter || undefined,
      });
      setMessages(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      showError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, showError]);

  React.useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleStatusChange = async (msg: ContactMessage, status: string) => {
    setUpdating(msg.id);
    try {
      await apiPatch(`/admin/contact/${msg.id}`, { status });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: status as any } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, status: status as any });
      }
      success("Status updated");
    } catch (err: any) {
      showError(err.message || "Failed to update");
    } finally {
      setUpdating(null);
    }
  };

  const handleView = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === "NEW") {
      handleStatusChange(msg, "READ");
    }
  };

  const handleDelete = async (msg: ContactMessage) => {
    if (!confirm("Delete this message?")) return;
    try {
      await apiDelete(`/admin/contact/${msg.id}`);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      setTotalItems((prev) => prev - 1);
      setSelectedMessage(null);
      success("Message deleted");
    } catch (err: any) {
      showError(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">
          Contact Messages
        </h1>
        <Badge color="red" size="sm">
          {messages.filter((m) => m.status === "NEW").length} unread
        </Badge>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
        <Input type="search" placeholder="Search messages..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading..." />
      ) : messages.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
          <p className="text-neutral-500">No messages found.</p>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-neutral-50">
                  <th className="px-4 py-3 text-left">Sender</th>
                  <th className="px-4 py-3 text-left">Subject</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id} className={msg.status === "NEW" ? "bg-blue-50/30 border-b border-neutral-100" : "border-b border-neutral-100"}>
                    <td className="px-4 py-3 font-medium">{msg.name}</td>
                    <td className="px-4 py-3">{msg.subject}</td>
                    <td className="px-4 py-3">{msg.status}</td>
                    <td className="px-4 py-3">{new Date(msg.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleView(msg)}
                        className="rounded-xl p-1 text-neutral-600 hover:bg-neutral-100 mr-1"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(msg)}
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

      {selectedMessage && (
        <Card variant="elevated" className="p-6 mt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg text-neutral-900">{selectedMessage.subject}</h3>
              <p className="text-sm text-neutral-600 mt-1">
                From: {selectedMessage.name} ({selectedMessage.email})
                {selectedMessage.phone && ` | ${selectedMessage.phone}`}
              </p>
            </div>
            <Select
              value={selectedMessage.status}
              onChange={(e) => handleStatusChange(selectedMessage, e.target.value)}
              disabled={updating === selectedMessage.id}
              className="w-36"
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
          </div>
          <p className="text-neutral-700 whitespace-pre-wrap">{selectedMessage.message}</p>
        </Card>
      )}
    </div>
  );
}
