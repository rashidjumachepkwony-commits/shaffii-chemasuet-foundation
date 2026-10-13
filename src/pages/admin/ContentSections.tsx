import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { contentSectionsService } from "@/services/index";
import type { ContentSection } from "@/types";
import { Search, Plus, Trash2, Save, Edit, Eye, EyeOff, GripVertical } from "lucide-react";

const SECTION_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "stat", label: "Stat" },
  { value: "team_member", label: "Team Member" },
  { value: "testimonial", label: "Testimonial" },
  { value: "section", label: "Section" },
];

const COMMON_CONTENT_FIELDS: Record<string, { label: string; type: string; placeholder?: string }> = {
  heading: { label: "Heading", type: "text", placeholder: "Section heading" },
  subheading: { label: "Subheading", type: "text", placeholder: "Section subheading" },
  body: { label: "Body", type: "textarea", placeholder: "Section content" },
  cta_text: { label: "CTA Text", type: "text", placeholder: "Call-to-action button text" },
  cta_link: { label: "CTA Link", type: "text", placeholder: "/path or https://..." },
  image_url: { label: "Image URL", type: "text", placeholder: "https://..." },
  bg_color: { label: "Background Color", type: "text", placeholder: "#ffffff" },
  text_color: { label: "Text Color", type: "text", placeholder: "#000000" },
};

