import { apiGet, apiPost, apiPut, apiPatch, apiDelete, extractData } from "@/services/api";
import type {
  Profile,
  Project,
  News,
  GalleryItem,
  Volunteer,
  Donation,
  ContactMessage,
  SiteSetting,
  AuditLog,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

export const authService = {
  async getMe(): Promise<{ profile: Profile | null; role: string | null; permissions: string[] }> {
    return extractData(await apiGet<ApiResponse<{ profile: Profile | null; role: string | null; permissions: string[] }>>("/auth/me"));
  },
};

export interface ProjectsListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const projectsService = {
  async list(params: ProjectsListParams = {}): Promise<PaginatedResponse<Project>> {
    return apiGet<PaginatedResponse<Project>>("/projects", {
      page: params.page,
      limit: params.limit,
      status: params.status,
      search: params.search,
    });
  },

  async getBySlug(slug: string): Promise<Project> {
    return extractData(await apiGet<ApiResponse<Project>>(`/projects/${slug}`));
  },
};

export interface NewsListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export const newsService = {
  async list(params: NewsListParams = {}): Promise<PaginatedResponse<News>> {
    return apiGet<PaginatedResponse<News>>("/news", {
      page: params.page,
      limit: params.limit,
      category: params.category,
      search: params.search,
    });
  },

  async getBySlug(slug: string): Promise<News> {
    return extractData(await apiGet<ApiResponse<News>>(`/news/${slug}`));
  },
};

export const galleryService = {
  async list(params: { page?: number; limit?: number; category?: string } = {}): Promise<PaginatedResponse<GalleryItem>> {
    return apiGet<PaginatedResponse<GalleryItem>>("/gallery", {
      page: params.page,
      limit: params.limit,
      category: params.category,
    });
  },
};

export const volunteersService = {
  async create(payload: {
    full_name: string;
    email?: string;
    phone?: string;
    location?: string;
    area_of_interest?: string;
    availability?: string;
    experience?: string;
    message?: string;
  }): Promise<Volunteer> {
    return extractData(await apiPost<Volunteer>("/volunteers", payload));
  },
};

export const donationsService = {
  async list(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Donation>> {
    return apiGet<PaginatedResponse<Donation>>("/donations", {
      page: params.page,
      limit: params.limit,
    });
  },
};

export const contactService = {
  async create(payload: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<ContactMessage> {
    return extractData(await apiPost<ContactMessage>("/contact", payload));
  },
};

export const dashboardService = {
  async getUserDashboard(): Promise<{
    upcoming_registrations: any[];
    past_registrations: any[];
    profile: Profile | null;
    stats: Record<string, number>;
  }> {
    return extractData(await apiGet<ApiResponse<any>>("/dashboard"));
  },
};

export const adminService = {
  async getDashboard(): Promise<Record<string, unknown>> {
    return extractData(await apiGet<ApiResponse<Record<string, unknown>>>("/admin/dashboard"));
  },

  async getSettings(): Promise<SiteSetting[]> {
    return extractData(await apiGet<ApiResponse<SiteSetting[]>>("/admin/settings"));
  },

  async updateSetting(key: string, value: string): Promise<SiteSetting> {
    return extractData(await apiPatch<SiteSetting>(`/admin/settings/${key}`, { value }));
  },

  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    action?: string;
    actor_id?: string;
  } = {}): Promise<PaginatedResponse<AuditLog>> {
    return apiGet<PaginatedResponse<AuditLog>>("/admin/audit-logs", {
      page: params.page,
      limit: params.limit,
      action: params.action,
      actor_id: params.actor_id,
    });
  },
};
