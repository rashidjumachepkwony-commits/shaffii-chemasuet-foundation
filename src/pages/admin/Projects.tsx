import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPost, apiPut, apiDelete } from "@/services/api";
import type { Project, PaginatedResponse, ApiResponse } from "@/types";
import { Plus, Search, Edit, Trash2, FolderOpen, Save } from "lucide-react";
import { useForm } from "@/hooks/useForm";
import { projectSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Textarea } from "@/components/ui/Textarea";

export default function AdminProjects() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const { success, error: showError } = useToast();

  const loadProjects = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<PaginatedResponse<Project>>("/admin/projects", {
        page, limit: 15, search: search || undefined,
      });
      setProjects(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      showError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [page, search, showError]);

  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Delete "${project.title}"?`)) return;
    try {
      await apiDelete(`/admin/projects/${project.id}`);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setTotalItems((prev) => prev - 1);
      success("Project deleted");
    } catch (err: any) {
      showError(err.message || "Failed to delete");
    }
  };

  const form = useForm({
    initialValues: {
      title: "",
      slug: "",
      summary: "",
      description: "",
      status: "DRAFT" as const,
      start_date: "",
      end_date: "",
      location: "",
    },
    validationSchema: projectSchema,
    onSubmit: async (values) => {
      try {
        if (editingProject) {
          await apiPut(`/admin/projects/${editingProject.id}`, values);
          success("Project updated");
        } else {
          await apiPost("/admin/projects", values);
          success("Project created");
        }
        setShowForm(false);
        setEditingProject(null);
        loadProjects();
      } catch (err: any) {
        showError(err.message || "Failed to save");
      }
    },
  });

  React.useEffect(() => {
    if (editingProject) {
      form.reset({
        title: editingProject.title || "",
        slug: editingProject.slug || "",
        summary: editingProject.summary || "",
        description: editingProject.description || "",
        status: editingProject.status as any || "DRAFT",
        start_date: editingProject.start_date?.split("T")[0] || "",
        end_date: editingProject.end_date?.split("T")[0] || "",
        location: editingProject.location || "",
      });
    }
  }, [editingProject]);

  if (showForm) {
    return (
      <ProjectForm
        form={form}
        editingProject={editingProject}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Projects</h1>
        <Button onClick={handleNew} rounded="full">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
        <Input
          type="search"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading..." />
      ) : projects.length === 0 ? (
        <p className="text-neutral-500">No projects found.</p>
      ) : (
        <>
          <Card variant="elevated" padding="none">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-neutral-50">
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3">{p.title}</td>
                    <td className="px-4 py-3">{p.status}</td>
                    <td className="px-4 py-3">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(p)} className="p-1 text-neutral-600 hover:bg-neutral-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} pageSize={15} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

function ProjectForm({
  form,
  editingProject,
  onCancel,
}: {
  form: ReturnType<typeof useForm<any>>;
  editingProject: Project | null;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">
          {editingProject ? "Edit Project" : "New Project"}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={form.handleSubmit} disabled={form.isSubmitting} loading={form.isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit} noValidate className="space-y-6">
        <FormField label="Title" name="title" error={form.errors.title} required>
          <Input
            placeholder="Project title"
            value={form.values.title as string}
            onChange={(e) => form.handleChange("title", e.target.value)}
            onBlur={() => form.handleBlur("title")}
          />
        </FormField>
        <FormField label="Slug" name="slug" error={form.errors.slug} required>
          <Input
            placeholder="project-slug"
            value={form.values.slug as string}
            onChange={(e) => form.handleChange("slug", e.target.value)}
            onBlur={() => form.handleBlur("slug")}
          />
        </FormField>
        <FormField label="Summary" name="summary" error={form.errors.summary}>
          <Textarea placeholder="Brief summary" rows={3}
            value={form.values.summary as string}
            onChange={(e) => form.handleChange("summary", e.target.value)}
            onBlur={() => form.handleBlur("summary")} />
        </FormField>
        <FormField label="Description" name="description" error={form.errors.description}>
          <Textarea placeholder="Full description" rows={8}
            value={form.values.description as string}
            onChange={(e) => form.handleChange("description", e.target.value)}
            onBlur={() => form.handleBlur("description")} />
        </FormField>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <FormField label="Status" name="status" error={form.errors.status} required>
            <select
              value={form.values.status || "DRAFT"}
              onChange={(e) => form.handleChange("status", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
            >
              <option value="DRAFT">Draft</option>
              <option value="PLANNED">Planned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </FormField>
          <FormField label="Start Date" name="start_date" error={form.errors.start_date}>
            <Input type="date"
              value={form.values.start_date as string}
              onChange={(e) => form.handleChange("start_date", e.target.value)}
              onBlur={() => form.handleBlur("start_date")} />
          </FormField>
          <FormField label="End Date" name="end_date" error={form.errors.end_date}>
            <Input type="date"
              value={form.values.end_date as string}
              onChange={(e) => form.handleChange("end_date", e.target.value)}
              onBlur={() => form.handleBlur("end_date")} />
          </FormField>
        </div>
        <FormField label="Location" name="location" error={form.errors.location}>
          <Input
            placeholder="Project location"
            value={form.values.location as string}
            onChange={(e) => form.handleChange("location", e.target.value)}
            onBlur={() => form.handleBlur("location")}
          />
        </FormField>
        {form.errors.root && <p className="text-sm text-red-600">{form.errors.root}</p>}
      </form>
    </div>
  );
}
