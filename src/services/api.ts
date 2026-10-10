import type { ApiResponse, PaginatedResponse } from "@/types";

const BASE = import.meta.env.VITE_API_URL || "";
const API_BASE = BASE ? `${BASE.replace(/\/$/, "")}/api` : "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let getToken: (() => Promise<string | null>) | null = null;

export function setTokenProvider(fn: () => Promise<string | null>) {
  getToken = fn;
}

async function getHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (getToken) {
    const token = await getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = await getHeaders();
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: { ...headers, ...(options.headers as HeadersInit) },
    });
  } catch (err) {
    throw new ApiError(
      "Unable to reach the server. Check your network connection or CORS configuration.",
      0,
      "NETWORK_ERROR"
    );
  }

  const contentType = response.headers.get("content-type");
  let data: unknown;
  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorResponse = data as ApiResponse;
    const message =
      (errorResponse.error || errorResponse.message) && typeof errorResponse.error === "string"
        ? errorResponse.error
        : typeof errorResponse.message === "string"
        ? errorResponse.message
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, errorResponse.error);
  }

  return data as T;
}

export async function apiGet<T = unknown>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return apiRequest<T>(`${path}${query}`);
}

export async function apiPost<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  return apiRequest<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  return apiRequest<T>(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  return apiRequest<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T = unknown>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: "DELETE" });
}

export function isPaginatedResponse<T>(
  data: unknown
): data is PaginatedResponse<T> {
  return (
    typeof data === "object" &&
    data !== null &&
    "meta" in data &&
    typeof (data as ApiResponse).success === "boolean"
  );
}

export function extractData<T>(response: ApiResponse<T> | T): T {
  if (typeof response === "object" && response !== null && "data" in response) {
    return (response as ApiResponse<T>).data as T;
  }
  return response as T;
}
