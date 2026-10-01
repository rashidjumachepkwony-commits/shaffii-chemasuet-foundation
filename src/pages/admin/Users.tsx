import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPatch, apiPost } from "@/services/api";
import type { Profile, PaginatedResponse, ApiResponse } from "@/types";
import { Search, User, Mail } from "lucide-react";

interface UserWithRole extends Profile {
  role: string | null;
  email: string;
}

export default function AdminUsers() {
  const { success, error: showError } = useToast();
  const [users, setUsers] = React.useState<UserWithRole[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(15);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<PaginatedResponse<UserWithRole>>(
        "/admin/users",
        { page, limit, search: search || undefined }
      );
      setUsers(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">
          Users
        </h1>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
        <Input
          type="search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading users..." />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      ) : users.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center">
          <User className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
          <p className="text-neutral-500">No users found.</p>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold">Role</th>
                  <th className="px-4 py-3 text-left font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3">
                      {user.full_name || "—"}
                    </td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold bg-neutral-100 text-neutral-800">
                        {user.role || "USER"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(user.created_at).toLocaleDateString()}
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
