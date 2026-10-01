import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { projectsService } from "@/services/index";
import type { Project } from "@/types";
import { Search, Calendar } from "lucide-react";

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const page = parseInt(params.get("page") || "1");
  const limit = 9;
  const search = params.get("search") || "";
  const status = params.get("status") || "COMPLETED";

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

  return (
    <SectionWrapper spacing="lg">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
          Our Projects
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Explore the projects driving positive change in our communities.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setParams({ search: e.target.value })}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading projects..." />
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">No projects published yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} to={`/projects/${project.slug}`}>
                <Card
                  variant="elevated"
                  className="group h-full transition-transform hover:scale-[1.02]"
                >
                  {project.featured_image && (
                    <img
                      src={project.featured_image}
                      alt={project.title}
                      className="h-48 w-full rounded-t-2xl object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-neutral-900 group-hover:text-foundation-700">
                      {project.title}
                    </h3>
                    {project.summary && (
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                        {project.summary}
                      </p>
                    )}
                    {(project.start_date || project.end_date) && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
                        <Calendar className="h-4 w-4" />
                        {project.start_date && new Date(project.start_date).toLocaleDateString()}
                        {" — "}
                        {project.end_date && new Date(project.end_date).toLocaleDateString()}
                      </div>
                    )}
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
