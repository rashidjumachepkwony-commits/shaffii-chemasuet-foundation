import * as React from "react";
const { useState, useEffect } = React;
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "@/hooks/useForm";
import { eventSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FileUploader } from "@/components/ui/FileUploader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { apiGet, apiPost, apiPut, apiGet as rawApiGet } from "@/services/api";
import type { Event, EventCategory, ApiResponse } from "@/types";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminEventForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = React.useState<EventCategory[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = React.useState<string>("");
  const { session } = useAuth();

  const [event, setEvent] = React.useState<Event | null>(null);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiGet<ApiResponse<EventCategory[]>>("/events/categories");
        setCategories(data.data || []);
      } catch (err: any) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();

    if (isEdit && id) {
      const loadEvent = async () => {
        try {
          const data = await apiGet<ApiResponse<Event>>(`/admin/events/${id}`);
          setEvent(data.data || null);
        } catch (err: any) {
          showError(err.message || "Failed to load event");
        } finally {
          setLoading(false);
        }
      };
      loadEvent();
    } else {
      setLoading(false);
    }
  }, [id, isEdit, showError]);

  React.useEffect(() => {
    if (event && !loading) {
      form.reset({
        title: event.title || "",
        slug: event.slug || "",
        short_description: event.short_description || "",
        full_description: event.full_description || "",
        category_id: event.category_id || "",
        event_date: event.event_date?.split("T")[0] || "",
        start_time: event.start_time || "",
        end_time: event.end_time || "",
        venue: event.venue || "",
        location: event.location || "",
        organizer: event.organizer || "",
        contact_information: event.contact_information || "",
        registration_deadline: event.registration_deadline?.split("T")[0] || "",
        capacity: event.capacity || 0,
        registration_enabled: event.registration_enabled,
        published: event.published,
        status: event.status,
      });
      setUploadedImageUrl(event.featured_image || "");
    }
  }, [event, loading]);

  const form = useForm({
    initialValues: {
      title: "",
      slug: "",
      short_description: "",
      full_description: "",
      category_id: "",
      event_date: "",
      start_time: "",
      end_time: "",
      venue: "",
      location: "",
      organizer: "",
      contact_information: "",
      registration_deadline: "",
      capacity: 0,
      registration_enabled: true,
      published: false,
      status: "DRAFT" as const,
    },
    validationSchema: eventSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          featured_image: uploadedImageUrl,
          capacity: values.capacity || null,
          start_time: `${values.event_date}T${values.start_time}`,
          end_time: `${values.event_date}T${values.end_time}`,
          registration_deadline: values.registration_deadline
            ? `${values.registration_deadline}T23:59:59`
            : null,
          event_date: values.event_date,
        };

        if (isEdit && id) {
          await apiPut(`/admin/events/${id}`, payload);
          success("Event updated successfully");
        } else {
          await apiPost("/admin/events", payload);
          success("Event created successfully");
        }
        navigate("/admin/events");
      } catch (err: any) {
        showError(err.message || "Failed to save event");
      }
    },
  });

  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "event-images");

      const token = session?.access_token;
      const uploadRes = await fetch(
        `${import.meta.env.VITE_API_URL || "/api"}/upload`,
        {
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
      setUploadedImageUrl(result.data.url);
      form.setFieldValue("featured_image", result.data.url);
      success("Image uploaded successfully");
    } catch (err: any) {
      showError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading event..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/events"
            className="rounded-xl p-2 text-neutral-600 hover:bg-neutral-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            {isEdit ? "Edit Event" : "Create Event"}
          </h1>
        </div>
        <Button
          onClick={form.handleSubmit}
          disabled={form.isSubmitting}
          loading={form.isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          {isEdit ? "Update" : "Save"} Event
        </Button>
      </div>

      <form onSubmit={form.handleSubmit} noValidate className="space-y-8">
        <FormField label="Featured Image" name="featured_image">
          <FileUploader
            onFilesSelected={handleImageUpload}
            uploading={uploading}
            currentPreview={uploadedImageUrl || null}
            currentAlt={form.values.title as string}
            accept="image/*"
            maxSize={5 * 1024 * 1024}
            label="Upload event image"
            hint="PNG, JPG up to 5MB"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField
            label="Title"
            name="title"
            error={form.errors.title}
            required
          >
            <Input
              placeholder="Event title"
              value={form.values.title as string}
              onChange={(e) => {
                form.handleChange("title", e.target.value);
                form.handleChange(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .substring(0, 100)
                );
              }}
              onBlur={() => form.handleBlur("title")}
              aria-invalid={!!form.errors.title}
            />
          </FormField>

          <FormField
            label="Slug"
            name="slug"
            error={form.errors.slug}
            required
          >
            <Input
              placeholder="event-slug"
              value={form.values.slug as string}
              onChange={(e) => form.handleChange("slug", e.target.value)}
              onBlur={() => form.handleBlur("slug")}
              aria-invalid={!!form.errors.slug}
            />
          </FormField>
        </div>

        <FormField
          label="Short Description"
          name="short_description"
          error={form.errors.short_description}
        >
          <Textarea
            placeholder="Brief summary shown on event cards"
            rows={3}
            value={form.values.short_description as string}
            onChange={(e) => form.handleChange("short_description", e.target.value)}
            onBlur={() => form.handleBlur("short_description")}
          />
        </FormField>

        <FormField
          label="Full Description"
          name="full_description"
          error={form.errors.full_description}
        >
          <Textarea
            placeholder="Full event description"
            rows={8}
            value={form.values.full_description as string}
            onChange={(e) => form.handleChange("full_description", e.target.value)}
            onBlur={() => form.handleBlur("full_description")}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField
            label="Category"
            name="category_id"
            error={form.errors.category_id}
          >
            <Select
              value={form.values.category_id as string}
              onChange={(e) => form.handleChange("category_id", e.target.value)}
              onBlur={() => form.handleBlur("category_id")}
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Event Date"
            name="event_date"
            error={form.errors.event_date}
            required
          >
            <Input
              type="date"
              value={form.values.event_date as string}
              onChange={(e) => form.handleChange("event_date", e.target.value)}
              onBlur={() => form.handleBlur("event_date")}
              aria-invalid={!!form.errors.event_date}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField
            label="Start Time"
            name="start_time"
            error={form.errors.start_time}
            required
          >
            <Input
              type="time"
              value={form.values.start_time as string}
              onChange={(e) => form.handleChange("start_time", e.target.value)}
              onBlur={() => form.handleBlur("start_time")}
              aria-invalid={!!form.errors.start_time}
            />
          </FormField>

          <FormField
            label="End Time"
            name="end_time"
            error={form.errors.end_time}
            required
          >
            <Input
              type="time"
              value={form.values.end_time as string}
              onChange={(e) => form.handleChange("end_time", e.target.value)}
              onBlur={() => form.handleBlur("end_time")}
              aria-invalid={!!form.errors.end_time}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField label="Venue" name="venue" error={form.errors.venue}>
            <Input
              placeholder="Venue name"
              value={form.values.venue as string}
              onChange={(e) => form.handleChange("venue", e.target.value)}
              onBlur={() => form.handleBlur("venue")}
            />
          </FormField>

          <FormField label="Location" name="location" error={form.errors.location}>
            <Input
              placeholder="Address or city"
              value={form.values.location as string}
              onChange={(e) => form.handleChange("location", e.target.value)}
              onBlur={() => form.handleBlur("location")}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField label="Organizer" name="organizer" error={form.errors.organizer}>
            <Input
              placeholder="Organizing entity"
              value={form.values.organizer as string}
              onChange={(e) => form.handleChange("organizer", e.target.value)}
              onBlur={() => form.handleBlur("organizer")}
            />
          </FormField>

          <FormField label="Contact Information" name="contact_information" error={form.errors.contact_information}>
            <Input
              placeholder="Email or phone"
              value={form.values.contact_information as string}
              onChange={(e) => form.handleChange("contact_information", e.target.value)}
              onBlur={() => form.handleBlur("contact_information")}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <FormField
            label="Registration Deadline"
            name="registration_deadline"
            error={form.errors.registration_deadline}
          >
            <Input
              type="date"
              value={form.values.registration_deadline as string}
              onChange={(e) => form.handleChange("registration_deadline", e.target.value)}
              onBlur={() => form.handleBlur("registration_deadline")}
            />
          </FormField>

          <FormField label="Capacity" name="capacity" error={form.errors.capacity}>
            <Input
              type="number"
              min="0"
              placeholder="e.g. 100"
              value={String(form.values.capacity || "")}
              onChange={(e) => form.handleChange("capacity", parseInt(e.target.value) || 0)}
              onBlur={() => form.handleBlur("capacity")}
            />
          </FormField>

          <FormField
            label="Status"
            name="status"
            error={form.errors.status}
            required
          >
            <Select
              value={form.values.status}
              onChange={(e) => form.handleChange("status", e.target.value as any)}
              onBlur={() => form.handleBlur("status")}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          </FormField>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.values.registration_enabled}
              onChange={(e) => form.handleChange("registration_enabled", e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-foundation-700 focus:ring-foundation-500"
            />
            <span className="text-sm font-medium text-neutral-700">Registration enabled</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.values.published}
              onChange={(e) => {
                form.handleChange("published", e.target.checked);
                if (e.target.checked) {
                  form.handleChange("status", "PUBLISHED");
                }
              }}
              className="h-4 w-4 rounded border-neutral-300 text-foundation-700 focus:ring-foundation-500"
            />
            <span className="text-sm font-medium text-neutral-700">Published</span>
          </label>
        </div>

        {form.errors.root && (
          <p className="text-sm text-red-600" role="alert">
            {form.errors.root}
          </p>
        )}
      </form>
    </div>
  );
}
