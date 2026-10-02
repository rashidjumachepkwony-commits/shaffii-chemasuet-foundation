import * as React from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { eventsService } from "@/services/events";
import type { Event, EventCategory } from "@/types";
import { Calendar, MapPin, Filter, Search, ArrowRight } from "lucide-react";

const EVENT_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "PUBLISHED", label: "Published Events" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
];

const statusColors = {
  PUBLISHED: "green",
  CANCELLED: "red",
  COMPLETED: "blue",
  DRAFT: "neutral",
} as const;

export default function EventsPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);

  const page = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "9");
  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const status = params.get("status") || "";
  const filter = params.get("filter") || "upcoming";

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventsRes, categoriesRes] = await Promise.all([
        eventsService.list({
          page,
          limit,
          search: search || undefined,
          category: category || undefined,
          status: status || "PUBLISHED",
          upcoming: filter === "upcoming" ? true : undefined,
          past: filter === "past" ? true : undefined,
        }),
        eventsService.getCategories(),
      ]);

      setEvents(eventsRes.data || []);
      setCategories(categoriesRes || []);
      setTotalPages(eventsRes.meta?.totalPages || 1);
      setTotalItems(eventsRes.meta?.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page, limit, search, category, status, filter]);

  const updateParam = (key: string, value: string) => {
    setParams({ ...Object.fromEntries(params), [key]: value });
  };

  const clearFilters = () => {
    setParams({});
  };

  return (
    <SectionWrapper spacing="lg">
      <section className="relative overflow-hidden rounded-[2rem] bg-neutral-900 px-5 py-12 text-white shadow-[0_30px_80px_rgba(23,33,27,0.12)] md:px-8 md:py-16">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60" style={{ backgroundImage: "url('/images/shaffi33.jpg')" }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/80 to-foundation-900/55" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="section-label border-gold-300/30 bg-white/5 text-gold-200">Community Calendar</span>
          <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl md:text-6xl">Events</h1>
          <p className="mt-4 text-lg text-neutral-200 md:text-xl">
            Discover gatherings, learning moments, and community experiences that move our mission forward.
          </p>
        </div>
      </section>

      <div className="mt-10 mb-8 rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-[0_15px_30px_rgba(23,33,27,0.04)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search events..."
              value={search}
              onChange={(e) => updateParam("search", e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filter}
            onChange={(e) => updateParam("filter", e.target.value)}
            className="lg:max-w-[180px]"
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="all">All</option>
          </Select>
          <Select
            value={category}
            onChange={(e) => updateParam("category", e.target.value)}
            className="lg:max-w-[220px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading events..." />
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <Calendar className="h-8 w-8 text-neutral-400" />
          </div>
          <p className="text-neutral-500">
            {search || category || status
              ? "No events match your search criteria."
              : "No events found."}
          </p>
          {(search || category || status) && (
            <Button variant="ghost" className="mt-4" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={limit}
              onPageChange={(p) => updateParam("page", String(p))}
            />
          </div>
        </>
      )}
    </SectionWrapper>
  );
}

function EventCard({ event }: { event: Event }) {
  const isPast = new Date(event.event_date) < new Date();
  const statusColor = statusColors[event.status as keyof typeof statusColors] || "neutral";

  return (
    <Link to={`/events/${event.slug}`}>
      <Card
        variant="elevated"
        className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_55px_rgba(23,33,27,0.1)]"
      >
        <div className="relative">
          <img
            src={event.featured_image || "/images/event-placeholder.jpg"}
            alt={event.title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect fill='%23e5e7eb' width='400' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af'%3AEvent Image%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute right-3 top-3 flex gap-2">
            {event.category && (
              <Badge color="blue" size="sm">
                {event.category.name}
              </Badge>
            )}
            <Badge color={isPast ? "neutral" : "green"} size="sm">
              {isPast ? "Past" : "Upcoming"}
            </Badge>
          </div>
          {event.status && (
            <span
              className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor === "green" ? "bg-emerald-100 text-emerald-800" : statusColor === "red" ? "bg-red-100 text-red-800" : statusColor === "blue" ? "bg-blue-100 text-blue-800" : "bg-neutral-100 text-neutral-800"}`}
              aria-label={`Event status: ${event.status}`}
            >
              {event.status}
            </span>
          )}
        </div>
        <div className="p-6">
          <h3 className="font-display text-xl font-bold text-neutral-900 transition-colors group-hover:text-gold-600">
            {event.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 line-clamp-2">
            {event.short_description || "Click to learn more about this event."}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gold-500" />
              {new Date(event.event_date).toLocaleDateString()}
            </div>
            {event.venue && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold-500" />
                {event.venue}
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
  );
}