import * as React from "react";
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
      <section className="relative overflow-hidden rounded-[2rem] bg-neutral-900 px-5 py-12 text-white shadow-[0_30px_80px_rgba(23,33,27,0.12)] md:px-8 md:py-16">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60" style={{ backgroundImage: "url('/images/shaffi6.jpg')" }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/85 to-foundation-900/55" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="section-label border-gold-300/30 bg-white/5 text-gold-200">Impact in Action</span>
          <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl md:text-6xl">Our Projects</h1>
          <p className="mt-4 text-lg text-neutral-200 md:text-xl">
            Explore the initiatives driving meaningful progress across education, livelihoods, and community wellbeing.
          </p>
        </div>
      </section>

      <div className="mt-10 mb-8 rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-[0_15px_30px_rgba(23,33,27,0.04)] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row">
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
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-400 sm:w-auto"
          >
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PLANNED">Planned</option>
            <option value="COMPLETED">Completed</option>
            <option value="DRAFT">Draft</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
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
                  className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_55px_rgba(23,33,27,0.1)]"
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
                      <div className="absolute left-3 top-3">
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
                    <h3 className="font-display text-xl font-bold text-neutral-900 transition-colors group-hover:text-gold-600">
                      {project.title}
                    </h3>
                    {project.summary && (
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600 line-clamp-2">
                        {project.summary}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
                      {project.start_date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-gold-500" />
                          {new Date(project.start_date).toLocaleDateString()}
                        </div>
                      )}
                      {project.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-gold-500" />
                          {project.location}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 border-t border-neutral-100 pt-4">
                      <Button variant="ghost" size="sm" className="w-full justify-between hover:bg-foundation-50">
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