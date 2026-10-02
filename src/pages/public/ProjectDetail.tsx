import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { projectsService } from "@/services/index";
import type { Project } from "@/types";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";

const statusColors = {
  IN_PROGRESS: "blue",
  PLANNED: "amber",
  COMPLETED: "green",
  DRAFT: "neutral",
  ON_HOLD: "purple",
  CANCELLED: "red",
} as const;

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const loadProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await projectsService.getBySlug(slug);
        setProject(data);
      } catch (err: any) {
        setError(err.message || "Project not found");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <SectionWrapper>
        <LoadingSpinner label="Loading project..." />
      </SectionWrapper>
    );
  }

  if (error || !project) {
    return (
      <SectionWrapper>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-neutral-900">Project Not Found</h1>
          <p className="mt-2 text-neutral-600">{error}</p>
          <Link to="/projects" className="mt-4 inline-block text-gold-600 font-semibold hover:underline">
            ← Back to Projects
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper spacing="lg">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/projects"
          className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-gold-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            color={
              statusColors[project.status as keyof typeof statusColors] || "neutral"
            }
          >
            {project.status}
          </Badge>
        </div>

        <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
          {project.title}
        </h1>

        {project.featured_image && (
          <img
            src={project.featured_image}
            alt={project.title}
            className="mt-6 w-full rounded-2xl shadow-xl object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%23e5e7eb' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af'%3AProject Image%3C/text%3E%3C/svg%3E";
            }}
          />
        )}

        {(project.start_date || project.end_date || project.location) && (
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-600">
            {project.start_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gold-500" />
                Start: {new Date(project.start_date).toLocaleDateString()}
              </span>
            )}
            {project.end_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gold-500" />
                End: {new Date(project.end_date).toLocaleDateString()}
              </span>
            )}
            {project.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gold-500" />
                {project.location}
              </span>
            )}
          </div>
        )}

        {project.summary && (
          <p className="mt-6 text-lg text-neutral-600 leading-relaxed">{project.summary}</p>
        )}

        {project.description && (
          <div
            className="mt-8 text-neutral-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        )}
      </div>
    </SectionWrapper>
  );
}