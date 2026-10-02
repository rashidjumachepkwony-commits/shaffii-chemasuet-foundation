import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { eventsService } from "@/services/events";
import type { Event } from "@/types";
import { Calendar, MapPin, Clock, Users, CalendarPlus, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RegistrationDialog } from "@/components/features/RegistrationDialog";

const statusColors = {
  PUBLISHED: "green",
  CANCELLED: "red",
  COMPLETED: "blue",
  DRAFT: "neutral",
} as const;

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showRegisterDialog, setShowRegisterDialog] = React.useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!slug) return;
    const loadEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await eventsService.getBySlug(slug);
        setEvent(data);
      } catch (err: any) {
        setError(err.message || "Event not found");
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [slug]);

  const getStatusMessage = (): string | null => {
    if (!event) return null;
    if (event.status === "CANCELLED") return "This event has been cancelled.";
    if (event.status === "DRAFT") return "This event is not published.";
    if (event.status === "COMPLETED") return "This event has already taken place.";
    if (event.status === "PUBLISHED") {
      if (!event.registration_enabled) return "Registration is currently disabled.";
      if (event.registration_deadline) {
        const deadline = new Date(event.registration_deadline);
        if (new Date() > deadline) return "Registration has closed.";
      }
      if (event.capacity) {
        // We can't check live count here without another call, but the Worker handles it
      }
    }
    return null;
  };

  const canRegister = (): boolean => {
    if (!event) return false;
    if (event.status !== "PUBLISHED") return false;
    if (!event.registration_enabled) return false;
    if (event.registration_deadline) {
      const deadline = new Date(event.registration_deadline);
      if (new Date() > deadline) return false;
    }
    return true;
  };

  const handleRegister = () => {
    setShowRegisterDialog(true);
  };

  if (loading) {
    return (
      <SectionWrapper>
        <LoadingSpinner label="Loading event..." />
      </SectionWrapper>
    );
  }

  if (error || !event) {
    return (
      <SectionWrapper>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-neutral-900">Event Not Found</h1>
          <p className="mt-2 text-neutral-600">{error || "The event you are looking for does not exist."}</p>
          <Link to="/events" className="mt-4 inline-flex items-center gap-1 text-gold-600 font-semibold hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to all events
          </Link>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <>
      <SectionWrapper spacing="lg">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/events"
            className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-gold-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
                {event.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-3">
                {event.category && (
                  <Badge color="blue">{event.category.name}</Badge>
                )}
                <Badge
                  color={
                    event.status === "PUBLISHED"
                      ? "green"
                      : event.status === "COMPLETED"
                      ? "blue"
                      : event.status === "CANCELLED"
                      ? "red"
                      : "neutral"
                  }
                >
                  {event.status}
                </Badge>
                {new Date(event.event_date) < new Date() && (
                  <Badge color="neutral">Past Event</Badge>
                )}
              </div>

              {event.featured_image && (
                <img
                  src={event.featured_image}
                  alt={event.title}
                  className="mt-6 w-full rounded-2xl shadow-xl object-cover max-h-[400px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Crect fill='%23e5e7eb' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af'%3AEvent Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              )}

              {event.full_description && (
                <div
                  className="mt-8 text-neutral-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: event.full_description }}
                />
              )}
            </div>

            <div className="space-y-6">
              <Card variant="bordered" padding="lg">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Event Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gold-500 mt-0.5" />
                    <div>
                      <span className="font-medium text-neutral-700">Date</span>
                      <p>{new Date(event.event_date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gold-500 mt-0.5" />
                    <div>
                      <span className="font-medium text-neutral-700">Time</span>
                      <p>{event.start_time} - {event.end_time}</p>
                    </div>
                  </div>
                  {event.venue && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gold-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-neutral-700">Venue</span>
                        <p>{event.venue}</p>
                        {event.location && <p className="text-neutral-600">{event.location}</p>}
                      </div>
                    </div>
                  )}
                  {event.organizer && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-gold-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-neutral-700">Organizer</span>
                        <p>{event.organizer}</p>
                      </div>
                    </div>
                  )}
                  {event.capacity && (
                    <div className="flex items-start gap-3">
                      <CalendarPlus className="h-5 w-5 text-gold-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-neutral-700">Capacity</span>
                        <p>{event.capacity} attendees</p>
                      </div>
                    </div>
                  )}
                  {event.registration_deadline && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gold-500 mt-0.5" />
                      <div>
                        <span className="font-medium text-neutral-700">Registration Deadline</span>
                        <p>{new Date(event.registration_deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  {event.contact_information && (
                    <div>
                      <span className="font-medium text-neutral-700">Contact</span>
                      <p>{event.contact_information}</p>
                    </div>
                  )}
                </div>
              </Card>

              <div className="sticky top-24 space-y-4">
                <Button
                  onClick={handleRegister}
                  disabled={!canRegister()}
                  className="w-full"
                  size="lg"
                  rounded="full"
                >
                  {getStatusMessage()
                    ? getStatusMessage()
                    : "Register for this Event"}
                </Button>
                {getStatusMessage() && (
                  <p className="text-center text-sm text-neutral-500">
                    {getStatusMessage()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <RegistrationDialog
        isOpen={showRegisterDialog}
        onClose={() => setShowRegisterDialog(false)}
        eventId={event.id}
        eventTitle={event.title}
        userEmail={user?.email}
        onSuccess={() => setShowRegisterDialog(false)}
      />
    </>
  );
}