import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Hero } from "@/components/layout/Hero";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useSettings } from "@/contexts/SettingsContext";
import { eventsService } from "@/services/events";
import { projectsService } from "@/services/index";
import type { Event, Project } from "@/types";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import * as React from "react";

export default function Home() {
  const { getSetting } = useSettings();
  const [upcomingEvents, setUpcomingEvents] = React.useState<Event[]>([]);
  const [featuredProjects, setFeaturedProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, projectsRes] = await Promise.all([
          eventsService.list({ limit: 4, status: "PUBLISHED" }),
          projectsService.list({ limit: 3, status: "COMPLETED" }),
        ]);
        setUpcomingEvents(eventsRes.data?.slice(0, 4) ?? []);
        setFeaturedProjects(projectsRes.data?.slice(0, 3) ?? []);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const foundationName = getSetting("foundation_name", "Shaffii Chemasuet Foundation");
  const mission = getSetting("mission", "[FOUNDATION MISSION]");
  const vision = getSetting("vision", "[FOUNDATION VISION]");

  const upcomingEventsList = upcomingEvents.filter(
    (e) => new Date(e.event_date) > new Date() && e.status === "PUBLISHED"
  );

  if (error) {
    return (
      <SectionWrapper>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <>
      <Hero
        title={foundationName}
        subtitle={mission}
        primaryAction={{ label: "Our Events", href: "/events" }}
        secondaryAction={{ label: "Learn More", href: "/about" }}
      />

      {/* Introduction */}
      <SectionWrapper>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
              {foundationName}
            </h2>
            <p className="mt-6 text-lg text-neutral-600">{mission}</p>
            {vision && (
              <blockquote className="mt-6 border-l-4 border-foundation-700 pl-6 italic text-neutral-700">
                {vision}
              </blockquote>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/about">
                <Button variant="secondary" size="md">
                  Our Story <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/volunteer">
                <Button variant="outline" size="md">
                  Volunteer With Us
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <img
              src="/images/foundation-placeholder.jpg"
              alt={foundationName}
              className="rounded-2xl shadow-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif'%3EFoundation Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      </SectionWrapper>

      {/* Upcoming Events */}
      <SectionWrapper className="bg-neutral-50">
        <div className="mb-8">
          <h3 className="font-display text-2xl font-bold text-neutral-900">
            Upcoming Events
          </h3>
          <p className="mt-2 text-neutral-600">
            Join us in our upcoming community initiatives and programs.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading events..." />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEventsList.slice(0, 3).map((event) => (
              <Link key={event.id} to={`/events/${event.slug}`}>
                <Card
                  variant="elevated"
                  className="group h-full transition-transform hover:scale-[1.02]"
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
                  </div>
                  <div className="p-6">
                    <h4 className="font-display text-xl font-bold text-neutral-900 group-hover:text-foundation-700">
                      {event.title}
                    </h4>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                      {event.short_description || event.full_description || "No description available."}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.venue || event.location || "TBD"}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/events">
            <Button variant="secondary" size="lg" rounded="full">
              View All Events <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionWrapper>

      {/* Featured Projects */}
      <SectionWrapper>
        <div className="mb-8">
          <h3 className="font-display text-2xl font-bold text-neutral-900">
            Featured Projects
          </h3>
          <p className="mt-2 text-neutral-600">
            Our projects making a lasting impact in the community.
          </p>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.slug}`}>
                <Card
                  variant="elevated"
                  className="group h-full transition-transform hover:scale-[1.02]"
                >
                  <img
                    src={project.featured_image || "/images/project-placeholder.jpg"}
                    alt={project.title}
                    className="h-48 w-full rounded-t-2xl object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="p-6">
                    <h4 className="font-display text-xl font-bold text-neutral-900 group-hover:text-foundation-700">
                      {project.title}
                    </h4>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                      {project.summary || "Project summary not available."}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500">No projects published yet.</p>
        )}

        {featuredProjects.length > 0 && (
          <div className="mt-8 text-center">
            <Link to="/projects">
              <Button variant="secondary" size="lg" rounded="full">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </SectionWrapper>

      {/* Volunteer CTA */}
      <SectionWrapper className="bg-foundation-900 text-white">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-gold-500" />
          <h3 className="font-display mt-4 text-3xl font-bold">
            Become a Volunteer
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-200">
            Join our community of volunteers making a difference in local communities.
          </p>
          <Link to="/volunteer" className="mt-6 inline-block">
            <Button variant="primary" size="lg" rounded="full">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionWrapper>

      {/* Donation CTA */}
      <SectionWrapper className="bg-gold-500">
        <div className="text-center">
          <h3 className="font-display text-3xl font-bold text-neutral-900">
            Support Our Work
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-700">
            Your contribution helps us sustain our community programs and initiatives.
          </p>
          <Link to="/donate" className="mt-6 inline-block">
            <Button variant="secondary" size="lg" rounded="full">
              Donate Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionWrapper>
    </>
  );
}