export default function AdminContentSections() {
  const { success, error: showError } = useToast();
  const [sections, setSections] = React.useState<ContentSection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(15);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const [isEditing, setIsEditing] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<ContentSection | null>(null);
  const [formData, setFormData] = React.useState<Partial<ContentSection>>({});

  const loadSections = React.useCallback(async () => {
       setLoading(true);
    setError(null);
    try {
      const res = await contentSectionsService.list({
        page,
        limit,
        search: search || undefined,
      });
      setSections(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalItems(res.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load content sections");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  React.useEffect(() => {
    loadSections();
  }, [loadSections]);

  const handleEdit = (section: ContentSection) => {
    setEditingSection(section);
    setFormData({ ...section });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditingSection(null);
    setFormData({
      section_key: "",
      title: "",
      type: "section",
      content: {},
      sort_order: 0,
      is_published: false,
    });
    setIsEditing(true);
  };

  const handleDelete = async (section: ContentSection) => {
    if (!window.confirm(`Delete "${section.title || section.section_key}"? This cannot be undone.`)) {
      return;
    }
    try {
      await contentSectionsService.delete(section.id);
      success("Content section deleted");
      loadSections();
    } catch (err: any) {
      showError(err.message || "Failed to delete section");
    }
  };

  const handleSave = async () => {
    if (!formData.section_key) {
      showError("Section key is required");
      return;
    }

    try {
      if (editingSection) {
        await contentSectionsService.update(editingSection.id, formData);
        success("Content section updated");
      } else {
        await contentSectionsService.create(formData);
        success("Content section created");
      }
      setIsEditing(false);
      setEditingSection(null);
      loadSections();
    } catch (err: any) {
      showError(err.message || "Failed to save section");
    }
  };

  const handleContentChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...(prev.content || {}),
        [field]: value,
      },
    }));
  };

  const handleContentJsonChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setFormData((prev) => ({ ...prev, content: parsed }));
    } catch {
      // Keep the raw string in a temp field
      setFormData((prev) => ({
        ...prev,
        content: { ...(prev.content || {}), __raw: value },
      }));
    }
  };

  const togglePublished = async (section: ContentSection) => {
    try {
      await contentSectionsService.update(section.id, {
        is_published: !section.is_published,
        published_at: !section.is_published
          ? new Date().toISOString()
          : undefined,
      });
      success(`Section ${!section.is_published ? "published" : "unpublished"}`);
      loadSections();
    } catch (err: any) {
      showError(err.message || "Failed to update section");
    }
  };

  const renderEditor = () => {
    const content = (formData.content || {}) as Record<string, string>;
    const isHero = formData.type === "hero";
    const fieldsToShow = isHero
      ? ["heading", "subheading", "body", "cta_text", "cta_link", "image_url", "bg_color", "text_color"]
      : Object.keys(content).filter((k) => k !== "__raw");

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Section Key *
            </label>
            <Input
              value={formData.section_key || ""}
              onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
              placeholder="e.g. home_hero, about_vision"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Title
            </label>
            <Input
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Display title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Type
            </label>
            <Select
              value={formData.type || "section"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as ContentSection["type"],
                  content: {},
                })
              }
            >
              {SECTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Sort Order
            </label>
            <Input
              type="number"
              value={formData.sort_order ?? 0}
              onChange={(e) =>
                setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <label className="text-sm font-medium text-neutral-700">Published</label>
          <Select
            value={formData.is_published ? "true" : "false"}
            onChange={(e) =>
              setFormData({ ...formData, is_published: e.target.value === "true" })
            }
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </Select>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-neutral-700 mb-3">
            Content Fields
          </h3>

          {isHero || Object.keys(content).filter((k) => k !== "__raw").length === 0
            ? Object.keys(COMMON_CONTENT_FIELDS).map((field) => (
                <div key={field} className="mb-3">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {COMMON_CONTENT_FIELDS[field]?.label || field}
                  </label>
                  {COMMON_CONTENT_FIELDS[field]?.type === "textarea" ||
                  field === "body" ? (
                    <Textarea
                      value={content[field] || ""}
                      onChange={(e) => handleContentChange(field, e.target.value)}
                      placeholder={COMMON_CONTENT_FIELDS[field]?.placeholder}
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={content[field] || ""}
                      onChange={(e) => handleContentChange(field, e.target.value)}
                      placeholder={COMMON_CONTENT_FIELDS[field]?.placeholder}
                    />
                  )}
                </div>
              ))
            : Object.keys(content)
                .filter((k) => k !== "__raw")
                .map((field) => (
                  <div key={field} className="mb-3">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      {COMMON_CONTENT_FIELDS[field]?.label || field}
                    </label>
                    {COMMON_CONTENT_FIELDS[field]?.type === "textarea" ||
                    field === "body" ? (
                      <Textarea
                        value={content[field] || ""}
                        onChange={(e) => handleContentChange(field, e.target.value)}
                        placeholder={COMMON_CONTENT_FIELDS[field]?.placeholder}
                        rows={3}
                      />
                    ) : (
                      <Input
                        value={content[field] || ""}
                        onChange={(e) => handleContentChange(field, e.target.value)}
                        placeholder={COMMON_CONTENT_FIELDS[field]?.placeholder}
                      />
                    )}
                  </div>
                ))}

          <div className="mt-3">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Raw JSON (advanced)
            </label>
            <Textarea
              value={JSON.stringify(content.__raw ? content.__raw : formData.content || {}, null, 2)}
              onChange={(e) => handleContentJsonChange(e.target.value)}
              placeholder='{"heading": "Welcome", "body": "..."}'
              rows={6}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">
          Content Sections
        </h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Section
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
        <Input
          type="search"
          placeholder="Search by key or title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10"
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading content sections..." />
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      ) : sections.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center">
          <p className="text-neutral-500">No content sections found.</p>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Section Key</th>
                  <th className="px-4 py-3 text-left font-semibold">Title</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section, idx) => (
                  <tr key={section.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3 text-neutral-500">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{section.section_key}</td>
                    <td className="px-4 py-3">{section.title || "—"}</td>
                    <td className="px-4 py-3 capitalize">{section.type}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          section.is_published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {section.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => togglePublished(section)}
                          aria-label={section.is_published ? "Unpublish" : "Publish"}
                          className="p-1 text-neutral-600 hover:text-neutral-900 rounded"
                        >
                          {section.is_published ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(section)}
                          aria-label="Edit"
                          className="p-1 text-neutral-600 hover:text-neutral-900 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(section)}
                          aria-label="Delete"
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

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="font-display text-xl font-bold text-neutral-900">
                {editingSection ? "Edit" : "Create"} Content Section
              </h2>
            </div>
            <div className="p-6">{renderEditor()}</div>
            <div className="p-6 border-t flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingSection(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
