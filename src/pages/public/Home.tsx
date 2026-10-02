import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useSettings } from "@/contexts/SettingsContext";
import { eventsService } from "@/services/events";
import { projectsService } from "@/services/index";
import type { Event, Project } from "@/types";
import { ArrowRight, Calendar, MapPin, Users, Leaf, GraduationCap, HeartHandshake, Shield, Globe, Sparkles } from "lucide-react";
import * as React from "react";

const focusAreas = [
  {
    title: "Youth Empowerment",
    description: "Creating pathways for young people to develop skills, find purpose, and lead positive change in their communities.",
    icon: <GraduationCap className="h-6 w-6 text-gold-500" />,
  },
  {
    title: "Women & Girls",
    description: "Supporting gender equality and creating opportunities for women and girls to thrive in education and leadership.",
    icon: <HeartHandshake className="h-6 w-6 text-gold-500" />,
  },
  {
    title: "Education & Mentorship",
    description: "Providing quality education access and mentorship programs that empower children and youth to reach their potential.",
    icon: <GraduationCap className="h-6 w-6 text-gold-500" />,
  },
  {
    title: "Digital Skills",
    description: "Equipping communities with digital literacy and technical skills for the modern economy.",
    icon: <Globe className="h-6 w-6 text-gold-500" />,
  },
  {
    title: "Livelihoods",
    description: "Supporting income-generating activities and entrepreneurship to build economic resilience.",
    icon: <Sparkles className="h-6 w-6 text-gold-500" />,
  },
  {
    title: "Community Health",
    description: "Promoting health awareness and providing access to basic healthcare services.",
    icon: <Shield className="h-6 w-6 text-gold-500" />,
  },
  {
    title: "Environment",
    description: "Supporting environmental stewardship through community-led conservation and sustainability initiatives.",
    icon: <Leaf className="h-6 w-6 text-gold-500" />,
  },
  {
    title: "Inclusion",
    description: "Building inclusive communities where every person, regardless of background, has opportunities to participate and belong.",
    icon: <HeartHandshake className="h-6 w-6 text-gold-500" />,
  },
];

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
          eventsService.list({ limit: 6, status: "PUBLISHED" }),
          projectsService.list({ limit: 3, status: "IN_PROGRESS" }),
        ]);
        setUpcomingEvents(eventsRes.data?.slice(0, 6) ?? []);
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
  const mission = getSetting("mission", "We empower communities through education, healthcare, and sustainable development.");
  const tagline = getSetting("foundation_tagline", "Empowering People. Strengthening Communities.");

  const upcomingEventsList = upcomingEvents.filter(
    (e) => new Date(e.event_date) >= new Date() && e.status === "PUBLISHED"
  );

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden text-white min-h-[80vh] md:min-h-[90vh]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/shaffi33.jpg')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 via-transparent to-foundation-700/20" />

        <div className="relative z-10 container mx-auto px-4 md:px-6 py-20 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-4">
              <span className="inline-block text-sm font-medium tracking-widther text-gold-200 uppercase">
                {tagline}
              </span>
              <h1 className="font-display text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl">
                Empowering People.
                <span className="block text-gold-400">Strengthening Communities.</span>
                <span className="block">Creating Opportunities.</span>
              </h1>
            </div>

            <p className="mx-auto max-w-2xl text-lg text-neutral-200 md:text-xl">
              {mission}
            </p>

            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <Link to="/projects">
                <Button
                  size="lg"
                  rounded="full"
                  className="bg-gold-500 text-neutral-900 hover:bg-gold-400 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform"
                >
                  Explore Our Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/volunteer">
                <Button
                  variant="outline"
                  size="lg"
                  rounded="full"
                  className="border-neutral-300 text-white hover:bg-white hover:text-neutral-900"
                >
                  Get Involved
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-4">
              <span className="inline-flex items-center gap-1 text-xs text-neutral-300">
                <span className="h-1 w-1 rounded-full bg-gold-400"></span>
                Community
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-neutral-300">
                <span className="h-1 w-1 rounded-full bg-gold-400"></span>
                Opportunity
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-neutral-300">
                <span className="h-1 w-1 rounded-full bg-gold-400"></span>
                Inclusion
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Foundation Introduction */}
      <SectionWrapper className="bg-white">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
              {foundationName}
            </h2>
            <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
              {mission}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/about">
                <Button variant="secondary" size="md" rounded="full">
                  Our Story <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/volunteer">
                <Button variant="outline" size="md" rounded="full">
                  Volunteer With Us
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <img
              src="/images/shaffi6.jpg"
              alt="Foundation community work"
              className="w-full rounded-2xl shadow-2xl object-cover aspect-[4/3]"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif'%3EFoundation Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      </SectionWrapper>

      {/* Areas of Focus */}
      <SectionWrapper className="bg-neutral-50">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Our Areas of Focus
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            We work across multiple pillars to create meaningful, lasting impact in communities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {focusAreas.map((area) => (
            <Card
              key={area.title}
              variant="elevated"
              className="group h-full text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="p-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-50 group-hover:bg-gold-100 transition-colors">
                  {area.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-neutral-900 group-hover:text-gold-600 transition-colors">
                  {area.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  {area.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Upcoming Events */}
      <SectionWrapper className="bg-white">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Upcoming Events
          </h2>
          <p className="mt-2 text-neutral-600">
            Join us in our upcoming community initiatives and programs.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading events..." />
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : upcomingEventsList.length === 0 ? (
          <p className="text-center text-neutral-500">No upcoming events scheduled yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEventsList.map((event) => (
                <Link key={event.id} to={`/events/${event.slug}`}>
                  <Card
                    variant="elevated"
                    className="group h-full overflow-hidden transition-all duration-300 hover:shadow-xl"
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
                      {event.category && (
                        <Badge color="blue" className="absolute top-3 left-3">
                          {event.category.name}
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-neutral-900 group-hover:text-gold-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                        {event.short_description || "Click to learn more about this event."}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gold-500" />
                          {new Date(event.event_date).toLocaleDateString()}
                        </div>
                        {event.venue && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gold-500" />
                            {event.venue}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/events">
                <Button variant="secondary" size="lg" rounded="full">
                  View All Events <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </SectionWrapper>

      {/* Featured Projects */}
      <SectionWrapper className="bg-neutral-50">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-2 text-neutral-600">
            Our initiatives making a lasting impact in communities.
          </p>
        </div>

        {featuredProjects.length === 0 ? (
          <p className="text-center text-neutral-500">No projects available yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
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
                              project.status === "IN_PROGRESS"
                                ? "blue"
                                : project.status === "PLANNED"
                                ? "amber"
                                : project.status === "COMPLETED"
                                ? "green"
                                : "neutral"
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
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                        {project.summary || "Click to learn more about this project."}
                      </p>
                      {(project.start_date || project.location) && (
                        <div className="mt-4 flex items-center justify-between text-sm text-neutral-500">
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
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/projects">
                <Button variant="secondary" size="lg" rounded="full">
                  View All Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </SectionWrapper>

      {/* News Section */}
      <SectionWrapper className="bg-white">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Latest News
          </h2>
          <p className="mt-2 text-neutral-600">
            Stories from our community and latest updates.
          </p>
        </div>

        <div className="text-center">
          <Link to="/news">
            <Button variant="secondary" size="lg" rounded="full">
              View All News <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionWrapper>

      {/* Volunteer CTA */}
      <SectionWrapper className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-500/10">
            <Users className="h-10 w-10 text-gold-400" />
          </div>
          <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl">
            Become a Volunteer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-300">
            Join our community of dedicated volunteers making a real difference in local communities.
          </p>
          <Link to="/volunteer" className="mt-6 inline-block">
            <Button
              variant="primary"
              size="lg"
              rounded="full"
              className="bg-gold-500 text-neutral-900 hover:bg-gold-400 shadow-xl"
            >
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionWrapper>

      {/* Donation CTA */}
      <SectionWrapper className="bg-gold-500">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-neutral-900 sm:text-4xl">
            Support Our Work
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-700">
            Your contribution helps us sustain and expand our community programs across Kenya.
          </p>
          <Link to="/donate" className="mt-6 inline-block">
            <Button
              variant="secondary"
              size="lg"
              rounded="full"
              className="bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg"
            >
              Donate Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionWrapper>
    </>
  );
}
