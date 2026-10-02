import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { projectsService } from "@/services/index";
import type { Project } from "@/types";
import { Search, Calendar, MapPin, ArrowRight } from "lucide-react";

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);

  const page = parseInt(params.get("page") || "1");
  const limit = 9;
  const search = params.get("search") || "";
  const status = params.get("status") || "IN_PROGRESS";

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await projectsService.list({
          page,
          limit,
          status,
          search: search || undefined,
        });
        setProjects(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalItems(res.meta?.total || 0);
      } catch (err: any) {
        setError(err.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [page, search, status]);

  const statusColors = {
    IN_PROGRESS: "blue",
    PLANNED: "amber",
    COMPLETED: "green",
    DRAFT: "neutral",
    ON_HOLD: "purple",
    CANCELLED: "red",
  } as const;

  return (
    <SectionWrapper spacing="lg">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
          Our Projects
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Explore the projects driving positive change in our communities.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setParams({ search: e.target.value, page: "1" })}
            className="pl-10"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setParams({ status: e.target.value, page: "1" })}
          className="w-full sm:w-auto rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
        >
          <option value="IN_PROGRESS">In Progress</option>
          <option value="PLANNED">Planned</option>
          <option value="COMPLETED">Completed</option>
          <option value="DRAFT">Draft</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading projects..." />
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <Search className="h-8 w-8 text-neutral-400" />
          </div>
          <p className="text-neutral-500">No projects found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.slug}`}>
                <Card
                  variant="elevated"
                  className="group h-full overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  {project.featured_image && (
                    <div className="relative">
                      <img
                        src={project.featured_image}
                        alt={project.title}
                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect fill='%23e5e7eb' width='400' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af'%3AProject Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <Badge
                          color={
                            statusColors[project.status as keyof typeof statusColors] || "neutral"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-neutral-900 group-hover:text-gold-600 transition-colors">
                      {project.title}
                    </h3>
                    {project.summary && (
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                        {project.summary}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
                      {project.start_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gold-500" />
                          {new Date(project.start_date).toLocaleDateString()}
                        </div>
                      )}
                      {project.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gold-500" />
                          {project.location}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={limit}
              onPageChange={(p) => setParams({ page: String(p) })}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
}