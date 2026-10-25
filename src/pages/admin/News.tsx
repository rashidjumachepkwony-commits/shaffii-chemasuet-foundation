import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPost, apiPut, apiDelete, API_BASE } from "@/services/api";
import type { News, PaginatedResponse } from "@/types";
import { Plus, Search, Edit, Trash2, Save } from "lucide-react";
import { useForm } from "@/hooks/useForm";
import { FormField } from "@/components/ui/Form";
import { Textarea } from "@/components/ui/Textarea";
import { FileUploader } from "@/components/ui/FileUploader";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminNews() {
  const [news, setNews] = React.useState<News[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [editingNews, setEditingNews] = React.useState<News | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [uploadingVideo, setUploadingVideo] = React.useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = React.useState<string>("");
  const { success, error: showError } = useToast();
  const { session } = useAuth();

  const loadNews = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<PaginatedResponse<News>>("/admin/news", {
        page, limit: 15, search: search || undefined,
      });
      setNews(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  React.useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleEdit = (item: News) => {
    setEditingNews(item);
    setShowForm(true);
  };

  const handleDelete = async (item: News) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try {
      await apiDelete(`/admin/news/${item.id}`);
      setNews((prev) => prev.filter((n) => n.id !== item.id));
      setTotalItems((prev) => prev - 1);
      success("News deleted");
    } catch (err: any) {
      showError(err.message || "Failed to delete");
    }
  };

  const form = useForm({
    initialValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      author: "",
      status: "DRAFT" as const,
      published_date: "",
    },
    validationSchema: null as any,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          video_url: uploadedVideoUrl,
          status: values.status,
          published_date: values.published_date || null,
        };
        if (editingNews) {
          await apiPut(`/admin/news/${editingNews.id}`, payload);
          success("News updated");
        } else {
          await apiPost("/admin/news", payload);
          success("News created");
        }
        setShowForm(false);
        setEditingNews(null);
        loadNews();
      } catch (err: any) {
        showError(err.message || "Failed to save");
      }
    },
  });

  React.useEffect(() => {
    if (editingNews) {
      form.reset({
        title: editingNews.title || "",
        slug: editingNews.slug || "",
        excerpt: editingNews.excerpt || "",
        content: editingNews.content || "",
        category: editingNews.category || "",
        author: editingNews.author || "",
        status: editingNews.status as any || "DRAFT",
        published_date: editingNews.published_date?.split("T")[0] || "",
      });
      setUploadedVideoUrl(editingNews.video_url || "");
    } else {
      setUploadedVideoUrl("");
    }
  }, [editingNews]);

  const handleVideoUpload = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "news-images");
      formData.append("media_type", "video");

      const token = session?.access_token;
      const uploadRes = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Upload failed");
      }

      const result = await uploadRes.json();
      setUploadedVideoUrl(result.data.url);
      form.setFieldValue("video_url", result.data.url);
      success("Video uploaded successfully");
    } catch (err: any) {
      showError(err.message || "Failed to upload video");
    } finally {
      setUploadingVideo(false);
    }
  };

  if (showForm) {
    return (
      <NewsForm
        form={form}
        editingNews={editingNews}
        onCancel={() => {
          setShowForm(false);
          setEditingNews(null);
          setUploadedVideoUrl("");
        }}
        handleVideoUpload={handleVideoUpload}
        uploadingVideo={uploadingVideo}
        uploadedVideoUrl={uploadedVideoUrl}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">News</h1>
        <Button onClick={() => { setEditingNews(null); setShowForm(true); }} rounded="full">
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
        <Input type="search" placeholder="Search news..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading..." />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      ) : news.length === 0 ? (
        <p className="text-neutral-500">No news articles found.</p>
      ) : (
        <>
          <Card variant="elevated" padding="none">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-neutral-50">
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3">{item.title}</td>
                    <td className="px-4 py-3">{item.status}</td>
                    <td className="px-4 py-3">{item.published_date ? new Date(item.published_date).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(item)} className="p-1 text-neutral-600 hover:bg-neutral-100 rounded mr-1">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item)} className="p-1 text-red-600 hover:bg-red-50 rounded">
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

function NewsForm({
  form,
  editingNews,
  onCancel,
  handleVideoUpload,
  uploadingVideo,
  uploadedVideoUrl,
}: {
  form: ReturnType<typeof useForm<any>>;
  editingNews: News | null;
  onCancel: () => void;
  handleVideoUpload: (files: File[]) => Promise<void>;
  uploadingVideo: boolean;
  uploadedVideoUrl: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">
          {editingNews ? "Edit Article" : "New Article"}
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
        <FormField label="Title" name="title" required>
          <Input placeholder="Article title"
            value={form.values.title as string}
            onChange={(e) => form.handleChange("title", e.target.value)}
            onBlur={() => form.handleBlur("title")} />
        </FormField>
        <FormField label="Slug" name="slug" required>
          <Input placeholder="article-slug"
            value={form.values.slug as string}
            onChange={(e) => form.handleChange("slug", e.target.value)}
            onBlur={() => form.handleBlur("slug")} />
        </FormField>
        <FormField label="Excerpt" name="excerpt">
          <Textarea placeholder="Brief summary" rows={3}
            value={form.values.excerpt as string}
            onChange={(e) => form.handleChange("excerpt", e.target.value)} />
        </FormField>
<FormField label="Content" name="content">
          <Textarea placeholder="Full article content" rows={8}
            value={form.values.content as string}
            onChange={(e) => form.handleChange("content", e.target.value)} />
        </FormField>

        <FormField label="Video URL (Optional)" name="video_url">
          <FileUploader
            onFilesSelected={handleVideoUpload}
            uploading={uploadingVideo}
            currentPreview={uploadedVideoUrl || null}
            mediaType="video"
            accept="video/*"
            maxSize={50 * 1024 * 1024}
            label="Upload article video"
            hint="MP4, WebM, MOV up to 50MB"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField label="Category" name="category">
            <Input placeholder="e.g. Announcements"
              value={form.values.category as string}
              onChange={(e) => form.handleChange("category", e.target.value)} />
          </FormField>
          <FormField label="Author" name="author">
            <Input placeholder="Author name"
              value={form.values.author as string}
              onChange={(e) => form.handleChange("author", e.target.value)} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField label="Published Date" name="published_date">
            <Input type="date"
              value={form.values.published_date as string}
              onChange={(e) => form.handleChange("published_date", e.target.value)} />
          </FormField>
          <FormField label="Status" name="status" required>
            <select
              value={form.values.status || "DRAFT"}
              onChange={(e) => form.handleChange("status", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </FormField>
        </div>
      </form>
    </div>
  );
}
