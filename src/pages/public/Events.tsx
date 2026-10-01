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
import { Calendar, MapPin, Filter, Search } from "lucide-react";

const EVENT_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "PUBLISHED", label: "Published Events" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
];

export default function EventsPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

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
      setCategories(categoriesRes.data || categoriesRes || []);
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
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
          Events
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Discover upcoming and past events from our foundation.
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="all">All</option>
        </Select>
        <Select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </Select>
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  const statusColor = {
    PUBLISHED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    DRAFT: "bg-neutral-100 text-neutral-800",
  };

  return (
    <Link to={`/events/${event.slug}`}>
      <Card
        variant="elevated"
        className="group h-full transition-all duration-200 hover:scale-[1.02]"
      >
        <div className="relative">
          <img
            src={event.featured_image || "/images/event-placeholder.jpg"}
            alt={event.title}
            className="h-48 w-full rounded-t-2xl object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect fill='%23e5e7eb' width='400' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af'%3AEvent Image%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute top-4 right-4 flex gap-2">
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
              className={`absolute top-4 left-4 rounded-full px-2.5 py-1 text-xs font-semibold ${
                statusColor[event.status] || statusColor.DRAFT
              }`}
              aria-label={`Event status: ${event.status}`}
            >
              {event.status}
            </span>
          )}
        </div>
        <div className="p-6">
          <h3 className="font-display text-xl font-bold text-neutral-900 group-hover:text-foundation-700">
            {event.title}
          </h3>
          <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
            {event.short_description || "Click to learn more about this event."}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-foundation-700" />
              {new Date(event.event_date).toLocaleDateString()}
            </div>
            {event.venue && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-foundation-700" />
                {event.venue}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
