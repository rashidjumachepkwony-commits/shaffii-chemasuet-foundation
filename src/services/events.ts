import { apiGet, apiPost, apiPut, apiPatch, apiDelete, extractData } from "@/services/api";
import type {
  Event,
  EventCategory,
  EventRegistration,
  PaginatedResponse,
  ApiResponse,
  EventStatus,
} from "@/types";

export interface EventsListParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
  upcoming?: boolean;
  past?: boolean;
}

export const eventsService = {
  async list(params: EventsListParams = {}): Promise<PaginatedResponse<Event>> {
    const query: Record<string, string | number | boolean | undefined> = {
      page: params.page,
      limit: params.limit,
      status: params.status,
      category: params.category,
      search: params.search,
    };
    if (params.upcoming !== undefined) query.upcoming = params.upcoming;
    if (params.past !== undefined) query.past = params.past;
    return apiGet<PaginatedResponse<Event>>("/events", query);
  },

  async getBySlug(slug: string): Promise<Event> {
    return extractData(await apiGet<ApiResponse<Event>>(`/events/${slug}`));
  },

  async getById(id: string): Promise<Event> {
    return extractData(await apiGet<ApiResponse<Event>>(`/events/id/${id}`));
  },

  async getCategories(): Promise<EventCategory[]> {
    const result = extractData(await apiGet<ApiResponse<EventCategory[]>>("/events/categories"));
    return Array.isArray(result) ? result : [];
  },

  async register(eventId: string, payload: {
    full_name: string;
    email: string;
    phone: string;
    organization?: string;
    age_group: string;
    activity_interest: string;
    activity_other?: string;
    county: string;
    locality?: string;
    attendee_count?: number;
    notes?: string;
  }): Promise<{ registration_reference: string; id: string }> {
    return extractData(await apiPost<{ registration_reference: string; id: string }>(
      `/events/${eventId}/register`,
      payload
    ));
  },

  async getStats(): Promise<Record<string, number>> {
    return extractData(await apiGet<ApiResponse<Record<string, number>>>("/events/stats"));
  },
};
