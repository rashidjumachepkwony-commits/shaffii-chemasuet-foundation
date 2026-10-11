import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPatch, apiPost, apiDelete } from "@/services/api";
import type { Profile, PaginatedResponse } from "@/types";
import { Search, User, Mail, Plus, Pencil, KeyRound, Trash2 } from "lucide-react";

interface UserWithRole extends Profile {
  role: string | null;
  email: string;
}

const ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "EVENT_MANAGER", label: "Event Manager" },
  { value: "CONTENT_MANAGER", label: "Content Manager" },
  { value: "USER", label: "Member" },
];

type DialogMode = "create" | "edit" | "password" | null;

const emptyForm = {
  email: "",
  password: "",
  full_name: "",
  role: "USER",
  phone: "",
  organization: "",
};

export default function AdminUsers() {
  const { success, error: showError } = useToast();
  const [users, setUsers] = React.useState<UserWithRole[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(15);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const [dialogMode, setDialogMode] = React.useState<DialogMode>(null);
  const [activeUser, setActiveUser] = React.useState<UserWithRole | null>(null);
  const [form, setForm] = React.useState({ ...emptyForm });
  const [saving, setSaving] = React.useState(false);

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<PaginatedResponse<UserWithRole>>("/admin/users", {
        page,
        limit,
        search: search || undefined,
      });
      setUsers(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      showError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, showError]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openDialog = (mode: DialogMode, user?: UserWithRole) => {
    setDialogMode(mode);
    setActiveUser(user || null);
    setForm(
      user
        ? {
            email: user.email || "",
            password: "",
            full_name: user.full_name || "",
            role: user.role || "USER",
            phone: user.phone || "",
            organization: user.organization || "",
          }
        : { ...emptyForm }
    );
  };

  const closeDialog = () => {
    setDialogMode(null);
    setActiveUser(null);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (dialogMode === "create") {
        if (!form.email || !form.password || !form.full_name) {
          showError("Email, password and full name are required");
          setSaving(false);
          return;
        }
        await apiPost("/admin/users", form);
        success(`Account created for ${form.email}`);
      } else if (dialogMode === "edit" && activeUser) {
        await apiPatch(`/admin/users/${activeUser.id}`, {
          email: form.email !== activeUser.email ? form.email : undefined,
          full_name: form.full_name,
          phone: form.phone,
          organization: form.organization,
          role: form.role,
        });
        success("User updated");
      } else if (dialogMode === "password" && activeUser) {
        if (form.password.length < 8) {
          showError("Password must be at least 8 characters");
          setSaving(false);
          return;
        }
        await apiPost(`/admin/users/${activeUser.id}/password`, {
          password: form.password,
        });
        success(`Password updated for ${activeUser.email}`);
      }
      closeDialog();
      loadUsers();
    } catch (err: any) {
      showError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: UserWithRole) => {
    if (!window.confirm(`Delete ${user.email}? This removes their account and cannot be undone.`)) {
      return;
    }
    try {
      await apiDelete(`/admin/users/${user.id}`);
      success("User deleted");
      loadUsers();
    } catch (err: any) {
      showError(err.message || "Failed to delete user");
    }
  };

  const dialogTitle =
    dialogMode === "create"
      ? "New User"
      : dialogMode === "password"
      ? `Set Password — ${activeUser?.email}`
      : `Edit User — ${activeUser?.email}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Users</h1>
        <Button onClick={() => openDialog("create")}>
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
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
          className="pl-10"
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading users..." />
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
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3">{user.full_name || "—"}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold bg-neutral-100 text-neutral-800">
                        {ROLES.find((r) => r.value === user.role)?.label || user.role || "Member"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openDialog("edit", user)}
                          aria-label={`Edit ${user.email}`}
                          className="p-1 text-neutral-600 hover:text-neutral-900 rounded"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDialog("password", user)}
                          aria-label={`Set password for ${user.email}`}
                          className="p-1 text-neutral-600 hover:text-neutral-900 rounded"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          aria-label={`Delete ${user.email}`}
                          className="p-1 text-neutral-600 hover:text-red-600 rounded"
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

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={dialogMode !== null}
        onClose={closeDialog}
        title={dialogTitle || ""}
        size="lg"
      >
        <div className="space-y-4">
          {dialogMode !== "password" && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email {dialogMode === "create" ? "*" : ""}
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="user@example.com"
                />
                {dialogMode === "edit" && (
                  <p className="mt-1 text-xs text-amber-600">
                    Changing this updates the user's sign-in email.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name {dialogMode === "create" ? "*" : ""}
                </label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+254 7..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Organization
                  </label>
                  <Input
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {dialogMode === "password" ? "New Password *" : "Password *"}
            </label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={
                dialogMode === "edit"
                  ? "Leave blank to keep the current password"
                  : "At least 8 characters"
              }
            />
          </div>

          {dialogMode !== "password" && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
              <Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={closeDialog} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={saving} disabled={saving}>
              {dialogMode === "create"
                ? "Create Account"
                : dialogMode === "password"
                ? "Set Password"
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
