import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { FileUploader } from "@/components/ui/FileUploader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPost, apiDelete } from "@/services/api";
import type { GalleryItem, PaginatedResponse, ApiResponse } from "@/types";
import { Plus, Search, Trash2, Save, Image, Upload } from "lucide-react";
import { useForm } from "@/hooks/useForm";
import { FormField } from "@/components/ui/Form";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminGallery() {
  const [items, setItems] = React.useState<GalleryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [showUpload, setShowUpload] = React.useState(false);
  const { success, error: showError } = useToast();
  const { session } = useAuth();

  const loadItems = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<PaginatedResponse<GalleryItem>>("/admin/gallery", {
        page, limit: 20, search: search || undefined,
      });
      setItems(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      showError(err.message || "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }, [page, search, showError]);

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("Delete this image?")) return;
    try {
      await apiDelete(`/admin/gallery/${item.id}`);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setTotalItems((prev) => prev - 1);
      success("Image deleted");
    } catch (err: any) {
      showError(err.message || "Failed to delete");
    }
  };

  const uploadForm = useForm({
    initialValues: { caption: "", category: "", alt_text: "", file: null as File | null },
    validationSchema: null as any,
    onSubmit: async (values) => {
      if (!values.file) {
        showError("Please select an image to upload");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("file", values.file);
        formData.append("bucket", "gallery-images");
        formData.append("caption", values.caption);
        formData.append("category", values.category);
        formData.append("alt_text", values.alt_text);

        const token = session?.access_token;
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "/api"}/upload`,
          {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload failed");
        }

        success("Image uploaded successfully");
        setShowUpload(false);
        loadItems();
      } catch (err: any) {
        showError(err.message || "Upload failed");
      }
    },
  });

  if (showUpload) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            Upload Image
          </h1>
          <Button variant="ghost" onClick={() => setShowUpload(false)}>
            <Save className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <form onSubmit={uploadForm.handleSubmit} className="space-y-6">
          <FormField label="Image File" name="file" required>
            <FileUploader
              onFilesSelected={(files) => uploadForm.setFieldValue("file", files[0])}
              accept="image/*"
              maxSize={5 * 1024 * 1024}
              maxFiles={1}
            />
          </FormField>

          <FormField label="Caption" name="caption">
            <Input
              placeholder="Image caption"
              value={uploadForm.values.caption as string}
              onChange={(e) => uploadForm.handleChange("caption", e.target.value)}
            />
          </FormField>

          <FormField label="Category" name="category">
            <Input
              placeholder="e.g. Events, Community"
              value={uploadForm.values.category as string}
              onChange={(e) => uploadForm.handleChange("category", e.target.value)}
            />
          </FormField>

          <FormField label="Alt Text" name="alt_text">
            <Input
              placeholder="Descriptive alt text for accessibility"
              value={uploadForm.values.alt_text as string}
              onChange={(e) => uploadForm.setFieldValue("alt_text", e.target.value)}
            />
          </FormField>

          <Button type="submit" disabled={uploadForm.isSubmitting} loading={uploadForm.isSubmitting}>
            Upload Image
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Gallery</h1>
        <Button onClick={() => setShowUpload(true)} rounded="full">
          <Plus className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
        <Input type="search" placeholder="Search gallery..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading..." />
      ) : items.length === 0 ? (
        <p className="text-neutral-500">No gallery images found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <Card key={item.id} variant="elevated" padding="none" className="overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.alt_text || item.caption || ""}
                  className="h-48 w-full object-cover"
                />
                <div className="p-3">
                  {item.caption && (
                    <p className="text-sm text-neutral-700 line-clamp-2">{item.caption}</p>
                  )}
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => handleDelete(item)}
                      className="rounded-xl p-1 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} pageSize={20} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
