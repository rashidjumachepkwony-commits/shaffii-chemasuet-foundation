import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { newsService } from "@/services/index";
import type { News } from "@/types";
import { Calendar, User, ArrowLeft } from "lucide-react";

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await newsService.getBySlug(slug);
        setNews(data);
      } catch (err: any) {
        setError(err.message || "News not found");
        setNews(null);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [slug]);

  if (loading) {
    return (
      <SectionWrapper>
        <LoadingSpinner label="Loading article..." />
      </SectionWrapper>
    );
  }

  if (error || !news) {
    return (
      <SectionWrapper>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-neutral-900">Article Not Found</h1>
          <p className="mt-2 text-neutral-600">{error}</p>
          <Link to="/news" className="mt-4 inline-block text-gold-600 font-semibold hover:underline">
            <ArrowLeft className="h-4 w-4 inline mr-1" />
            Back to News
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper spacing="lg">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/news"
          className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-gold-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          {news.category && <Badge color="blue">{news.category}</Badge>}
          {news.published_date && (
            <Badge color="neutral" size="sm">
              {new Date(news.published_date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Badge>
          )}
        </div>

        <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
          {news.title}
        </h1>

        {(news.author || news.published_date || news.category) && (
          <div className="mt-4 flex items-center gap-6 text-sm text-neutral-500">
            {news.author && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {news.author}
              </span>
            )}
            {news.published_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(news.published_date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        )}

        {news.featured_image && (
          <img
            src={news.featured_image}
            alt={news.title}
            className="mt-6 w-full rounded-2xl shadow-xl object-cover"
          />
        )}

        {news.excerpt && (
          <p className="mt-6 text-xl text-neutral-600 italic">{news.excerpt}</p>
        )}

        {news.content && (
          <div
            className="mt-8 text-neutral-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        )}
      </div>
    </SectionWrapper>
  );
}