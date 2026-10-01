import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { newsService } from "@/services/index";
import type { News } from "@/types";
import { Search, Calendar, Clock } from "lucide-react";

export default function News() {
  const [params, setParams] = useSearchParams();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const page = parseInt(params.get("page") || "1");
  const limit = 9;
  const search = params.get("search") || "";

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await newsService.list({
          page,
          limit,
          search: search || undefined,
        });
        setNews(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalItems(res.meta?.total || 0);
      } catch (err: any) {
        setError(err.message || "Failed to load news");
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [page, search]);

  return (
    <SectionWrapper spacing="lg">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
          News & Updates
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Stay updated with our latest news and community impact stories.
        </p>
      </div>

      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setParams({ search: e.target.value })}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading news..." />
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : news.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">No news articles available.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Link key={item.id} to={`/news/${item.slug}`}>
                <Card
                  variant="elevated"
                  className="group h-full transition-transform hover:scale-[1.02]"
                >
                  {item.featured_image && (
                    <img
                      src={item.featured_image}
                      alt={item.title}
                      className="h-48 w-full rounded-t-2xl object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  <div className="p-6">
                    <div className="mb-2 flex flex-wrap gap-2">
                      {item.category && (
                        <Badge color="blue" size="sm">{item.category}</Badge>
                      )}
                      {item.published_date && (
                        <Badge color="neutral" size="sm">
                          {new Date(item.published_date).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-neutral-900 group-hover:text-foundation-700">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                        {item.excerpt}
                      </p>
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
