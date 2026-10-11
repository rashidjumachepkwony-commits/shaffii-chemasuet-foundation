import { apiGet, apiPost, apiPatch, extractData } from "@/services/api";
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
  ContentSection,
  ApiResponse,
  PaginatedResponse,
} from "@/types";
import { apiDelete } from "@/services/api";

export const authService = {
  async getMe(): Promise<{ profile: Profile | null; role: string | null; permissions: string[] }> {
    return extractData(await apiGet<ApiResponse<{ profile: Profile | null; role: string | null; permissions: string[] }>>("/auth/me"));
  },

  async login(email: string, password: string): Promise<{
    user: { id: string; email: string };
    session: { access_token: string; refresh_token: string; expires_at: number } | null;
    profile: Profile | null;
    role: string;
    permissions: string[];
  }> {
    return extractData(await apiPost("/auth/login", { email, password }));
  },

  async register(data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    organization?: string;
  }): Promise<{ message: string; user: { id: string; email: string } }> {
    return extractData(await apiPost("/auth/register", data));
  },

  async refreshToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string | null;
    expires_at: number | null;
  } | null> {
    return extractData(await apiPost("/auth/refresh", { refresh_token: refreshToken }));
  },

  async verifyAdmin(): Promise<{ role: string; permissions: string[] }> {
    return extractData(await apiGet("/auth/verify-admin"));
  },

  async oauthSession(payload: {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
  }): Promise<{
    user: { id: string; email: string };
    session: { access_token: string; refresh_token: string; expires_at: number };
    profile: Profile | null;
    role: string | null;
    pending: boolean;
    permissions: string[];
  }> {
    return extractData(await apiPost("/auth/oauth-session", payload));
  },

  async logout(): Promise<void> {
    await apiPost("/auth/logout");
  },

  async resetPassword(email: string): Promise<{ message?: string }> {
    return extractData(await apiPost("/auth/reset-password", { email }));
  },

  async confirmResetPassword(
    accessToken: string,
    password: string
  ): Promise<{ message?: string }> {
    return extractData(
      await apiPost("/auth/reset-password/confirm", {
        access_token: accessToken,
        password,
      })
    );
  },

  async updateProfile(data: {
    full_name?: string;
    phone?: string;
    organization?: string;
    password?: string;
  }): Promise<{ success: boolean }> {
    return extractData(await apiPatch("/auth/profile", data));
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

export const contentSectionsService = {
  async list(params: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
  } = {}): Promise<PaginatedResponse<ContentSection>> {
    return apiGet<PaginatedResponse<ContentSection>>("/admin/content", {
      page: params.page,
      limit: params.limit,
      type: params.type,
      search: params.search,
    });
  },

  async getById(id: string): Promise<ContentSection> {
    return extractData(await apiGet<ApiResponse<ContentSection>>(`/admin/content/${id}`));
  },

  async create(payload: Partial<ContentSection>): Promise<ContentSection> {
    return extractData(await apiPost<ContentSection>("/admin/content", payload));
  },

  async update(id: string, payload: Partial<ContentSection>): Promise<ContentSection> {
    return extractData(await apiPatch<ContentSection>(`/admin/content/${id}`, payload));
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return extractData(await apiDelete<{ success: boolean }>(`/admin/content/${id}`));
  },

  async getBySectionKey(key: string): Promise<ContentSection | null> {
    return extractData(await apiGet<ApiResponse<ContentSection | null>>(`/public/content/${key}`));
  },

  async listPublic(params: {
    type?: string;
    key?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedResponse<ContentSection>> {
    return apiGet<PaginatedResponse<ContentSection>>("/public/content", {
      type: params.type,
      key: params.key,
      page: params.page,
      limit: params.limit,
    });
  },
};
